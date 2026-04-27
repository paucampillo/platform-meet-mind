import { jsonResponse, safeParseJsonText } from "./_anthropic.js";

export const config = { runtime: "edge" };

const SYSTEM_PROMPT =
  "Eres el nucleo de MeetMind. Analiza la siguiente reunion. Devuelve estrictamente un objeto JSON valido con 3 claves: resumen (string con un resumen ejecutivo), tareas (array de objetos con descripcion y responsable), y mermaid_codigo (string con codigo Mermaid.js tipo flowchart TD para crear un diagrama de los procesos o dependencias habladas. No uses markdown de codigo en el string de mermaid, solo la sintaxis pura)";

const DEFAULT_MERMAID =
  "flowchart TD\nA[Sin diagrama generado] --> B[Revisar transcripcion]";
const DEFAULT_GANTT = `gantt
title Plan base de reunion
dateFormat YYYY-MM-DD
axisFormat %d/%m
section Seguimiento
Definir siguientes pasos :t1, 2026-01-01, 2d`;

const MODEL_CANDIDATES = [
  "openrouter/free",
  "deepseek/deepseek-r1:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen2.5-7b-instruct:free",
];

const extractProviderMessage = (body) => {
  if (!body) return null;
  if (typeof body === "string") return body;
  if (typeof body?.error?.message === "string") return body.error.message;
  if (typeof body?.message === "string") return body.message;
  return null;
};

const readContentText = (payload) => {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("\n");
  }
  return "";
};

const extractBalancedJsonObject = (rawText) => {
  const text = String(rawText || "");
  const start = text.indexOf("{");
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaping = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }
      if (char === "\\") {
        escaping = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
};

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const parseModelJsonLoose = (rawText) => {
  const direct = safeParseJsonText(rawText);
  if (direct.ok && direct.data && typeof direct.data === "object") {
    return direct.data;
  }

  const stripped = String(rawText || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const parsedStripped = safeJsonParse(stripped);
  if (parsedStripped && typeof parsedStripped === "object") {
    return parsedStripped;
  }

  const candidate = extractBalancedJsonObject(stripped);
  if (!candidate) return null;

  const parsedCandidate = safeJsonParse(candidate);
  if (parsedCandidate && typeof parsedCandidate === "object") {
    return parsedCandidate;
  }

  return null;
};

const fallbackRawResultFromText = (meetingText) => {
  const normalizedText = String(meetingText || "").trim();
  const compactSummary = normalizedText
    .replace(/\s+/g, " ")
    .slice(0, 420);

  const lines = normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10);

  const tasks = [];
  for (const line of lines) {
    const match = line.match(/^([^:\[]+?)(?:\s*\[[^\]]+\])?\s*:\s*(.+)$/);
    if (match) {
      const speaker = match[1].trim();
      const content = match[2].trim();
      if (content) {
        tasks.push({
          descripcion: content.slice(0, 180),
          responsable: speaker || "Sin asignar",
        });
      }
    } else if (line.length > 10) {
      tasks.push({
        descripcion: line.slice(0, 180),
        responsable: "Sin asignar",
      });
    }
    if (tasks.length >= 6) break;
  }

  if (tasks.length === 0) {
    tasks.push({
      descripcion: "Revisar reunion y confirmar acciones prioritarias",
      responsable: "Sin asignar",
    });
  }

  return {
    resumen: compactSummary || "Resumen generado sin estructura JSON del modelo.",
    tareas: tasks,
    mermaid_codigo: "",
    gantt_codigo: "",
  };
};

const stripMermaidFence = (input) =>
  String(input || "")
    .replace(/```mermaid/gi, "")
    .replace(/```/g, "")
    .trim();

const sanitizeMermaidLabel = (label) =>
  String(label || "")
    .replace(/"/g, "'")
    .replace(/[<>]/g, "")
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")")
    .replace(/\|/g, "/")
    .replace(/\s+/g, " ")
    .trim();

