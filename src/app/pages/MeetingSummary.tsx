import { useMemo, useRef, useState } from "react";
import {
  Brain,
  CalendarRange,
  CheckSquare,
  Play,
  Square,
  Network,
  Sparkles,
} from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { DiagramViewer } from "../components/DiagramViewer";
import { MeetingInput } from "../components/MeetingInput";
import type { MeetingProcessResult, MeetingTask } from "../components/meeting-flow/types";

const DEFAULT_TRANSCRIPT = `Ana Martinez [00:12:34]: Para el proximo trimestre, necesitamos migrar a una arquitectura de microservicios antes de junio.

Carlos Lopez [00:13:15]: Puedo encargarme de la documentacion tecnica y preparar el plan de migracion.

Maria Torres [00:14:02]: Propongo organizar sesiones de capacitacion en la nueva arquitectura.

David Ruiz [00:17:30]: Necesitamos aprobar el incremento presupuestario para infraestructura cloud.`;

const USER_COLOR_PALETTE = [
  "border-rose-200 bg-rose-100 text-rose-700",
  "border-sky-200 bg-sky-100 text-sky-700",
  "border-emerald-200 bg-emerald-100 text-emerald-700",
  "border-amber-200 bg-amber-100 text-amber-700",
  "border-indigo-200 bg-indigo-100 text-indigo-700",
  "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700",
];

const THEME_RULES: Array<{ theme: string; keywords: string[] }> = [
  {
    theme: "Arquitectura e infraestructura",
    keywords: ["microserv", "arquitect", "infra", "cloud", "migr", "sistema"],
  },
  {
    theme: "Producto y experiencia",
    keywords: ["ux", "ui", "landing", "diseno", "protot", "feature", "beta"],
  },
  {
    theme: "Comunicacion y marketing",
    keywords: ["marketing", "campana", "email", "anuncio", "redes", "lead"],
  },
  {
    theme: "Operacion y gestion",
    keywords: ["presupuesto", "aprob", "plan", "document", "capacit", "seguimiento"],
  },
];

