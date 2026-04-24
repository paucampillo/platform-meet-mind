export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "in-progress" | "completed" | "blocked";

export interface TaskAssignee {
  name: string;
  avatar: string;
}

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskRecord {
  id: string;
  title: string;
  assignee: TaskAssignee | null;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  project: string;
  blocked: boolean;
  dependsOn: string[];
  blockedDays?: number;
  isOverdue?: boolean;
  smartPriority?: string;
  timeEstimate?: string;
  tags?: string[];
  subtasks?: TaskSubtask[];
}

interface SerializedTaskRecord extends Omit<TaskRecord, "dueDate"> {
  dueDate: string;
}

const STORAGE_KEY = "meetmind.tasks.v1";

export const DEFAULT_ASSIGNEE_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";

const baseTasks: TaskRecord[] = [
  {
    id: "t1",
    title: "Finalizar diseño de la nueva landing page",
    assignee: {
      name: "María García",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    dueDate: new Date(2026, 1, 28),
    priority: "high",
    status: "in-progress",
    project: "Rediseño de Dashboard",
    blocked: false,
    dependsOn: [],
    isOverdue: false,
    smartPriority: "Hoy",
    timeEstimate: "4h",
    tags: ["UI", "Design"],
    subtasks: [
      { id: "s1", title: "Diseñar hero section", completed: true },
      { id: "s2", title: "Crear componentes reutilizables", completed: true },
      { id: "s3", title: "Implementar responsive", completed: false },
    ],
  },
  {
    id: "t2",
    title: "Revisar propuesta de arquitectura del backend",
    assignee: {
      name: "Carlos Ruiz",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    dueDate: new Date(2026, 1, 27),
    priority: "high",
    status: "blocked",
    project: "App Móvil v2.0",
    blocked: true,
    dependsOn: ["t6"],
    blockedDays: 5,
    isOverdue: true,
    smartPriority: "Retrasada",
    timeEstimate: "6h",
    tags: ["Backend", "Architecture"],
    subtasks: [],
  },
  {
    id: "t3",
    title: "Documentar API endpoints versión 2.0",
    assignee: {
      name: "Laura Martínez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    dueDate: new Date(2026, 2, 2),
    priority: "medium",
    status: "pending",
    project: "Integración API Terceros",
    blocked: false,
    smartPriority: "Semana",
    timeEstimate: "8h",
    tags: ["Documentation"],
    dependsOn: ["t7"],
    subtasks: [],
  },
  {
    id: "t4",
    title: "Configurar pipeline de CI/CD en producción",
    assignee: {
      name: "David López",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    dueDate: new Date(2026, 2, 5),
    priority: "medium",
    status: "in-progress",
    project: "Rediseño de Dashboard",
    blocked: false,
    smartPriority: "Semana",
    timeEstimate: "5h",
    tags: ["DevOps"],
    dependsOn: [],
    subtasks: [],
  },
  {
    id: "t5",
    title: "Actualizar dependencias del proyecto",
    assignee: {
      name: "Ana Torres",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    dueDate: new Date(2026, 2, 8),
    priority: "low",
    status: "completed",
    project: "App Móvil v2.0",
    blocked: false,
    timeEstimate: "2h",
    tags: ["Maintenance"],
    dependsOn: [],
    subtasks: [],
  },
  {
    id: "t6",
    title: "Diseñar sistema de componentes",
    assignee: {
      name: "Laura Martínez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    dueDate: new Date(2026, 1, 25),
    priority: "high",
    status: "completed",
    project: "Rediseño de Dashboard",
    blocked: false,
    timeEstimate: "10h",
    tags: ["Design System"],
    dependsOn: [],
    subtasks: [],
  },
  {
    id: "t7",
    title: "Implementar autenticación OAuth",
    assignee: {
      name: "Carlos Ruiz",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    dueDate: new Date(2026, 2, 10),
    priority: "high",
    status: "pending",
    project: "App Móvil v2.0",
    blocked: false,
    smartPriority: "Semana",
    timeEstimate: "12h",
    tags: ["Security", "Backend"],
    dependsOn: [],
    subtasks: [],
  },
  {
    id: "t8",
    title: "Optimizar queries de base de datos",
    assignee: {
      name: "David López",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    dueDate: new Date(2026, 2, 12),
    priority: "medium",
    status: "pending",
    project: "Integración API Terceros",
    blocked: false,
    smartPriority: "Semana",
    timeEstimate: "6h",
    tags: ["Performance"],
    dependsOn: [],
    subtasks: [],
  },
  {
    id: "t9",
    title: "Crear test de integración para API",
    assignee: null,
    dueDate: new Date(2026, 2, 14),
    priority: "high",
    status: "pending",
    project: "Integración API Terceros",
    blocked: false,
    smartPriority: "Semana",
    timeEstimate: "8h",
    tags: ["Testing"],
    dependsOn: [],
    subtasks: [],
  },
  {
    id: "t10",
    title: "Refactorizar módulo de autenticación",
    assignee: null,
    dueDate: new Date(2026, 2, 16),
    priority: "medium",
    status: "pending",
    project: "App Móvil v2.0",
    blocked: false,
    smartPriority: "Semana",
    timeEstimate: "10h",
    tags: ["Refactoring"],
    dependsOn: [],
    subtasks: [],
  },
];

const serializeTasks = (tasks: TaskRecord[]): SerializedTaskRecord[] =>
  tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate.toISOString(),
  }));

const hydrateTask = (task: SerializedTaskRecord): TaskRecord => ({
  ...task,
  dueDate: new Date(task.dueDate),
  dependsOn: Array.isArray(task.dependsOn) ? task.dependsOn : [],
  tags: Array.isArray(task.tags) ? task.tags : [],
  subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
});

export const getDefaultTasks = (): TaskRecord[] =>
  baseTasks.map((task) => ({
    ...task,
    dueDate: new Date(task.dueDate),
    dependsOn: [...task.dependsOn],
    tags: task.tags ? [...task.tags] : [],
    subtasks: task.subtasks ? [...task.subtasks] : [],
    assignee: task.assignee ? { ...task.assignee } : null,
  }));

export const loadTasks = (): TaskRecord[] => {
  if (typeof window === "undefined") {
    return getDefaultTasks();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return getDefaultTasks();
  }

  try {
    const parsed = JSON.parse(raw) as SerializedTaskRecord[];
    if (!Array.isArray(parsed)) {
      return getDefaultTasks();
    }
    return parsed.map(hydrateTask);
  } catch {
    return getDefaultTasks();
  }
};

export const saveTasks = (tasks: TaskRecord[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeTasks(tasks)));
};
