import { FlowEditor } from "./FlowEditor";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface FlowEditorOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FlowEditorOverlay({ isOpen, onClose }: FlowEditorOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Overlay sheet */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
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

          {/* Flow Editor Content (full size, no padding, no outer scroll) */}
          <div className="flex-1 min-h-0">
            <FlowEditor />
          </div>
        </div>
      </div>
    </div>
  );
}