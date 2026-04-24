import { useState } from "react";
import { ChevronRight, ListTodo, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

interface OutlineItemProps {
  title: string;
  level: number;
  children?: OutlineItemProps[];
  content?: string[];
}

export function OutlineItem({ title, level, children, content }: OutlineItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const paddingLeft = level * 24;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded-lg group"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {children && children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded transition-transform"
            style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}
        {(!children || children.length === 0) && <div className="w-5" />}
        <span className={`flex-1 ${level === 0 ? "font-semibold text-gray-900" : level === 1 ? "font-medium text-gray-800" : "text-gray-700"}`}>
          {title}
        </span>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ListTodo className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MessageSquare className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {content && isExpanded && (
        <div style={{ paddingLeft: `${paddingLeft + 24}px` }}>
          <ul className="space-y-1 py-2">
            {content.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700 group hover:bg-gray-50 rounded px-2 py-1">
                <span className="text-gray-400 mt-1.5">•</span>
                <span className="flex-1">{item}</span>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ListTodo className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {children && isExpanded && (
        <div>
          {children.map((child, index) => (
            <OutlineItem key={index} {...child} />
          ))}
        </div>
      )}
    </div>
  );
}
