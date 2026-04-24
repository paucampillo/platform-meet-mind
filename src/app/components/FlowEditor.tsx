import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Play,
  Save,
  Sparkles,
  ZoomIn,
  ZoomOut,
  AlignHorizontalSpaceAround,
  Check,
  AlertCircle,
  Loader2,
  Video,
  CalendarPlus,
  Mail,
  CheckCircle,
  Clock,
  Filter,
  Bell,
  Users,
  FileText,
  History,
  Trash2,
  ChevronRight,
  LayoutGrid,
  Tag,
} from "lucide-react";

interface FlowNode {
  id: string;
  type: "trigger" | "action" | "logic" | "integration";
  category: string;
  label: string;
  icon: any;
  x: number;
  y: number;
  status?: "idle" | "running" | "success" | "error";
  config?: any;
  owner?: string;
  lastRun?: string;
  hasOutput?: boolean;
  hasCondition?: boolean;
  hasCredentials?: boolean;
  validationError?: string;
}

interface Connection {
  from: string;
  to: string;
  valid: boolean;
  branch?: "yes" | "no";
}

export function FlowEditor() {
  const [mode, setMode] = useState<"design" | "execution">(
    "design",
  );
  const [flowStatus, setFlowStatus] = useState<
    "draft" | "active" | "paused"
  >("active");
  const [selectedNode, setSelectedNode] =
    useState<FlowNode | null>(null);
  const [draggingNode, setDraggingNode] = useState<
    string | null
  >(null);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [showPlanningPanel, setShowPlanningPanel] =
    useState(false);
  const [selectedRun, setSelectedRun] = useState<number | null>(
    null,
  );
  const [isAutoOrganizing, setIsAutoOrganizing] =
    useState(false);

  const [nodes, setNodes] = useState<FlowNode[]>([
    {
      id: "node-1",
      type: "trigger",
      category: "Trigger",
      label: "Reunión finalizada",
      icon: Video,
      x: 100,
      y: 200,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-2",
      type: "action",
      category: "Action",
      label: "Extraer decisiones y action items (IA)",
      icon: Sparkles,
      x: 380,
      y: 200,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-3",
      type: "logic",
      category: "Logic",
      label: "Clasificar por fase",
      icon: Filter,
      x: 720,
      y: 200,
      status: "idle",
      owner: "María G.",
      lastRun: "Hace 2h",
      hasOutput: true,
      hasCondition: true,
    },
    {
      id: "node-4",
      type: "action",
      category: "Action",
      label: "Crear tareas en proyecto",
      icon: CheckCircle,
      x: 1060,
      y: 200,
      status: "idle",
      config: { count: 12 },
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-5",
      type: "logic",
      category: "Logic",
      label: "¿Tiene deadline?",
      icon: Clock,
      x: 100,
      y: 400,
      status: "idle",
      owner: "Carlos R.",
      lastRun: "Hace 2h",
      hasOutput: true,
      hasCondition: true,
    },
    {
      id: "node-6",
      type: "action",
      category: "Action",
      label: "Añadir al calendario (Auto-generado)",
      icon: CalendarPlus,
      x: 400,
      y: 340,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-7",
      type: "integration",
      category: "Integration",
      label: "Notificar por email (equipo)",
      icon: Mail,
      x: 720,
      y: 340,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
      hasCredentials: true,
    },
    {
      id: "node-8",
      type: "action",
      category: "Action",
      label: "Sugerir deadline según fase",
      icon: Sparkles,
      x: 400,
      y: 480,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-9",
      type: "action",
      category: "Action",
      label: "Añadir al calendario (borrador)",
      icon: CalendarPlus,
      x: 720,
      y: 480,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-10",
      type: "integration",
      category: "Integration",
      label: "Email pidiendo confirmación",
      icon: Mail,
      x: 1040,
      y: 480,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: false,
      validationError: "Falta conexión",
      hasCredentials: true,
    },
    {
      id: "node-11",
      type: "logic",
      category: "Logic",
      label: "¿Prioridad Alta?",
      icon: AlertCircle,
      x: 1040,
      y: 340,
      status: "idle",
      owner: "Laura M.",
      lastRun: "Hace 2h",
      hasOutput: true,
      hasCondition: true,
    },
    {
      id: "node-12",
      type: "action",
      category: "Action",
      label: "Crear recordatorio 48h antes",
      icon: Bell,
      x: 1360,
      y: 280,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-13",
      type: "action",
      category: "Action",
      label: "Marcar como bloqueante",
      icon: AlertCircle,
      x: 1360,
      y: 400,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-14",
      type: "action",
      category: "Action",
      label: "Actualizar dashboard del proyecto",
      icon: LayoutGrid,
      x: 1680,
      y: 300,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-15",
      type: "action",
      category: "Action",
      label: "Generar resumen ejecutivo",
      icon: FileText,
      x: 2000,
      y: 300,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
    },
    {
      id: "node-16",
      type: "integration",
      category: "Integration",
      label: "Enviar update al equipo",
      icon: Users,
      x: 2320,
      y: 300,
      status: "idle",
      owner: "Sistema",
      lastRun: "Hace 2h",
      hasOutput: true,
      hasCredentials: true,
    },
  ]);

  const [connections] = useState<Connection[]>([
    { from: "node-1", to: "node-2", valid: true },
    { from: "node-2", to: "node-3", valid: true },
    { from: "node-3", to: "node-4", valid: true },
    { from: "node-4", to: "node-5", valid: true },
    {
      from: "node-5",
      to: "node-6",
      valid: true,
      branch: "yes",
    },
    { from: "node-6", to: "node-7", valid: true },
    { from: "node-5", to: "node-8", valid: true, branch: "no" },
    { from: "node-8", to: "node-9", valid: true },
    { from: "node-9", to: "node-10", valid: true },
    { from: "node-7", to: "node-11", valid: true },
    {
      from: "node-11",
      to: "node-12",
      valid: true,
      branch: "yes",
    },
    {
      from: "node-11",
      to: "node-13",
      valid: true,
      branch: "no",
    },
    { from: "node-12", to: "node-14", valid: true },
    { from: "node-13", to: "node-14", valid: true },
    { from: "node-14", to: "node-15", valid: true },
    { from: "node-15", to: "node-16", valid: true },
  ]);

  const recentRuns = [
    {
      id: 1,
      date: "2026-03-04 16:45",
      status: "success",
      duration: "8.3s",
      tasksCreated: 12,
      eventsCreated: 8,
    },
    {
      id: 2,
      date: "2026-03-04 14:20",
      status: "success",
      duration: "7.9s",
      tasksCreated: 9,
      eventsCreated: 5,
    },
    {
      id: 3,
      date: "2026-03-03 11:30",
      status: "error",
      duration: "3.2s",
      tasksCreated: 0,
      eventsCreated: 0,
      error: "Error en integración de email",
    },
    {
      id: 4,
      date: "2026-03-02 15:10",
      status: "success",
      duration: "9.1s",
      tasksCreated: 15,
      eventsCreated: 10,
    },
  ];

  const planningPhases = [
    {
      name: "Design System",
      tasks: [
        "Definir paleta de colores",
        "Crear componentes base",
        "Documentar tokens",
      ],
      suggestedDeadline: "8 Mar 2026",
      color: "purple",
    },
    {
      name: "Widgets",
      tasks: [
        "Widget de métricas",
        "Widget de gráficos",
        "Widget de actividad",
      ],
      suggestedDeadline: "10 Mar 2026",
      color: "blue",
    },
    {
      name: "Data API",
      tasks: [
        "Refactorizar endpoints",
        "Optimizar queries",
        "Implementar caching",
      ],
      suggestedDeadline: "12 Mar 2026",
      color: "green",
    },
    {
      name: "QA & Release",
      tasks: [
        "Testing E2E",
        "Auditoría de performance",
        "Deploy a producción",
      ],
      suggestedDeadline: "15 Mar 2026",
      color: "orange",
    },
  ];

  const conflicts = [
    {
      member: "Laura M.",
      issue: "2 tareas el mismo día (10 Mar)",
      tasks: ["Diseñar widgets", "Revisar componentes"],
    },
    {
      member: "Ana S.",
      issue: "Sobrecarga en semana del 8 Mar",
      tasks: ["Implementar 5 componentes"],
    },
  ];

  const handleTestRun = () => {
    setIsTestRunning(true);
    let currentIndex = 0;

    const runTest = () => {
      if (currentIndex < nodes.length) {
        setNodes((prev) =>
          prev.map((node, idx) => ({
            ...node,
            status:
              idx === currentIndex
                ? "running"
                : idx < currentIndex
                  ? "success"
                  : "idle",
          })),
        );
        currentIndex++;
        setTimeout(runTest, 600);
      } else {
        setNodes((prev) =>
          prev.map((node) => ({ ...node, status: "success" })),
        );
        setTimeout(() => {
          setIsTestRunning(false);
        }, 500);
      }
    };

    runTest();
  };

  const handleAutoOrganize = () => {
    setIsAutoOrganizing(true);
    setTimeout(() => {
      setIsAutoOrganizing(false);
    }, 1500);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "trigger":
        return "bg-purple-50 border-purple-200 text-purple-900";
      case "action":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "logic":
        return "bg-amber-50 border-amber-200 text-amber-900";
      case "integration":
        return "bg-green-50 border-green-200 text-green-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "running":
        return (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        );
      case "success":
        return <Check className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getPhaseColor = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "blue":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "green":
        return "bg-green-50 text-green-700 border-green-200";
      case "orange":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col p-6 pt-20">
      {/* Control Bar */}
      <Card className="border-gray-200 shrink-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                defaultValue="Flujo de ejecución — Rediseño de Dashboard"
                className="w-[420px] h-9 font-semibold"
              />
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 border-0"
              >
                <Tag className="w-3 h-3 mr-1" />
                Tecnología
              </Badge>
              <Select defaultValue="sprint1">
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sprint1">
                    Sprint 1
                  </SelectItem>
                  <SelectItem value="sprint2">
                    Sprint 2
                  </SelectItem>
                  <SelectItem value="sprint3">
                    Sprint 3
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Estado:
                </span>
                <Select
                  value={flowStatus}
                  onValueChange={(v: any) => setFlowStatus(v)}
                >
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        Borrador
                      </div>
                    </SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Activo
                      </div>
                    </SelectItem>
                    <SelectItem value="paused">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Pausado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={
                    mode === "design" ? "default" : "ghost"
                  }
                  className={`h-8 ${mode === "design" ? "bg-white shadow-sm" : ""}`}
                  onClick={() => setMode("design")}
                >
                  Modo Diseño
                </Button>
                <Button
                  size="sm"
                  variant={
                    mode === "execution" ? "default" : "ghost"
                  }
                  className={`h-8 ${mode === "execution" ? "bg-white shadow-sm" : ""}`}
                  onClick={() => setMode("execution")}
                >
                  Modo Ejecución
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleTestRun}
                disabled={isTestRunning}
              >
                <Play className="w-4 h-4 mr-2" />
                Probar
              </Button>

              <Button size="sm" variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>

              <Button size="sm" variant="outline">
                <History className="w-4 h-4 mr-2" />
                Versiones
              </Button>

              <Button
                size="sm"
                className={`gap-2 ${
                  flowStatus === "active"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {flowStatus === "active" ? "Pausar" : "Activar"}
              </Button>

              <Button
                size="sm"
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Sparkles className="w-4 h-4" />
                Generar flujo desde reunión
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress bar */}
      {isTestRunning && (
        <Card className="border-indigo-200 bg-indigo-50 mt-4 shrink-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <div className="flex-1">
                <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{
                      width: `${
                        (nodes.filter(
                          (n) => n.status === "success",
                        ).length /
                          nodes.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-indigo-900">
                Ejecutando...{" "}
                {Math.round(
                  (nodes.filter((n) => n.status === "success")
                    .length /
                    nodes.length) *
                    100,
                )}
                %
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Editor Layout (fills remaining height) */}
      <div className="flex-1 min-h-0 mt-4">
        <div className="h-full flex gap-4">
          {/* Central Canvas */}
          <div className="flex-1 min-w-0 h-full">
            <Card className="border-gray-200 relative overflow-hidden h-full">
              <CardContent className="p-0 h-full">
                {/* Canvas Controls */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium text-gray-600 px-2">
                    100%
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 ml-2"
                    onClick={handleAutoOrganize}
                    disabled={isAutoOrganizing}
                  >
                    <AlignHorizontalSpaceAround
                      className={`w-4 h-4 ${isAutoOrganizing ? "animate-pulse" : ""}`}
                    />
                    Auto-organizar
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowPlanningPanel(true)}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Colocar tareas
                  </Button>
                </div>

                {/* Grid Background */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Canvas Content */}
                <div className="relative h-full overflow-auto">
                  {/* Connections */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      minWidth: "2600px",
                      minHeight: "900px",
                    }}
                  >
                    {connections.map((conn, idx) => {
                      const fromNode = nodes.find(
                        (n) => n.id === conn.from,
                      );
                      const toNode = nodes.find(
                        (n) => n.id === conn.to,
                      );
                      if (!fromNode || !toNode) return null;

                      const startX = fromNode.x + 240;
                      const startY = fromNode.y + 40;
                      const endX = toNode.x;
                      const endY = toNode.y + 40;
                      const midX = (startX + endX) / 2;

                      const isAnimated =
                        isTestRunning &&
                        (fromNode.status === "running" ||
                          fromNode.status === "success") &&
                        (toNode.status === "running" ||
                          toNode.status === "idle");

                      const isHighlighted =
                        selectedRun !== null &&
                        mode === "execution";

                      return (
                        <g key={idx}>
                          <path
                            d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                            stroke={
                              isHighlighted
                                ? "#6366F1"
                                : conn.valid
                                  ? "#9CA3AF"
                                  : "#EF4444"
                            }
                            strokeWidth={
                              isHighlighted ? "3" : "2"
                            }
                            fill="none"
                            className={
                              isAnimated ? "animate-pulse" : ""
                            }
                          />
                          {isAnimated && (
                            <circle r="4" fill="#3B82F6">
                              <animateMotion
                                dur="0.6s"
                                repeatCount="1"
                                path={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                              />
                            </circle>
                          )}
                          <path
                            d={`M ${endX - 8} ${endY - 4} L ${endX} ${endY} L ${endX - 8} ${endY + 4}`}
                            stroke={
                              isHighlighted
                                ? "#6366F1"
                                : conn.valid
                                  ? "#9CA3AF"
                                  : "#EF4444"
                            }
                            strokeWidth="2"
                            fill="none"
                          />
                          {conn.branch && (
                            <text
                              x={midX}
                              y={
                                (startY + endY) / 2 +
                                (conn.branch === "yes"
                                  ? -10
                                  : 20)
                              }
                              fill="#6B7280"
                              fontSize="12"
                              fontWeight="500"
                            >
                              {conn.branch === "yes"
                                ? "Sí"
                                : "No"}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Nodes */}
                  {nodes.map((node) => {
                    const Icon = node.icon;
                    const isDragging = draggingNode === node.id;
                    const isSelected =
                      selectedNode?.id === node.id;

                    return (
                      <div
                        key={node.id}
                        className={`absolute cursor-pointer transition-all ${
                          isDragging
                            ? "scale-105 shadow-2xl z-20"
                            : "shadow-md hover:shadow-lg"
                        } ${isSelected ? "ring-2 ring-indigo-500 z-10" : ""} ${
                          isAutoOrganizing
                            ? "animate-pulse"
                            : ""
                        }`}
                        style={{
                          left: `${node.x}px`,
                          top: `${node.y}px`,
                          width: "240px",
                        }}
                        onClick={() => setSelectedNode(node)}
                        onMouseDown={() =>
                          setDraggingNode(node.id)
                        }
                        onMouseUp={() => setDraggingNode(null)}
                      >
                        <div
                          className={`rounded-lg border-2 p-4 bg-white ${getNodeColor(node.type)}`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">
                                {node.label}
                              </p>
                              <p className="text-xs opacity-70">
                                {node.category}
                              </p>
                            </div>
                            {node.status &&
                              getStatusIcon(node.status)}
                          </div>

                          <div className="mt-2 pt-2 border-t border-current/10">
                            <div className="flex items-center justify-between text-xs opacity-70">
                              {node.owner && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {node.owner}
                                </span>
                              )}
                              {node.lastRun && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {node.lastRun}
                                </span>
                              )}
                            </div>
                            {node.config?.count && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-white/50 mt-1"
                              >
                                +{node.config.count} tasks
                              </Badge>
                            )}
                          </div>

                          {node.validationError && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {node.validationError}
                            </div>
                          )}

                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-400 border-2 border-white" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-gray-400 border-2 border-white" />
                        </div>

                        {isDragging && (
                          <>
                            <div
                              className="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-400 -translate-x-1/2 opacity-50"
                              style={{ height: "900px" }}
                            />
                            <div
                              className="absolute top-1/2 left-0 right-0 h-px bg-indigo-400 -translate-y-1/2 opacity-50"
                              style={{ width: "2600px" }}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}

                  {/* Minimap */}
                  <div className="absolute bottom-6 left-6 w-48 h-32 bg-white border-2 border-gray-200 rounded-lg overflow-hidden z-20">
                    <div className="relative w-full h-full bg-gray-50">
                      {nodes.map((node) => (
                        <div
                          key={node.id}
                          className={`absolute ${getNodeColor(node.type)} opacity-60`}
                          style={{
                            left: `${(node.x / 2600) * 100}%`,
                            top: `${(node.y / 900) * 100}%`,
                            width: "8%",
                            height: "15%",
                          }}
                        />
                      ))}
                      <div className="absolute inset-0 border-2 border-indigo-500 opacity-30" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - smaller */}
          <Card className="w-[280px] border-gray-200 shrink-0 h-full">
            <CardContent className="p-4 h-full overflow-auto">
              {mode === "execution" ? (
                <>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Ejecuciones recientes
                  </h3>
                  <div className="space-y-3">
                    {recentRuns.map((run) => (
                      <div
                        key={run.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedRun === run.id
                            ? "border-indigo-300 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          setSelectedRun(
                            selectedRun === run.id
                              ? null
                              : run.id,
                          )
                        }
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${run.status === "success" ? "bg-green-500" : "bg-red-500"}`}
                            />
                            <span className="text-xs text-gray-600">
                              {run.date}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {run.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-700">
                          <span>{run.tasksCreated} tareas</span>
                          <span>•</span>
                          <span>
                            {run.eventsCreated} eventos
                          </span>
                        </div>
                        {run.error && (
                          <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded">
                            {run.error}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs mt-2 w-full"
                        >
                          Ver detalles
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {selectedNode
                      ? "Inspector"
                      : "Reglas del proyecto"}
                  </h3>

                  {selectedNode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-2">
                          Nombre del nodo
                        </label>
                        <Input
                          defaultValue={selectedNode.label}
                          className="h-9"
                        />
                      </div>

                      {selectedNode.type === "action" && (
                        <div>
                          <label className="text-xs font-medium text-gray-600 block mb-2">
                            Responsable
                          </label>
                          <Select defaultValue="maria">
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maria">
                                María García
                              </SelectItem>
                              <SelectItem value="carlos">
                                Carlos Ruiz
                              </SelectItem>
                              <SelectItem value="laura">
                                Laura Martínez
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-200">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar nodo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Deadline global:
                          </span>
                          <span className="font-medium text-gray-900">
                            15 Mar 2026
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Sprint actual:
                          </span>
                          <span className="font-medium text-gray-900">
                            Sprint 1
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Equipo del proyecto
                        </p>
                        <div className="space-y-2">
                          {[
                            { name: "María G.", role: "PM" },
                            { name: "Laura M.", role: "UI" },
                            {
                              name: "Ana S.",
                              role: "Frontend",
                            },
                            {
                              name: "David L.",
                              role: "Backend",
                            },
                            {
                              name: "Carlos R.",
                              role: "UX/QA",
                            },
                          ].map((member, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-gray-700">
                                {member.name}
                              </span>
                              <span className="text-gray-500">
                                {member.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Planning Panel Dialog */}
      <Dialog
        open={showPlanningPanel}
        onOpenChange={setShowPlanningPanel}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <DialogTitle>
                Sugerencia de planificación (IA)
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Agrupación por fase
              </h4>
              <div className="space-y-3">
                {planningPhases.map((phase, idx) => (
                  <Card
                    key={idx}
                    className={`border-2 ${
                      phase.color === "purple"
                        ? "border-purple-200"
                        : phase.color === "blue"
                          ? "border-blue-200"
                          : phase.color === "green"
                            ? "border-green-200"
                            : "border-orange-200"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            {phase.name}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1">
                            Deadline sugerido:{" "}
                            <span className="font-medium">
                              {phase.suggestedDeadline}
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={getPhaseColor(phase.color)}
                        >
                          {phase.tasks.length} tareas
                        </Badge>
                      </div>
                      <div className="space-y-1 mt-3">
                        {phase.tasks.map((task, taskIdx) => (
                          <div
                            key={taskIdx}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            {task}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Conflictos detectados
              </h4>
              <div className="space-y-2">
                {conflicts.map((conflict, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-900">
                          {conflict.member}
                        </p>
                        <p className="text-xs text-orange-800 mt-1">
                          {conflict.issue}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {conflict.tasks.map(
                            (task, taskIdx) => (
                              <Badge
                                key={taskIdx}
                                variant="secondary"
                                className="text-xs bg-white"
                              >
                                {task}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPlanningPanel(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowPlanningPanel(false)}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}