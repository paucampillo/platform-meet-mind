import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { SegmentedControl } from "../components/SegmentedControl";
import { CardOption } from "../components/CardOption";
import { OutlineItem } from "../components/OutlineItem";
import { ConceptNode } from "../components/ConceptNode";
import { TranscriptionFlow } from "../components/TranscriptionFlow";
import {
  CheckCircle2,
  Lightbulb,
  ListTodo,
  FileText,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Download,
  Clock,
  FileSearch,
  Target,
  AlertTriangle,
  List,
  Network,
  Loader2,
  ExternalLink,
  Maximize2,
  Languages,
  BarChart3,
  Link,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DEFAULT_ASSIGNEE_AVATAR, loadTasks, saveTasks, TaskRecord } from "../lib/taskStore";
import { postApiJson } from "../lib/apiClient";

export default function MeetingDetail() {
  const navigate = useNavigate();
  const { id: meetingId = "1" } = useParams();
  const [activeSection, setActiveSection] = useState<string>("summary");
  
  // Summary generation states
  const [selectedFormat, setSelectedFormat] = useState<"resumen" | "esquema" | "mapa" | null>(null);
  const [detailLevel, setDetailLevel] = useState("Medio");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [isExtractingTasks, setIsExtractingTasks] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<any[]>([]);
  const [extractedDecisions, setExtractedDecisions] = useState<any[]>([]);
  const [extractTasksError, setExtractTasksError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  
  // Advanced generation options
  const [selectedFocus, setSelectedFocus] = useState<string[]>(["VisiÃ³n general"]);
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>(["all"]);
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [includeQuotes, setIncludeQuotes] = useState(true);
  const [toneStyle, setToneStyle] = useState("Profesional");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [outputLanguage, setOutputLanguage] = useState("EspaÃ±ol");
  const [includeStatistics, setIncludeStatistics] = useState(false);
  const [highlightPriority, setHighlightPriority] = useState(false);
  const [linkToTranscript, setLinkToTranscript] = useState(true);
  const [templateStyle, setTemplateStyle] = useState("Ejecutivo");

  const sections = [
    { id: "summary", label: "Resumen", icon: FileSearch },
    { id: "decisions", label: "Decisiones", icon: CheckCircle2 },
    { id: "action-items", label: "Action Items", icon: ListTodo },
    { id: "transcript", label: "TranscripciÃ³n completa", icon: FileText },
  ];

  const formats = [
    {
      id: "resumen" as const,
      icon: FileText,
      title: "Resumen detallado",
      description: "Puntos clave, contexto y decisiones",
    },
    {
      id: "esquema" as const,
      icon: List,
      title: "Esquema de temas",
      description: "Estructura jerÃ¡rquica de la reuniÃ³n",
    },
    {
      id: "mapa" as const,
      icon: Network,
      title: "Mapa conceptual",
      description: "Relaciones visuales entre conceptos",
    },
  ];

  const summaryData = {
    context:
      "ReuniÃ³n de planificaciÃ³n estratÃ©gica del primer trimestre de 2026. El equipo de producto y desarrollo se reuniÃ³ para definir objetivos clave, evaluar la arquitectura actual y establecer prioridades para los prÃ³ximos meses.",
    keyPoints: [
      {
        icon: Target,
        text: "Objetivo principal: Escalar la plataforma para soportar 100k usuarios simultÃ¡neos",
      },
      {
        icon: CheckCircle2,
        text: "Aprobado el presupuesto adicional para infraestructura cloud",
      },
      {
        icon: Lightbulb,
        text: "Propuesta de migraciÃ³n a microservicios aceptada por el equipo tÃ©cnico",
      },
      {
        icon: Target,
        text: "Lanzamiento de versiÃ³n beta pÃºblica programado para abril 2026",
      },
    ],
    openIssues: [
      "Definir estrategia de migraciÃ³n de datos existentes a la nueva arquitectura",
      "Confirmar disponibilidad del equipo de QA para testing extensivo",
      "Revisar impacto de costos operativos en el presupuesto anual",
    ],
  };

  const outlineData = [
    {
      title: "1. Contexto y objetivos",
      level: 0,
      children: [
        {
          title: "1.1 SituaciÃ³n actual",
          level: 1,
          content: [
            "La plataforma actual tiene limitaciones de escalabilidad",
            "Se proyecta un crecimiento de 100k usuarios simultÃ¡neos",
          ],
        },
        {
          title: "1.2 Objetivos del Q1 2026",
          level: 1,
          content: [
            "Mejorar la infraestructura para soportar crecimiento",
            "Aumentar la seguridad con MFA",
            "Preparar lanzamiento de beta pÃºblica",
          ],
        },
      ],
    },
    {
      title: "2. Decisiones tÃ©cnicas",
      level: 0,
      children: [
        {
          title: "2.1 Arquitectura",
          level: 1,
          content: [
            "MigraciÃ³n completa a microservicios",
            "ImplementaciÃ³n en fases durante Q2",
            "EvaluaciÃ³n de proveedores cloud",
          ],
        },
        {
          title: "2.2 Seguridad",
          level: 1,
          content: [
            "AutenticaciÃ³n multi-factor obligatoria",
            "AuditorÃ­a de seguridad externa",
            "Cumplimiento con estÃ¡ndares SOC 2",
          ],
        },
      ],
    },
    {
      title: "3. Plan de acciÃ³n",
      level: 0,
      children: [
        {
          title: "3.1 Tareas inmediatas",
          level: 1,
          content: [
            "Crear documento de arquitectura detallado",
            "Asignar recursos al equipo de seguridad",
            "Programar reuniÃ³n de seguimiento en 2 semanas",
          ],
        },
      ],
    },
  ];

  const conceptNodes = [
    {
      id: "1",
      title: "Escalabilidad",
      description: "Necesidad principal",
      type: "concept" as const,
      x: 100,
      y: 100,
    },
    {
      id: "2",
      title: "Microservicios",
      description: "SoluciÃ³n tÃ©cnica",
      type: "decision" as const,
      x: 350,
      y: 100,
    },
    {
      id: "3",
      title: "Seguridad",
      description: "Requerimiento crÃ­tico",
      type: "concept" as const,
      x: 100,
      y: 250,
    },
    {
      id: "4",
      title: "Implementar MFA",
      description: "AcciÃ³n prioritaria",
      type: "action" as const,
      x: 350,
      y: 250,
    },
    {
      id: "5",
      title: "Beta pÃºblica",
      description: "Objetivo Q1",
      type: "decision" as const,
      x: 600,
      y: 175,
    },
  ];

  const decisions = [
    {
      id: "d1",
      text: "Migrar la arquitectura del backend a microservicios para mejorar escalabilidad",
      context: "DecisiÃ³n tomada despuÃ©s de analizar el crecimiento proyectado",
    },
    {
      id: "d2",
      text: "Implementar autenticaciÃ³n multi-factor para todos los usuarios",
      context: "Prioridad alta basada en recomendaciones de seguridad",
    },
    {
      id: "d3",
      text: "Lanzar versiÃ³n beta pÃºblica la primera semana de abril",
      context: "Fecha acordada por el equipo de producto y marketing",
    },
  ];

  const actionItems = [
    {
      id: "a1",
      title: "Finalizar diseÃ±o de la nueva landing page",
      assignee: "MarÃ­a GarcÃ­a",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      dueDate: "2026-02-28",
      status: "pending",
      addToCalendar: true,
    },
    {
      id: "a2",
      title: "Revisar propuesta de arquitectura del backend",
      assignee: "Carlos Ruiz",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      dueDate: "2026-02-27",
      status: "in-progress",
      addToCalendar: true,
    },
    {
      id: "a3",
      title: "Crear documentaciÃ³n de API endpoints",
      assignee: "Laura MartÃ­nez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      dueDate: "2026-03-02",
      status: "pending",
      addToCalendar: false,
    },
  ];

  const suggestions = [
    "Considerar crear un documento de arquitectura antes de implementar los microservicios",
    "Programar una reuniÃ³n de seguimiento en 2 semanas para revisar el progreso",
    "Asignar recursos adicionales al equipo de seguridad para la implementaciÃ³n de MFA",
  ];

  const DEFAULT_TRANSCRIPT = `Ana MartÃ­nez [00:12:34]: Para el prÃ³ximo trimestre, necesitamos migrar a una arquitectura de microservicios antes de junio. Es crÃ­tico para la escalabilidad del proyecto.

Carlos LÃ³pez [00:13:15]: Estoy de acuerdo. Puedo encargarme de la documentaciÃ³n tÃ©cnica y preparar el plan de migraciÃ³n para la prÃ³xima semana.

MarÃ­a Torres [00:14:02]: Necesitamos tambiÃ©n considerar el impacto en el equipo de desarrollo. Propongo organizar sesiones de capacitaciÃ³n en la nueva arquitectura.

Ana MartÃ­nez [00:15:20]: Excelente punto MarÃ­a. Carlos, Â¿puedes coordinar con RRHH para programar las sesiones de capacitaciÃ³n para abril?

Carlos LÃ³pez [00:16:05]: Sin problema, me encargo de eso. TambiÃ©n voy a preparar material de onboarding para los nuevos desarrolladores.

David Ruiz [00:17:30]: Respecto al presupuesto, necesitamos aprobar el incremento para infraestructura cloud. Propongo aumentar un 30% el presupuesto actual.

Ana MartÃ­nez [00:18:45]: Aprobado. David, prepara el informe de costos para el prÃ³ximo board. MarÃ­a, Â¿cuÃ¡ndo tenemos lista la propuesta de arquitectura?

MarÃ­a Torres [00:19:20]: Para el viernes tengo el documento tÃ©cnico listo. TambiÃ©n incluirÃ© un anÃ¡lisis de riesgos.

Carlos LÃ³pez [00:20:10]: Perfecto. Yo me comprometo a tener el plan de migraciÃ³n en fases listo para el lunes. IncluirÃ¡ los hitos y dependencias.

Ana MartÃ­nez [00:21:00]: Excelente. ReuniÃ³n de seguimiento el 10 de marzo. Todos traigan actualizaciones de sus entregables.`;

  useEffect(() => {
    setTranscriptText((prev) => prev || DEFAULT_TRANSCRIPT);
  }, []);

  const handleGenerate = async () => {
    if (!selectedFormat) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const json = await postApiJson<any>("/api/generate-summary", {
        transcript: transcriptText,
        format: selectedFormat,
        detailLevel,
        focusAreas: selectedFocus,
        speakers: selectedSpeakers,
        includeTimestamps,
        includeQuotes,
        toneStyle,
        outputLanguage,
        includeStatistics,
        highlightPriority,
        linkToTranscript,
        templateStyle,
      });
      if (json.success) {
        setGeneratedContent(json.data);
        setHasGenerated(true);
      } else {
        setGenerateError(json.error || "Error generando el contenido");
      }
    } catch (err: any) {
      setGenerateError(err?.message || "No se pudo generar el contenido.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtractTasks = async () => {
    setIsExtractingTasks(true);
    setExtractTasksError(null);
    try {
      const json = await postApiJson<any>("/api/generate-tasks", { transcript: transcriptText });
      if (json.success && json.data) {
        setExtractedTasks(json.data.tasks || []);
        setExtractedDecisions(json.data.decisions || []);
      } else {
        setExtractTasksError(json.error || "Error extrayendo tareas");
      }
    } catch (err: any) {
      setExtractTasksError(err?.message || "No se pudieron extraer tareas.");
    } finally {
      setIsExtractingTasks(false);
    }
  };

  const normalizePriority = (priority?: string): TaskRecord["priority"] => {
    if (!priority) return "medium";
    const value = priority.toLowerCase();
    if (value === "alta" || value === "high") return "high";
    if (value === "baja" || value === "low") return "low";
    return "medium";
  };

  const parseDeadline = (deadline?: string): Date => {
    if (!deadline) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const parsed = new Date(deadline);
    if (Number.isNaN(parsed.getTime())) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    return parsed;
  };

  const pushTasksToManager = (tasksToPush: any[]) => {
    if (!tasksToPush.length) {
      setActionMessage("No hay tareas para enviar al gestor.");
      return;
    }

    const existing = loadTasks();
    const mapped: TaskRecord[] = tasksToPush.map((task, index) => {
      const assigneeName = typeof task.assignee === "string" ? task.assignee.trim() : "";
      const status: TaskRecord["status"] = task.priority === "bloqueada" ? "blocked" : "pending";
      return {
        id: `ai-${meetingId}-${Date.now()}-${index}`,
        title: task.title || `AcciÃ³n ${index + 1}`,
        assignee: assigneeName ? { name: assigneeName, avatar: DEFAULT_ASSIGNEE_AVATAR } : null,
        dueDate: parseDeadline(task.deadline),
        priority: normalizePriority(task.priority),
        status,
        project: "Reuniones",
        blocked: status === "blocked",
        dependsOn: [],
        tags: ["IA", "Meeting"],
        subtasks: [],
        smartPriority: normalizePriority(task.priority) === "high" ? "Hoy" : "Semana",
        timeEstimate: "2h",
      };
    });

    saveTasks([...mapped, ...existing]);
    setActionMessage(`${mapped.length} tarea(s) aÃ±adidas al gestor.`);
  };

  const handleExportGenerated = () => {
    if (!generatedContent) {
      setActionMessage("Genera contenido antes de exportar.");
      return;
    }

    const extension = exportFormat === "Excel" ? "csv" : exportFormat === "Word" ? "doc" : "txt";
    const content =
      extension === "csv"
        ? `campo,valor\nformato,${selectedFormat}\ndetalle,${detailLevel}\ncontenido,\"${JSON.stringify(generatedContent).replace(/\"/g, '""')}\"`
        : JSON.stringify(
            {
              meetingId,
              format: selectedFormat,
              detailLevel,
              outputLanguage,
              generatedAt: new Date().toISOString(),
              data: generatedContent,
            },
            null,
            2,
          );

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `meetmind-${meetingId}-${selectedFormat || "resumen"}.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
    setActionMessage("ExportaciÃ³n lista.");
  };

  const handleExportTranscript = () => {
    if (!transcriptText.trim()) {
      setActionMessage("No hay transcripciÃ³n para exportar.");
      return;
    }

    const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `meetmind-${meetingId}-transcripcion.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setActionMessage("TranscripciÃ³n exportada.");
  };

  const handleGeneratePlan = () => {
    if (extractedTasks.length > 0) {
      pushTasksToManager(extractedTasks);
      navigate("/tasks");
      return;
    }

    pushTasksToManager(actionItems);
    navigate("/tasks");
  };

  const renderGeneratedContent = () => {
    if (!hasGenerated || !selectedFormat) return null;

    if (!generatedContent) return null;

    switch (selectedFormat) {
      case "resumen": {
        const data = generatedContent;
        const keyPoints: string[] = data.keyPoints?.map((p: any) => typeof p === "string" ? p : p.text) || [];
        const openIssues: string[] = data.openIssues || [];
        const decisions: string[] = data.decisions || [];
        const nextSteps: string[] = data.nextSteps || [];
        return (
          <div className="space-y-6">
            {data.context && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded" />
                  Contexto general
                </h3>
                <p className="text-gray-700 leading-relaxed pl-3">{data.context}</p>
              </div>
            )}
            {keyPoints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded" />
                  Puntos clave
                </h3>
                <div className="space-y-3 pl-3">
                  {keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="flex-1 text-gray-700 leading-relaxed pt-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {decisions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-indigo-600 rounded" />
                  Decisiones tomadas
                </h3>
                <div className="space-y-2 pl-3">
                  {decisions.map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {openIssues.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-amber-500 rounded" />
                  Riesgos o temas abiertos
                </h3>
                <Card className="bg-amber-50/50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {openIssues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 leading-relaxed">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {nextSteps.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-green-500 rounded" />
                  PrÃ³ximos pasos
                </h3>
                <div className="space-y-2 pl-3">
                  {nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ChevronRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      case "esquema": {
        const outline = generatedContent?.outline || outlineData;
        const renderOutlineNode = (item: any, depth = 0) => (
          <div key={item.title} className={`${depth > 0 ? "ml-4 border-l-2 border-gray-100 pl-4" : ""}`}>
            <OutlineItem
              title={item.title}
              level={depth}
              children={item.children?.map((child: any) => ({
                title: child.title,
                level: depth + 1,
                content: child.children?.map((c: any) => c.title) || [],
                children: [],
              })) || []}
            />
          </div>
        );
        return (
          <div className="space-y-2">
            {outline.map((item: any, index: number) => renderOutlineNode(item, 0))}
          </div>
        );
      }

      case "mapa": {
        const centralConcept = generatedContent?.centralConcept || "ReuniÃ³n";
        const nodes = generatedContent?.nodes || conceptNodes.map((n) => ({ id: n.id, label: n.title, type: n.type, description: n.description }));
        const connections = generatedContent?.connections || [];
        const positions = [
          { x: 80, y: 80 }, { x: 350, y: 60 }, { x: 80, y: 240 },
          { x: 350, y: 240 }, { x: 580, y: 150 }, { x: 580, y: 310 },
        ];
        const getColor = (type: string) => type === "primary" ? "bg-purple-600" : type === "secondary" ? "bg-blue-500" : "bg-green-500";
        return (
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="relative h-[500px] bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-12 bg-indigo-600 rounded-lg flex items-center justify-center z-10 shadow-lg">
                  <span className="text-white text-xs font-bold text-center px-2">{centralConcept}</span>
                </div>
                {nodes.slice(0, 6).map((node: any, i: number) => {
                  const pos = positions[i] || { x: 100 + i * 80, y: 100 + i * 60 };
                  return (
                    <div key={node.id}
                      className="absolute bg-white border-2 border-gray-200 rounded-lg p-2 shadow-sm cursor-pointer hover:border-purple-400 transition-colors z-10"
                      style={{ left: pos.x, top: pos.y, width: 140 }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getColor(node.type)}`} />
                        <span className="text-xs font-semibold text-gray-900 truncate">{node.label}</span>
                      </div>
                      {node.description && <p className="text-xs text-gray-500 truncate">{node.description}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-[200px] space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-gray-900 mb-2">Nodos ({nodes.length})</p>
                <div className="space-y-2">
                  {nodes.map((node: any) => (
                    <div key={node.id} className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getColor(node.type)}`} />
                        <span className="text-xs font-medium text-gray-900">{node.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "summary":
        return (
          <div className="space-y-6">
            {/* Generator Card */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Generar desde transcripciÃ³n</h2>
                    <p className="text-sm text-gray-600">Elige el formato que prefieras</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Format Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Tipo de contenido</h3>
                  <div className="space-y-2">
                    {formats.map((format) => (
                      <CardOption
                        key={format.id}
                        icon={format.icon}
                        title={format.title}
                        description={format.description}
                        selected={selectedFormat === format.id}
                        onClick={() => setSelectedFormat(format.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Detail Level */}
                {selectedFormat && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Nivel de detalle</h3>
                    <SegmentedControl
                      options={["Corto", "Medio", "Detallado"]}
                      value={detailLevel}
                      onChange={setDetailLevel}
                    />
                  </div>
                )}

                {/* Advanced Options */}
                {selectedFormat && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-xs"
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    >
                      <Sparkles className="w-4 h-4" />
                      Opciones avanzadas
                    </Button>
                    {showAdvancedOptions && (
                      <div className="space-y-3 mt-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={includeTimestamps}
                            onCheckedChange={(checked) => setIncludeTimestamps(checked)}
                          />
                          <Label className="text-xs text-gray-500">Incluir marcas de tiempo</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={includeQuotes}
                            onCheckedChange={(checked) => setIncludeQuotes(checked)}
                          />
                          <Label className="text-xs text-gray-500">Incluir citas</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Estilo de tono</Label>
                          <Select
                            value={toneStyle}
                            onValueChange={(value) => setToneStyle(value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Profesional">Profesional</SelectItem>
                              <SelectItem value="Coloquial">Coloquial</SelectItem>
                              <SelectItem value="Formal">Formal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Enfocarse en</Label>
                          <Select
                            value={selectedFocus[0]}
                            onValueChange={(value) => setSelectedFocus([value])}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VisiÃ³n general">VisiÃ³n general</SelectItem>
                              <SelectItem value="Decisiones">Decisiones</SelectItem>
                              <SelectItem value="Tareas">Tareas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Hablarantes</Label>
                          <Select
                            value={selectedSpeakers[0]}
                            onValueChange={(value) => setSelectedSpeakers([value])}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos los speakers</SelectItem>
                              <SelectItem value="MarÃ­a GarcÃ­a">MarÃ­a GarcÃ­a</SelectItem>
                              <SelectItem value="Carlos Ruiz">Carlos Ruiz</SelectItem>
                              <SelectItem value="Laura MartÃ­nez">Laura MartÃ­nez</SelectItem>
                              <SelectItem value="David LÃ³pez">David LÃ³pez</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Formato de exportaciÃ³n</Label>
                          <Select
                            value={exportFormat}
                            onValueChange={(value) => setExportFormat(value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PDF">PDF</SelectItem>
                              <SelectItem value="Word">Word</SelectItem>
                              <SelectItem value="Excel">Excel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Idioma de salida</Label>
                          <Select
                            value={outputLanguage}
                            onValueChange={(value) => setOutputLanguage(value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EspaÃ±ol">EspaÃ±ol</SelectItem>
                              <SelectItem value="InglÃ©s">InglÃ©s</SelectItem>
                              <SelectItem value="FrancÃ©s">FrancÃ©s</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={includeStatistics}
                            onCheckedChange={(checked) => setIncludeStatistics(checked)}
                          />
                          <Label className="text-xs text-gray-500">Incluir estadÃ­sticas</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={highlightPriority}
                            onCheckedChange={(checked) => setHighlightPriority(checked)}
                          />
                          <Label className="text-xs text-gray-500">Resaltar prioridades</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={linkToTranscript}
                            onCheckedChange={(checked) => setLinkToTranscript(checked)}
                          />
                          <Label className="text-xs text-gray-500">Enlazar a transcripciÃ³n</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Estilo de plantilla</Label>
                          <Select
                            value={templateStyle}
                            onValueChange={(value) => setTemplateStyle(value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ejecutivo">Ejecutivo</SelectItem>
                              <SelectItem value="Simple">Simple</SelectItem>
                              <SelectItem value="Detallado">Detallado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Transcript input */}
                {selectedFormat && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">TranscripciÃ³n de la reuniÃ³n</h3>
                    <textarea
                      className="w-full h-32 text-xs p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white font-mono"
                      placeholder="Pega aquÃ­ la transcripciÃ³n de tu reuniÃ³n..."
                      value={transcriptText}
                      onChange={(e) => setTranscriptText(e.target.value)}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-400">{transcriptText.length} caracteres</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setTranscriptText(DEFAULT_TRANSCRIPT)}
                      >
                        Usar ejemplo
                      </Button>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                {selectedFormat && (
                  <div>
                    {generateError && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600">{generateError}</p>
                      </div>
                    )}
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !transcriptText.trim()}
                      className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generando con IA...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generar {formats.find(f => f.id === selectedFormat)?.title}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Powered by Claude AI Â· Basado en la transcripciÃ³n
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Content */}
            {hasGenerated && selectedFormat && (
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedFormat === "resumen"
                          ? "Resumen detallado"
                          : selectedFormat === "esquema"
                          ? "Esquema de temas"
                          : "Mapa conceptual"}{" "}
                        ({detailLevel})
                      </h2>
                      <p className="text-sm text-gray-600">
                        Generado desde la transcripciÃ³n
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2" onClick={handleExportGenerated}>
                        <Download className="w-4 h-4" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>{renderGeneratedContent()}</CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!hasGenerated && !selectedFormat && (
              <Card className="border-gray-200">
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Selecciona un formato para comenzar
                  </h3>
                  <p className="text-sm text-gray-600">
                    La IA generarÃ¡ automÃ¡ticamente el contenido desde la transcripciÃ³n
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "decisions":
        return (
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                Decisiones clave
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {decisions.map((decision) => (
                <Card key={decision.id} className="border-l-4 border-l-purple-600 bg-purple-50/50">
                  <CardContent className="p-4">
                    <p className="font-medium text-gray-900 mb-2">{decision.text}</p>
                    <p className="text-sm text-gray-600">{decision.context}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        );

      case "action-items":
        return (
          <div className="space-y-4">
            {/* AI Extract Button */}
            <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">ExtracciÃ³n automÃ¡tica con IA</h3>
                  </div>
                  <Button
                    onClick={handleExtractTasks}
                    disabled={isExtractingTasks || !transcriptText.trim()}
                    size="sm"
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isExtractingTasks ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Analizando...</>
                    ) : (
                      <><Zap className="w-4 h-4" />Extraer tareas y decisiones</>
                    )}
                  </Button>
                </div>
                {!transcriptText.trim() && (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">Pega una transcripciÃ³n en la pestaÃ±a "Resumen" para activar la extracciÃ³n.</p>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setTranscriptText(DEFAULT_TRANSCRIPT)}>
                      Cargar ejemplo
                    </Button>
                  </div>
                )}
                {extractTasksError && (
                  <p className="text-xs text-red-600 mt-2">{extractTasksError}</p>
                )}
              </CardContent>
            </Card>

            {/* AI Extracted Tasks */}
            {extractedTasks.length > 0 && (
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ListTodo className="w-5 h-5 text-indigo-600" />
                      Action Items â€” ExtraÃ­dos por IA ({extractedTasks.length})
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={() => pushTasksToManager(extractedTasks)}>
                      Enviar a tareas
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {extractedTasks.map((item: any) => (
                    <Card key={item.id} className={`border-l-4 ${item.priority === "alta" ? "border-l-red-500" : item.priority === "media" ? "border-l-amber-500" : "border-l-gray-300"} border-gray-200`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Checkbox className="mt-1" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.title}</p>
                            {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                          </div>
                          <Badge className={`${item.priority === "alta" ? "bg-red-100 text-red-700" : item.priority === "media" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"} border-0 text-xs`}>
                            {item.priority}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pl-7">
                          {item.assignee && (
                            <div>
                              <Label className="text-xs text-gray-500">Responsable</Label>
                              <p className="text-sm font-medium mt-1">{item.assignee}</p>
                            </div>
                          )}
                          {item.deadline && (
                            <div>
                              <Label className="text-xs text-gray-500">Fecha lÃ­mite</Label>
                              <p className="text-sm font-medium mt-1">{item.deadline}</p>
                            </div>
                          )}
                        </div>
                        {item.source && (
                          <div className="pl-7">
                            <p className="text-xs text-gray-400 italic">"{item.source}"</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* AI Extracted Decisions */}
            {extractedDecisions.length > 0 && (
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    Decisiones â€” ExtraÃ­das por IA ({extractedDecisions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {extractedDecisions.map((d: any) => (
                    <Card key={d.id} className="border-l-4 border-l-purple-600 bg-purple-50/50">
                      <CardContent className="p-4">
                        <p className="font-medium text-gray-900 mb-1">{d.text}</p>
                        {d.madeBy && <p className="text-xs text-gray-500">Por: {d.madeBy} Â· Impacto: {d.impact}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Static fallback items */}
            {extractedTasks.length === 0 && (
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ListTodo className="w-5 h-5 text-indigo-600" />
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {actionItems.map((item) => (
                    <Card key={item.id} className="border-gray-200">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <Checkbox className="mt-1" />
                          <div className="flex-1">
                            <Input
                              defaultValue={item.title}
                              className="font-medium border-0 px-0 focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-indigo-600"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pl-7">
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Responsable</Label>
                            <Input defaultValue={item.assignee} className="text-sm" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Fecha lÃ­mite</Label>
                            <Input type="date" defaultValue={item.dueDate} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Estado</Label>
                            <Select defaultValue={item.status}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="in-progress">En progreso</SelectItem>
                                <SelectItem value="done">Hecho</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2 pt-7">
                            <Switch id={`calendar-${item.id}`} defaultChecked={item.addToCalendar} />
                            <Label htmlFor={`calendar-${item.id}`} className="text-xs cursor-pointer">
                              AÃ±adir al calendario
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "transcript":
        return (
          <div className="space-y-6">
            {/* Header with metadata */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  TranscripciÃ³n inteligente en vivo
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    45 minutos
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    2,847 palabras
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />
                    Procesando
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleExportTranscript}>
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>

            {/* AI Transcription Flow */}
            <TranscriptionFlow />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen app-background">
      <Header />

      <main className="mx-auto max-w-[1600px] px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Reuniones</span>
            <ChevronRight className="w-4 h-4" />
            <span>ReuniÃ³n de planificaciÃ³n Q1 2026</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ReuniÃ³n de planificaciÃ³n Q1 2026
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>24 de febrero, 2026</span>
            <span>Â·</span>
            <span>45 minutos</span>
            <span>Â·</span>
            <Badge className="bg-blue-100 text-blue-800 border-0">EjecutÃ¡ndose</Badge>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
            {actionMessage}
          </div>
        )}
        {/* 3-Column Layout / 2-Column for Transcript */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <aside className="col-span-2">
            <nav className="space-y-1 sticky top-8">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Center Column - Main Content */}
          <div className={activeSection === "transcript" ? "col-span-10" : "col-span-7"}>
            {renderContent()}
          </div>

          {/* Right Sidebar - AI Panel (Hidden for transcript view) */}
          {activeSection !== "transcript" && (
            <aside className="col-span-3">
              <div className="sticky top-8 space-y-6">
                {/* AI Suggestions */}
                <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      Sugerencias de IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <Card key={index} className="bg-white/80 border-indigo-100">
                        <CardContent className="p-3 flex gap-2">
                          <Lightbulb className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">{suggestion}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* Convert to Executable Plan */}
                <Card className="border-gray-200">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Plan ejecutable</h3>
                      <p className="text-sm text-gray-600">
                        Convierte todas las decisiones y tareas en un plan estructurado
                      </p>
                    </div>
                    <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={handleGeneratePlan}>
                      <Sparkles className="w-4 h-4" />
                      Generar plan
                    </Button>
                  </CardContent>
                </Card>

                {/* Execution Progress */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Progreso de ejecuciÃ³n</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Tareas completadas</span>
                          <span className="font-semibold">3/8</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: "37.5%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Decisiones ejecutadas</span>
                          <span className="font-semibold">2/5</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full" style={{ width: "40%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}