const FLOW_THEME_COLORS = [
  { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" },
  { fill: "#dcfce7", stroke: "#16a34a", text: "#166534" },
  { fill: "#fef3c7", stroke: "#d97706", text: "#92400e" },
  { fill: "#fce7f3", stroke: "#db2777", text: "#9d174d" },
  { fill: "#ede9fe", stroke: "#7c3aed", text: "#5b21b6" },
];

const FLOW_OWNER_COLORS = [
  { fill: "#f1f5f9", stroke: "#334155", text: "#0f172a" },
  { fill: "#e0f2fe", stroke: "#0369a1", text: "#0c4a6e" },
  { fill: "#ecfccb", stroke: "#65a30d", text: "#365314" },
  { fill: "#ffedd5", stroke: "#ea580c", text: "#9a3412" },
  { fill: "#ede9fe", stroke: "#6d28d9", text: "#4c1d95" },
  { fill: "#ffe4e6", stroke: "#e11d48", text: "#881337" },
];

const hashString = (input: string) => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const sanitizeMermaidLabel = (label: string) =>
  String(label || "")
    .replace(/"/g, "'")
    .replace(/[<>]/g, "")
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")")
    .replace(/\|/g, "/")
    .replace(/:/g, " -")
    .replace(/\s+/g, " ")
    .trim();

const detectTheme = (description: string) => {
  const normalized = description.toLowerCase();
  for (const rule of THEME_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.theme;
    }
  }
  return "General";
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const GANTT_CRITICAL_KEYWORDS = [
  "bloque",
  "riesgo",
  "seguridad",
  "presupuesto",
  "aprobar",
  "deadline",
  "urgente",
];

const GANTT_DONE_KEYWORDS = ["complet", "terminad", "cerrad", "finaliz"];

const getGanttTaskTags = (description: string, taskIndex: number) => {
  const normalized = (description || "").toLowerCase();
  if (GANTT_CRITICAL_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return ["crit"];
  }
  if (GANTT_DONE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return ["done"];
  }
  if (taskIndex === 0) {
    return ["active"];
  }
  return [];
};

const ensureHorizontalFlow = (mermaidCode: string) => {
  const cleaned = String(mermaidCode || "").trim();
  if (!cleaned) return "";
  if (/^flowchart\s+LR\b/i.test(cleaned)) return cleaned;
  if (/^flowchart\s+TD\b/i.test(cleaned)) return cleaned.replace(/^flowchart\s+TD\b/i, "flowchart LR");
  if (/^graph\s+TD\b/i.test(cleaned)) return cleaned.replace(/^graph\s+TD\b/i, "flowchart LR");
  if (/^(flowchart|graph)\b/i.test(cleaned)) return cleaned;
  return `flowchart LR\n${cleaned}`;
};

const buildCrossDependencyFlow = (
  tasks: MeetingTask[],
  fallbackMermaidCode: string,
) => {
  if (tasks.length === 0) {
    return ensureHorizontalFlow(
      fallbackMermaidCode ||
        'flowchart LR\nNSTART["Inicio"] --> NOTE["Sin tareas detectadas"] --> NEND["Cierre"]',
    );
  }

  const lines: string[] = ["flowchart LR", 'NSTART["Inicio"]', 'NEND["Cierre"]'];
  lines.push("style NSTART fill:#ccfbf1,stroke:#0f766e,stroke-width:2px,color:#134e4a");
  lines.push("style NEND fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d");

  const themeOrder: string[] = [];
  const themeTaskIds = new Map<string, string[]>();
  const userTaskIds = new Map<string, string[]>();
  const taskRecords = tasks.map((task, index) => {
    const id = `K${index + 1}`;
    const theme = detectTheme(task.descripcion || "");
    const user = task.responsable?.trim() || "Sin asignar";
    const label = sanitizeMermaidLabel(
      `${task.descripcion || "Tarea"} (${user})`,
    ).slice(0, 90);

    if (!themeTaskIds.has(theme)) {
      themeTaskIds.set(theme, []);
      themeOrder.push(theme);
    }
    themeTaskIds.get(theme)?.push(id);

    if (!userTaskIds.has(user)) {
      userTaskIds.set(user, []);
    }
    userTaskIds.get(user)?.push(id);

    return { id, theme, user, label, index };
  });

  const themeNodeIdByName = new Map<string, string>();
  themeOrder.forEach((theme, index) => {
    const themeNodeId = `TH${index + 1}`;
    themeNodeIdByName.set(theme, themeNodeId);
    lines.push(`${themeNodeId}["${sanitizeMermaidLabel(theme)}"]`);
    lines.push(`NSTART --> ${themeNodeId}`);
    const themeColor = FLOW_THEME_COLORS[index % FLOW_THEME_COLORS.length];
    lines.push(
      `style ${themeNodeId} fill:${themeColor.fill},stroke:${themeColor.stroke},stroke-width:2px,color:${themeColor.text}`,
    );
  });

  taskRecords.forEach((task) => {
    lines.push(`${task.id}["${task.label}"]`);
    const themeNodeId = themeNodeIdByName.get(task.theme);
    if (themeNodeId) {
      lines.push(`${themeNodeId} --> ${task.id}`);
    }
    const ownerColor = FLOW_OWNER_COLORS[
      hashString(task.user) % FLOW_OWNER_COLORS.length
    ];
    lines.push(
      `style ${task.id} fill:${ownerColor.fill},stroke:${ownerColor.stroke},stroke-width:2px,color:${ownerColor.text}`,
    );
  });

  // Sequential flow inside each theme.
  for (const taskIds of themeTaskIds.values()) {
    for (let index = 0; index < taskIds.length - 1; index += 1) {
      lines.push(`${taskIds[index]} --> ${taskIds[index + 1]}`);
    }
  }

  // Cross dependencies by same owner (non-blocking dashed dependency).
  for (const taskIds of userTaskIds.values()) {
    if (taskIds.length < 2) continue;
    for (let index = 0; index < taskIds.length - 1; index += 1) {
      lines.push(`${taskIds[index]} -.-> ${taskIds[index + 1]}`);
    }
  }

  const lowerDescriptions = tasks.map((task) => (task.descripcion || "").toLowerCase());
  const enableKeywords = ["aprobar", "definir", "disenar", "document", "plan"];
  const executeKeywords = ["implementar", "programar", "migrar", "lanzar", "ejecut", "desplegar"];

  // Cross dependencies by semantic enablement: approval/planning tasks enable execution tasks.
  taskRecords.forEach((targetTask) => {
    const targetDesc = lowerDescriptions[targetTask.index];
    const isExecutionTask = executeKeywords.some((keyword) => targetDesc.includes(keyword));
    if (!isExecutionTask) return;

    for (let sourceIndex = 0; sourceIndex < targetTask.index; sourceIndex += 1) {
      const sourceDesc = lowerDescriptions[sourceIndex];
      const isEnableTask = enableKeywords.some((keyword) => sourceDesc.includes(keyword));
      if (!isEnableTask) continue;

      const sourceTask = taskRecords[sourceIndex];
      lines.push(`${sourceTask.id} -.-> ${targetTask.id}`);
      break;
    }
  });

  const hasOutgoing = new Set<string>();
  lines.forEach((line) => {
    const direct = line.match(/^(K\d+)\s+-->|^(K\d+)\s+\.-/);
    if (direct?.[1]) hasOutgoing.add(direct[1]);
    if (direct?.[2]) hasOutgoing.add(direct[2]);
  });

  taskRecords.forEach((task) => {
    if (!hasOutgoing.has(task.id)) {
      lines.push(`${task.id} --> NEND`);
    }
  });

  return lines.join("\n");
};

const buildUserGantt = (tasks: MeetingTask[]) => {
  const baseDate = new Date();
  const normalizedBaseDate = new Date(
    Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate()),
  );

  const grouped = new Map<string, MeetingTask[]>();
  for (const task of tasks) {
    const user = task.responsable?.trim() || "Sin asignar";
    if (!grouped.has(user)) grouped.set(user, []);
    grouped.get(user)?.push(task);
  }

  const lines = [
    "gantt",
    "title Gantt por usuarios y tareas",
    "dateFormat YYYY-MM-DD",
    "axisFormat %d/%m",
  ];

  let cursor = normalizedBaseDate;
  let idCounter = 1;

  for (const [user, userTasks] of grouped.entries()) {
    lines.push(`section ${sanitizeMermaidLabel(user) || "Sin asignar"}`);
    userTasks.forEach((task, taskIndex) => {
      const safeTask = sanitizeMermaidLabel(task.descripcion) || `Tarea ${idCounter}`;
      const taskId = `u${idCounter}`;
      const durationDays = Math.min(4, Math.max(1, Math.ceil(safeTask.length / 36)));
      const tags = getGanttTaskTags(task.descripcion, taskIndex);
      const tagsPrefix = tags.length > 0 ? `${tags.join(", ")}, ` : "";
      lines.push(`${safeTask} :${tagsPrefix}${taskId}, ${toIsoDate(cursor)}, ${durationDays}d`);
      cursor = addDays(cursor, 1);
      idCounter += 1;
    });
  }

  if (idCounter === 1) {
    lines.push("section General");
    lines.push(`Definir plan de accion :active, u1, ${toIsoDate(cursor)}, 2d`);
  }

  return lines.join("\n");
};

