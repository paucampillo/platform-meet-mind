import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { ListTodo, CheckCircle2, MessageSquarePlus } from "lucide-react";

interface TranscriptItemProps {
  speaker: string;
  timestamp: string;
  text: string;
  highlights?: {
    type: "decision" | "task";
    start: number;
    end: number;
  }[];
}

export function TranscriptItem({ speaker, timestamp, text, highlights = [] }: TranscriptItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const renderHighlightedText = () => {
    if (highlights.length === 0) return text;

    let lastIndex = 0;
    const parts = [];

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, index) => {
      if (lastIndex < highlight.start) {
        parts.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      const highlightClass =
        highlight.type === "decision"
          ? "bg-purple-100 text-purple-900 px-1 rounded"
          : "bg-blue-100 text-blue-900 px-1 rounded";

      parts.push(
        <span key={`highlight-${index}`} className={highlightClass}>
          {text.substring(highlight.start, highlight.end)}
        </span>
      );

      lastIndex = highlight.end;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
      setShowActions(true);
    } else {
      setShowActions(false);
    }
  };

  return (
    <div
      className="py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors group relative"
      onMouseUp={handleTextSelection}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-[140px]">
          <p className="font-semibold text-sm text-gray-900">{speaker}</p>
          <p className="text-xs text-gray-500 mt-0.5">{timestamp}</p>
        </div>
        <div className="flex-1">
          <p className="text-gray-700 leading-relaxed">{renderHighlightedText()}</p>
        </div>
      </div>

      {/* Hover Actions Menu */}
      {showActions && selectedText && (
        <Card className="absolute right-4 top-4 z-10 shadow-lg border-gray-200">
          <div className="flex items-center gap-1 p-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs h-8"
              onClick={() => {
                console.log("Convert to task:", selectedText);
                setShowActions(false);
              }}
            >
              <ListTodo className="w-3 h-3" />
              Convertir en tarea
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs h-8"
              onClick={() => {
                console.log("Mark as decision:", selectedText);
                setShowActions(false);
              }}
            >
              <CheckCircle2 className="w-3 h-3" />
              Marcar como decisión
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs h-8"
              onClick={() => {
                console.log("Add comment:", selectedText);
                setShowActions(false);
              }}
            >
              <MessageSquarePlus className="w-3 h-3" />
              Añadir comentario
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
