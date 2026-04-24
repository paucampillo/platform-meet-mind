import { Button } from "./ui/button";
import { Copy, Download, FileText, ListTodo } from "lucide-react";

export function ActionBar() {
  return (
    <div className="flex items-center gap-2 py-3 border-b border-gray-200">
      <Button variant="outline" size="sm" className="gap-2">
        <Copy className="w-4 h-4" />
        Copiar
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="w-4 h-4" />
        Descargar PDF
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <FileText className="w-4 h-4" />
        Exportar a Docs
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <ListTodo className="w-4 h-4" />
        Crear tareas
      </Button>
    </div>
  );
}
