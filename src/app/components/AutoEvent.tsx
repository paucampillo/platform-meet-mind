import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AutoEventProps {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  source: string;
}

export function AutoEvent({ title, date, time, duration, source }: AutoEventProps) {
  return (
    <Card className="border-l-4 border-l-indigo-600 border-gray-200 hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium">{title}</h4>
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs gap-1">
            <Sparkles className="w-3 h-3" />
            Auto-generado
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>
            {format(date, "d MMMM", { locale: es })} · {time} ({duration}h)
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Desde: {source}</p>
      </CardContent>
    </Card>
  );
}
