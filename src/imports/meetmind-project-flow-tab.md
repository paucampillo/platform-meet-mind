Diseña la pestaña Flujo dentro del detalle de proyecto de MeetMind, respetando exactamente la estructura ya existente (header MeetMind + botones “Importar reunión” y “Nueva Grabación”, botón “Volver al Dashboard”, card del proyecto con chips “Alta / En progreso”, métricas, equipo y tabs Overview / Tareas / Reuniones / Flujo / Gantt). No rediseñes la pantalla base; solo diseña el contenido del tab Flujo.

Objetivo

Crear un editor visual de flujos estilo Power Automate / n8n, pero adaptado a MeetMind: automatizar el “después de la conversación” (reuniones → tareas → calendario → notificaciones). Debe sentirse muy interactivo, manipulable y vivo.

1) Layout del Tab Flujo (estructura del editor)

Diseña 3 áreas principales dentro del tab:

A) Barra superior del flujo (control bar)

Nombre del flujo editable

Estado: Borrador / Activo / Pausado

CTA: Activar

Botones: Probar, Guardar, Versiones, …

Toggle: Modo Diseño | Modo Ejecución

Botón IA destacado: Generar flujo desde reunión

B) Editor central (Canvas interactivo)

Canvas con grid suave y muchísimo espacio

Zoom controls (+/–), minimapa, snap-to-grid opcional

Nodos draggables (se pueden mover libremente)

Conectores curvos con animación al conectar

Selección múltiple (marquee selection) y alineación (auto-align)

Atajos visibles (tooltip): arrastrar, duplicar, borrar

Botón flotante “+” para añadir nodo rápido

C) Panel izquierdo “Bloques” (Library)

Bloques arrastrables (drag) con categorías:

Triggers (reunión finalizada, decisión detectada, tarea creada…)

Actions (crear tarea, asignar, deadline, calendario, notificar…)

Logic (if/else, filtros, esperar…)

Integrations (calendario, email, Slack/Teams…)

Cada bloque con icono, nombre, mini descripción

D) Panel derecho “Inspector” (configuración en vivo)

Cambia según nodo seleccionado

Campos editables: responsable (avatars), fechas, prioridad, mensaje, condición…

Botón “Aplicar”

Sección “Sugerencia IA” (si nodo sugerido)

2) Interactividad obligatoria (hacerlo evidente en el diseño)

El cliente quiere que se pueda arrastrar y mover y ver avance. Diseña y muestra explícitamente:

Drag & Drop (con estados)

Estado “dragging”: el nodo se eleva con shadow, aparece guía de alineación

Drop zones: zonas donde “encaja” o sugiere conexiones

Snap lines: guías sutiles para alinear

Conexiones (handles y validación)

Cada nodo tiene handles de entrada/salida

Conectar arrastrando cable (wire)

Validaciones visuales:

rojo si conexión inválida

warning si nodo sin salida/entrada

mensajes cortos “Falta condición”, “Nodo sin trigger”

Mover y reorganizar

Arrastrar nodo libremente

Multi-select y mover en grupo

Duplicar nodo (Ctrl+D) y copiar/pegar

Botón “Auto-organizar” (layout automático) opcional

3) Ejecución visual (que se vea “cómo avanza”)

Diseña un modo donde el flujo se “reproduce” y se ven acciones:

Modo “Probar” (test run)

Botón “Probar” inicia una ejecución simulada

Animación: un “token” o highlight recorre los nodos en orden

Cada nodo muestra estado durante la ejecución:

Running (spinner)

OK (check)

Error (alert)

Panel derecho muestra “Log en vivo”:

timestamps

qué acción se ejecutó

resultado (p.ej. “3 tareas creadas”, “Evento añadido”)

Botón “Reiniciar prueba”

Modo “Ejecución” (runs reales)

Lista de ejecuciones recientes (runs) con estado

Al seleccionar un run, el canvas resalta el camino seguido

Tooltip en nodos: “Ejecutado 12 veces”, “Último error…”

4) Acciones y feedback inmediato (muy tangible)

Cada acción debe mostrar resultados visibles:

Nodo “Crear tarea” muestra contador: “+3 tasks”

Nodo “Añadir al calendario” muestra chip “Auto-generado”

Nodo “Notificar” muestra canal (Email/Slack) y “Enviado”

Nodo “If/Else” muestra qué rama se tomó durante el run

5) Plantillas (para acelerar)

Diseña un acceso “Empezar desde plantilla” con 3 plantillas:

“Reunión → tareas → calendario”

“Reunión → aprobación → ejecución”

“Seguimiento automático de deadlines”

6) Frames a entregar (obligatorio)

Crea estos frames, todos dentro del layout actual:

Empty state (sin nodos) + CTA “Generar flujo desde reunión”

Flujo completo con nodos conectados (default)

Nodo seleccionado con inspector abierto

Estado arrastrando nodo (dragging)

Modo Probar con ejecución animada + logs

Modo Ejecución con lista de runs y camino resaltado

Errores/validación (un nodo mal conectado)

Copy (en español)

“Generar flujo desde reunión”

“Activar”

“Probar”

“Modo Diseño / Modo Ejecución”

“Sugerido por IA”

“Cambios sin guardar”

“Auto-organizar”

“Log en vivo”

Reglas finales:

Mantén estética MeetMind (minimal, limpio, mucho blanco).

No solapes etiquetas con texto.

Reutiliza chips/badges y estilos de tareas existentes.

El flujo debe sentirse como un constructor visual interactivo, no un diagrama estático.