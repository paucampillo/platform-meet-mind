import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Maximize2,
  Sparkles,
  Download,
  AlertCircle,
  LockKeyhole,
  Users,
} from "lucide-react";

interface GanttPreviewProps {
  onOpenEditor: () => void;
}

export function GanttPreview({ onOpenEditor }: GanttPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const quickStats = {
    thisWeek: 5,
    blocked: 1,
    conflicts: 2,
  };

  // Simplified timeline preview
  const previewTasks = [
    { id: 1, name: "Diseñar componentes", progress: 100, color: "bg-green-500", width: "30%" },
    { id: 2, name: "Implementar widgets", progress: 65, color: "bg-blue-500", width: "25%", offset: "25%" },
    { id: 3, name: "Refactorizar API", progress: 40, color: "bg-blue-500", width: "20%", offset: "45%" },
    { id: 4, name: "Testing", progress: 0, color: "bg-gray-300", width: "15%", offset: "60%" },
  ];

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
            {/* Mini Timeline */}
            <div className="relative h-[300px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              {/* Timeline header */}
              <div className="h-10 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">TAREAS</span>
                <div className="flex gap-8 text-xs font-semibold text-gray-600">
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Abr</span>
                </div>
              </div>

              {/* Timeline content */}
              <div className="p-4 space-y-3">
                {previewTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4">
                    <div className="w-32 text-xs text-gray-700 truncate">{task.name}</div>
                    <div className="flex-1 relative h-8">
                      {/* Background track */}
                      <div className="absolute inset-0 bg-gray-200 rounded" />
                      {/* Task bar */}
                      <div
                        className={`absolute h-full ${task.color} rounded flex items-center justify-between px-2 text-white text-xs`}
                        style={{
                          width: task.width,
                          left: task.offset || "0%",
                        }}
                      >
                        <span className="truncate">{task.name}</span>
                        {task.progress > 0 && <span>{task.progress}%</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today line */}
              <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-indigo-600 z-10">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                  Hoy
                </div>
              </div>

              {/* Hover overlay */}
              {isHovered && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all">
                  <div className="text-center text-white">
                    <Maximize2 className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">Abrir Gantt completo</p>
                  </div>
                </div>
              )}

              {/* Expand button */}
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-14 right-3 h-8 w-8 p-0 shadow-md bg-white/90 hover:bg-white"
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
        {/* Quick Stats */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Resumen</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Esta semana</span>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {quickStats.thisWeek} tareas
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bloqueadas</span>
                <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                  <LockKeyhole className="w-3 h-3 mr-1" />
                  {quickStats.blocked}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conflictos</span>
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Users className="w-3 h-3 mr-1" />
                  {quickStats.conflicts}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardContent className="p-4 space-y-2">
            <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Sparkles className="w-4 h-4" />
              Optimizar plan (IA)
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={onOpenEditor}>
              <Maximize2 className="w-4 h-4" />
              Abrir Gantt completo
            </Button>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900 mb-1">Conflictos detectados</p>
                <p className="text-xs text-orange-800">
                  2 miembros del equipo tienen solapes en sus tareas esta semana.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
