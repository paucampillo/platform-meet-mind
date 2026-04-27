import { useMemo, useState } from "react";
import { CalendarRange, CheckCircle2, Workflow } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { DiagramViewer } from "./DiagramViewer";
import type { MeetingProcessResult } from "./meeting-flow/types";

interface MeetingResultsProps extends MeetingProcessResult {
  onSaveWorkspace: () => void;
}

export function MeetingResults({
  resumen,
  tareas,
  mermaid_codigo,
  gantt_codigo,
  onSaveWorkspace,
}: MeetingResultsProps) {
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

  const completedCount = useMemo(
    () => Object.values(checkedTasks).filter(Boolean).length,
    [checkedTasks],
  );

  return (
    <Card className="border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Resultados de la reunión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="rounded-lg border border-border bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Resumen ejecutivo
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {resumen || "No se pudo generar un resumen para esta reunión."}
          </p>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-background/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Tareas detectadas</h4>
              <span className="text-xs text-muted-foreground">
                {completedCount}/{tareas.length} marcadas
              </span>
            </div>
            <div className="space-y-3">
              {tareas.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No se detectaron tareas accionables en esta reunión.
                </p>
              )}
              {tareas.map((tarea, index) => (
                <label
                  key={`${tarea.descripcion}-${index}`}
                  className="flex items-start gap-3 rounded-md border border-border/70 bg-background px-3 py-2"
                >
                  <Checkbox
                    checked={checkedTasks[index] ?? false}
                    onCheckedChange={(checked) =>
                      setCheckedTasks((prev) => ({
                        ...prev,
                        [index]: checked === true,
                      }))
                    }
                    className="mt-0.5"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{tarea.descripcion}</p>
                    <p className="text-xs text-muted-foreground">
                      Responsable:{" "}
                      <span className="font-semibold text-primary">
                        {tarea.responsable || "Sin asignar"}
                      </span>
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-background/80 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Workflow className="h-4 w-4 text-primary" />
              Mapa de flujo
            </div>
            <DiagramViewer
              mermaidCode={mermaid_codigo}
              fallbackItems={tareas.map(
                (tarea) => `${tarea.descripcion} (${tarea.responsable || "Sin asignar"})`,
              )}
              diagramType="flowchart"
            />
          </section>
        </div>

        <section className="rounded-lg border border-border bg-background/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarRange className="h-4 w-4 text-primary" />
            Cronograma (Gantt)
          </div>
          <DiagramViewer
            mermaidCode={gantt_codigo}
            fallbackItems={tareas.map(
              (tarea) => `${tarea.descripcion} (${tarea.responsable || "Sin asignar"})`,
            )}
            diagramType="gantt"
          />
        </section>

        <Button onClick={onSaveWorkspace} size="lg" className="w-full">
          Guardar en mi espacio de trabajo
        </Button>
      </CardContent>
    </Card>
  );
}
