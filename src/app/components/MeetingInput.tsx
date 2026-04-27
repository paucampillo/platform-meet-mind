import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Waves } from "lucide-react";

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

export function MeetingInput({ initialText = "", onProcessed }: MeetingInputProps) {
  const [text, setText] = useState(initialText);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioMeta, setAudioMeta] = useState<AudioMeta | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartRef = useRef<number | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const shouldRestartRecognitionRef = useRef(false);
  const speechRetryCountRef = useRef(0);

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
    if (!SpeechRecognitionCtor) {
      setErrorMessage(
        "Tu navegador graba audio, pero no soporta transcripcion automatica. Puedes escribir en el campo manual.",
      );
      return false;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : "es-ES";
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

      const normalized = finalChunk.replace(/\s+/g, " ").trim();
      const normalizedInterim = interimChunk.replace(/\s+/g, " ").trim();
      setLiveTranscript(normalizedInterim);

      if (!normalized) return;

      setText((prev) => {
        const current = prev.trim();
        return current ? `${current}\n${normalized}` : normalized;
      });
    };

    recognition.onerror = (event: any) => {
      const error = String(event?.error || "");
      if (error === "not-allowed" || error === "service-not-allowed") {
        setErrorMessage(
          "No hay permiso para transcribir voz. Activa el microfono en el navegador.",
        );
        shouldRestartRecognitionRef.current = false;
      } else if (error === "network") {
        if (shouldRestartRecognitionRef.current && speechRetryCountRef.current < 2) {
          speechRetryCountRef.current += 1;
          setErrorMessage(
            `La transcripcion perdio conexion. Reintentando (${speechRetryCountRef.current}/2)...`,
          );
          return;
        }
        setErrorMessage(
          "Error de transcripcion por red del navegador. Prueba en Chrome/Edge, localhost y con internet estable.",
        );
        shouldRestartRecognitionRef.current = false;
        setIsTranscribing(false);
      } else if (error === "no-speech") {
        // Normal when user pauses; keep silent.
      } else if (error) {
        setErrorMessage(`Error de transcripcion: ${error}`);
      }
    };

    recognition.onend = () => {
      if (!shouldRestartRecognitionRef.current) return;
      try {
        recognition.start();
      } catch {
        setIsTranscribing(false);
      }
    };

    recognitionRef.current = recognition;
    shouldRestartRecognitionRef.current = true;
    try {
      recognition.start();
      setIsTranscribing(true);
      speechRetryCountRef.current = 0;
      setErrorMessage(null);
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
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      void finalizeSpeechRecognition(0);
      cleanupStream();
    };
  }, []);

  const processMeeting = async (nextAudioMeta?: AudioMeta | null) => {
    if (isLoading) return;
    if (!text.trim()) {
      setErrorMessage("Anade texto de la reunion para procesar con IA en esta version.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await postApiJson<ProcessMeetingApiResponse>(
        "/api/process-meeting",
        {
          text: text.trim(),
          audioMeta: nextAudioMeta ?? audioMeta,
        },
      );

      if (!response.success || !response.data) {
        setErrorMessage(response.error || "No se pudo procesar la reunion.");
        return;
      }

      onProcessed(response.data);
    } catch (error: any) {
      setErrorMessage(error?.message || "Error al procesar la reunion.");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    recordingStartRef.current = Date.now();

    // Prefer speech-recognition-only mode to avoid microphone conflicts with MediaRecorder.
    const speechStarted = startSpeechRecognition();
    if (speechStarted) {
      setIsRecording(true);
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setErrorMessage("Tu navegador no soporta grabacion de audio.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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

        const resolvedAudioMeta = {
          mimeType,
          size: blob.size,
          durationMs,
        };
        setAudioMeta(resolvedAudioMeta);
        cleanupStream();

        // Stop speech recognition gracefully to keep the final chunk.
        await finalizeSpeechRecognition();
        await pause(150);
        await processMeeting(resolvedAudioMeta);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error: any) {
      setErrorMessage(error?.message || "No se pudo iniciar la grabacion de audio.");
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
      setIsRecording(false);
      return;
    }

    setIsRecording(false);
    void (async () => {
      await finalizeSpeechRecognition();
      const resolvedAudioMeta = buildSyntheticAudioMeta();
      setAudioMeta(resolvedAudioMeta);
      await processMeeting(resolvedAudioMeta);
    })();
  };

  return (
    <Card className="border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Captura de reunion (Beta privada)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isLoading}
              className="gap-2"
              type="button"
            >
              <Mic className="h-4 w-4" />
              Iniciar grabacion
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              disabled={isLoading}
              variant="destructive"
              className="gap-2"
              type="button"
            >
              <MicOff className="h-4 w-4" />
              Detener
            </Button>
          )}

          {isRecording && (
            <span className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              Grabando ahora
            </span>
          )}

          {isRecording && isTranscribing && (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Waves className="h-3.5 w-3.5" />
              Transcribiendo voz a texto
            </span>
          )}

          {audioMeta && !isRecording && (
            <span className="text-xs text-muted-foreground">
              Audio listo: {(audioMeta.size / 1024).toFixed(1)} KB
              {audioMeta.durationMs
                ? ` - ${(audioMeta.durationMs / 1000).toFixed(1)}s`
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
          />
          {isRecording && isTranscribing && liveTranscript && (
            <p className="text-xs text-muted-foreground">
              Escuchando: "{liveTranscript}"
            </p>
          )}
        </div>

        {errorMessage && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button
          onClick={() => {
            void processMeeting();
          }}
          disabled={isLoading}
          className="w-full gap-2 md:w-auto"
          type="button"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analizando con IA...
            </>
          ) : (
            "Procesar"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