const buildNodeFlowMermaid = ({ tareas, resumen }) => {
  const taskLabels = (Array.isArray(tareas) ? tareas : [])
    .map((task) =>
      sanitizeMermaidLabel(
        `${task?.descripcion || ""}${task?.responsable ? ` (${task.responsable})` : ""}`,
      ),
    )
    .filter(Boolean)
    .slice(0, 10);

  const summaryLabels = String(resumen || "")
    .split(/[.;\n]/)
    .map((chunk) => sanitizeMermaidLabel(chunk))
    .filter(Boolean)
    .slice(0, 4);

  const labels =
    taskLabels.length > 0
      ? taskLabels
      : summaryLabels.length > 0
        ? summaryLabels
        : ["Reunion procesada", "Definir responsables", "Seguimiento de tareas"];

  const lines = ['flowchart TD', 'N0["Inicio de reunion"]'];
  lines.push(`N1["${labels[0]}"]`);
  lines.push("N0 --> N1");

  for (let index = 1; index < labels.length; index += 1) {
    const prevId = `N${index}`;
    const currentId = `N${index + 1}`;
    lines.push(`${currentId}["${labels[index]}"]`);
    lines.push(`${prevId} --> ${currentId}`);
  }

  lines.push(`N${labels.length + 1}["Cierre y seguimiento"]`);
  lines.push(`N${labels.length} --> N${labels.length + 1}`);

  return lines.join("\n");
};

const ensureNodeFlowMermaid = ({ mermaidCode, tareas, resumen }) => {
  const cleaned = stripMermaidFence(mermaidCode);
  if (!cleaned) {
    return buildNodeFlowMermaid({ tareas, resumen });
  }

  const withType = /^(flowchart|graph)\b/i.test(cleaned)
    ? cleaned
    : `flowchart TD\n${cleaned}`;
  const hasNode = /\[[^\]]+\]|\([^)]+\)|\{[^}]+\}/.test(withType);
  const hasEdge = /-->|==>|-.->/.test(withType);

  if (!hasNode || !hasEdge) {
    return buildNodeFlowMermaid({ tareas, resumen });
  }

  return withType;
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const toIsoDate = (date) => date.toISOString().slice(0, 10);

const sanitizeGanttLabel = (label) =>
  sanitizeMermaidLabel(label)
    .replace(/:/g, " -")
    .replace(/#/g, "")
    .slice(0, 70);

const buildGanttMermaid = ({ tareas, resumen }) => {
  const baseDate = new Date();
  const normalizedBaseDate = new Date(
    Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate()),
  );

  const taskLabels = (Array.isArray(tareas) ? tareas : [])
    .map((task) =>
      sanitizeGanttLabel(
        `${task?.descripcion || ""}${task?.responsable ? ` (${task.responsable})` : ""}`,
      ),
    )
    .filter(Boolean)
    .slice(0, 8);

  const summaryLabels = String(resumen || "")
    .split(/[.;\n]/)
    .map((chunk) => sanitizeGanttLabel(chunk))
    .filter(Boolean)
    .slice(0, 4);

  const labels =
    taskLabels.length > 0
      ? taskLabels
      : summaryLabels.length > 0
        ? summaryLabels
        : ["Analisis de reunion", "Asignar responsables", "Cerrar plan de accion"];

  const lines = [
    "gantt",
    "title Cronograma de acciones",
    "dateFormat YYYY-MM-DD",
    "axisFormat %d/%m",
    "section Ejecucion",
  ];

  let cursorDate = normalizedBaseDate;
  labels.forEach((label, index) => {
    const taskId = `task${index + 1}`;
    const durationDays = Math.min(4, 1 + (index % 3));
    const safeLabel = label || `Tarea ${index + 1}`;

    if (index === 0) {
      lines.push(`${safeLabel} :${taskId}, ${toIsoDate(cursorDate)}, ${durationDays}d`);
    } else {
      lines.push(`${safeLabel} :${taskId}, after task${index}, ${durationDays}d`);
    }

    cursorDate = addDays(cursorDate, durationDays);
  });

  return lines.join("\n");
};

