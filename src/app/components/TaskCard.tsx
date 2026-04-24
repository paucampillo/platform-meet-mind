import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Calendar,
  FolderKanban,
  Timer,
  Tag,
  LockKeyhole,
  UserPlus,
  AlertCircle,
  GitBranch,
} from "lucide-react";
import { Link } from "react-router";

interface Task {
  id: string;
  title: string;
  assignee: { name: string; avatar: string } | null;
  dueDate: Date;
  priority: string;
  status: string;
  project: string;
  blocked: boolean;
  dependsOn?: string[];
  blockedDays?: number;
  isOverdue?: boolean;
  smartPriority?: string;
  timeEstimate?: string;
  tags?: string[];
  subtasks?: Array<{ id: string; title: string; completed: boolean }>;
}

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export function TaskCard({ task, compact = false }: TaskCardProps) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          checked={task.status === "completed"}
          readOnly
        />

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {task.title}
          </h4>

          {/* Dependencias */}
          {task.dependsOn && task.dependsOn.length > 0 && !compact && (
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
              <GitBranch className="w-3 h-3" />
              <span>Depende de: {task.dependsOn.join(", ")}</span>
            </div>
          )}

          {/* Blocked warning */}
          {task.blocked && task.blockedDays && task.blockedDays >= 3 && !compact && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg mb-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-800">
                Bloqueada {task.blockedDays} días
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs flex-wrap">
            {/* Assignee */}
            {task.assignee ? (
              <div className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {!compact && (
                  <span className="text-gray-600">{task.assignee.name}</span>
                )}
              </div>
            ) : (
              <Button variant="outline" size="sm" className="h-6 px-2 text-xs gap-1">
                <UserPlus className="w-3 h-3" />
                Asignar
              </Button>
            )}

            {/* Due Date */}
            {!compact && (
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-3 h-3" />
                {task.dueDate.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            )}

            {/* Time Estimate */}
            {task.timeEstimate && !compact && (
              <div className="flex items-center gap-1 text-gray-600">
                <Timer className="w-3 h-3" />
                {task.timeEstimate}
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && !compact && (
              <>
                {task.tags.slice(0, 2).map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700 border-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            {/* Blocked Status */}
            {task.blocked && (
              <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 text-xs">
                <LockKeyhole className="w-3 h-3 mr-1" />
                Bloqueada
              </Badge>
            )}

            {/* Priority */}
            <Badge className={getPriorityColor(task.priority) + " text-xs"}>
              {getPriorityLabel(task.priority)}
            </Badge>

            {/* Status */}
            <Badge className={getStatusColor(task.status) + " text-xs"} variant="secondary">
              {getStatusLabel(task.status)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
