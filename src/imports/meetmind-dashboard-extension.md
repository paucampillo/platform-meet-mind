Contexto: Ya existe una Home/Dashboard de MeetMind (como en los screenshots). No rediseñar desde cero. Mantener estilo visual: minimal, limpio, cards, chips de estado, top bar con “Importar reunión”, “Nueva Grabación”, avatar.

Objetivo

Extender la UI actual para que sea una Dashboard personal basada en el perfil/rol, con navegación clara hacia:

Gestor de Proyectos (incluye Gantt + Flujo dentro)

Reuniones (mantener pantallas actuales de transcripción/resumen/decisiones/action items)

Gestor de Tareas (panel avanzado)

Calendario como módulo separado (Home solo muestra preview)

Perfil (al click del avatar) como dashboard “vista por otros en la organización”

1) Home / Dashboard personal (mantener estructura, añadir capa de contexto)
A) Mantener top bar actual

Izquierda: logo “MeetMind”.

Derecha: Importar reunión + Nueva Grabación + Avatar (clickable).

Añadir (sin romper layout) un selector compacto de contexto cerca del buscador o debajo del header:

“Mi ámbito: Tecnología / HR / Ventas…” (según rol)

“Ciclo actual: Sprint X / Q1 / Hiring Week…”

B) Mantener hero (“De la conversación a la acción”)

Mantener CTA central “Iniciar nueva sesión”

Debajo del hero, añadir una fila de insights personales en mini-cards (muy sutil):

“Tareas pendientes”

“Retrasadas”

“Reuniones esta semana”

“Vacantes sin dueño”
(Solo números + icono, sin gráficos grandes)

2) Reorganización de bloques (sin cambiar lo que ya existe, solo completar)
Bloque 1: Mis Proyectos (añadir arriba o antes de Reuniones recientes)

Reutilizar el patrón de cards ya usado en “Mis Proyectos” (de tus screenshots).

Cada Project Card debe incluir:

Nombre + chips (Prioridad, Estado)

Meta line: miembros, deadline, progreso tareas

Barra de progreso

Click abre Gestor de Proyectos (nuevo módulo) en la misma app.

Bloque 2: Reuniones recientes (mantener cards actuales)

Mantener cards con: título, estado, tiempo, #tareas, #decisiones

Añadir chip de proyecto en cada reunión (si está taggeada a un proyecto) o chip de tipo (“Daily”, “1:1”, “Planning”).

Click abre la vista de reunión existente (Resumen/Decisiones/Action Items/Transcripción) sin cambios.

Bloque 3: Tareas activas (mantener lista actual, enriquecer)

Mantener lista con checkbox, asignado, fecha, prioridad.

Añadir 2 mejoras mínimas:

chip “Bloqueada” si aplica

indicador de “Proyecto” en una línea secundaria

CTA “Ver todas” abre Gestor de Tareas (nuevo módulo).

Bloque 4: Próximos eventos (mantener como preview)

Mantener cards de eventos con tag “Auto-generado” y “Desde: reunión…”

CTA “Ver calendario completo” abre módulo Calendario (separado).

Bloque lateral adicional (opcional, como en tu ejemplo): Mi Equipo

Mantener patrón de lista de personas + rol + estado online.

Click en persona abre su Perfil (vista por otros).

3) Nuevos módulos: solo definir navegación + layout base (no detallar funciones internas todavía)
A) Gestor de Proyectos (nuevo)

Entrada: click en Project Card.

Layout: header del proyecto + tabs:

“Overview”

“Tareas”

“Reuniones”

“Flujo” (diagrama de flujo)

“Gantt” (diagrama Gantt)
(Gantt y Flujo deben vivir aquí, no en Home.)

B) Gestor de Tareas (nuevo)

Entrada: “Ver todas” en Tareas activas o sidebar.

Layout: header + filtros + vista principal.

Mantener estilo minimal con chips y paneles, pero sin diseñar aún todos los detalles (solo estructura base y espacio para filtros/agrupación por proyecto).

C) Calendario (módulo separado)

Entrada: botón “Ver calendario completo” o sidebar.

Home solo muestra preview.

D) Perfil (vista para otros)

Click en avatar (top right) abre Perfil.

Perfil muestra:

header: foto, nombre, rol, equipo

mini-cards: proyectos activos, tareas pendientes, reuniones esta semana

listas: “Proyectos”, “Tareas actuales”

Estilo igual al resto (cards + chips + aire).

4) Reglas de consistencia visual

No cambiar paleta base ni estilo de cards actuales.

Mantener spacing, bordes redondeados, sombras suaves, chips.

“Insight feel” solo con: números, chips, mini barras; evitar dashboards recargados.

5) Entregables en Figma

Actualizar frame existente “Home” (desktop) sin romper la composición

Crear 1 frame nuevo por módulo (wireframe visual con el mismo style):

Gestor de Proyectos (con tabs e placeholders para Flujo/Gantt)

Gestor de Tareas (estructura base)

Calendario (estructura base)

Perfil (vista pública interna)