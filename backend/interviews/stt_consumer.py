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

# ── Model singleton – loaded once per worker process ─────────────────────────
_whisper_model = None


def _load_model():
    global _whisper_model
    if _whisper_model is None:
        from faster_whisper import WhisperModel
        _whisper_model = WhisperModel(
            "tiny.en",
            device="cpu",
            compute_type="int8",
        )
        print("[STT] Faster-Whisper model loaded (tiny.en, cpu, int8)")
    return _whisper_model


# ── Consumer ─────────────────────────────────────────────────────────────────
class STTConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = await self._get_user_from_query()
        if user is None:
            await self.close(code=4001)
            return

        self.audio_buffer = np.array([], dtype=np.float32)
        self.current_transcript = ""
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

            # Transcribe only when we have ≥1 second of audio (16 000 samples)
            if len(self.audio_buffer) < 16_000:
                return

            transcript = await self._transcribe()
            if transcript and transcript.strip() != self.current_transcript.strip():
                self.current_transcript = transcript.strip()
                await self.send(json.dumps({
                    "type": "transcript",
                    "text": self.current_transcript,
                    "is_final": False,
                }))

        # ── Text frame: { "type": "finalize" } ───────────────────────────────
        elif text_data:
            data = json.loads(text_data)
            if data.get("type") == "finalize":
                transcript = await self._transcribe()
                final_text = (transcript or self.current_transcript).strip()
                # Clear buffer for next answer
                self.audio_buffer = np.array([], dtype=np.float32)
                self.current_transcript = ""
                await self.send(json.dumps({
                    "type": "transcript",
                    "text": final_text,
                    "is_final": True,
                }))

    # ── Helpers ───────────────────────────────────────────────────────────────

    @sync_to_async
    def _transcribe(self):
        """Run Faster-Whisper synchronously in a thread pool."""
        try:
            model = _load_model()
            audio_snapshot = self.audio_buffer.copy()
            segments, _info = model.transcribe(
                audio_snapshot,
                language="en",
                vad_filter=True,
                vad_parameters={"min_silence_duration_ms": 300},
                beam_size=1,
            )
            return " ".join(seg.text for seg in segments).strip()
        except Exception as e:
            print(f"[STT] Transcription error: {e}")
            return ""

    @sync_to_async
    def _get_user_from_query(self):
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            from django.contrib.auth import get_user_model
            User = get_user_model()
            qs = parse_qs(self.scope.get("query_string", b"").decode())
            jwt = qs.get("token", [None])[0]
            if not jwt:
                return None
            payload = AccessToken(jwt)
            return User.objects.get(id=payload["user_id"])
        except Exception:
            return None
