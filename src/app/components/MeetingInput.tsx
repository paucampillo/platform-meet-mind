import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Mic, Sparkles, StopCircle, Waves, Zap } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { postApiJson } from "../lib/apiClient";
import type { MeetingProcessResult } from "./meeting-flow/types";

interface MeetingInputProps {
  initialText?: string;
  onProcessed: (result: MeetingProcessResult) => void;
}

interface ProcessMeetingApiResponse {
  success: boolean;
  data: MeetingProcessResult;
  error?: string;
}

interface AudioMeta {
  mimeType: string;
  size: number;
  durationMs: number | null;
}

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const getSpeechRecognitionCtor = (): (new () => BrowserSpeechRecognition) | null => {
  if (typeof window === "undefined") return null;
  const maybeWindow = window as any;
  return maybeWindow.SpeechRecognition || maybeWindow.webkitSpeechRecognition || null;
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Mensajes de procesamiento originales ──────────────────────────────────────
const PROCESSING_MESSAGES = [
  "Identificando quién propuso la idea que todos ignoraron...",
  "Contando las veces que alguien dijo 'esto podría ser un email'...",
  "Detectando el momento exacto en que todos empezaron a mirar el móvil...",
  "Catalogando interrupciones por grado de desfachatez...",
  "Calculando el porcentaje de 'sí, sí' sin intención de hacer nada...",
  "Transcribiendo el silencio incómodo después de la pregunta del jefe...",
  "Identificando qué tarea nadie va a hacer realmente...",
  "Analizando la cadena de 'yo creía que lo hacías tú'...",
  "Procesando el 'os mando un correo' que nunca llegó...",
  "Deduciendo quién tomaba notas y quién miraba Twitter...",
  "Calculando el índice de asentimientos sin comprensión...",
  "Extrayendo el único punto accionable entre 47 diapositivas...",
  "Transcribiendo la tangente de 20 minutos sobre la reunión anterior...",
  "Mapeando las promesas con fecha de caducidad de 3 días...",
  "Localizando el 'lo hablamos luego' que jamás se habló...",
  "Analizando el tono del 'buena idea' que nunca se ejecutó...",
  "Procesando el ruido de teclado de quien tomaba 'apuntes'...",
  "Clasificando excusas por nivel de creatividad y desparpajo...",
  "Identificando al responsable del micro en silencio 8 minutos...",
  "Detectando cuántas veces se repitió el mismo punto con distintas palabras...",
  "Calculando horas-persona invertidas en decidir la hora de la próxima reunión...",
  "Transcribiendo el 'podemos avanzar' que en realidad no avanzó nada...",
  "Analizando quién habló el 80% del tiempo y quién puso cara de pensar...",
  "Procesando el 'os dejo el link en el chat' que nadie abrió...",
  "Identificando la tarea que va a terminar en otro sprint por consenso tácito...",
];

export function MeetingInput({ initialText = "", onProcessed }: MeetingInputProps) {
  const [text, setText] = useState(initialText);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioMeta, setAudioMeta] = useState<AudioMeta | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  // Processing animation state
  const [processingStep, setProcessingStep] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartRef = useRef<number | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const shouldRestartRecognitionRef = useRef(false);
  const speechRetryCountRef = useRef(0);

  // Audio visualization
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(14).fill(0.08));
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // ── Processing animation loop ──────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      setFakeProgress(0);
      setProcessingStep(0);
      return;
    }

    // Cycle messages every 3.5 seconds
    const messageTimer = setInterval(() => {
      setProcessingStep((prev) => prev + 1);
    }, 3500);

    // Fake progress: fast start, slows near 88%
    const progressTimer = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev >= 88) return prev + (Math.random() > 0.85 ? 0.3 : 0);
        const increment = Math.max(0.4, (88 - prev) * 0.055 + Math.random() * 2.5);
        return Math.min(88, prev + increment);
      });
    }, 350);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, [isLoading]);

  const startAudioAnalysis = (stream: MediaStream) => {
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const bucketSize = Math.floor(dataArray.length / 14);
        const levels = Array.from({ length: 14 }, (_, i) => {
          const start = i * bucketSize;
          const slice = dataArray.slice(start, start + bucketSize);
          const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
          return Math.max(0.06, avg / 255);
        });
        setAudioLevels(levels);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    } catch {
      // AudioContext may fail in some environments; silently continue
    }
  };

  const stopAudioAnalysis = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
    setAudioLevels(Array(14).fill(0.08));
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const finalizeSpeechRecognition = async (timeoutMs = 1500) => {
    shouldRestartRecognitionRef.current = false;
    const recognition = recognitionRef.current;
    if (!recognition) {
      setIsTranscribing(false);
      setLiveTranscript("");
      return;
    }

    await new Promise<void>((resolve) => {
      let resolved = false;
      const finish = () => {
        if (resolved) return;
        resolved = true;
        recognitionRef.current = null;
        setIsTranscribing(false);
        setLiveTranscript("");
        resolve();
      };

      const timer = window.setTimeout(finish, timeoutMs);

      recognition.onend = () => {
        window.clearTimeout(timer);
        finish();
      };

      try {
        recognition.stop();
      } catch {
        window.clearTimeout(timer);
        finish();
      }
    });
  };

  const startSpeechRecognition = () => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) return false;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const phrase = String(result?.[0]?.transcript || "").trim();
        if (!phrase) continue;
        if (result.isFinal) {
          finalChunk += `${phrase} `;
        } else {
          interimChunk += `${phrase} `;
        }
      }
      setLiveTranscript(interimChunk.replace(/\s+/g, " ").trim());
      const normalized = finalChunk.replace(/\s+/g, " ").trim();
      if (!normalized) return;
      setText((prev) => {
        const current = prev.trim();
        return current ? `${current}\n${normalized}` : normalized;
      });
    };

    recognition.onerror = (event: any) => {
      const error = String(event?.error || "");
      if (error === "not-allowed" || error === "service-not-allowed") {
        shouldRestartRecognitionRef.current = false;
      } else if (error === "network") {
        if (shouldRestartRecognitionRef.current && speechRetryCountRef.current < 2) {
          speechRetryCountRef.current += 1;
          return;
        }
        shouldRestartRecognitionRef.current = false;
        setIsTranscribing(false);
      }
    };

    recognition.onend = () => {
      if (!shouldRestartRecognitionRef.current) return;
      try { recognition.start(); } catch { setIsTranscribing(false); }
    };

    recognitionRef.current = recognition;
    shouldRestartRecognitionRef.current = true;
    try {
      recognition.start();
      setIsTranscribing(true);
      speechRetryCountRef.current = 0;
      return true;
    } catch {
      shouldRestartRecognitionRef.current = false;
      recognitionRef.current = null;
      setIsTranscribing(false);
      return false;
    }
  };

  const buildSyntheticAudioMeta = (): AudioMeta => {
    const durationMs = recordingStartRef.current
      ? Date.now() - recordingStartRef.current
      : null;
    return {
      mimeType: "speech-recognition",
      size: 0,
      durationMs,
    };
  };

  useEffect(() => {
    if (!isRecording) {
      setRecordingSeconds(0);
      stopAudioAnalysis();
      return;
    }
    const timer = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      void finalizeSpeechRecognition(0);
      cleanupStream();
      stopAudioAnalysis();
    };
  }, []);

  const processMeeting = async (nextAudioMeta?: AudioMeta | null) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await postApiJson<ProcessMeetingApiResponse>(
        "/api/process-meeting",
        {
          text: text.trim() || "demo",
          audioMeta: nextAudioMeta ?? audioMeta,
        },
      );

      if (response.success && response.data) {
        onProcessed(response.data);
      }
    } catch {
      // silently ignored in demo mode
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    recordingStartRef.current = Date.now();

    const speechStarted = startSpeechRecognition();
    if (speechStarted) {
      setIsRecording(true);
      // Try to start audio analysis for waveform (may fail if no media stream)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        startAudioAnalysis(stream);
        // Don't store this stream in streamRef - it's just for visualization
      } catch { /* silent */ }
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startAudioAnalysis(stream);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const durationMs = recordingStartRef.current
          ? Date.now() - recordingStartRef.current
          : null;

        const resolvedAudioMeta = { mimeType, size: blob.size, durationMs };
        setAudioMeta(resolvedAudioMeta);
        stopAudioAnalysis();
        cleanupStream();

        await finalizeSpeechRecognition();
        await pause(150);
        await processMeeting(resolvedAudioMeta);
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      cleanupStream();
      setIsRecording(false);
      void finalizeSpeechRecognition(0);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      shouldRestartRecognitionRef.current = false;
      recorder.stop();
      stopAudioAnalysis();
      setIsRecording(false);
      return;
    }

    setIsRecording(false);
    stopAudioAnalysis();
    void (async () => {
      await finalizeSpeechRecognition();
      const resolvedAudioMeta = buildSyntheticAudioMeta();
      setAudioMeta(resolvedAudioMeta);
      await processMeeting(resolvedAudioMeta);
    })();
  };

  const currentMessage = PROCESSING_MESSAGES[processingStep % PROCESSING_MESSAGES.length];
  const progressRounded = Math.round(fakeProgress);

  return (
    <Card className="border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Captura de reunion (Beta privada)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {!isRecording ? (
            <motion.button
              type="button"
              onClick={startRecording}
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-100 hover:shadow-rose-200 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="h-4 w-4" />
              Iniciar grabacion
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={stopRecording}
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-shadow disabled:opacity-50"
            >
              <StopCircle className="h-4 w-4" />
              Detener y procesar
            </motion.button>
          )}

          {isRecording && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Recording status badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive">
                <motion.span
                  className="h-2 w-2 rounded-full bg-destructive"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
                REC
                <span className="font-mono tabular-nums">
                  {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:
                  {String(recordingSeconds % 60).padStart(2, "0")}
                </span>
              </span>

              {/* Waveform bars */}
              <div className="flex items-center gap-px h-8">
                {audioLevels.map((level, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-rose-500 to-rose-300"
                    animate={{ height: `${Math.max(8, level * 100)}%` }}
                    transition={{ duration: 0.08, ease: "linear" }}
                    style={{ minHeight: 4, maxHeight: 32 }}
                  />
                ))}
              </div>

              {isTranscribing && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <Waves className="h-3 w-3" />
                  Transcribiendo...
                </span>
              )}
            </div>
          )}

          {audioMeta && !isRecording && !isLoading && (
            <span className="text-xs text-muted-foreground">
              Audio listo: {(audioMeta.size / 1024).toFixed(1)} KB
              {audioMeta.durationMs
                ? ` — ${(audioMeta.durationMs / 1000).toFixed(1)}s`
                : ""}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Notas o transcripcion manual
          </label>
          <Textarea
            placeholder="Pega aqui tus notas o habla para autocompletar la transcripcion..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-32"
            disabled={isLoading}
          />
          {isRecording && isTranscribing && liveTranscript && (
            <p className="text-xs text-muted-foreground">
              Escuchando: "{liveTranscript}"
            </p>
          )}
        </div>

        {/* ── Processing animation / Procesar button ────────────────── */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-violet-50/50 to-background"
            >
              {/* Top bar: icon + title + % */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <motion.div
                  animate={{
                    scale: [1, 1.12, 1],
                    rotate: [0, 6, -6, 0],
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-200"
                >
                  <Brain className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">Analizando con IA</p>
                    <motion.span
                      key={progressRounded}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm font-bold text-indigo-600"
                    >
                      {progressRounded}%
                    </motion.span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Procesando la transcripcion de la reunion
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-5 pb-3">
                <div className="relative h-2.5 overflow-hidden rounded-full bg-indigo-100/80">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500"
                    animate={{ width: `${fakeProgress}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2.2s_ease_infinite]" />
                </div>
              </div>

              {/* Cycling message */}
              <div className="px-5 pb-4">
                <div className="flex items-start gap-2.5 rounded-lg bg-white/60 border border-indigo-100 px-4 py-3 min-h-[52px]">
                  <motion.div
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Zap className="h-3.5 w-3.5 flex-shrink-0 text-indigo-400 mt-0.5" />
                  </motion.div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={processingStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28 }}
                      className="text-xs text-indigo-700/80 leading-relaxed italic"
                    >
                      {currentMessage}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Step dots + status */}
              <div className="flex items-center gap-2 border-t border-indigo-100/60 px-5 py-3">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const active = i === processingStep % 5;
                    return (
                      <motion.div
                        key={i}
                        animate={{
                          width: active ? 20 : 6,
                          backgroundColor: active ? "#6366f1" : "#ddd6fe",
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="h-1.5 rounded-full"
                        style={{ width: active ? 20 : 6 }}
                      />
                    );
                  })}
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-indigo-400" />
                  {fakeProgress < 75
                    ? "Leyendo entre lineas..."
                    : fakeProgress < 88
                      ? "Casi lo tengo todo..."
                      : "Ultimando detalles..."}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => { void processMeeting(); }}
                disabled={isLoading}
                className="w-full gap-2 md:w-auto"
                type="button"
              >
                <Sparkles className="h-4 w-4" />
                Procesar con IA
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