interface ThemeGroup {
  theme: string;
  users: Array<{ user: string; tasks: MeetingTask[] }>;
}

interface TaskDetailSelection {
  task: MeetingTask;
  theme: string;
  user: string;
}

const groupTasksByThemeAndUser = (tasks: MeetingTask[]): ThemeGroup[] => {
  const map = new Map<string, Map<string, MeetingTask[]>>();

  for (const task of tasks) {
    const theme = detectTheme(task.descripcion || "");
    const user = task.responsable?.trim() || "Sin asignar";

    if (!map.has(theme)) {
      map.set(theme, new Map());
    }
    const usersMap = map.get(theme)!;
    if (!usersMap.has(user)) {
      usersMap.set(user, []);
    }
    usersMap.get(user)!.push(task);
  }

  return Array.from(map.entries())
    .map(([theme, usersMap]) => ({
      theme,
      users: Array.from(usersMap.entries()).map(([user, groupedTasks]) => ({
        user,
        tasks: groupedTasks,
      })),
    }))
    .sort((a, b) => a.theme.localeCompare(b.theme));
};

const getUserColorClass = (user: string, seed: number) => {
  const idx = hashString(`${seed}-${user}`) % USER_COLOR_PALETTE.length;
  return USER_COLOR_PALETTE[idx];
};

const shuffleArray = <T,>(items: T[]) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
};

