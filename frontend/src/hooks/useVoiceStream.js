import { useState, useRef, useCallback, useEffect } from "react";

const SILENCE_TIMEOUT_MS = 1500;

export default function useVoiceStream({ onSilenceDetected, existingStream } = {}) {
  const [isListening, setReactIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const setIsListening = useCallback((val) => {
    isListeningRef.current = val;
    setReactIsListening(val);
  }, []);

  const existingStreamRef = useRef(existingStream);
  useEffect(() => {
    existingStreamRef.current = existingStream;
  }, [existingStream]);
  const [amplitude, setAmplitude] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const sourceRef = useRef(null);
  const processorRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const backendFinalTextRef = useRef("");
  const accumulatedBrowserTextRef = useRef("");
  const hasFatalErrorRef = useRef(false);

  const onSilenceRef = useRef(onSilenceDetected);
  useEffect(() => { onSilenceRef.current = onSilenceDetected; }, [onSilenceDetected]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setAmplitude(0);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (e) {
      console.warn("[STT] Error stopping browser recognition:", e);
    }

    try {
      if (!existingStreamRef.current && processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
      }
    } catch (e) {
      console.warn("[STT] Error disconnecting processor:", e);
    }

    try {
      if (!existingStreamRef.current) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {}

    try {
      if (!existingStreamRef.current && audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    } catch (e) {}

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (!existingStreamRef.current) {
      audioContextRef.current = null;
      streamRef.current = null;
    }
    backendFinalTextRef.current = "";
    accumulatedBrowserTextRef.current = "";
  }, []);

  const startListening = useCallback(async () => {
    if (isListening) return;
    hasFatalErrorRef.current = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const browserHasProducedTextRef = { current: false };
    
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        let currentSessionFinalText = "";

        recognition.onresult = (event) => {
          let finalText = "";
          let interimText = "";
          for (let i = 0; i < event.results.length; ++i) {
            const segment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalText += (finalText ? " " : "") + segment.trim();
            } else {
              interimText += (interimText ? " " : "") + segment.trim();
            }
          }
          currentSessionFinalText = finalText;
          
          let fullFinal = accumulatedBrowserTextRef.current;
          if (finalText) {
            fullFinal += (fullFinal ? " " : "") + finalText;
          }
          const combinedText = (fullFinal + (fullFinal && interimText ? " " : "") + interimText).trim();
          
          if (combinedText) {
            browserHasProducedTextRef.current = true;
            // Update the UI immediately with the browser's fast transcription to reduce perceived latency
            setVoiceTranscript(combinedText);

            // Reset the silence timer on any speech detection
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              // Silence detected! Tell the backend to finalize the robust AI transcript
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: "finalize" }));
              }
            }, SILENCE_TIMEOUT_MS);
          }
        };

        recognition.onerror = (e) => {
          if (['not-allowed', 'audio-capture', 'service-not-allowed'].includes(e.error)) {
            hasFatalErrorRef.current = true;
          }
        };

        recognition.onend = () => {
          // Save this session's final text before restarting
          if (currentSessionFinalText) {
            accumulatedBrowserTextRef.current += (accumulatedBrowserTextRef.current ? " " : "") + currentSessionFinalText;
            currentSessionFinalText = "";
          }
          
          if (recognitionRef.current && !hasFatalErrorRef.current) {
            setTimeout(() => {
              if (recognitionRef.current && !hasFatalErrorRef.current) {
                try { recognition.start(); } catch (err) {}
              }
            }, 100);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        console.warn("[STT] Browser Speech API init failed, visuals will rely on backend.", e);
      }
    }

    // --- 2. SETUP BACKEND WEBSOCKET (For Robust Final Accuracy) ---
    try {
      const sessionToken = localStorage.getItem('interview_session_token');
      if (!sessionToken) {
        console.warn("[STT] No session token found.");
        hasFatalErrorRef.current = true;
        return;
      }

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const urlObj = new URL(API_BASE);
      const wsProtocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${urlObj.host}/ws/stt/${sessionToken}/?token=${sessionToken}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => console.log("[STT] WebSocket connected to Faster-Whisper");

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'transcript') {
            const text = data.text;
            
            // Reset silence timer using backend text as a fallback
            if (text.trim() !== "") {
              if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = setTimeout(() => {
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                  wsRef.current.send(JSON.stringify({ type: "finalize" }));
                }
              }, SILENCE_TIMEOUT_MS);
            }
            
            // Unconditionally use backend's high-fidelity intermediate text
            if (!data.is_final) {
              setVoiceTranscript(text);
            }
            
            // If the backend sends is_final = true, this is the final trigger
            if (data.is_final) {
              backendFinalTextRef.current = text;
              
              // The browser's native STT locks in mistakes if the user takes a short pause (firing onend).
              // The backend Faster-Whisper model transcribes the ENTIRE audio buffer seamlessly, fixing all 
              // grammatical and contextual errors that the browser locked in.
              // We use the backend's text as the absolute source of truth for submission!
              const textToSubmit = backendFinalTextRef.current || voiceTranscript;
                                     
              stopListening();
              onSilenceRef.current?.(textToSubmit);
            }
          }
        } catch(e) {
          console.error("[STT] Error parsing WS message", e);
        }
      };

      ws.onerror = () => hasFatalErrorRef.current = true;
      ws.onclose = () => setIsListening(false);

      // --- 3. SETUP AUDIO CONTEXT (To send raw bytes to Backend) ---
      let stream = existingStreamRef.current;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      streamRef.current = stream;

      // Ensure AudioContext exists and is running
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioCtx({ sampleRate: 16000 });
      }

      // ALWAYS recreate the ScriptProcessor to prevent Chrome from silently dropping the listener
      if (processorRef.current) {
        try { processorRef.current.disconnect(); } catch (e) {}
      }
      if (sourceRef.current) {
        try { sourceRef.current.disconnect(); } catch (e) {}
      }

      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (!isListeningRef.current) return;
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate amplitude for UI
        let sum = 0;
        for(let i = 0; i < inputData.length; i++) sum += Math.abs(inputData[i]);
        setAmplitude(Math.min(((sum / inputData.length) * 100), 20));

        let outputData = inputData;
        if (audioContext.sampleRate !== 16000) {
            const ratio = audioContext.sampleRate / 16000;
            const newLength = Math.round(inputData.length / ratio);
            const resampled = new Float32Array(newLength);
            for (let i = 0; i < newLength; i++) {
                resampled[i] = inputData[Math.round(i * ratio)] || 0;
            }
            outputData = resampled;
        }
        
        const pcm16 = new Int16Array(outputData.length);
        for (let i = 0; i < outputData.length; i++) {
            const s = Math.max(-1, Math.min(1, outputData[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        wsRef.current.send(pcm16.buffer);
      };

      setIsListening(true);
      setVoiceTranscript("");
      backendFinalTextRef.current = "";

    } catch (err) {
      console.error("[STT] Start failed:", err);
      stopListening();
    }
  }, [isListening, stopListening, setIsListening]);

  useEffect(() => () => stopListening(), [stopListening]);

  return { isListening, amplitude, transcript: voiceTranscript, startListening, stopListening };
}