const normalizeMeetingResult = (raw) => {
  const resumen =
    typeof raw?.resumen === "string" && raw.resumen.trim()
      ? raw.resumen.trim()
      : "";

  const tareas = Array.isArray(raw?.tareas)
    ? raw.tareas
        .map((task) => ({
          descripcion:
            typeof task?.descripcion === "string"
              ? task.descripcion.trim()
              : typeof task?.description === "string"
                ? task.description.trim()
                : "",
          responsable:
            typeof task?.responsable === "string"
              ? task.responsable.trim()
              : typeof task?.owner === "string"
                ? task.owner.trim()
                : "Sin asignar",
        }))
        .filter((task) => task.descripcion.length > 0)
    : [];

  const rawMermaid =
    typeof raw?.mermaid_codigo === "string" ? raw.mermaid_codigo.trim() : "";
  const aiMermaid = ensureNodeFlowMermaid({
    mermaidCode: rawMermaid || DEFAULT_MERMAID,
    tareas,
    resumen,
  });
  // Force a deterministic node-based flowchart to maximize Mermaid render success.
  const mermaidCodigo = buildNodeFlowMermaid({
    tareas:
      tareas.length > 0
      ? tareas
      : [
          {
            descripcion: sanitizeMermaidLabel(aiMermaid).slice(0, 120),
            responsable: "Sistema",
          },
        ],
    resumen,
  });
  const rawGantt =
    typeof raw?.gantt_codigo === "string" ? stripMermaidFence(raw.gantt_codigo) : "";
  const ganttCodigo =
    rawGantt && /^gantt\b/i.test(rawGantt)
      ? rawGantt
      : buildGanttMermaid({
          tareas:
            tareas.length > 0
              ? tareas
              : [
                  {
                    descripcion: sanitizeGanttLabel(rawGantt || DEFAULT_GANTT),
                    responsable: "Sistema",
                  },
                ],
          resumen,
        });

  return { resumen, tareas, mermaid_codigo: mermaidCodigo, gantt_codigo: ganttCodigo };
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  let body = null;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ success: false, error: "Body JSON invalido." }, 400);
  }

  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (text.length < 10) {
    return jsonResponse(
      {
        success: false,
        error: "Se requiere texto de reunion (minimo 10 caracteres).",
      },
      400,
    );
  }

  const apiKey = process.env?.OPEN_ROUTER_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse(
      {
        success: false,
        error: "OPEN_ROUTER_API_KEY no esta configurada en el servidor.",
      },
      500,
    );
  }

  let providerPayload = null;
  let providerText = "";
  let providerStatus = 502;
  let providerMessage = null;
  let hadRecoverableFailure = false;

  for (const modelId of MODEL_CANDIDATES) {
    let response;
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          temperature: 0.2,
          max_tokens: 1200,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Analiza la reunion y responde unicamente con JSON valido.\n\nREUNION:\n${text}`,
            },
          ],
        }),
      });
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          error: `Error de red al conectar con OpenRouter: ${error?.message || "desconocido"}`,
        },
        502,
      );
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const currentMessage = extractProviderMessage(payload) || "";
    if (response.ok) {
      const currentText = readContentText(payload).trim();
      if (currentText) {
        providerPayload = payload;
        providerText = currentText;
        providerStatus = 200;
        providerMessage = null;
        break;
      }
      hadRecoverableFailure = true;
      providerStatus = 502;
      providerMessage = currentMessage || `El modelo ${modelId} devolvio contenido vacio.`;
      continue;
    }

    const isInvalidModel = /not a valid model id/i.test(currentMessage);
    const hasNoEndpoints = /no endpoints found/i.test(currentMessage);
    const isRateLimited =
      response.status === 429 ||
      /rate limit|too many requests/i.test(currentMessage);
    const isTransientProviderIssue = /provider returned error/i.test(currentMessage);
    if (isInvalidModel || hasNoEndpoints || isRateLimited || isTransientProviderIssue) {
      hadRecoverableFailure = true;
      providerStatus = response.status || 400;
      providerMessage = currentMessage;
      continue;
    }

    providerStatus = response.status || 502;
    providerMessage = currentMessage;
    providerPayload = payload;
    break;
  }

  if (providerStatus !== 200 || !providerPayload) {
    if (hadRecoverableFailure) {
      return jsonResponse(
        {
          success: false,
          error:
            "Los modelos gratuitos estan temporalmente saturados o no disponibles. Intenta de nuevo en unos segundos.",
        },
        503,
      );
    }

    const fallbackMessage =
      providerStatus === 401 || providerStatus === 403
        ? "OpenRouter rechazo la API key (401/403)."
        : providerStatus === 429
          ? "OpenRouter devolvio limite de cuota o rate limit (429)."
          : providerMessage || `OpenRouter respondio con error (${providerStatus}).`;

    return jsonResponse(
      {
        success: false,
        error: providerMessage || fallbackMessage,
      },
      providerStatus || 502,
    );
  }

  const modelText = providerText || readContentText(providerPayload).trim();
  if (!modelText) {
    return jsonResponse(
      {
        success: false,
        error: "La respuesta de OpenRouter llego vacia.",
      },
      502,
    );
  }

  const parsedData = parseModelJsonLoose(modelText) || fallbackRawResultFromText(text);
  const data = normalizeMeetingResult(parsedData);
  if (
    !data.resumen &&
    data.tareas.length === 0 &&
    !data.mermaid_codigo &&
    !data.gantt_codigo
  ) {
    return jsonResponse(
      {
        success: false,
        error: "La IA devolvio una estructura incompleta.",
      },
      502,
    );
  }

  return jsonResponse({ success: true, data });
}
