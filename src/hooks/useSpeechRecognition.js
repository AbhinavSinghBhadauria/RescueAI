import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Real speech-to-text via the browser's Web Speech API
 * (SpeechRecognition / webkitSpeechRecognition). Supported in Chrome,
 * Edge, and most Chromium browsers; not in Firefox and inconsistently in
 * Safari — callers should check `supported` and offer typing as a
 * fallback rather than pretending it always works.
 */
export function useSpeechRecognition({ onResult } = {}) {
  const RecognitionCtor = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;
  const supported = !!RecognitionCtor;

  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    if (!supported) return;
    const recognition = new RecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      setInterimTranscript(interim);
      if (final) onResultRef.current?.(final.trim());
    };

    recognition.onerror = (event) => {
      setError(
        event.error === 'not-allowed' ? 'Microphone permission denied.'
        : event.error === 'no-speech' ? 'No speech detected — try again.'
        : `Speech recognition error: ${event.error}`
      );
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [supported]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // start() throws if already started — ignore
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { supported, listening, interimTranscript, error, start, stop, toggle };
}
