Diseña una pantalla de producto (web app) para MeetMind: “Resumen, Esquema y Mapa Conceptual”. No es una diapositiva: es una funcionalidad real dentro de la app.

FRAME:
- Desktop 1440x1024, fondo #FFFFFF, tipografía Inter.
- Estilo SaaS moderno, minimal, con acento morado MeetMind.

HEADER (top bar, fijo):
- Izquierda: logo MeetMind + nombre.
- Centro (opcional): breadcrumb “Reuniones > [Nombre de la reunión] > Resumen”.
- Derecha: botones “Exportar” (primario), “Compartir”, avatar usuario.

LAYOUT PRINCIPAL (2 columnas):
A) COLUMNA IZQUIERDA (navegación y formatos) — ancho ~320px
- Bloque “Formatos” con 3 opciones tipo tabs/radio cards:
  1) Resumen
  2) Esquema (outline)
  3) Mapa conceptual
- Cada opción con icono + microtexto (1 línea).
- Debajo: bloque “Nivel de detalle” (selector):
  - Corto / Medio / Detallado (segmented control).
- Debajo: bloque “Enfoque” (chips):
  - Visión general, Temas tratados, Decisiones, Acciones.
- Botón: “Generar” (primario) + estado loading.
- Nota pequeña: “Basado en la transcripción de la reunión”.

B) COLUMNA DERECHA (resultado) — ancho restante
- Encabezado: título dinámico según formato (ej. “Resumen (Medio)”).
- Debajo: fila de acciones rápidas:
  - “Copiar”, “Descargar PDF”, “Exportar a Docs”, “Crear tareas”.
- CONTENIDO según formato (3 estados):

ESTADO 1: RESUMEN
- Sección “Puntos clave” (bullets).
- Sección “Temas tratados” (chips o lista).
- Sección “Decisiones” (mini tabla: decisión / owner / fecha).

ESTADO 2: ESQUEMA (OUTLINE)
- Árbol jerárquico expandible:
  Tema > Subtema > bullets
- Cada bullet con icono para “Marcar como acción” y “Añadir comentario”.

ESTADO 3: MAPA CONCEPTUAL
- Canvas con nodos y conexiones (placeholder visual):
  - Nodos tipo cards con título + 1 línea.
  - Conexiones con flechas (dependencias / causa-efecto).
- Panel lateral dentro de la columna derecha (a la derecha del canvas) con:
  - Lista de nodos, búsqueda, filtro por tipo (concepto / decisión / acción).
  - Botón “Auto-organizar”.

EXTRAS (muy MeetMind):
- Un “callout” arriba del contenido: “Personalización: ajusta detalle y enfoque — exporta con un clic”.
- “Fuente”/trazabilidad: cada bloque tiene un link “Ver en transcripción” (abre el minuto exacto).
- Estado vacío: “Selecciona un formato y pulsa Generar”.

COMPONENTES (crear como design system):
- SegmentedControl (Corto/Medio/Detallado)
- Chip (Enfoque)
- CardOption (Resumen/Esquema/Mapa)
- ActionBar (Copiar/Exportar/Crear tareas)
- OutlineItem (expandible)
- ConceptNode (para el canvas)
- PrimaryButton / SecondaryButton

Alineación y espaciado:
- Grid 12 columnas, margen 80px, gaps 24px.
- Cards con radius 12, borde #E5E7EB, sombra suave.
- Colores: texto #111827, secundario #6B7280, acento morado para CTA y estados activos.