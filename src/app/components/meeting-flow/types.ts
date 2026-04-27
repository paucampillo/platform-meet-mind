export interface MeetingTask {
  descripcion: string;
  responsable: string;
}

export interface MeetingProcessResult {
  resumen: string;
  tareas: MeetingTask[];
  mermaid_codigo: string;
  gantt_codigo: string;
}
