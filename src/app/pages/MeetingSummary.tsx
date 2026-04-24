import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SegmentedControl } from "../components/SegmentedControl";
import { Chip } from "../components/Chip";
import { CardOption } from "../components/CardOption";
import { ActionBar } from "../components/ActionBar";
import { OutlineItem } from "../components/OutlineItem";
import { ConceptNode } from "../components/ConceptNode";
import {
  Brain,
  ChevronRight,
  Upload,
  Share2,
  FileText,
  List,
  Network,
  Sparkles,
  Loader2,
  ExternalLink,
  Search,
  Filter,
  Maximize2,
} from "lucide-react";
import { postApiJson } from "../lib/apiClient";

export default function MeetingSummary() {
  const [selectedFormat, setSelectedFormat] = useState<"resumen" | "esquema" | "mapa">("resumen");
  const [detailLevel, setDetailLevel] = useState("Medio");
  const [selectedFocus, setSelectedFocus] = useState<string[]>(["VisiÃ³n general"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasContent, setHasContent] = useState(true);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [transcriptText, setTranscriptText] = useState("Ana MartÃ­nez [00:12:34]: Para el prÃ³ximo trimestre, necesitamos migrar a una arquitectura de microservicios antes de junio.\n\nCarlos LÃ³pez [00:13:15]: Puedo encargarme de la documentaciÃ³n tÃ©cnica y preparar el plan de migraciÃ³n.\n\nMarÃ­a Torres [00:14:02]: Propongo organizar sesiones de capacitaciÃ³n en la nueva arquitectura.\n\nDavid Ruiz [00:17:30]: Necesitamos aprobar el incremento presupuestario para infraestructura cloud.");

  const formats = [
    {
      id: "resumen" as const,
      icon: FileText,
      title: "Resumen",
      description: "Puntos clave y decisiones",
    },
    {
      id: "esquema" as const,
      icon: List,
      title: "Esquema",
      description: "Estructura jerÃ¡rquica",
    },
    {
      id: "mapa" as const,
      icon: Network,
      title: "Mapa conceptual",
      description: "Relaciones visuales",
    },
  ];

  const focusOptions = ["VisiÃ³n general", "Temas tratados", "Decisiones", "Acciones"];

  const toggleFocus = (focus: string) => {
    setSelectedFocus((prev) =>
      prev.includes(focus) ? prev.filter((f) => f !== focus) : [...prev, focus]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const json = await postApiJson<any>("/api/generate-summary", {
        transcript: transcriptText,
        format: selectedFormat,
        detailLevel,
        focusAreas: selectedFocus,
      });
      if (json.success) {
        setGeneratedContent(json.data);
        setHasContent(true);
      } else {
        setGenerateError(json.error || "Error generando el contenido");
      }
    } catch (err: any) {
      setGenerateError(err?.message || "No se pudo generar el contenido.");
    } finally {
      setIsGenerating(false);
    }
  };

  const summaryData = {
    keyPoints: [
      "MigraciÃ³n a microservicios aprobada para mejorar escalabilidad",
      "ImplementaciÃ³n de autenticaciÃ³n multi-factor como prioridad alta",
      "Lanzamiento de versiÃ³n beta pÃºblica programado para abril 2026",
      "Presupuesto adicional aprobado para infraestructura cloud",
    ],
    topics: [
      "Arquitectura tÃ©cnica",
      "Seguridad",
      "Roadmap de producto",
      "Recursos y presupuesto",
    ],
    decisions: [
      { decision: "Migrar a microservicios", owner: "Carlos Ruiz", date: "Q2 2026" },
      { decision: "Implementar MFA", owner: "Laura MartÃ­nez", date: "Marzo 2026" },
      { decision: "Lanzar beta pÃºblica", owner: "MarÃ­a GarcÃ­a", date: "Abril 2026" },
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

  const renderContent = () => {
    if (!hasContent) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Selecciona un formato y pulsa Generar
          </h3>
          <p className="text-sm text-gray-600">
            Elige el nivel de detalle y enfoque que prefieras
          </p>
        </div>
      );
    }

    switch (selectedFormat) {
      case "resumen": {
        const ai = generatedContent;
        const keyPoints: string[] = ai?.keyPoints?.map((p: any) => typeof p === "string" ? p : p.text) || summaryData.keyPoints;
        const decisions: any[] = ai?.decisions?.map((d: string, i: number) => ({ decision: d, owner: "â€”", date: "â€”" })) || summaryData.decisions;
        return (
          <div className="space-y-8">
            {ai && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-xs text-green-700 font-medium">âœ“ Generado por Claude AI desde tu transcripciÃ³n</span>
              </div>
            )}
            {ai?.context && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contexto</h3>
                <p className="text-gray-700 leading-relaxed">{ai.context}</p>
              </section>
            )}
            {/* Key Points */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Puntos clave</h3>
              <div className="space-y-3">
                {keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-purple-700">{index + 1}</span>
                    </div>
                    <p className="flex-1 text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Decisions */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Decisiones</h3>
              <Card className="border-gray-200">
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">DecisiÃ³n</th>
                        <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Responsable</th>
                        <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {decisions.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{typeof item === "string" ? item : item.decision}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.owner || "â€”"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.date || "â€”"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </section>
          </div>
        );
      }

      case "esquema":
        return (
          <div className="space-y-2">
            {outlineData.map((item, index) => (
              <OutlineItem key={index} {...item} />
            ))}
          </div>
        );

      case "mapa":
        return (
          <div className="flex gap-6">
            {/* Canvas */}
            <div className="flex-1">
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-8">
                  <div className="relative h-[600px] bg-white rounded-lg border-2 border-dashed border-gray-300">
                    {conceptNodes.map((node) => (
                      <ConceptNode key={node.id} {...node} />
                    ))}
                    {/* Arrows/Connections */}
                    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
                        </marker>
                      </defs>
                      <line
                        x1="280"
                        y1="130"
                        x2="350"
                        y2="130"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                      <line
                        x1="280"
                        y1="280"
                        x2="350"
                        y2="280"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                      <line
                        x1="530"
                        y1="130"
                        x2="600"
                        y2="175"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="w-[280px] space-y-4">
              <Card className="border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar nodos..." className="pl-9" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Filter className="w-4 h-4" />
                    Filtrar por tipo
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Maximize2 className="w-4 h-4" />
                    Auto-organizar
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Nodos ({conceptNodes.length})</h4>
                  <div className="space-y-2">
                    {conceptNodes.map((node) => (
                      <div
                        key={node.id}
                        className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              node.type === "concept"
                                ? "bg-blue-500"
                                : node.type === "decision"
                                ? "bg-purple-500"
                                : "bg-green-500"
                            }`}
                          />
                          <span className="text-xs font-medium text-gray-900">{node.title}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1 pl-4">
                          {node.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen app-background">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="mx-auto px-20 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">MeetMind</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Reuniones</span>
              <ChevronRight className="w-4 h-4" />
              <span>ReuniÃ³n de planificaciÃ³n Q1 2026</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Resumen</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Upload className="w-4 h-4" />
              Exportar
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="mx-auto px-20 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Controls */}
          <aside className="col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Formats */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Formatos</h3>
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
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Nivel de detalle</h3>
                <SegmentedControl
                  options={["Corto", "Medio", "Detallado"]}
                  value={detailLevel}
                  onChange={setDetailLevel}
                />
              </div>

              {/* Focus */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Enfoque</h3>
                <div className="flex flex-wrap gap-2">
                  {focusOptions.map((focus) => (
                    <Chip
                      key={focus}
                      label={focus}
                      selected={selectedFocus.includes(focus)}
                      onClick={() => toggleFocus(focus)}
                    />
                  ))}
                </div>
              </div>

              {/* Transcript input */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">TranscripciÃ³n</label>
                <textarea
                  className="w-full h-28 text-xs p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white font-mono"
                  placeholder="Pega aquÃ­ la transcripciÃ³n de tu reuniÃ³n..."
                  value={transcriptText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTranscriptText(e.target.value)}
                />
              </div>

              {generateError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{generateError}</p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !transcriptText.trim()}
                className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500">
                Basado en la transcripciÃ³n de la reuniÃ³n
              </p>
            </div>
          </aside>

          {/* Right Column - Content */}
          <div className="col-span-9">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-0">
                {/* Callout */}
                <div className="bg-purple-50 border-b border-purple-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-purple-900">
                        <strong>PersonalizaciÃ³n:</strong> ajusta detalle y enfoque â€” exporta con un
                        clic
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedFormat === "resumen"
                      ? "Resumen"
                      : selectedFormat === "esquema"
                      ? "Esquema"
                      : "Mapa conceptual"}{" "}
                    ({detailLevel})
                  </h2>
                </div>

                {/* Action Bar */}
                {hasContent && (
                  <div className="px-6">
                    <ActionBar />
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-6">{renderContent()}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


