Contexto (obligatorio respetar)
MeetMind ya tiene la página /projects/:id con estructura estable (card del proyecto, métricas, tabs Overview/Tareas/Reuniones/Flujo/Gantt). La incorporación de diagramas grandes dentro del tab rompe el layout.
No se debe insertar un canvas gigante dentro del tab.

Objetivo
Rediseñar los tabs Flujo y Gantt para que:

Al hacer click en el tab se muestre un preview compacto con acciones rápidas (sin romper la estructura).

Al hacer click en “Ver detalle” / “Abrir editor”, se abra un overlay fullscreen estilo Apple (sheet/modal) con blur de fondo, animación suave y controles completos:

En Flujo: Modo Diseño / Modo Ejecución, drag & drop, conexiones, logs, Probar/Guardar/Versiones/Pausar.

En Gantt: timeline completo, dependencias, filtros, IA preview, optimización y export.

Estética (Apple-like)

Mucho espacio en blanco, sombras suaves, blur/backdrop, animaciones sutiles

Tipografía clara, jerarquía fuerte

Controles minimalistas (icon buttons + labels cortos)

Componentes consistentes con el sistema existente (chips Alta/En progreso, badges, etc.)

1) Tab “Flujo” (PREVIEW compacto dentro del layout)

Diseña un layout dentro del tab Flujo que quepa en el espacio actual.

A) Card “Preview del flujo”

Contenedor tipo card con bordes suaves

Miniatura del flujo (snapshot no editable) a escala (ej. 70–80%)

Scroll interno discreto si el flujo es grande (no crecer la página)

En hover: overlay sutil con texto “Abrir editor” + icono ⤢

En la esquina superior derecha del preview: botón icono ⤢ (Expandir)

B) Columna “Acciones rápidas”

A la derecha del preview, un panel compacto con:

Estado del flujo (chip): Activo / Borrador / Pausado

Botones:

Probar ahora (primario)

“Generar desde reunión”

“Auto-organizar”

Resumen rápido:

Nodos: X

Acciones: X

Integraciones: X

Última ejecución: success/error

“Ejecuciones recientes” (máximo 3–4):

fecha/hora · status · duración · #tareas

Regla: En el preview NO mostrar el toolbar completo (Modo Diseño/Ejecución, Guardar, Versiones…). Eso solo va en el overlay.

2) Overlay fullscreen estilo Apple (DETALLE FLUJO)

Al hacer click en el preview o en “Abrir editor”, abrir un overlay fullscreen tipo “sheet”:

Fondo con blur (frosted glass), la página detrás queda inmóvil

Animación: slide up + fade (250–350ms)

Botón “Cerrar” (X) arriba a la izquierda y “Listo” opcional a la derecha

A) Top bar del overlay (minimal)

Título: “Flujo de ejecución — Rediseño de Dashboard”

Estado: chip Activo/Pausado

Toggle: Modo Diseño | Modo Ejecución (segmented control estilo iOS/macOS)

Acciones (icon + label):

Probar

Guardar

Versiones

Pausar

CTA destacado: “Generar flujo desde reunión”

B) Layout del overlay

Canvas grande (centro) 100% interactivo:

drag & drop nodos

conectar con handles

multi-select

snap-to-grid

auto-organizar (de verdad)

validación visual de errores

Panel derecho (inspector/logs):

En Modo Diseño: inspector del nodo (campos)

En Modo Ejecución: runs + logs en vivo

Barra inferior opcional (muy sutil) con zoom, minimapa, atajos

C) Ejecución visual (en overlay)

En “Probar”, el flujo se reproduce con highlight/token

Cada nodo muestra estado Running/OK/Error

Logs se actualizan en vivo en el panel derecho

Al cerrar overlay, el preview del tab se actualiza (última ejecución, status, etc.)

3) Tab “Gantt” (PREVIEW compacto)

Mismo patrón Apple:

Card con mini timeline semanal/mensual (no editable)

Acciones rápidas a la derecha:

Optimizar plan (IA) (preview)

Exportar

Abrir Gantt completo (⤢)

Resumen:

tareas con deadline esta semana

bloqueadas

conflictos de responsable

4) Overlay fullscreen estilo Apple (DETALLE GANTT)

Al abrir detalle, overlay fullscreen con:

Top bar minimal:

Toggle Semana | Mes

Hoy

Dependencias

Filtros

CTA: “Optimizar plan (IA)”

Timeline completo, dependencias, drawer de tarea, IA preview Aceptar/Revertir

Botón cerrar (X) y animación suave

5) Frames obligatorios

Tab Flujo — Preview + acciones rápidas

Tab Flujo — hover preview (overlay “Abrir editor”)

Overlay Flujo — Modo Diseño (editor completo)

Overlay Flujo — Modo Ejecución (runs/logs)

Tab Gantt — Preview + acciones rápidas

Overlay Gantt — editor completo + IA preview

Copy (usar tal cual):

“Abrir editor”

“Probar ahora”

“Generar desde reunión”

“Auto-organizar”

“Optimizar plan (IA)”

“Cerrar”

“Listo”

Reglas finales:

No romper el layout del proyecto en /projects/:id

Preview = compacto + acciones rápidas

Detalle = overlay fullscreen Apple-like con todas las opciones y modos de edición/ejecución