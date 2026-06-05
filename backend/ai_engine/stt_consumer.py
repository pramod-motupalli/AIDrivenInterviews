"""
STT WebSocket Consumer
Accepts raw Int16 PCM audio at 16 kHz from the frontend MediaRecorder pipeline,
transcribes incrementally using Faster-Whisper (CPU/int8), and returns
{ type, text, is_final } JSON messages.

Route: ws/stt/<session_token>/?token=<jwt_access_token>
"""

import json
import numpy as np
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import time
import asyncio

from groq import Groq
from decouple import config
import io
import wave

# ── Groq client singleton ───────────────────────────────────────────────────
_groq_client = None

def _get_groq_client():
    global _groq_client
    if _groq_client is None:
        _groq_client = Groq(api_key=config('GROQ_API_KEY'))
    return _groq_client


# ── Consumer ─────────────────────────────────────────────────────────────────
class STTConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = await self._get_user_from_query()
        if user is None:
            await self.close(code=4001)
            return

        self.audio_buffer = np.array([], dtype=np.float32)
        self.current_transcript = ""
        self.is_transcribing = False
        self.last_transcribe_time = time.time()
        self.job_title, self.skills = await self._get_interview_context()
        await self.accept()
        print(f"[STT] Connected: {user.email}")

    async def disconnect(self, close_code):
        self.audio_buffer = np.array([], dtype=np.float32)
        print(f"[STT] Disconnected ({close_code})")

    async def receive(self, bytes_data=None, text_data=None):
        # ── Binary frame: raw Int16 PCM at 16 kHz ────────────────────────────
        if bytes_data:
            chunk = np.frombuffer(bytes_data, dtype=np.int16).astype(np.float32) / 32768.0
            self.audio_buffer = np.concatenate([self.audio_buffer, chunk])
            
            # Trigger incremental transcription
            now = time.time()
            if not self.is_transcribing and (now - self.last_transcribe_time > 4.0) and len(self.audio_buffer) > 16000:
                self.is_transcribing = True
                self.last_transcribe_time = now
                asyncio.create_task(self._process_incremental())

        # ── Text frame: { "type": "finalize" } ───────────────────────────────
        elif text_data:
            data = json.loads(text_data)
            if data.get("type") == "finalize":
                transcript = await self._transcribe()
                if transcript is not None:
                    final_text = transcript.strip()
                else:
                    final_text = self.current_transcript.strip()
                    
                # Clear buffer for next answer
                self.audio_buffer = np.array([], dtype=np.float32)
                self.current_transcript = ""
                await self.send(json.dumps({
                    "type": "transcript",
                    "text": final_text,
                    "is_final": True,
                }))

    async def _process_incremental(self):
        try:
            transcript = await self._transcribe()
            if transcript is not None:
                self.current_transcript = transcript
                await self.send(json.dumps({
                    "type": "transcript",
                    "text": transcript,
                    "is_final": False,
                }))
        except Exception as e:
            print(f"[STT] Incremental transcription error: {e}")
        finally:
            self.is_transcribing = False

    # ── Helpers ───────────────────────────────────────────────────────────────

    @sync_to_async
    def _transcribe(self):
        """Convert accumulated audio buffer to WAV and transcribe using Groq Whisper API."""
        try:
            if len(self.audio_buffer) == 0:
                return ""

            client = _get_groq_client()

            # Convert float32 back to 16-bit PCM (Int16)
            pcm16_data = (self.audio_buffer * 32767.0).astype(np.int16)

            # Write to in-memory BytesIO WAV file
            wav_io = io.BytesIO()
            with wave.open(wav_io, 'wb') as wav_file:
                wav_file.setnchannels(1)           # Mono
                wav_file.setsampwidth(2)          # 2 bytes per sample (16-bit)
                wav_file.setframerate(16000)       # 16 kHz sample rate
                wav_file.writeframes(pcm16_data.tobytes())

            wav_io.seek(0)
            wav_io.name = "audio.wav"

            # Build dynamic prompt
            base_prompt = "Job interview. Indian English dialect."
            if self.job_title:
                base_prompt += f" Role: {self.job_title}."
            if self.skills:
                base_prompt += f" Keywords: {self.skills}."

            prompt_text = base_prompt
            
            # Call Groq Whisper API (whisper-large-v3) optimized for technical terms
            transcription = client.audio.transcriptions.create(
                file=wav_io,
                model="whisper-large-v3",
                language="en",
                prompt=prompt_text,
                temperature=0.0,
            )
            text = transcription.text.strip()
            
            # Filter out known Whisper hallucinations
            lower_text = text.lower()
            hallucination_triggers = [
                "candidate speaks english",
                "indian accent",
                "indian-english",
                "technical terms, names",
                "candidate is not a professional",
                "technical interview. machine learning",
                "native english speaker",
                "i'm a native english speaker",
                "i am a native english speaker"
            ]
            
            for trigger in hallucination_triggers:
                if trigger in lower_text:
                    print(f"[STT] Filtered Whisper hallucination: {text}")
                    return "candidate didnt respondedd"
            
            # If the result is literally empty after Whisper (pure silence)
            if not text:
                return "candidate didnt respondedd"
                
            return text
        except Exception as e:
            print(f"[STT] Groq Transcription error: {e}")
            return None

    @sync_to_async
    def _get_user_from_query(self):
        from rest_framework_simplejwt.tokens import AccessToken
        from django.contrib.auth import get_user_model
        from .models import Interview
        User = get_user_model()
        qs = parse_qs(self.scope.get("query_string", b"").decode())
        token = qs.get("token", [None])[0]
        if not token:
            return None
            
        try:
            payload = AccessToken(token)
            return User.objects.get(id=payload["user_id"])
        except Exception:
            # Fallback for candidates connecting with interview_session_token
            try:
                interview = Interview.objects.get(session_token=token)
                class DummyUser:
                    email = f"Candidate: {interview.candidate_name}"
                return DummyUser()
            except Exception:
                return None

    @sync_to_async
    def _get_interview_context(self):
        from .models import Interview
        session_token = self.scope['url_route']['kwargs'].get('session_token')
        if not session_token:
            return "", ""
        try:
            interview = Interview.objects.get(session_token=session_token)
            skills = ", ".join(interview.skills) if interview.skills else ""
            title = interview.job.title if interview.job else ""
            return title, skills
        except Exception:
            return "", ""
