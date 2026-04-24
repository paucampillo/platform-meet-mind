import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface MeetingCardProps {
  id: string;
  title: string;
  date: Date;
  duration: number;
  tasksCount: number;
  decisionsCount: number;
  status: "in-progress" | "executing" | "completed";
}

export function MeetingCard({
  id,
  title,
  date,
  duration,
  tasksCount,
  decisionsCount,
  status,
}: MeetingCardProps) {
  const statusConfig = {
    "in-progress": { label: "En progreso", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    executing: { label: "Ejecutándose", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
    completed: { label: "Completada", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Link to={`/meeting/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{title}</h3>
            <Badge className={`${config.color} border-0 gap-1`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(date, { addSuffix: true, locale: es })} · {duration} min
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-gray-600">
                <strong className="text-gray-900">{tasksCount}</strong> tareas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600" />
              <span className="text-gray-600">
                <strong className="text-gray-900">{decisionsCount}</strong> decisiones
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
