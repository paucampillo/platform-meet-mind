import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  CalendarRange,
  CheckSquare,
  Play,
  Square,
  Network,
  Sparkles,
  User,
  Tag,
  Zap,
  TrendingUp,
  ChevronRight,
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

const USER_DOT_COLORS = [
  "bg-rose-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-indigo-400",
  "bg-fuchsia-400",
];

const THEME_VISUAL_STYLES = [
  {
    gradient: "from-sky-50 to-blue-50",
    border: "border-sky-200",
    headerBg: "bg-gradient-to-r from-sky-500 to-blue-500",
    badge: "bg-sky-100 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
    glow: "shadow-sky-100",
    taskBorder: "border-l-sky-400",
  },
  {
    gradient: "from-emerald-50 to-green-50",
    border: "border-emerald-200",
    headerBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    glow: "shadow-emerald-100",
    taskBorder: "border-l-emerald-400",
  },
  {
    gradient: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    headerBg: "bg-gradient-to-r from-amber-500 to-orange-500",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    glow: "shadow-amber-100",
    taskBorder: "border-l-amber-400",
  },
  {
    gradient: "from-fuchsia-50 to-pink-50",
    border: "border-fuchsia-200",
    headerBg: "bg-gradient-to-r from-fuchsia-500 to-pink-500",
    badge: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    dot: "bg-fuchsia-500",
    glow: "shadow-fuchsia-100",
    taskBorder: "border-l-fuchsia-400",
  },
  {
    gradient: "from-violet-50 to-indigo-50",
    border: "border-violet-200",
    headerBg: "bg-gradient-to-r from-violet-500 to-indigo-500",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
    glow: "shadow-violet-100",
    taskBorder: "border-l-violet-400",
  },
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

  for (const taskIds of themeTaskIds.values()) {
    for (let index = 0; index < taskIds.length - 1; index += 1) {
      lines.push(`${taskIds[index]} --> ${taskIds[index + 1]}`);
    }
  }

  for (const taskIds of userTaskIds.values()) {
    if (taskIds.length < 2) continue;
    for (let index = 0; index < taskIds.length - 1; index += 1) {
      lines.push(`${taskIds[index]} -.-> ${taskIds[index + 1]}`);
    }
  }

  const lowerDescriptions = tasks.map((task) => (task.descripcion || "").toLowerCase());
  const enableKeywords = ["aprobar", "definir", "disenar", "document", "plan"];
  const executeKeywords = ["implementar", "programar", "migrar", "lanzar", "ejecut", "desplegar"];

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

const getUserDotColor = (user: string, seed: number) => {
  const idx = hashString(`${seed}-${user}`) % USER_DOT_COLORS.length;
  return USER_DOT_COLORS[idx];
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

const playNotifSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);

    const notes = [
      { freq: 1046.5, start: 0,    dur: 0.18 },
      { freq: 1318.5, start: 0.12, dur: 0.22 },
      { freq: 1568.0, start: 0.22, dur: 0.35 },
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(master);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });
  } catch {
    // AudioContext not available
  }
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
  const [resultKey, setResultKey] = useState(0);
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);

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
  const simulationState = useMemo(
    () => ({ activeNodeId: activeSimulationNodeId, completedNodeIds: completedSimulationNodeIds }),
    [activeSimulationNodeId, completedSimulationNodeIds],
  );
  const userGanttCode = useMemo(() => buildUserGantt(tasks), [tasks]);
  const flowFallbackItems = useMemo(
    () => tasks.map((task) => `${task.descripcion} (${task.responsable || "Sin asignar"})`),
    [tasks],
  );
  const ganttFallbackItems = useMemo(
    () => tasks.map((task) => `${task.responsable || "Sin asignar"} - ${task.descripcion}`),
    [tasks],
  );
  const totalFlowSteps = tasks.length + 2;
  const completedFlowSteps = completedSimulationNodeIds.length;
  const flowProgressPercent = Math.max(
    0,
    Math.min(100, Math.round((completedFlowSteps / Math.max(1, totalFlowSteps)) * 100)),
  );

  const uniqueUsers = useMemo(
    () => new Set(tasks.map((t) => t.responsable?.trim() || "Sin asignar")).size,
    [tasks],
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
    setResultKey((k) => k + 1);
    setVisibleNotifications([]);
  };

  useEffect(() => {
    if (resultKey === 0) return;
    setVisibleNotifications([]);
    const timers: ReturnType<typeof setTimeout>[] = [];

    [0, 1, 2, 3].forEach((i) => {
      const showAt = 400 + i * 520;
      const hideAt = showAt + 5500;

      timers.push(setTimeout(() => {
        setVisibleNotifications((prev) => [...prev, i]);
        if (i === 0) playNotifSound();
      }, showAt));

      timers.push(setTimeout(() => {
        setVisibleNotifications((prev) => prev.filter((n) => n !== i));
      }, hideAt));
    });

    return () => timers.forEach(clearTimeout);
  }, [resultKey]);

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
                <AnimatePresence mode="wait">
                  <motion.p
                    key={resultKey}
                    initial={meetingResult ? { opacity: 0, y: 6 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-sm leading-relaxed text-foreground/90"
                  >
                    {meetingResult?.resumen ||
                      "Aun no hay resultado. Pulsa 'Procesar' en la izquierda para generar resumen y vistas detalladas."}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Action cards */}
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Tasks card */}
                <motion.button
                  key={`tasks-${resultKey}`}
                  type="button"
                  initial={meetingResult ? { opacity: 0, y: 24, scale: 0.95 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.05, type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={meetingResult ? { scale: 1.03, y: -2 } : {}}
                  whileTap={meetingResult ? { scale: 0.97 } : {}}
                  onClick={() => {
                    if (!meetingResult) return;
                    if (!selectedTaskDetail && firstTaskDetail) {
                      setSelectedTaskDetail(firstTaskDetail);
                    }
                    setIsTasksModalOpen(true);
                  }}
                  disabled={!meetingResult}
                  className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                    meetingResult
                      ? "border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 cursor-pointer"
                      : "border-border bg-muted/30 cursor-not-allowed opacity-50"
                  }`}
                >
                  {meetingResult && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    />
                  )}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 shadow-sm">
                      <CheckSquare className="h-4 w-4 text-white" />
                    </div>
                    {tasks.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
                        className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700 border border-sky-200"
                      >
                        {tasks.length}
                      </motion.span>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground">Tasks</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tasks.length} tareas detectadas</p>
                  {meetingResult && (
                    <ChevronRight className="absolute right-3 bottom-3 h-4 w-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>

                {/* Diagrama card */}
                <motion.button
                  key={`flow-${resultKey}`}
                  type="button"
                  initial={meetingResult ? { opacity: 0, y: 24, scale: 0.95 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={meetingResult ? { scale: 1.03, y: -2 } : {}}
                  whileTap={meetingResult ? { scale: 0.97 } : {}}
                  onClick={() => { if (meetingResult) setIsFlowModalOpen(true); }}
                  disabled={!meetingResult}
                  className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                    meetingResult
                      ? "border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100 cursor-pointer"
                      : "border-border bg-muted/30 cursor-not-allowed opacity-50"
                  }`}
                >
                  {meetingResult && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 0.7, delay: 0.35 }}
                    />
                  )}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm">
                      <Network className="h-4 w-4 text-white" />
                    </div>
                    {isFlowSimulationRunning && (
                      <motion.span
                        className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ▶
                      </motion.span>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground">Diagrama</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Flujo accionable</p>
                  {meetingResult && (
                    <ChevronRight className="absolute right-3 bottom-3 h-4 w-4 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>

                {/* Gantt card */}
                <motion.button
                  key={`gantt-${resultKey}`}
                  type="button"
                  initial={meetingResult ? { opacity: 0, y: 24, scale: 0.95 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.25, type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={meetingResult ? { scale: 1.03, y: -2 } : {}}
                  whileTap={meetingResult ? { scale: 0.97 } : {}}
                  onClick={() => { if (meetingResult) setIsGanttModalOpen(true); }}
                  disabled={!meetingResult}
                  className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                    meetingResult
                      ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 cursor-pointer"
                      : "border-border bg-muted/30 cursor-not-allowed opacity-50"
                  }`}
                >
                  {meetingResult && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                    />
                  )}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
                      <CalendarRange className="h-4 w-4 text-white" />
                    </div>
                    {uniqueUsers > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.45 }}
                        className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200"
                      >
                        {uniqueUsers}p
                      </motion.span>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground">Gantt</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Por usuarios y tareas</p>
                  {meetingResult && (
                    <ChevronRight className="absolute right-3 bottom-3 h-4 w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>
              </div>
            </CardContent>
          </Card>

        </section>
      </main>

      {/* ── TASKS MODAL ──────────────────────────────────────────────── */}
      <Dialog open={isTasksModalOpen} onOpenChange={setIsTasksModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-5xl border-0 p-0 shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">Tareas por usuario y tematica</DialogTitle>
          <DialogDescription className="sr-only">Agrupacion automatica por tema con color de usuario aleatorio.</DialogDescription>
          {/* Gradient header */}
          <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Tareas por usuario y tematica</h2>
                <p className="text-sm text-white/75">
                  {tasks.length} tareas · {uniqueUsers} personas · {groupedTasks.length} tematicas
                </p>
              </div>
            </div>
          </div>

          <div className="grid h-[68vh] gap-4 p-5 lg:grid-cols-[1.3fr_0.7fr] overflow-hidden">
            {/* Left: task groups */}
            <div className="space-y-3 overflow-y-auto pr-1">
              {groupedTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <CheckSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No hay tareas para mostrar.</p>
                </div>
              )}
              <AnimatePresence>
                {groupedTasks.map((themeGroup, themeIndex) => {
                  const style = THEME_VISUAL_STYLES[themeIndex % THEME_VISUAL_STYLES.length];
                  const totalTasksInGroup = themeGroup.users.reduce(
                    (sum, u) => sum + u.tasks.length,
                    0,
                  );
                  return (
                    <motion.div
                      key={themeGroup.theme}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: themeIndex * 0.06 }}
                      className={`overflow-hidden rounded-xl border-2 shadow-sm ${style.border} ${style.glow}`}
                    >
                      {/* Theme header */}
                      <div className={`${style.headerBg} px-4 py-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-white/90" />
                          <h3 className="text-sm font-bold text-white">{themeGroup.theme}</h3>
                        </div>
                        <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-bold text-white">
                          {totalTasksInGroup} tarea{totalTasksInGroup !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Theme body */}
                      <div className={`bg-gradient-to-br ${style.gradient} p-4 space-y-4`}>
                        {themeGroup.users.map((entry) => (
                          <div key={`${themeGroup.theme}-${entry.user}`} className="space-y-2">
                            {/* User row */}
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold border ${getUserColorClass(entry.user, userColorSeed)}`}
                              >
                                {entry.user.charAt(0).toUpperCase()}
                              </div>
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getUserColorClass(entry.user, userColorSeed)}`}
                              >
                                {entry.user}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {entry.tasks.length} tarea{entry.tasks.length !== 1 ? "s" : ""}
                              </span>
                            </div>

                            {/* Task list */}
                            <ul className="space-y-1.5 pl-8">
                              {entry.tasks.map((task, taskIndex) => {
                                const isSelected =
                                  selectedTaskDetail?.task.descripcion === task.descripcion &&
                                  selectedTaskDetail?.user === entry.user &&
                                  selectedTaskDetail?.theme === themeGroup.theme;

                                return (
                                  <motion.li
                                    key={`${entry.user}-${task.descripcion}-${taskIndex}`}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: taskIndex * 0.04 }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSelectedTaskDetail({
                                          task,
                                          theme: themeGroup.theme,
                                          user: entry.user,
                                        })
                                      }
                                      className={`group w-full rounded-lg border-l-4 px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                                        isSelected
                                          ? `${style.taskBorder} border-t border-r border-b border-primary/20 bg-white shadow-md`
                                          : `${style.taskBorder} border-t border-r border-b border-border/60 bg-white/70 hover:bg-white hover:shadow-sm`
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        <div
                                          className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${style.dot}`}
                                        />
                                        <span
                                          className={`text-xs leading-relaxed ${
                                            isSelected ? "font-semibold text-foreground" : "text-foreground/80"
                                          }`}
                                        >
                                          {task.descripcion}
                                        </span>
                                      </div>
                                    </button>
                                  </motion.li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right: task detail panel */}
            <aside className="overflow-y-auto rounded-xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
              <AnimatePresence mode="wait">
                {selectedTaskDetail ? (
                  <motion.div
                    key={selectedTaskDetail.task.descripcion}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 space-y-4 flex-1"
                  >
                    {/* Task description card */}
                    <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                          Tarea seleccionada
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {selectedTaskDetail.task.descripcion}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground flex-shrink-0">Responsable</span>
                        <div className="ml-auto flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${getUserDotColor(selectedTaskDetail.user, userColorSeed)}`}
                          />
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getUserColorClass(selectedTaskDetail.user, userColorSeed)}`}
                          >
                            {selectedTaskDetail.user}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground flex-shrink-0">Tematica</span>
                        <span className="ml-auto text-xs font-medium text-foreground text-right">
                          {selectedTaskDetail.theme}
                        </span>
                      </div>
                    </div>

                    {/* Related by owner */}
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <User className="h-3 w-3" />
                        Mismo responsable
                      </p>
                      {relatedBySameOwner.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No hay relacionadas.</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {relatedBySameOwner.map((task, index) => (
                            <motion.li
                              key={`owner-${task.descripcion}-${index}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="rounded-lg border border-border/60 bg-card px-2.5 py-2 text-xs text-foreground/80 hover:bg-muted/40 transition-colors cursor-pointer"
                              onClick={() =>
                                setSelectedTaskDetail({
                                  task,
                                  theme: detectTheme(task.descripcion || ""),
                                  user: task.responsable?.trim() || "Sin asignar",
                                })
                              }
                            >
                              {task.descripcion}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Related by theme */}
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        Misma tematica
                      </p>
                      {relatedBySameTheme.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No hay relacionadas.</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {relatedBySameTheme.map((task, index) => (
                            <motion.li
                              key={`theme-${task.descripcion}-${index}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="rounded-lg border border-border/60 bg-card px-2.5 py-2 text-xs text-foreground/80 hover:bg-muted/40 transition-colors cursor-pointer"
                              onClick={() =>
                                setSelectedTaskDetail({
                                  task,
                                  theme: detectTheme(task.descripcion || ""),
                                  user: task.responsable?.trim() || "Sin asignar",
                                })
                              }
                            >
                              {task.descripcion}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20">
                      <CheckSquare className="h-7 w-7 text-primary/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/70">Selecciona una tarea</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Haz clic en cualquier tarea para ver sus detalles y relaciones.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── DIAGRAM MODAL ────────────────────────────────────────────── */}
      <Dialog open={isFlowModalOpen} onOpenChange={handleFlowModalOpenChange}>
        <DialogContent className="!inset-0 !top-0 !left-0 !h-[100dvh] !w-[100vw] !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-none border-0 p-0 shadow-none sm:!max-w-none">
          <DialogTitle className="sr-only">Diagrama de flujo accionable</DialogTitle>
          <DialogDescription className="sr-only">Vista completa de dependencias y secuencia de acciones.</DialogDescription>
          <div className="flex h-full flex-col">
            {/* Diagram header */}
            <div className="border-b border-border bg-gradient-to-r from-violet-50/70 via-background to-background px-6 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm">
                  <Network className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Diagrama de flujo accionable</h2>
                  <p className="text-xs text-muted-foreground">Vista completa de dependencias y secuencia de acciones</p>
                </div>
              </div>

              {/* Simulation controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Big Play/Stop button */}
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={handleToggleFlowSimulation}
                    disabled={tasks.length === 0}
                    className={`relative flex items-center gap-2.5 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      isFlowSimulationRunning
                        ? "bg-gradient-to-r from-rose-500 to-red-500 shadow-rose-200"
                        : "bg-gradient-to-r from-indigo-500 to-violet-500 shadow-indigo-200"
                    }`}
                    whileHover={tasks.length > 0 ? { scale: 1.04 } : {}}
                    whileTap={tasks.length > 0 ? { scale: 0.96 } : {}}
                  >
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_3s_ease_infinite]" />

                    {/* Pulsing border ring when idle */}
                    {!isFlowSimulationRunning && tasks.length > 0 && (
                      <motion.span
                        className="absolute inset-0 rounded-xl border-2 border-indigo-300"
                        animate={{ scale: [1, 1.12, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}

                    {/* Recording dot when running */}
                    {isFlowSimulationRunning && (
                      <motion.span
                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-white"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                      />
                    )}

                    {isFlowSimulationRunning ? (
                      <>
                        <Square className="h-4 w-4 fill-white flex-shrink-0" />
                        Detener simulacion
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 fill-white flex-shrink-0" />
                        Simular flujo
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Status badge */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFlowSimulationRunning ? "running" : "idle"}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.18 }}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      isFlowSimulationRunning
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    <motion.span
                      className={`h-2 w-2 rounded-full ${isFlowSimulationRunning ? "bg-amber-500" : "bg-emerald-500"}`}
                      animate={isFlowSimulationRunning ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                    {isFlowSimulationRunning ? "En ejecucion" : "En pausa"}
                  </motion.div>
                </AnimatePresence>

                {/* Active task chip */}
                <AnimatePresence>
                  {activeSimulationNodeId && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-800 max-w-[220px]"
                    >
                      <Zap className="h-3 w-3 flex-shrink-0 text-amber-500" />
                      <span className="truncate">
                        {taskLabelByNodeId.get(activeSimulationNodeId) || activeSimulationNodeId}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step timer */}
                {lastStepDurationMs && isFlowSimulationRunning && (
                  <span className="text-xs text-muted-foreground">
                    ~{(lastStepDurationMs / 1000).toFixed(1)}s por paso
                  </span>
                )}

                {/* Progress bar */}
                <div className="ml-auto flex min-w-[200px] items-center gap-2">
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500"
                      animate={{ width: `${flowProgressPercent}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {isFlowSimulationRunning && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.8s_ease_infinite]" />
                    )}
                  </div>
                  <span className="min-w-10 text-right text-xs font-medium text-muted-foreground">
                    {flowProgressPercent}%
                  </span>
                </div>
              </div>

              {/* Simulation legend */}
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {[
                  { label: "Inactivo", colorClass: "bg-slate-300", border: "border-slate-300" },
                  { label: "En cola", colorClass: "bg-blue-400", border: "border-blue-300" },
                  { label: "Activo", colorClass: "bg-amber-400", border: "border-amber-300" },
                  { label: "Completado", colorClass: "bg-emerald-400", border: "border-emerald-300" },
                ].map(({ label, colorClass, border }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`h-2.5 w-2.5 rounded-sm ${colorClass} border ${border}`} />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
                {completedFlowSteps > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {completedFlowSteps} / {totalFlowSteps} pasos
                  </span>
                )}
              </div>
            </div>

            {/* Diagram canvas */}
            <div className="min-h-0 flex-1 p-0">
              <DiagramViewer
                mermaidCode={horizontalFlowCode}
                simulation={simulationState}
                diagramType="flowchart"
                defaultZoom={0.75}
                fallbackItems={flowFallbackItems}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── GANTT MODAL ──────────────────────────────────────────────── */}
      <Dialog open={isGanttModalOpen} onOpenChange={setIsGanttModalOpen}>
        <DialogContent className="!inset-0 !top-0 !left-0 !h-[100dvh] !w-[100vw] !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-none border-0 p-0 shadow-none sm:!max-w-none">
          <DialogTitle className="sr-only">Diagrama Gantt por usuarios y tareas</DialogTitle>
          <DialogDescription className="sr-only">Plan visual de ejecucion distribuido por responsables.</DialogDescription>
          <div className="flex h-full flex-col">
            {/* Gantt header */}
            <div className="border-b border-border bg-gradient-to-r from-emerald-50/70 via-background to-background px-6 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
                  <CalendarRange className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Diagrama Gantt por usuarios y tareas</h2>
                  <p className="text-xs text-muted-foreground">Plan visual de ejecucion distribuido por responsables</p>
                </div>
              </div>

              {/* Stats + legend row */}
              <div className="flex flex-wrap items-center gap-3">
                {tasks.length > 0 && (
                  <>
                    <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                      <CheckSquare className="h-3 w-3" />
                      {tasks.length} tareas
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
                      <User className="h-3 w-3" />
                      {uniqueUsers} persona{uniqueUsers !== 1 ? "s" : ""}
                    </div>
                  </>
                )}

                <div className="ml-auto flex flex-wrap items-center gap-4">
                  {[
                    { label: "Activa", colorClass: "bg-indigo-500" },
                    { label: "Critica", colorClass: "bg-rose-500" },
                    { label: "Completada", colorClass: "bg-slate-400" },
                    { label: "Pendiente", colorClass: "bg-sky-400" },
                  ].map(({ label, colorClass }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={`h-2.5 w-4 rounded-sm ${colorClass}`} />
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gantt canvas */}
            <div className="min-h-0 flex-1 p-0">
              <DiagramViewer
                mermaidCode={userGanttCode}
                diagramType="gantt"
                defaultZoom={1}
                fallbackItems={ganttFallbackItems}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* ── Windows/Chrome-style notification toasts ─────────────────── */}
      {(() => {
        const NOTIFS = [
          {
            icon: CheckSquare,
            title: `${tasks.length} tarea${tasks.length !== 1 ? "s" : ""} identificada${tasks.length !== 1 ? "s" : ""}`,
            body: tasks.map((t) => t.responsable).filter(Boolean).join(" · ") || "Asignadas automaticamente",
            accent: "#0ea5e9",
            iconBg: "linear-gradient(135deg,#0ea5e9,#6366f1)",
          },
          {
            icon: Network,
            title: "Diagrama de flujo generado",
            body: "Dependencias entre tareas detectadas",
            accent: "#8b5cf6",
            iconBg: "linear-gradient(135deg,#8b5cf6,#ec4899)",
          },
          {
            icon: CalendarRange,
            title: "Cronograma Gantt listo",
            body: `${uniqueUsers} responsable${uniqueUsers !== 1 ? "s" : ""} planificado${uniqueUsers !== 1 ? "s" : ""}`,
            accent: "#10b981",
            iconBg: "linear-gradient(135deg,#10b981,#14b8a6)",
          },
          {
            icon: Sparkles,
            title: "Resumen ejecutivo disponible",
            body: "Analisis completo de la reunion",
            accent: "#f59e0b",
            iconBg: "linear-gradient(135deg,#f59e0b,#f97316)",
          },
        ];

        return (
          <div className="fixed bottom-5 right-5 z-[9999] flex flex-col-reverse gap-2.5" style={{ width: 360 }}>
            <AnimatePresence>
              {visibleNotifications.map((i) => {
                const n = NOTIFS[i];
                if (!n) return null;
                const Icon = n.icon;
                return (
                  <motion.div
                    key={`notif-${resultKey}-${i}`}
                    initial={{ opacity: 0, x: 380, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 380, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className="relative overflow-hidden rounded-xl border border-black/[0.07] bg-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-md"
                  >
                    {/* Top bar: app identity */}
                    <div className="flex items-center gap-2 border-b border-black/[0.05] px-3.5 py-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary">
                        <Brain className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-[11px] font-semibold text-foreground/70 tracking-wide">MeetMind</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">ahora</span>
                      <button
                        type="button"
                        onClick={() => setVisibleNotifications((prev) => prev.filter((n) => n !== i))}
                        className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground/60 hover:bg-black/10 hover:text-foreground transition-colors text-[11px] leading-none"
                        aria-label="Cerrar"
                      >
                        ×
                      </button>
                    </div>

                    {/* Body */}
                    <div className="flex items-start gap-3 px-3.5 py-3">
                      <div
                        className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
                        style={{ background: n.iconBg }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-[13px] font-semibold text-foreground leading-tight">{n.title}</p>
                        <p className="mt-0.5 text-[12px] text-muted-foreground leading-snug">{n.body}</p>
                      </div>
                    </div>

                    {/* Progress bar (depletes over 5.5 s) */}
                    <div className="h-0.5 w-full bg-black/[0.05]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: n.accent }}
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5.5, ease: "linear" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        );
      })()}
    </div>
  );
}