const waitMs = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const withFlowSimulationStyles = (
  baseFlowCode: string,
  activeNodeId: string | null,
  completedNodeIds: string[],
) => {
  if (!baseFlowCode) return "";

  const lines = baseFlowCode.split("\n");
  const taskNodeIds = Array.from(
    new Set(
      lines
        .map((line) => line.match(/^\s*(K\d+)\s*\[/)?.[1])
        .filter((nodeId): nodeId is string => Boolean(nodeId)),
    ),
  );

  const allNodeIds = ["NSTART", ...taskNodeIds, "NEND"];
  const completedSet = new Set(completedNodeIds);

  const classDefs = [
    "classDef mmIdle fill:#f8fafc,stroke:#94a3b8,stroke-width:2px,color:#0f172a;",
    "classDef mmQueued fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;",
    "classDef mmDone fill:#dcfce7,stroke:#16a34a,stroke-width:3px,color:#14532d;",
    "classDef mmActive fill:#fef3c7,stroke:#f59e0b,stroke-width:4px,color:#78350f,stroke-dasharray:10 6;",
  ];

  const classLines = allNodeIds.map((nodeId) => {
    const className = completedSet.has(nodeId)
      ? "mmDone"
      : activeNodeId === nodeId
        ? "mmActive"
        : nodeId.startsWith("K")
          ? "mmQueued"
          : "mmIdle";

    return `class ${nodeId} ${className}`;
  });

  const edgeLines = lines.filter((line) => /-->|-\.->/.test(line));
  const linkStyles = edgeLines
    .map((edgeLine, index) => {
      const match = edgeLine.match(/^\s*([A-Za-z0-9_]+)\s+(-\.->|-->)\s+([A-Za-z0-9_]+)/);
      if (!match) return `linkStyle ${index} stroke:#94a3b8,stroke-width:1.6px,opacity:0.45;`;

      const fromNode = match[1];
      const toNode = match[3];
      const touchesActive =
        activeNodeId != null && (fromNode === activeNodeId || toNode === activeNodeId);
      const isCompletedEdge = completedSet.has(fromNode) && completedSet.has(toNode);

      if (touchesActive) {
        return `linkStyle ${index} stroke:#f59e0b,stroke-width:3px,opacity:1;`;
      }
      if (isCompletedEdge) {
        return `linkStyle ${index} stroke:#16a34a,stroke-width:2.6px,opacity:0.95;`;
      }
      return `linkStyle ${index} stroke:#94a3b8,stroke-width:1.6px,opacity:0.45;`;
    })
    .filter(Boolean);

  return [baseFlowCode, ...classDefs, ...classLines, ...linkStyles].join("\n");
};

export default function MeetingSummary() {
  const [meetingResult, setMeetingResult] = useState<MeetingProcessResult | null>(null);
  const [userColorSeed, setUserColorSeed] = useState(() => Math.floor(Math.random() * 100000));
  const flowSimulationRunIdRef = useRef(0);

  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isGanttModalOpen, setIsGanttModalOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskDetailSelection | null>(null);
  const [isFlowSimulationRunning, setIsFlowSimulationRunning] = useState(false);
  const [activeSimulationNodeId, setActiveSimulationNodeId] = useState<string | null>(null);
  const [completedSimulationNodeIds, setCompletedSimulationNodeIds] = useState<string[]>([]);
  const [lastStepDurationMs, setLastStepDurationMs] = useState<number | null>(null);

  const tasks = meetingResult?.tareas || [];
  const groupedTasks = useMemo(() => groupTasksByThemeAndUser(tasks), [tasks]);
  const firstTaskDetail = useMemo<TaskDetailSelection | null>(() => {
    const firstTheme = groupedTasks[0];
    const firstUser = firstTheme?.users[0];
    const firstTask = firstUser?.tasks[0];
    if (!firstTheme || !firstUser || !firstTask) return null;
    return {
      task: firstTask,
      theme: firstTheme.theme,
      user: firstUser.user,
    };
  }, [groupedTasks]);
  const horizontalFlowCode = useMemo(
    () => buildCrossDependencyFlow(tasks, meetingResult?.mermaid_codigo || ""),
    [meetingResult?.mermaid_codigo, tasks],
  );
  const taskLabelByNodeId = useMemo(() => {
    const labels = new Map<string, string>([
      ["NSTART", "Inicio"],
      ["NEND", "Cierre"],
    ]);
    tasks.forEach((task, index) => {
      labels.set(`K${index + 1}`, task.descripcion || `Tarea ${index + 1}`);
    });
    return labels;
  }, [tasks]);
  const simulatedFlowCode = useMemo(
    () =>
      withFlowSimulationStyles(
        horizontalFlowCode,
        activeSimulationNodeId,
        completedSimulationNodeIds,
      ),
    [activeSimulationNodeId, completedSimulationNodeIds, horizontalFlowCode],
  );
  const userGanttCode = useMemo(() => buildUserGantt(tasks), [tasks]);
  const totalFlowSteps = tasks.length + 2;
  const completedFlowSteps = completedSimulationNodeIds.length;
  const flowProgressPercent = Math.max(
    0,
    Math.min(100, Math.round((completedFlowSteps / Math.max(1, totalFlowSteps)) * 100)),
  );

  const stopFlowSimulation = () => {
    flowSimulationRunIdRef.current += 1;
    setIsFlowSimulationRunning(false);
    setActiveSimulationNodeId(null);
  };

  const startFlowSimulation = async () => {
    if (tasks.length === 0) return;

    const runId = flowSimulationRunIdRef.current + 1;
    flowSimulationRunIdRef.current = runId;
    setIsFlowSimulationRunning(true);
    setCompletedSimulationNodeIds([]);
    setActiveSimulationNodeId(null);
    setLastStepDurationMs(null);

    const taskNodeIds = tasks.map((_, index) => `K${index + 1}`);
    const randomizedTaskPath = shuffleArray(taskNodeIds);
    const simulationPath = ["NSTART", ...randomizedTaskPath, "NEND"];

    for (const nodeId of simulationPath) {
      if (flowSimulationRunIdRef.current !== runId) {
        return;
      }

      const stepDurationMs =
        nodeId === "NSTART" || nodeId === "NEND"
          ? 500 + Math.floor(Math.random() * 500)
          : 900 + Math.floor(Math.random() * 1700);

      setActiveSimulationNodeId(nodeId);
      setLastStepDurationMs(stepDurationMs);
      await waitMs(stepDurationMs);

      if (flowSimulationRunIdRef.current !== runId) {
        return;
      }

      setCompletedSimulationNodeIds((prev) =>
        prev.includes(nodeId) ? prev : [...prev, nodeId],
      );
      setActiveSimulationNodeId(null);
      await waitMs(150);
    }

    if (flowSimulationRunIdRef.current === runId) {
      setIsFlowSimulationRunning(false);
      setActiveSimulationNodeId(null);
    }
  };

  const handleToggleFlowSimulation = () => {
    if (isFlowSimulationRunning) {
      stopFlowSimulation();
      return;
    }
    void startFlowSimulation();
  };

  const handleFlowModalOpenChange = (open: boolean) => {
    setIsFlowModalOpen(open);
    if (!open) {
      stopFlowSimulation();
      setCompletedSimulationNodeIds([]);
      setLastStepDurationMs(null);
    }
  };

  const handleProcessed = (result: MeetingProcessResult) => {
    stopFlowSimulation();
    setCompletedSimulationNodeIds([]);
    setLastStepDurationMs(null);
    setMeetingResult(result);
    setUserColorSeed(Math.floor(Math.random() * 100000));
    setSelectedTaskDetail(null);
  };

  const relatedBySameOwner = useMemo(() => {
    if (!selectedTaskDetail) return [];
    return tasks
      .filter(
        (task) =>
          (task.responsable?.trim() || "Sin asignar") === selectedTaskDetail.user &&
          task.descripcion !== selectedTaskDetail.task.descripcion,
      )
      .slice(0, 4);
  }, [selectedTaskDetail, tasks]);

  const relatedBySameTheme = useMemo(() => {
    if (!selectedTaskDetail) return [];
    return tasks
      .filter(
        (task) =>
          detectTheme(task.descripcion || "") === selectedTaskDetail.theme &&
          task.descripcion !== selectedTaskDetail.task.descripcion,
      )
      .slice(0, 4);
  }, [selectedTaskDetail, tasks]);

  return (
    <div className="min-h-screen app-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">MeetMind</p>
              <p className="text-xs text-muted-foreground">Analisis visual de reuniones</p>
            </div>
          </div>
          <Badge className="border-primary/20 bg-primary/10 text-primary">
            Beta privada
          </Badge>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-2">
        <section className="space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background shadow-sm">
            <CardContent className="space-y-2 p-6">
              <Badge className="w-fit border-primary/20 bg-primary/10 text-primary">
                Captura de reunion
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Captura y procesa tu reunion en segundos
              </h1>
              <p className="text-sm text-muted-foreground">
                Inicia grabacion o pega texto. El sistema abstrae el resumen y activa vistas
                detalladas de tareas, flujo y gantt.
              </p>
            </CardContent>
          </Card>

          <MeetingInput
            initialText={DEFAULT_TRANSCRIPT}
            onProcessed={handleProcessed}
          />
        </section>

        <section className="space-y-4">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Resultado IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border border-border bg-background/80 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Resumen abstraido
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {meetingResult?.resumen ||
                    "Aun no hay resultado. Pulsa 'Procesar' en la izquierda para generar resumen y vistas detalladas."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Button
                  onClick={() => {
                    if (!selectedTaskDetail && firstTaskDetail) {
                      setSelectedTaskDetail(firstTaskDetail);
                    }
                    setIsTasksModalOpen(true);
                  }}
                  disabled={!meetingResult}
                  className="h-auto flex-col items-start gap-1 py-3"
                  variant={meetingResult ? "default" : "secondary"}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <CheckSquare className="h-4 w-4" />
                    Tasks
                  </span>
                  <span className="text-xs opacity-85">
                    {tasks.length} tareas detectadas
                  </span>
                </Button>

                <Button
                  onClick={() => setIsFlowModalOpen(true)}
                  disabled={!meetingResult}
                  className="h-auto flex-col items-start gap-1 py-3"
                  variant={meetingResult ? "default" : "secondary"}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Network className="h-4 w-4" />
                    Diagrama
                  </span>
                  <span className="text-xs opacity-85">Flujo accionable horizontal</span>
                </Button>

                <Button
                  onClick={() => setIsGanttModalOpen(true)}
                  disabled={!meetingResult}
                  className="h-auto flex-col items-start gap-1 py-3"
                  variant={meetingResult ? "default" : "secondary"}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarRange className="h-4 w-4" />
                    Gantt
                  </span>
                  <span className="text-xs opacity-85">Por usuarios y tareas</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Dialog open={isTasksModalOpen} onOpenChange={setIsTasksModalOpen}>
        <DialogContent className="max-h-[86vh] overflow-hidden sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Tareas por usuario y tematica</DialogTitle>
            <DialogDescription>
              Agrupacion automatica por tema con color de usuario aleatorio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid h-[68vh] gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-4 overflow-y-auto pr-1">
              {groupedTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay tareas para mostrar todavia.
                </p>
              )}
              {groupedTasks.map((themeGroup) => (
                <div
                  key={themeGroup.theme}
                  className="rounded-lg border border-border bg-background/80 p-4"
                >
                  <h3 className="text-sm font-semibold text-foreground">{themeGroup.theme}</h3>
                  <div className="mt-3 space-y-3">
                    {themeGroup.users.map((entry) => (
                      <div key={`${themeGroup.theme}-${entry.user}`} className="space-y-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getUserColorClass(entry.user, userColorSeed)}`}
                        >
                          {entry.user}
                        </span>
                        <ul className="space-y-1.5">
                          {entry.tasks.map((task, index) => {
                            const isSelected =
                              selectedTaskDetail?.task.descripcion === task.descripcion &&
                              selectedTaskDetail?.user === entry.user &&
                              selectedTaskDetail?.theme === themeGroup.theme;

                            return (
                              <li key={`${entry.user}-${task.descripcion}-${index}`}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedTaskDetail({
                                      task,
                                      theme: themeGroup.theme,
                                      user: entry.user,
                                    })
                                  }
                                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                                    isSelected
                                      ? "border-primary bg-primary/10 text-foreground"
                                      : "border-border bg-card text-foreground hover:border-primary/50"
                                  }`}
                                >
                                  {task.descripcion}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-lg border border-border bg-background/80 p-4">
              {selectedTaskDetail ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Detalle de tarea
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {selectedTaskDetail.task.descripcion}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-foreground">Responsable:</span>{" "}
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getUserColorClass(selectedTaskDetail.user, userColorSeed)}`}
                      >
                        {selectedTaskDetail.user}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Tematica:</span>{" "}
                      <span className="text-foreground/90">{selectedTaskDetail.theme}</span>
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Relacionadas por responsable
                    </p>
                    {relatedBySameOwner.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay relacionadas.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {relatedBySameOwner.map((task, index) => (
                          <li
                            key={`owner-${task.descripcion}-${index}`}
                            className="rounded-md border border-border bg-card px-2.5 py-2 text-sm text-foreground"
                          >
                            {task.descripcion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Relacionadas por tematica
                    </p>
                    {relatedBySameTheme.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay relacionadas.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {relatedBySameTheme.map((task, index) => (
                          <li
                            key={`theme-${task.descripcion}-${index}`}
                            className="rounded-md border border-border bg-card px-2.5 py-2 text-sm text-foreground"
                          >
                            {task.descripcion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Haz click en una tarea para ver su informacion.
                </p>
              )}
            </aside>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFlowModalOpen} onOpenChange={handleFlowModalOpenChange}>
        <DialogContent className="!inset-0 !top-0 !left-0 !h-[100dvh] !w-[100vw] !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-none border-0 p-0 shadow-none sm:!max-w-none">
          <div className="flex h-full flex-col">
            <DialogHeader className="gap-1 border-b border-border px-6 py-4 text-left">
              <DialogTitle className="text-lg font-semibold text-foreground">
                Diagrama de flujo accionable (horizontal)
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Vista completa de dependencias y secuencia de acciones.
              </DialogDescription>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  onClick={handleToggleFlowSimulation}
                  disabled={tasks.length === 0}
                  className="h-8 px-3"
                  variant={isFlowSimulationRunning ? "destructive" : "default"}
                >
                  {isFlowSimulationRunning ? (
                    <>
                      <Square className="mr-2 h-3.5 w-3.5" />
                      Detener
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-3.5 w-3.5" />
                      Play
                    </>
                  )}
                </Button>
                <Badge
                  className={
                    isFlowSimulationRunning
                      ? "border-amber-200 bg-amber-100 text-amber-800"
                      : "border-emerald-200 bg-emerald-100 text-emerald-800"
                  }
                >
                  {isFlowSimulationRunning ? "En ejecucion" : "En pausa"}
                </Badge>
                {activeSimulationNodeId && (
                  <Badge className="border-primary/30 bg-primary/10 text-primary">
                    {taskLabelByNodeId.get(activeSimulationNodeId) || activeSimulationNodeId}
                  </Badge>
                )}
                {lastStepDurationMs && (
                  <span className="text-xs text-muted-foreground">
                    Paso: {(lastStepDurationMs / 1000).toFixed(1)}s
                  </span>
                )}
                <div className="ml-auto flex min-w-[220px] items-center gap-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 transition-all duration-500 ${
                        isFlowSimulationRunning ? "animate-pulse" : ""
                      }`}
                      style={{ width: `${flowProgressPercent}%` }}
                    />
                  </div>
                  <span className="min-w-10 text-right text-xs text-muted-foreground">
                    {flowProgressPercent}%
                  </span>
                </div>
              </div>
            </DialogHeader>
            <div className="flex-1 min-h-0 p-0">
              <DiagramViewer
                mermaidCode={simulatedFlowCode}
                diagramType="flowchart"
                defaultZoom={0.75}
                fallbackItems={tasks.map(
                  (task) => `${task.descripcion} (${task.responsable || "Sin asignar"})`,
                )}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isGanttModalOpen} onOpenChange={setIsGanttModalOpen}>
        <DialogContent className="!inset-0 !top-0 !left-0 !h-[100dvh] !w-[100vw] !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-none border-0 p-0 shadow-none sm:!max-w-none">
          <div className="flex h-full flex-col">
            <DialogHeader className="gap-1 border-b border-border px-6 py-4 text-left">
              <DialogTitle className="text-lg font-semibold text-foreground">
                Diagrama Gantt por usuarios y tareas
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Plan visual de ejecucion distribuido por responsables.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 p-0">
              <DiagramViewer
                mermaidCode={userGanttCode}
                diagramType="gantt"
                defaultZoom={1}
                fallbackItems={tasks.map(
                  (task) => `${task.responsable || "Sin asignar"} - ${task.descripcion}`,
                )}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
