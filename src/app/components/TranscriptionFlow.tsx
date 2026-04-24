import { 
  Brain,
  CheckCircle2,
  User,
  Calendar,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  MessageSquare,
  Play,
  Pause,
  Volume2,
  SkipForward,
  SkipBack,
  FileText,
  Filter,
  Search,
  Tag
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface TranscriptSegment {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
  type?: "decision" | "task" | "insight" | null;
  confidence?: number;
}

const mockTranscript: TranscriptSegment[] = [
  {
    id: "1",
    speaker: "Ana Martínez",
    timestamp: "00:12:34",
    text: "Para el próximo trimestre, necesitamos migrar a una arquitectura de microservicios antes de junio. Es crítico para la escalabilidad del proyecto.",
    type: "decision",
    confidence: 0.95
  },
  {
    id: "2",
    speaker: "Carlos López",
    timestamp: "00:13:15",
    text: "Estoy de acuerdo. Puedo encargarme de la documentación técnica y preparar el plan de migración para la próxima semana.",
    type: "task",
    confidence: 0.92
  },
  {
    id: "3",
    speaker: "María Torres",
    timestamp: "00:14:02",
    text: "Necesitamos también considerar el impacto en el equipo de desarrollo. Propongo organizar sesiones de capacitación en la nueva arquitectura.",
    type: "insight",
    confidence: 0.88
  },
  {
    id: "4",
    speaker: "Ana Martínez",
    timestamp: "00:15:20",
    text: "Excelente punto María. Carlos, ¿puedes coordinar con RRHH para programar las sesiones de capacitación para abril?",
    type: "task",
    confidence: 0.91
  },
  {
    id: "5",
    speaker: "Carlos López",
    timestamp: "00:16:05",
    text: "Sin problema, me encargo de eso. También voy a preparar material de onboarding para los nuevos desarrolladores que vamos a contratar.",
    type: null,
    confidence: 0.75
  }
];

export function TranscriptionFlow() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:14:32");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string | null>("2");

  const filteredTranscript = mockTranscript.filter(segment => {
    const matchesType = selectedType === "all" || segment.type === selectedType;
    const matchesSearch = segment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         segment.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: TranscriptSegment["type"]) => {
    switch(type) {
      case "decision": return "bg-purple-100 text-purple-700 border-purple-200";
      case "task": return "bg-blue-100 text-blue-700 border-blue-200";
      case "insight": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getTypeIcon = (type: TranscriptSegment["type"]) => {
    switch(type) {
      case "decision": return CheckCircle2;
      case "task": return Target;
      case "insight": return Sparkles;
      default: return MessageSquare;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Processing Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Brain className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Procesamiento inteligente en tiempo real
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />
                      En vivo
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    La IA está identificando decisiones, tareas y insights clave automáticamente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Precisión</div>
                  <div className="text-lg font-bold text-indigo-600">94%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Detectados</div>
                  <div className="text-lg font-bold text-purple-600">8 items</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interactive Controls */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Playback Controls */}
            <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
              <Button variant="outline" size="sm" className="h-9 w-9">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                className="h-10 w-10 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9">
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Time Display */}
            <div className="flex items-center gap-2 text-sm font-mono">
              <span className="text-indigo-600 font-semibold">{currentTime}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">00:45:23</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative group cursor-pointer">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: "32%" }} />
              <div className="absolute inset-0 bg-indigo-200 opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar en la transcripción..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Todo
                  </div>
                </SelectItem>
                <SelectItem value="decision">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Decisiones
                  </div>
                </SelectItem>
                <SelectItem value="task">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Tareas
                  </div>
                </SelectItem>
                <SelectItem value="insight">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Insights
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Stream */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTranscript.map((segment, index) => {
            const TypeIcon = getTypeIcon(segment.type);
            const isSelected = selectedSegment === segment.id;
            
            return (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedSegment(segment.id)}
              >
                <Card 
                  className={`border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    isSelected 
                      ? "border-indigo-300 bg-indigo-50/50 shadow-lg" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Left: Speaker Avatar & Time */}
                      <div className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {segment.speaker.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-xs font-mono text-gray-500">{segment.timestamp}</span>
                      </div>

                      {/* Center: Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{segment.speaker}</span>
                          {segment.type && (
                            <Badge className={`${getTypeColor(segment.type)} text-xs`}>
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {segment.type === "decision" && "Decisión"}
                              {segment.type === "task" && "Tarea"}
                              {segment.type === "insight" && "Insight"}
                            </Badge>
                          )}
                          {segment.confidence && segment.confidence > 0.9 && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <Zap className="w-3 h-3 mr-1" />
                              Alta confianza
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {segment.text}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col gap-2">
                        {segment.type && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-transform hover:scale-105 active:scale-95"
                          >
                            <Target className="w-3 h-3" />
                            Crear
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* AI Analysis (Shown when selected) */}
                    <AnimatePresence>
                      {isSelected && segment.type && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                  <Brain className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                    Análisis de IA
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    {segment.type === "decision" && (
                                      <>
                                        <div className="flex items-start gap-2">
                                          <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-gray-700">
                                            Decisión estratégica identificada con impacto en arquitectura técnica
                                          </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-gray-700">
                                            Fecha límite implícita: <span className="font-semibold">Junio 2026</span>
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    {segment.type === "task" && (
                                      <>
                                        <div className="flex items-start gap-2">
                                          <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-gray-700">
                                            Tarea asignable detectada con responsable explícito
                                          </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <User className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-gray-700">
                                            Sugerido: <span className="font-semibold">{segment.speaker}</span>
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    {segment.type === "insight" && (
                                      <div className="flex items-start gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                          Insight estratégico que puede requerir seguimiento
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Real-time Stats Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-xs text-gray-600">Decisiones</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-xs text-gray-600">Tareas</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-xs text-gray-600">Insights</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-2">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">94%</div>
                <div className="text-xs text-gray-600">Precisión IA</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}