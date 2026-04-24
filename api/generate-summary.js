import { callAnthropic, jsonResponse, safeParseJsonText } from "./_anthropic.js";

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  const {
    transcript,
    format,
    detailLevel,
    focusAreas,
    speakers = [],
    includeTimestamps = false,
    includeQuotes = true,
    toneStyle = "Profesional",
    outputLanguage = "Español",
    includeStatistics = false,
    highlightPriority = false,
    linkToTranscript = true,
    templateStyle = "Ejecutivo",
  } = await req.json();

  if (!transcript || transcript.trim().length < 10) {
    return jsonResponse({ success: false, error: "Transcript is required" }, 400);
  }

  const formatInstructions = {
    resumen: `Genera un resumen estructurado en JSON con este formato exacto:
{
  "context": "Párrafo de contexto general de la reunión",
  "keyPoints": [
    {"text": "Punto clave 1", "category": "decision|task|insight|risk"},
    {"text": "Punto clave 2", "category": "decision|task|insight|risk"}
  ],
  "openIssues": ["Riesgo o tema abierto 1", "Riesgo o tema abierto 2"],
  "decisions": ["Decisión 1", "Decisión 2"],
  "nextSteps": ["Próximo paso 1", "Próximo paso 2"]
}`,
    esquema: `Genera un esquema jerárquico en JSON con este formato exacto:
{
  "outline": [
    {
      "title": "Tema principal 1",
      "level": 1,
      "children": [
        {"title": "Subtema 1.1", "level": 2, "children": []},
        {"title": "Subtema 1.2", "level": 2, "children": [{"title": "Detalle 1.2.1", "level": 3, "children": []}]}
      ]
    },
    {
      "title": "Tema principal 2",
      "level": 1,
      "children": []
    }
  ]
}`,
    mapa: `Genera un mapa conceptual en JSON con este formato exacto:
{
  "centralConcept": "Concepto central de la reunión",
  "nodes": [
    {"id": "1", "label": "Concepto A", "type": "primary", "description": "Descripción breve"},
    {"id": "2", "label": "Concepto B", "type": "secondary", "description": "Descripción breve"},
    {"id": "3", "label": "Concepto C", "type": "secondary", "description": "Descripción breve"}
  ],
  "connections": [
    {"from": "central", "to": "1", "label": "incluye"},
    {"from": "1", "to": "2", "label": "requiere"},
    {"from": "1", "to": "3", "label": "genera"}
  ]
}`,
  };

  const detailInstructions = {
    Corto: "Sé muy conciso. Máximo 3-4 puntos clave.",
    Medio: "Nivel de detalle moderado. 5-7 puntos clave con contexto.",
    Detallado: "Muy detallado. 8-12 puntos con contexto completo y análisis.",
  };

  const focusInstruction =
    focusAreas && focusAreas.length > 0
      ? `Enfócate especialmente en: ${focusAreas.join(", ")}.`
      : "";

  const speakersInstruction =
    speakers && speakers.length > 0 && !speakers.includes("all")
      ? `Prioriza el análisis de estos hablantes: ${speakers.join(", ")}.`
      : "Considera a todos los hablantes de la transcripción.";

  const outputPreferences = [
    `Idioma de salida: ${outputLanguage}.`,
    `Tono de redacción: ${toneStyle}.`,
    includeTimestamps
      ? "Incluye marcas de tiempo cuando sean relevantes."
      : "No incluyas marcas de tiempo innecesarias.",
    includeQuotes
      ? "Incluye citas textuales breves para respaldar puntos clave."
      : "Evita citas textuales largas.",
    includeStatistics
      ? "Añade métricas o estadísticas breves de la conversación."
      : "No añadas métricas adicionales.",
    highlightPriority
      ? "Resalta explícitamente tareas y decisiones prioritarias."
      : "No fuerces priorización extra.",
    linkToTranscript
      ? "Cuando sea útil, referencia de qué parte de la transcripción proviene cada hallazgo."
      : "No incluyas referencias al origen textual.",
    `Usa estilo de plantilla: ${templateStyle}.`,
  ].join("\n");

  const systemPrompt =
    "Eres MeetMind, un asistente inteligente para reuniones. Analizas transcripciones y generas contenido estructurado en español. SIEMPRE responde únicamente con JSON válido, sin markdown, sin explicaciones adicionales.";

  const userPrompt = `Analiza esta transcripción de reunión y ${
    formatInstructions[format] || formatInstructions.resumen
  }

Nivel de detalle: ${detailInstructions[detailLevel] || detailInstructions.Medio}
${focusInstruction}
${speakersInstruction}

Preferencias de salida:
${outputPreferences}

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

  return jsonResponse({ success: true, format, data: parsed.data });
}
