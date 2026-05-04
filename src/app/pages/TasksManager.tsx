import { Header } from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Checkbox } from "../components/ui/checkbox";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Calendar,
  FolderKanban,
  Clock,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
  MoreVertical,
  ArrowRight,
  Copy,
  Trash2,
  UserPlus,
  GitBranch,
  Timer,
  Split,
  HelpCircle,
  FileText,
  Tag,
  LayoutGrid,
  Network,
  Users,
  List,
  ArrowDown,
  Sparkles,
  Loader2
} from "lucide-react";
import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { TaskCard } from "../components/TaskCard";
import { DEFAULT_ASSIGNEE_AVATAR, loadTasks, saveTasks, TaskRecord } from "../lib/taskStore";
import { postApiJson } from "../lib/apiClient";

type ViewMode = "standard" | "priority" | "dependencies" | "team";

export default function TasksManager() {
  const [tasks, setTasks] = useState<TaskRecord[]>(() => loadTasks());
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [filterUnassigned, setFilterUnassigned] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [prioritizeMsg, setPrioritizeMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all-projects");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [priorityFilter, setPriorityFilter] = useState("all-priority");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("Rediseño de Dashboard");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [newTaskStatus, setNewTaskStatus] = useState<"pending" | "in-progress" | "completed" | "blocked">("pending");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const isBlocked = newStatus === "blocked";
        return {
          ...task,
          status: newStatus as TaskRecord["status"],
          blocked: isBlocked,
          blockedDays: isBlocked ? task.blockedDays ?? 1 : undefined,
        };
      }),
    );
  };

  const handleAIPrioritize = async () => {
    setIsPrioritizing(true);
    setPrioritizeMsg(null);
    try {
      const taskList = tasks
        .map((t) => `- ${t.title} [${t.priority}] [${t.status}]${t.blocked ? " [BLOQUEADA]" : ""}`)
        .join("\n");
      const json = await postApiJson<any>("/api/summary", {
        transcript: `Lista de tareas del equipo:\n${taskList}`,
        format: "resumen",
        detailLevel: "Corto",
        focusAreas: ["Priorización", "Bloqueos", "Dependencias"],
      });
      if (json.success && json.data?.context) {
        setPrioritizeMsg(json.data.context);
      } else {
        setPrioritizeMsg("IA: Revisa las tareas bloqueadas primero, luego las de alta prioridad sin dependencias.");
      }
    } catch (err: any) {
      setPrioritizeMsg(err?.message || "Error conectando con la IA.");
    } finally {
      setIsPrioritizing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-0";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-0";
      case "pending":
        return "bg-gray-100 text-gray-800 border-0";
      case "blocked":
        return "bg-red-100 text-red-800 border-0";
      default:
        return "bg-gray-100 text-gray-800 border-0";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completada";
      case "in-progress":
        return "En progreso";
      case "pending":
        return "Pendiente";
      case "blocked":
        return "Bloqueada";
      default:
        return status;
    }
  };

  const getSmartPriorityColor = (smartPriority?: string) => {
    switch (smartPriority) {
      case "Hoy":
        return "bg-red-50 text-red-700 border-red-200";
      case "Semana":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Retrasada":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "";
    }
  };

  const makeTaskId = () => `t${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "completed" ? "pending" : "completed", blocked: false }
          : task,
      ),
    );
  };

  const getNextStatus = (status: TaskRecord["status"]): TaskRecord["status"] => {
    switch (status) {
      case "pending":
        return "in-progress";
      case "in-progress":
        return "completed";
      case "completed":
        return "pending";
      case "blocked":
      default:
        return "pending";
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleDuplicateTask = (taskId: string) => {
    setTasks((prev) => {
      const source = prev.find((task) => task.id === taskId);
      if (!source) {
        return prev;
      }
      const clone: TaskRecord = {
        ...source,
        id: makeTaskId(),
        title: `${source.title} (copia)`,
        dueDate: new Date(source.dueDate),
        dependsOn: [...(source.dependsOn || [])],
        tags: source.tags ? [...source.tags] : [],
        subtasks: source.subtasks ? source.subtasks.map((s) => ({ ...s, id: `${s.id}-copy` })) : [],
        assignee: source.assignee ? { ...source.assignee } : null,
      };
      return [clone, ...prev];
    });
  };

  const handleToggleBlocked = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task;
        }
        const blocked = !task.blocked;
        return {
          ...task,
          blocked,
          blockedDays: blocked ? task.blockedDays ?? 1 : undefined,
          status: blocked ? "blocked" : task.status === "blocked" ? "pending" : task.status,
        };
      }),
    );
  };

  const handleCreateTask = () => {
    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    const dueDate = newTaskDueDate ? new Date(`${newTaskDueDate}T09:00:00`) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const assigneeName = newTaskAssignee.trim();
    const task: TaskRecord = {
      id: makeTaskId(),
      title,
      assignee: assigneeName ? { name: assigneeName, avatar: DEFAULT_ASSIGNEE_AVATAR } : null,
      dueDate,
      priority: newTaskPriority,
      status: newTaskStatus,
      project: newTaskProject,
      blocked: newTaskStatus === "blocked",
      dependsOn: [],
      tags: [],
      subtasks: [],
      smartPriority: newTaskPriority === "high" ? "Hoy" : "Semana",
      timeEstimate: "2h",
    };

    setTasks((prev) => [task, ...prev]);
    setIsCreateDialogOpen(false);
    setNewTaskTitle("");
    setNewTaskDueDate("");
    setNewTaskAssignee("");
    setNewTaskPriority("medium");
    setNewTaskStatus("pending");
    setNewTaskProject("Rediseño de Dashboard");
  };

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (filterUnassigned && task.assignee) {
        return false;
      }

      if (projectFilter !== "all-projects" && task.project !== projectFilter) {
        return false;
      }

      if (statusFilter !== "all-status" && task.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== "all-priority" && task.priority !== priorityFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        task.title,
        task.project,
        task.assignee?.name || "",
        ...(task.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [tasks, filterUnassigned, projectFilter, statusFilter, priorityFilter, searchQuery]);

  const unassignedCount = tasks.filter((t) => !t.assignee).length;

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    blocked: tasks.filter(t => t.blocked).length,
    unassigned: unassignedCount,
  };

  const templates = [
    { id: 1, name: "Tarea de desarrollo", description: "Estructura para tareas de código" },
    { id: 2, name: "Tarea de diseño", description: "Estructura para tareas de UI/UX" },
    { id: 3, name: "Revisión de código", description: "Checklist para code review" },
    { id: 4, name: "Bug fix", description: "Template para resolver bugs" },
  ];

  return (
    <div className="relative z-[1] min-h-screen app-background">
      <Header />

      <main className="mx-auto max-w-[1600px] px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestor de Tareas</h1>
              <p className="text-gray-600">Administra y organiza todas tus tareas en un solo lugar</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowTemplates(true)}
              >
                <FileText className="w-4 h-4" />
                Plantillas
              </Button>
              
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Plantillas de tareas</DialogTitle>
                    <DialogDescription>
                      Selecciona una plantilla para crear una nueva tarea rápidamente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {templates.map((template) => (
                      <Card key={template.id} className="border-gray-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                              <p className="text-xs text-gray-600">{template.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleAIPrioritize}
                disabled={isPrioritizing}
                variant="outline"
                className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                {isPrioritizing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Analizando...</>
                ) : (
                  <><Sparkles className="w-4 h-4" />IA: Priorizar</>
                )}
              </Button>
              <Button
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Nueva tarea
              </Button>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Crear nueva tarea</DialogTitle>
                <DialogDescription>
                  Define los datos mínimos para que la tarea quede visible en todo MeetMind.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Título</label>
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Ej: Preparar demo de sprint"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Proyecto</label>
                    <Select value={newTaskProject} onValueChange={setNewTaskProject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rediseño de Dashboard">Rediseño de Dashboard</SelectItem>
                        <SelectItem value="App Móvil v2.0">App Móvil v2.0</SelectItem>
                        <SelectItem value="Integración API Terceros">Integración API Terceros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Vence el</label>
                    <Input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Prioridad</label>
                    <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value as "high" | "medium" | "low")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <Select value={newTaskStatus} onValueChange={(value) => setNewTaskStatus(value as "pending" | "in-progress" | "completed" | "blocked")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="in-progress">En progreso</SelectItem>
                        <SelectItem value="blocked">Bloqueada</SelectItem>
                        <SelectItem value="completed">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Responsable</label>
                    <Input
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleCreateTask}
                    disabled={!newTaskTitle.trim()}
                  >
                    Crear tarea
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* AI Prioritize Banner */}
          {prioritizeMsg && (
            <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-indigo-900 mb-1">Recomendación de IA</p>
                <p className="text-sm text-indigo-800">{prioritizeMsg}</p>
              </div>
              <button onClick={() => setPrioritizeMsg(null)} className="text-indigo-400 hover:text-indigo-600 text-lg leading-none">×</button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                    <p className="text-xs text-gray-600">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                    <p className="text-xs text-gray-600">En progreso</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                    <p className="text-xs text-gray-600">Completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <LockKeyhole className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.blocked}</p>
                    <p className="text-xs text-gray-600">Bloqueadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`border-gray-200 cursor-pointer transition-all ${
                filterUnassigned ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:border-purple-300'
              }`}
              onClick={() => setFilterUnassigned(!filterUnassigned)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.unassigned}</p>
                    <p className="text-xs text-gray-600">Sin dueño</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-gray-200 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar tareas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-projects">Todos los proyectos</SelectItem>
                    <SelectItem value="Rediseño de Dashboard">Rediseño de Dashboard</SelectItem>
                    <SelectItem value="App Móvil v2.0">App Móvil v2.0</SelectItem>
                    <SelectItem value="Integración API Terceros">Integración API Terceros</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="blocked">Bloqueada</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priority">Todas las prioridades</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setSearchQuery("");
                    setProjectFilter("all-projects");
                    setStatusFilter("all-status");
                    setPriorityFilter("all-priority");
                    setFilterUnassigned(false);
                  }}
                >
                  <Filter className="w-4 h-4" />
                  Limpiar filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-gray-500 mb-4">
            Mostrando {filteredTasks.length} de {tasks.length} tareas
          </p>

          {/* View Selector */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("standard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === "standard"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">Estándar</span>
              </button>
              <button
                onClick={() => setViewMode("priority")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === "priority"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm font-medium">Por Prioridad</span>
              </button>
              <button
                onClick={() => setViewMode("dependencies")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === "dependencies"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Network className="w-4 h-4" />
                <span className="text-sm font-medium">Dependencias</span>
              </button>
              <button
                onClick={() => setViewMode("team")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === "team"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Por Equipo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Render different views based on viewMode */}
        {viewMode === "standard" && (
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={task.status === "completed"}
                        onChange={() => handleToggleComplete(task.id)}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                            
                            {/* Dependencias */}
                            {task.dependsOn && task.dependsOn.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                                <GitBranch className="w-3 h-3" />
                                <span>Depende de: {task.dependsOn.join(", ")}</span>
                              </div>
                            )}

                            {/* Hint de escalado para tareas bloqueadas/retrasadas */}
                            {task.blocked && task.blockedDays && task.blockedDays >= 3 && (
                              <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg mt-2 text-xs">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                <span className="text-orange-800">
                                  Bloqueada {task.blockedDays} días. Considera:
                                </span>
                                <div className="flex items-center gap-1 ml-auto">
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    <UserPlus className="w-3 h-3 mr-1" />
                                    Reasignar
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    <Split className="w-3 h-3 mr-1" />
                                    Dividir
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    <HelpCircle className="w-3 h-3 mr-1" />
                                    Pedir ayuda
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Subtasks indicator */}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtareas
                                  <ArrowRight className={`w-3 h-3 ml-1 transition-transform ${selectedTask === task.id ? 'rotate-90' : ''}`} />
                                </Button>
                              </div>
                            )}

                            {/* Checklist expandido */}
                            {selectedTask === task.id && task.subtasks && task.subtasks.length > 0 && (
                              <div className="mt-3 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                                {task.subtasks.map((subtask) => (
                                  <div key={subtask.id} className="flex items-center gap-2">
                                    <Checkbox checked={subtask.completed} />
                                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                      {subtask.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, getNextStatus(task.status))}>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Cambiar estado (rápido)
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Cambiar prioridad
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Cambiar responsable
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="w-4 h-4 mr-2" />
                                Cambiar fecha
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FolderKanban className="w-4 h-4 mr-2" />
                                Cambiar proyecto
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleBlocked(task.id)}>
                                <LockKeyhole className="w-4 h-4 mr-2" />
                                {task.blocked ? "Desbloquear tarea" : "Marcar como bloqueada"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <GitBranch className="w-4 h-4 mr-2" />
                                Gestionar dependencias
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDuplicateTask(task.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-3 text-sm flex-wrap">
                          {/* Assignee */}
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                <AvatarFallback>{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className="text-gray-600">{task.assignee.name}</span>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1">
                              <UserPlus className="w-3 h-3" />
                              Asignar
                            </Button>
                          )}

                          {/* Due Date */}
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {task.dueDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </div>

                          {/* Time Estimate */}
                          {task.timeEstimate && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Timer className="w-4 h-4" />
                              {task.timeEstimate}
                            </div>
                          )}

                          {/* Project - editable link */}
                          <Link to="/projects" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
                            <FolderKanban className="w-4 h-4" />
                            {task.project}
                          </Link>

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              {task.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 ml-auto">
                            {/* Smart Priority */}
                            {task.smartPriority && (
                              <Badge variant="secondary" className={getSmartPriorityColor(task.smartPriority)}>
                                {task.smartPriority}
                              </Badge>
                            )}

                            {/* Blocked Status */}
                            {task.blocked && (
                              <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                                <LockKeyhole className="w-3 h-3 mr-1" />
                                Bloqueada
                              </Badge>
                            )}

                            {/* Priority */}
                            <Badge className={getPriorityColor(task.priority)}>
                              {getPriorityLabel(task.priority)}
                            </Badge>

                            {/* Status */}
                            <Badge className={getStatusColor(task.status)} variant="secondary">
                              {getStatusLabel(task.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Priority View - Zonas por prioridad */}
        {viewMode === "priority" && (
          <div className="grid grid-cols-3 gap-6">
            {/* High Priority Zone */}
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-t-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-900">Prioridad Alta</h3>
                    <p className="text-sm text-red-700">
                      {filteredTasks.filter(t => t.priority === "high").length} tareas
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {filteredTasks
                  .filter(t => t.priority === "high")
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                {filteredTasks.filter(t => t.priority === "high").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay tareas de alta prioridad</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medium Priority Zone */}
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-t-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-900">Prioridad Media</h3>
                    <p className="text-sm text-yellow-700">
                      {filteredTasks.filter(t => t.priority === "medium").length} tareas
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {filteredTasks
                  .filter(t => t.priority === "medium")
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                {filteredTasks.filter(t => t.priority === "medium").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay tareas de prioridad media</p>
                  </div>
                )}
              </div>
            </div>

            {/* Low Priority Zone */}
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-t-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-900">Prioridad Baja</h3>
                    <p className="text-sm text-green-700">
                      {filteredTasks.filter(t => t.priority === "low").length} tareas
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {filteredTasks
                  .filter(t => t.priority === "low")
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                {filteredTasks.filter(t => t.priority === "low").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay tareas de baja prioridad</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dependencies View - Vista de dependencias */}
        {viewMode === "dependencies" && (
          <div className="space-y-6">
            {/* Tareas bloqueantes (que bloquean a otras) */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <LockKeyhole className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tareas Bloqueadas</h3>
                  <p className="text-sm text-gray-600">
                    Estas tareas están esperando que otras se completen
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredTasks
                  .filter(t => t.blocked || (t.dependsOn && t.dependsOn.length > 0))
                  .map(task => (
                    <div key={task.id} className="relative">
                      <TaskCard task={task} />
                      {task.dependsOn && task.dependsOn.length > 0 && (
                        <div className="mt-2 ml-4 flex items-center gap-2">
                          <ArrowDown className="w-4 h-4 text-gray-400" />
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <GitBranch className="w-3 h-3" />
                            <span>Depende de: {task.dependsOn.join(", ")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                {filteredTasks.filter(t => t.blocked || (t.dependsOn && t.dependsOn.length > 0)).length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">¡Excelente!</p>
                    <p className="text-sm">No hay tareas bloqueadas</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tareas críticas - que bloquean a otras */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Network className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tareas Críticas</h3>
                  <p className="text-sm text-gray-600">
                    Otras tareas dependen de estas - priorízalas
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredTasks
                  .filter(task => 
                    filteredTasks.some(t => 
                      t.dependsOn && t.dependsOn.includes(task.id)
                    )
                  )
                  .map(task => {
                    const blockedTasks = filteredTasks.filter(t => 
                      t.dependsOn && t.dependsOn.includes(task.id)
                    );
                    return (
                      <div key={task.id} className="relative">
                        <TaskCard task={task} />
                        <div className="mt-2 ml-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-xs text-red-800">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-medium">
                              Bloquea {blockedTasks.length} {blockedTasks.length === 1 ? "tarea" : "tareas"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {filteredTasks.filter(task => 
                  filteredTasks.some(t => t.dependsOn && t.dependsOn.includes(task.id))
                ).length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    <Network className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No hay tareas críticas que bloqueen a otras</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tareas independientes */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tareas Independientes</h3>
                  <p className="text-sm text-gray-600">
                    Pueden iniciarse en cualquier momento
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {filteredTasks
                  .filter(task => 
                    !task.blocked && 
                    (!task.dependsOn || task.dependsOn.length === 0) &&
                    !filteredTasks.some(t => t.dependsOn && t.dependsOn.includes(task.id))
                  )
                  .map(task => (
                    <TaskCard key={task.id} task={task} compact />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Team View - Vista por equipo */}
        {viewMode === "team" && (
          <div className="space-y-6">
            {/* Agrupar tareas por assignee */}
            {Array.from(new Set(filteredTasks.filter(t => t.assignee).map(t => t.assignee!.name))).map(assigneeName => {
              const assigneeTasks = filteredTasks.filter(t => t.assignee?.name === assigneeName);
              const assignee = assigneeTasks[0].assignee!;
              const totalTime = assigneeTasks.reduce((sum, t) => {
                if (!t.timeEstimate) return sum;
                const hours = parseInt(t.timeEstimate);
                return sum + (isNaN(hours) ? 0 : hours);
              }, 0);

              return (
                <div key={assigneeName}>
                  <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 ring-2 ring-indigo-100">
                        <AvatarImage src={assignee.avatar} alt={assignee.name} />
                        <AvatarFallback className="text-lg">
                          {assignee.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{assignee.name}</h3>
                        <p className="text-sm text-gray-600">
                          {assigneeTasks.length} {assigneeTasks.length === 1 ? "tarea" : "tareas"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Carga de trabajo</p>
                        <p className="text-lg font-bold text-gray-900">{totalTime}h</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-xs text-gray-600">
                            {assigneeTasks.filter(t => t.priority === "high").length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-xs text-gray-600">
                            {assigneeTasks.filter(t => t.priority === "medium").length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-gray-600">
                            {assigneeTasks.filter(t => t.priority === "low").length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {assigneeTasks.map(task => (
                      <TaskCard key={task.id} task={task} compact />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Tareas sin asignar */}
            {filteredTasks.filter(t => !t.assignee).length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-900">Sin asignar</h3>
                      <p className="text-sm text-purple-700">
                        {filteredTasks.filter(t => !t.assignee).length} tareas necesitan un responsable
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {filteredTasks
                    .filter(t => !t.assignee)
                    .map(task => (
                      <TaskCard key={task.id} task={task} compact />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}




