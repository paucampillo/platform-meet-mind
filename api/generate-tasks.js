import { callAnthropic, jsonResponse, safeParseJsonText } from "./_anthropic.js";

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  const { transcript, project, team } = await req.json();

  if (!transcript || transcript.trim().length < 10) {
    return jsonResponse({ success: false, error: "Transcript is required" }, 400);
  }

  const systemPrompt =
    "Eres MeetMind, un asistente inteligente para reuniones. Extraes tareas y compromisos de transcripciones en español. SIEMPRE responde únicamente con JSON válido.";

  const userPrompt = `Analiza esta transcripción y extrae TODAS las tareas, compromisos y action items mencionados.

${project ? `Proyecto: ${project}` : ""}
${team ? `Equipo: ${team}` : ""}

Responde con este JSON exacto:
{
  "tasks": [
    {
      "id": "1",
      "title": "Título corto y claro de la tarea",
      "description": "Descripción más detallada si aplica",
      "assignee": "Nombre de la persona responsable (o null si no se menciona)",
      "deadline": "Fecha límite mencionada (o null si no se menciona)",
      "priority": "alta|media|baja",
      "source": "Cita textual de la transcripción que originó esta tarea",
      "type": "task|decision|followup"
    }
  ],
  "decisions": [
    {
      "id": "d1",
      "text": "Decisión tomada",
      "madeBy": "Quién la tomó (o 'El equipo')",
      "impact": "Alto|Medio|Bajo"
    }
  ],
  "summary": "Resumen ejecutivo en 2 frases de los compromisos de esta reunión"
}

TRANSCRIPCIÓN:
${transcript}

Responde SOLO con el JSON, sin ningún texto adicional.`;

  const provider = await callAnthropic({
    systemPrompt,
    userPrompt,
    maxTokens: 2000,
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
