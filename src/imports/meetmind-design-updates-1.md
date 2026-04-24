Mantén el diseño actual de MeetMind: estructura, grid, spacing, tipografía, jerarquía, componentes, estilo visual, radios, sombras, navegación y layout. No rediseñes la vista principal ni cambies la arquitectura de pantallas. El objetivo es aplicar cambios puntuales y expandir funcionalidades visuales sin romper lo existente.

1) Subtítulo (Hero): eliminar “clases”

En el subtítulo bajo “De la conversación a la acción.” elimina la palabra “clases” y cualquier referencia a clases.
Mantén el tono y longitud similar. Ejemplo:

“Tus reuniones convertidas en decisiones, tareas y agenda automáticamente.”

2) “Mis Proyectos”: cards con fondo sutil por proyecto

Mantén el componente actual de card y su estructura interna, pero:

Aplica a cada proyecto un background muy suave y ligeramente distinto (tintas pastel casi blancas).

No cambies métricas, badges, layout ni tamaños: solo la tinta de fondo (opcional una línea accent muy fina).

3) Detalle de Proyecto: expandir experiencia sin rediseñar tabs

En la pantalla de detalle de proyecto, conserva los tabs:
Overview · Tareas · Reuniones · Flujo · Gantt

⚠️ Importante: Gantt y Flujo ya están diseñados. NO los rediseñes desde cero.
Solo mejoras incrementales manteniendo la composición.

3.1) Gantt (mejoras incrementales)

Sobre el Gantt existente:

Añade/ajusta controles compactos (Semana/Mes si falta, filtros mínimos).

Refuerza claridad: línea “Hoy”, milestones sutiles, dependencias más limpias.

Barras con % y estado coherente con badges existentes.

Mantén el estilo “clean/enterprise”.

3.2) Flujo (mejoras incrementales)

Sobre el flujo existente:

Mejora alineación, espaciado y consistencia de conectores.

Nodos con info mínima útil (owner/estado/fecha o etiqueta breve).

Controles discretos: zoom +/-, auto-layout, exportar (si no existen, añadir sin alterar el layout).

3.3) Módulo “Ciclo Scrum” (sin tab nuevo)

Inserta en Overview (o como bloque complementario dentro de “Flujo”) un módulo “Ciclo Scrum”:

Loop/circular minimal: Backlog → Planning → Sprint → Daily → Review → Retro → Backlog.

Integrado con chips/badges del sistema.

4) Integraciones: SOLO fuera del proyecto (en la dashboard principal)

No muestres integraciones dentro del proyecto.
Añade un bloque/indicador de integración solo en la dashboard principal, de forma discreta:

Ubicación sugerida: parte superior del dashboard o cerca de acciones tipo “Importar reunión / Nueva grabación”.

Formato: chip/etiqueta + iconos pequeños (muy minimal), por ejemplo:

“Integrado con: Teams · Meet”

Estados: Conectado / No conectado.

CTA compacto: “Conectar” / “Administrar”.

Tooltip opcional: “Sincroniza reuniones, participantes y calendario”.

Mantén este bloque pequeño, no invasivo, y coherente con el estilo actual.

5) Gestor de Tareas: expandir reglas/funcionalidad sin rediseñar UI

Mantén el layout actual del Gestor de Tareas (no cambies estructura).
Expande la lógica con UI mínima (badges, hints, acciones rápidas), sin rehacer la pantalla:

Dependencias: “Depende de…” + estado Bloqueada.

Prioridad inteligente: chips Hoy / Semana / Retrasadas.

Sin dueño: filtro o agrupación + acción “Asignar”.

Escalado: hint discreto si bloqueada/retrasada X días (reasignar/dividir/pedir ayuda).

Checklist: subtareas dentro del detalle.

Vinculación a proyecto visible y editable desde acciones rápidas.

Plantillas/reglas (light) como opción en menú, sin nueva pantalla pesada.

Acciones rápidas desde “…”: estado, prioridad, responsable, fecha, bloquear, dependencias.

6) Reglas finales

No alteres cabecera global, ni composición base del dashboard.

Mantén consistencia total con el design system.

Auto Layout + componentes reutilizables donde corresponda.