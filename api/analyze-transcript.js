import { callAnthropic, jsonResponse, safeParseJsonText } from "./_anthropic.js";

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  const { transcript } = await req.json();

  if (!transcript || transcript.trim().length < 10) {
    return jsonResponse({ success: false, error: "Transcript is required" }, 400);
  }

  const systemPrompt =
    "Eres MeetMind, un asistente inteligente para reuniones. Analizas transcripciones y clasificas cada segmento. Responde SOLO con JSON válido.";

  const userPrompt = `Analiza esta transcripción y devuelve cada fragmento clasificado. Para cada línea de la transcripción, identifica si es una decisión, tarea, insight, o texto normal.

Formato de respuesta:
{
  "segments": [
    {
      "id": "1",
      "speaker": "Nombre del hablante",
      "timestamp": "00:XX:XX o extraído del texto",
      "text": "Texto del segmento",
      "type": "decision|task|insight|normal",
      "confidence": 0.0 a 1.0
    }
  ],
  "stats": {
    "totalWords": número,
    "decisions": número,
    "tasks": número,
    "insights": número,
    "speakers": ["nombre1", "nombre2"]
  }
}

TRANSCRIPCIÓN:
${transcript}

Responde SOLO con el JSON, sin texto adicional.`;

  const provider = await callAnthropic({
    systemPrompt,
    userPrompt,
    maxTokens: 3000,
  });

  if (!provider.ok) {
    return jsonResponse({ success: false, error: provider.error }, provider.status || 500);
  }

  const parsed = safeParseJsonText(provider.text);
  if (!parsed.ok || !parsed.data) {
    return jsonResponse(
      {
        success: false,
        error: "No se pudo parsear el JSON devuelto por la IA.",
      },
      502,
    );
  }

  return jsonResponse({ success: true, data: parsed.data });
}
