import { useState, useRef, useCallback, useEffect } from "react";

const SILENCE_TIMEOUT_MS = 2500;   // fire onSilenceDetected after 2.5 s of no new text

export default function useVoiceStream({ onSilenceDetected } = {}) {
  const [isListening, setIsListening]     = useState(false);
  const [amplitude, setAmplitude]         = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const audioContextRef    = useRef(null);
  const streamRef          = useRef(null);
  const analyserRef        = useRef(null);
  const animFrameRef       = useRef(null);
  const recognitionRef     = useRef(null);
  const silenceTimerRef    = useRef(null);
  const lastTextRef        = useRef("");
  const hasFatalErrorRef   = useRef(false);

  const onSilenceRef       = useRef(onSilenceDetected);
  useEffect(() => { onSilenceRef.current = onSilenceDetected; }, [onSilenceDetected]);

  // Cleanup function for stopping listening state
  const stopListening = useCallback(() => {
    setIsListening(false);
    setAmplitude(0);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
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
      console.warn("[STT] Error stopping recognition:", e);
    }

    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch (e) {}

    try {
      audioContextRef.current?.close();
    } catch (e) {}

    audioContextRef.current = null;
    analyserRef.current     = null;
    streamRef.current       = null;
    lastTextRef.current     = "";
  }, []);

  const startListening = useCallback(async () => {
    if (isListening) return;

    hasFatalErrorRef.current = false;

    // 1. Initialise Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("[STT] Browser Speech Recognition not supported.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN"; // Optimized for Indian-English dialect/accent profiles to maximize transcription accuracy

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

        const combinedText = (finalText + (finalText && interimText ? " " : "") + interimText).trim();
        if (combinedText) {
          setVoiceTranscript(combinedText);
          lastTextRef.current = combinedText;

          // Reset the silence timer
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            // Silence detected: stop the microphone and trigger final submission
            const textToSubmit = lastTextRef.current;
            stopListening();
            onSilenceRef.current?.(textToSubmit);
          }, SILENCE_TIMEOUT_MS);
        }
      };

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') {
          console.error("[STT] Speech recognition error:", e.error);
        }
        if (['not-allowed', 'audio-capture', 'service-not-allowed'].includes(e.error)) {
          hasFatalErrorRef.current = true;
        }
      };

      recognition.onend = () => {
        if (recognitionRef.current && !hasFatalErrorRef.current) {
          // Delayed restart to allow browser threads to completely clean up before starting again
          setTimeout(() => {
            if (recognitionRef.current && !hasFatalErrorRef.current) {
              try {
                recognition.start();
              } catch (err) {
                console.warn("[STT] Restart failed, marking as not listening:", err);
                setIsListening(false);
              }
            }
          }, 100);
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;

      // 2. Initialise Audio Analyzer (purely for visual amplitude animation)
      // Isolated in a separate try-catch so that if it fails due to browser autoplay/permissions/locks,
      // it does NOT prevent the actual Speech Recognition engine from running.
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioContext = new AudioCtx();
          audioContextRef.current = audioContext;

          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;

          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 32;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setAmplitude(Math.min(avg / 5, 20));
            animFrameRef.current = requestAnimationFrame(tick);
          };
          tick();
        }
      } catch (audioErr) {
        console.warn("[STT] Audio analyzer initialization failed, continuing speech recognition anyway:", audioErr);
      }

      recognition.start();
      setIsListening(true);
      setVoiceTranscript("");
      lastTextRef.current = "";
    } catch (err) {
      console.error("[STT] Start failed:", err);
      stopListening();
    }
  }, [isListening, stopListening]);

  useEffect(() => () => stopListening(), [stopListening]);

  return { isListening, amplitude, transcript: voiceTranscript, startListening, stopListening };
}
