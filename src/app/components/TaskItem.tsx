import { Checkbox } from "../components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TaskItemProps {
  id: string;
  title: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  dueDate: Date;
  priority: "high" | "medium" | "low";
  completed: boolean;
  onToggle?: (id: string) => void;
}

export function TaskItem({
  id,
  title,
  assignee,
  dueDate,
  priority,
  completed,
  onToggle,
}: TaskItemProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const priorityLabels = {
    high: "Alta",
    medium: "Media",
    low: "Baja",
  };

  return (
    <div className="flex items-center gap-4 py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle?.(id)}
        className="border-gray-300"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${completed ? "line-through text-gray-400" : "text-gray-900"}`}>
          {title}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="w-6 h-6">
          <AvatarImage src={assignee.avatar} />
          <AvatarFallback className="text-xs">
            {assignee.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-500 min-w-[80px]">
          {format(dueDate, "d MMM", { locale: es })}
        </span>
        <Badge className={`${priorityColors[priority]} text-xs px-2`}>
          {priorityLabels[priority]}
        </Badge>
      </div>
    </div>
  );
}
