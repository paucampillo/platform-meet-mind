import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface CardOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function CardOption({ icon: Icon, title, description, selected, onClick }: CardOptionProps) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all border-2 ${
        selected
          ? "border-purple-600 bg-purple-50/50 shadow-sm"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selected ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold mb-0.5 ${selected ? "text-purple-900" : "text-gray-900"}`}>
              {title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
