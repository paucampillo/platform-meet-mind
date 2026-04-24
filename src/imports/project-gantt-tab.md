Diseña la pestaña Gantt dentro del detalle de proyecto de MeetMind, respetando exactamente la estructura actual de la pantalla:

Header superior con marca MeetMind y botones: “Importar reunión” y “Nueva Grabación”.

En el cuerpo del proyecto ya existe:

Botón “Volver al Dashboard”

Título del proyecto (ej. “Rediseño de Dashboard”)

Chips de prioridad y estado (ej. “Alta”, “En progreso”)

Descripción del proyecto (texto)

Bloque de datos: Fecha inicio, Deadline, Presupuesto, Gastado

Barra de Progreso general del proyecto

Lista “Equipo del proyecto (5 miembros)” con avatares/nombres

Métricas: Tareas completadas, Reuniones realizadas, Decisiones tomadas, Miembros del equipo

Tabs: Overview / Tareas / Reuniones / Flujo / Gantt

Mantén el mismo estilo visual: minimalista, profesional, mucho blanco, jerarquía fuerte (Notion + Linear + Apple). Reutiliza chips/badges existentes (Alta, En progreso, Completada).

Objetivo del Tab Gantt

El Gantt debe mostrar la planificación temporal del proyecto completo (no por tarea individual), conectando:
reuniones → tareas → planificación, con señalización de tareas auto-generadas.

1) Contenido del Tab “Gantt”

Cuando el usuario hace click en Gantt, debajo de los tabs aparece:

A) Barra de control del Gantt (toolbar compacta)

Usa componentes ya existentes (chips, dropdowns, botones):

Selector de vista: Semana | Mes

Botón: Hoy

Toggle/checkbox: Mostrar dependencias

Filtros (dropdown o chips removibles):

Responsable (María, Carlos, Laura, David, Ana)

Estado (Pendiente, En progreso, Completada, Bloqueada)

Prioridad (Alta, Media, Baja)

Search input: Buscar tarea

Botón secundario: Exportar

Botón CTA (destacado): Optimizar plan (IA)

B) Layout principal en 2 paneles (sin cambiar el layout base de la página)
Panel izquierdo: Lista de tareas del proyecto (estilo Linear)

Cada fila muestra:

Checkbox

Título tarea

Responsable (avatar)

Estado (badge: En progreso / Completada…)

Prioridad (chip: Alta/Media/Baja)

Fecha inicio y/o Deadline

Etiqueta pequeña si aplica: “Auto-generada” / “Creada desde reunión”

Incluye tareas de ejemplo coherentes con el proyecto:

Diseñar sistema de componentes — Laura — Completada

Implementar nuevos widgets — Ana — En progreso

Refactorizar API de datos — David — En progreso

(añade 5–8 tareas más para poblar el Gantt)

Panel derecho: Timeline Gantt (Semana/Mes)

Barras horizontales alineadas con cada tarea

Color/estilo sutil por estado (mismo sistema que badges)

Línea vertical “Hoy”

Milestones (diamante) para hitos del proyecto

Si “Mostrar dependencias” está activo: líneas finas con flecha entre barras

2) Interacciones (muestra estados visuales)

Diseña visualmente estas interacciones (aunque sea en “mock”):

Arrastrar barra para mover fechas

Redimensionar extremos para ajustar duración

Hover: resalta fila + barra

Click en tarea abre drawer lateral derecho (sin cambiar pantalla)

Título editable

Responsable (dropdown)

Estado / Prioridad

Fecha inicio / Deadline

Toggle: Añadir al calendario

Si “Auto-generada”: campo “Creada desde reunión” con link a la reunión

3) IA “Optimizar plan” (preview antes de aplicar)

Al pulsar Optimizar plan (IA):

Muestra un modo “preview” con cambios sugeridos:

barras modificadas resaltadas

mini explicación arriba: “La IA reorganizó tareas para evitar solapes y respetar dependencias”

botones: Aceptar cambios / Revertir

Mantén todo dentro del Tab Gantt (no crear páginas nuevas)

4) Estados necesarios (frames)

Crea estos frames:

Gantt default (Semana)

Gantt con dependencias activas

Gantt con drawer de tarea abierto

IA preview (antes/después)

Empty state (si no hay tareas):

Mensaje: “Aún no hay planificación”

Botones: “Importar reunión” y “Crear tarea”

Copy (en español, consistente)

“Optimizar plan (IA)”

“Creada desde reunión”

“Auto-generada”

“Mostrar dependencias”

“Aceptar cambios” / “Revertir”

“Añadir al calendario”

“Semana / Mes”

Reglas: no rediseñar header ni overview; solo diseñar el contenido del tab Gantt reutilizando el sistema ya implementado.