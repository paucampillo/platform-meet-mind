import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { 
  ListTodo, 
  CalendarPlus, 
  Target, 
  Users, 
  Video, 
  MessageSquare, 
  RotateCcw 
} from "lucide-react";

export function ScrumCycle() {
  const stages = [
    {
      id: "backlog",
      name: "Backlog",
      icon: ListTodo,
      color: "bg-gray-100 text-gray-700 border-gray-300",
      iconBg: "bg-gray-50",
      iconColor: "text-gray-600",
      active: false,
      items: 24
    },
    {
      id: "planning",
      name: "Planning",
      icon: CalendarPlus,
      color: "bg-blue-100 text-blue-700 border-blue-300",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      active: false,
      items: null
    },
    {
      id: "sprint",
      name: "Sprint",
      icon: Target,
      color: "bg-purple-100 text-purple-700 border-purple-300",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      active: true,
      items: 12,
      days: "3/14 días"
    },
    {
      id: "daily",
      name: "Daily",
      icon: Users,
      color: "bg-green-100 text-green-700 border-green-300",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      active: false,
      items: null
    },
    {
      id: "review",
      name: "Review",
      icon: Video,
      color: "bg-orange-100 text-orange-700 border-orange-300",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      active: false,
      items: null
    },
    {
      id: "retro",
      name: "Retro",
      icon: MessageSquare,
      color: "bg-pink-100 text-pink-700 border-pink-300",
      iconBg: "bg-pink-50",
      iconColor: "text-pink-600",
      active: false,
      items: null
    }
  ];

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Ciclo Scrum</h3>
              <p className="text-sm text-gray-600">Sprint 5 · Q1 2026</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            En progreso
          </Badge>
        </div>

        <div className="relative">
          {/* Circular flow visualization */}
          <div className="flex items-center justify-between relative">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="relative flex flex-col items-center">
                  {/* Connector line */}
                  {index < stages.length - 1 && (
                    <div className="absolute top-6 left-[50%] w-[calc(100%+4rem)] h-0.5 bg-gray-200 -z-10" />
                  )}
                  
                  {/* Return to backlog line */}
                  {index === stages.length - 1 && (
                    <div className="absolute top-6 right-[50%] w-[400%] h-0.5 bg-gray-200 -z-10" 
                         style={{ 
                           clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                           transform: "translateY(60px)"
                         }} 
                    />
                  )}

                  {/* Stage node */}
                  <div className={`w-12 h-12 rounded-full ${stage.iconBg} border-2 ${
                    stage.active ? 'border-purple-400 shadow-lg' : 'border-gray-200'
                  } flex items-center justify-center mb-2 bg-white relative z-10`}>
                    <Icon className={`w-5 h-5 ${stage.iconColor}`} />
                  </div>

                  {/* Stage label */}
                  <span className={`text-xs font-medium mb-1 ${
                    stage.active ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {stage.name}
                  </span>

                  {/* Stage info */}
                  {stage.items !== null && (
                    <span className="text-xs text-gray-500">
                      {stage.items} tareas
                    </span>
                  )}
                  {stage.days && (
                    <span className="text-xs text-gray-500">
                      {stage.days}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Return arrow indicator */}
          <div className="absolute bottom-0 right-0 flex items-center gap-1 text-xs text-gray-500">
            <RotateCcw className="w-3 h-3" />
            <span>Ciclo continuo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
