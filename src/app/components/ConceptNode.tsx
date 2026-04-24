import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface ConceptNodeProps {
  id: string;
  title: string;
  description: string;
  type: "concept" | "decision" | "action";
  x: number;
  y: number;
}

export function ConceptNode({ title, description, type, x, y }: ConceptNodeProps) {
  const typeColors = {
    concept: "bg-blue-50 border-blue-200 text-blue-900",
    decision: "bg-purple-50 border-purple-200 text-purple-900",
    action: "bg-green-50 border-green-200 text-green-900",
  };

  const typeLabels = {
    concept: "Concepto",
    decision: "Decisión",
    action: "Acción",
  };

  return (
    <Card
      className={`absolute w-[200px] ${typeColors[type]} border-2 shadow-md cursor-move hover:shadow-lg transition-shadow`}
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <CardContent className="p-3">
        <Badge className={`${typeColors[type]} border-0 text-xs mb-2`}>
          {typeLabels[type]}
        </Badge>
        <h4 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h4>
        <p className="text-xs opacity-75 line-clamp-2">{description}</p>
      </CardContent>
    </Card>
  );
}
