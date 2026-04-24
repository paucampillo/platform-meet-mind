import { GanttView } from "./GanttView";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface GanttViewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GanttViewOverlay({ isOpen, onClose }: GanttViewOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Overlay sheet */}
      <div className="absolute inset-0 flex items-center justify-center p-8 animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 h-10 w-10 p-0 rounded-full z-50 bg-white/90 hover:bg-white shadow-md"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Optional "Listo" button */}
          <Button
            variant="default"
            size="sm"
            className="absolute top-4 right-4 z-50 bg-indigo-600 hover:bg-indigo-700 shadow-md"
            onClick={onClose}
          >
            Listo
          </Button>

          {/* Gantt View Content */}
          <div className="flex-1 overflow-auto p-8 pt-20">
            <GanttView />
          </div>
        </div>
      </div>
    </div>
  );
}
