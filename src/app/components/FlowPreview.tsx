import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Maximize2,
  Play,
  Sparkles,
  AlignHorizontalSpaceAround,
  CheckCircle2,
  Video,
  Mail,
  Filter,
  Clock,
  CalendarPlus,
} from "lucide-react";

interface FlowPreviewProps {
  onOpenEditor: () => void;
}

export function FlowPreview({ onOpenEditor }: FlowPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const flowStats = {
    nodes: 16,
    actions: 10,
    integrations: 3,
    lastExecution: {
      status: "success",
      date: "2026-03-04 16:45",
      duration: "8.3s",
      tasksCreated: 12,
    },
  };

  const recentRuns = [
    { id: 1, date: "2026-03-04 16:45", status: "success", duration: "8.3s", tasks: 12 },
    { id: 2, date: "2026-03-04 14:20", status: "success", duration: "7.9s", tasks: 9 },
    { id: 3, date: "2026-03-03 11:30", status: "error", duration: "3.2s", tasks: 0 },
  ];

  // Mini nodes for preview (simplified visualization)
  const previewNodes = [
    { id: 1, x: 30, y: 40, type: "trigger", icon: Video },
    { id: 2, x: 120, y: 40, type: "action", icon: Sparkles },
    { id: 3, x: 210, y: 40, type: "logic", icon: Filter },
    { id: 4, x: 300, y: 40, type: "action", icon: CheckCircle2 },
    { id: 5, x: 30, y: 100, type: "logic", icon: Clock },
    { id: 6, x: 120, y: 80, type: "action", icon: CalendarPlus },
    { id: 7, x: 210, y: 80, type: "integration", icon: Mail },
    { id: 8, x: 120, y: 120, type: "action", icon: Sparkles },
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case "trigger":
        return "bg-purple-100 border-purple-300";
      case "action":
        return "bg-blue-100 border-blue-300";
      case "logic":
        return "bg-amber-100 border-amber-300";
      case "integration":
        return "bg-green-100 border-green-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Preview Card */}
      <div className="col-span-2">
        <Card 
          className="border-gray-200 relative overflow-hidden cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onOpenEditor}
        >
          <CardContent className="p-6">
            {/* Preview Canvas */}
            <div className="relative h-[300px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              {/* Mini grid background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
                  backgroundSize: "15px 15px",
                }}
              />

              {/* Mini nodes */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Connections */}
                <line x1="70" y1="55" x2="120" y2="55" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="160" y1="55" x2="210" y2="55" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="250" y1="55" x2="300" y2="55" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="340" y1="55" x2="340" y2="100" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="70" y1="115" x2="120" y2="95" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="160" y1="95" x2="210" y2="95" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="70" y1="115" x2="120" y2="135" stroke="#9CA3AF" strokeWidth="2" />
              </svg>

              {previewNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.id}
                    className={`absolute w-10 h-10 rounded-lg border-2 ${getNodeColor(node.type)} flex items-center justify-center shadow-sm`}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                );
              })}

              {/* Hover overlay */}
              {isHovered && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all">
                  <div className="text-center text-white">
                    <Maximize2 className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">Abrir editor</p>
                  </div>
                </div>
              )}

              {/* Expand button */}
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-3 right-3 h-8 w-8 p-0 shadow-md bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEditor();
                }}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <div className="space-y-4">
        {/* Status */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Estado del flujo</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5" />
                Activo
              </Badge>
            </div>

            {/* Quick stats */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Nodos:</span>
                <span className="font-semibold text-gray-900">{flowStats.nodes}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Acciones:</span>
                <span className="font-semibold text-gray-900">{flowStats.actions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Integraciones:</span>
                <span className="font-semibold text-gray-900">{flowStats.integrations}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-600">Última ejecución:</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </div>
              <p className="text-xs text-gray-600">
                {flowStats.lastExecution.date} · {flowStats.lastExecution.duration} · {flowStats.lastExecution.tasksCreated} tareas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardContent className="p-4 space-y-2">
            <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Play className="w-4 h-4" />
              Probar ahora
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              Generar desde reunión
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <AlignHorizontalSpaceAround className="w-4 h-4" />
              Auto-organizar
            </Button>
          </CardContent>
        </Card>

        {/* Recent Runs */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Ejecuciones recientes</h4>
            <div className="space-y-2">
              {recentRuns.map((run) => (
                <div key={run.id} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${run.status === "success" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs text-gray-600">{run.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span>{run.duration}</span>
                    <span>{run.tasks} tareas</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
