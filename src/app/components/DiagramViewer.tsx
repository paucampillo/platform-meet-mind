import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode, type WheelEvent } from "react";

type DiagramType = "flowchart" | "gantt";

interface DiagramViewerProps {
  mermaidCode: string;
  fallbackItems?: string[];
  diagramType?: DiagramType;
  defaultZoom?: number;
}

const readCssVar = (
  styles: CSSStyleDeclaration,
  name: string,
  fallback: string,
) => {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
};

const normalizeThemeColor = (raw: string) => {
  const value = raw.trim();
  if (!value) return value;
  if (
    value.startsWith("#") ||
    value.startsWith("rgb(") ||
    value.startsWith("rgba(") ||
    value.startsWith("hsl(") ||
    value.startsWith("hsla(") ||
    value.startsWith("oklch(") ||
    value.startsWith("oklab(")
  ) {
    return value;
  }
  if (/\d+\s+\d+%\s+\d+%/.test(value)) {
    return `hsl(${value})`;
  }
  return value;
};

const resolveCssColor = (raw: string, fallback: string) => {
  if (typeof document === "undefined") return fallback;

  const colorCandidate = normalizeThemeColor(raw) || fallback;
  const probe = document.createElement("span");
  probe.style.color = "";
  probe.style.color = colorCandidate;

  if (!probe.style.color) {
    return fallback;
  }

  probe.style.position = "absolute";
  probe.style.opacity = "0";
  probe.style.pointerEvents = "none";
  probe.textContent = ".";
  document.body.appendChild(probe);

  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved || fallback;
};

const stripMarkdownFence = (input: string) =>
  input.replace(/```mermaid/gi, "").replace(/```/g, "").trim();

const sanitizeLabel = (label: string) =>
  label
    .replace(/"/g, "'")
    .replace(/[<>]/g, "")
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")")
    .replace(/\|/g, "/")
    .replace(/:/g, " -")
    .trim();

const clampZoom = (value: number) =>
  Math.min(2.5, Math.max(0.5, Number(value.toFixed(2))));

const FALLBACK_NODE_COLORS = [
  { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" },
  { fill: "#dcfce7", stroke: "#16a34a", text: "#166534" },
  { fill: "#fef3c7", stroke: "#d97706", text: "#92400e" },
  { fill: "#fce7f3", stroke: "#db2777", text: "#9d174d" },
  { fill: "#ede9fe", stroke: "#7c3aed", text: "#5b21b6" },
  { fill: "#ffe4e6", stroke: "#e11d48", text: "#881337" },
];

const ensureDiagramType = (input: string, diagramType: DiagramType) => {
  const cleaned = stripMarkdownFence(input);
  if (!cleaned) return "";

  const hasType =
    /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|xychart|sankey|block-beta)\b/im.test(
      cleaned,
    );

  if (hasType) return cleaned;
  return diagramType === "gantt" ? `gantt\n${cleaned}` : `flowchart TD\n${cleaned}`;
};

const buildFallbackFlowchart = (items: string[]) => {
  const labels = items
    .map((item) => sanitizeLabel(item))
    .filter(Boolean)
    .slice(0, 10);

  const sequence =
    labels.length > 0
      ? labels
      : ["Reunion procesada", "Definir responsables", "Seguimiento de acciones"];

  const lines: string[] = ['flowchart TD', 'N0["Inicio"]', `N1["${sequence[0]}"]`, "N0 --> N1"];
  for (let index = 1; index < sequence.length; index += 1) {
    lines.push(`N${index + 1}["${sequence[index]}"]`);
    lines.push(`N${index} --> N${index + 1}`);
  }
  lines.push(`N${sequence.length + 1}["Cierre"]`);
  lines.push(`N${sequence.length} --> N${sequence.length + 1}`);
  return lines.join("\n");
};

const todayIso = () => {
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return utcDate.toISOString().slice(0, 10);
};

const buildFallbackGantt = (items: string[]) => {
  const labels = items
    .map((item) => sanitizeLabel(item))
    .filter(Boolean)
    .slice(0, 8);

  const tasks =
    labels.length > 0 ? labels : ["Analisis", "Ejecucion", "Revision final"];

  const lines = [
    "gantt",
    "title Cronograma de acciones",
    "dateFormat YYYY-MM-DD",
    "axisFormat %d/%m",
    "section Reunion",
  ];

  tasks.forEach((task, index) => {
    const taskId = `task${index + 1}`;
    const duration = `${Math.min(4, 1 + (index % 3))}d`;
    if (index === 0) {
      lines.push(`${task} :${taskId}, ${todayIso()}, ${duration}`);
    } else {
      lines.push(`${task} :${taskId}, after task${index}, ${duration}`);
    }
  });

  return lines.join("\n");
};

const extractFlowLabels = (mermaidCode: string, fallbackItems: string[]) => {
  if (fallbackItems.length > 0) {
    return fallbackItems.filter(Boolean).slice(0, 8);
  }

  const labels: string[] = [];
  const matches = stripMarkdownFence(mermaidCode).match(/\[(.*?)\]/g) || [];
  for (const raw of matches) {
    const cleaned = sanitizeLabel(raw.replace(/^\[/, "").replace(/\]$/, ""));
    if (cleaned) labels.push(cleaned);
    if (labels.length >= 8) break;
  }

  return labels.length > 0 ? labels : ["Reunion", "Analisis", "Acciones"];
};

interface FallbackFlowNode {
  id: string;
  label: string;
  owner: string;
}

const hashString = (input: string) => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const parseFlowNodes = (mermaidCode: string, fallbackItems: string[]): FallbackFlowNode[] => {
  const labels = extractFlowLabels(mermaidCode, fallbackItems).slice(0, 10);
  return labels.map((raw, index) => {
    const label = sanitizeLabel(raw);
    const match = label.match(/\(([^()]+)\)\s*$/);
    const owner = match?.[1]?.trim() || "Sin asignar";
    return {
      id: `F${index + 1}`,
      label,
      owner,
    };
  });
};

const buildFallbackFlowEdges = (nodes: FallbackFlowNode[]) => {
  const edges: Array<{ from: number; to: number; dashed?: boolean }> = [];

  for (let index = 0; index < nodes.length - 1; index += 1) {
    edges.push({ from: index, to: index + 1, dashed: false });
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 2; j < nodes.length; j += 1) {
      if (nodes[i].owner === nodes[j].owner && nodes[i].owner !== "Sin asignar") {
        edges.push({ from: i, to: j, dashed: true });
        break;
      }
    }
  }

  return edges;
};

const extractGanttLabels = (mermaidCode: string, fallbackItems: string[]) => {
  if (fallbackItems.length > 0) {
    return fallbackItems.filter(Boolean).slice(0, 8);
  }

  const lines = stripMarkdownFence(mermaidCode)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const labels: string[] = [];
  for (const line of lines) {
    if (
      line.startsWith("gantt") ||
      line.startsWith("title ") ||
      line.startsWith("dateFormat ") ||
      line.startsWith("axisFormat ") ||
      line.startsWith("section ")
    ) {
      continue;
    }
    const label = sanitizeLabel(line.split(":")[0] || "");
    if (label) labels.push(label);
    if (labels.length >= 8) break;
  }

  return labels.length > 0 ? labels : ["Analisis", "Ejecucion", "Revision"];
};

const buildCandidateSources = (
  mermaidCode: string,
  fallbackItems: string[],
  diagramType: DiagramType,
) => {
  const normalized = ensureDiagramType(mermaidCode, diagramType);
  const fallback =
    diagramType === "gantt"
      ? buildFallbackGantt(fallbackItems)
      : buildFallbackFlowchart(fallbackItems);

  return Array.from(new Set([normalized, fallback])).filter(Boolean);
};

export function DiagramViewer({
  mermaidCode,
  fallbackItems = [],
  diagramType = "flowchart",
  defaultZoom = 1,
}: DiagramViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(() => clampZoom(defaultZoom));
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const candidateSources = useMemo(
    () => buildCandidateSources(mermaidCode, fallbackItems, diagramType),
    [diagramType, fallbackItems, mermaidCode],
  );

  useEffect(() => {
    setZoom(clampZoom(defaultZoom));
    setPan({ x: 0, y: 0 });
  }, [defaultZoom, mermaidCode, diagramType]);

  const handleWheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    event.preventDefault();

    const rect = viewport.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    if (event.ctrlKey || event.metaKey) {
      const delta = event.deltaY < 0 ? 0.12 : -0.12;
      setZoom((prevZoom) => {
        const nextZoom = clampZoom(prevZoom + delta);
        if (nextZoom === prevZoom) return prevZoom;

        setPan((prevPan) => {
          const worldX = (localX - prevPan.x) / prevZoom;
          const worldY = (localY - prevPan.y) / prevZoom;
          return {
            x: localX - worldX * nextZoom,
            y: localY - worldY * nextZoom,
          };
        });

        return nextZoom;
      });
      return;
    }

    setPan((prev) => ({
      x: prev.x - event.deltaX,
      y: prev.y - event.deltaY,
    }));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;

    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setPan({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    });
  };

  const endPan = (event?: PointerEvent<HTMLDivElement>) => {
    if (event && dragRef.current.pointerId === event.pointerId) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // ignore release errors
      }
    }
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsPanning(false);
  };

  const resetView = () => {
    setZoom(clampZoom(defaultZoom));
    setPan({ x: 0, y: 0 });
  };

  const renderViewport = (content: ReactNode, className: string) => (
    <div
      ref={viewportRef}
      className={`${className} touch-none ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
      onWheel={handleWheelZoom}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPan}
      onPointerLeave={endPan}
      onPointerCancel={endPan}
    >
      <div
        className="inline-block will-change-transform select-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {content}
      </div>
    </div>
  );

  const zoomControls = (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => setZoom((prev) => clampZoom(prev - 0.15))}
        className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground hover:bg-muted"
        aria-label="Alejar diagrama"
      >
        -
      </button>
      <span className="min-w-14 text-center text-xs text-muted-foreground">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={() => setZoom((prev) => clampZoom(prev + 0.15))}
        className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground hover:bg-muted"
        aria-label="Acercar diagrama"
      >
        +
      </button>
      <button
        type="button"
        onClick={resetView}
        className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground hover:bg-muted"
        aria-label="Restablecer vista"
      >
        Reset
      </button>
      <span className="ml-2 text-[11px] text-muted-foreground">Arrastra para mover | Ctrl+rueda para zoom</span>
    </div>
  );

  useEffect(() => {
    let cancelled = false;

    const tryRenderSources = async (mermaid: any) => {
      for (const source of candidateSources) {
        try {
          const diagramId = `meetmind-mermaid-${Math.random().toString(36).slice(2)}`;
          const { svg, bindFunctions } = await mermaid.render(diagramId, source);

          if (cancelled || !containerRef.current) return true;
          if (!svg || !svg.includes("<svg")) {
            continue;
          }

          containerRef.current.innerHTML = svg;
          bindFunctions?.(containerRef.current);
          const renderedSvg = containerRef.current.querySelector("svg");
          if (renderedSvg) {
            renderedSvg.style.maxWidth = "none";
            const viewBox = renderedSvg.viewBox?.baseVal;
            if (viewBox?.width && viewBox?.height) {
              renderedSvg.style.width = `${viewBox.width}px`;
              renderedSvg.style.height = `${viewBox.height}px`;
            }

            if (!renderedSvg.querySelector("style[data-meetmind-flowfx]")) {
              const flowFxStyle = document.createElementNS("http://www.w3.org/2000/svg", "style");
              flowFxStyle.setAttribute("data-meetmind-flowfx", "true");
              flowFxStyle.textContent = `
                .node rect, .node path { transition: all 420ms ease; }
                .edgePath path { transition: stroke 360ms ease, stroke-width 360ms ease, opacity 300ms ease; }
                .mmActive rect, .mmActive path {
                  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.65));
                  animation: mmPulseNode 900ms ease-in-out infinite;
                }
                .mmDone rect, .mmDone path {
                  filter: drop-shadow(0 0 6px rgba(22, 163, 74, 0.35));
                }
                .edgePath path[style*="#f59e0b"] {
                  stroke-dasharray: 10 6;
                  animation: mmDashEdge 900ms linear infinite;
                }
                @keyframes mmPulseNode {
                  0% { transform: scale(1); opacity: 0.9; }
                  50% { transform: scale(1.035); opacity: 1; }
                  100% { transform: scale(1); opacity: 0.9; }
                }
                @keyframes mmDashEdge {
                  from { stroke-dashoffset: 20; }
                  to { stroke-dashoffset: 0; }
                }
              `;
              renderedSvg.prepend(flowFxStyle);
            }
          }
          setErrorMessage(null);
          return true;
        } catch (error: any) {
          console.error("Mermaid render error:", error?.message || error);
          // Try next source candidate.
        }
      }

      return false;
    };

    const renderDiagram = async () => {
      if (!containerRef.current) return;

      if (candidateSources.length === 0) {
        containerRef.current.innerHTML = "";
        setErrorMessage("No hay diagrama para mostrar.");
        return;
      }

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        const styles = getComputedStyle(document.documentElement);
        const background = resolveCssColor(readCssVar(styles, "--card", "#ffffff"), "#ffffff");
        const foreground = resolveCssColor(
          readCssVar(styles, "--foreground", "#030213"),
          "#030213",
        );
        const primary = resolveCssColor(readCssVar(styles, "--primary", "#4f46e5"), "#4f46e5");
        const border = resolveCssColor(readCssVar(styles, "--border", "#d4d4d8"), "#d4d4d8");
        const muted = resolveCssColor(readCssVar(styles, "--muted", "#ececf0"), "#ececf0");
        const ring = resolveCssColor(readCssVar(styles, "--ring", "#2563eb"), "#2563eb");
        const destructive = resolveCssColor(
          readCssVar(styles, "--destructive", "#dc2626"),
          "#dc2626",
        );

        // Attempt 1: themed Mermaid aligned with current UI palette.
        let themedRendered = false;
        try {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "loose",
            theme: "base",
            themeVariables: {
              background,
              primaryColor: primary,
              primaryTextColor: foreground,
              primaryBorderColor: border,
              lineColor: foreground,
              secondaryColor: muted,
              tertiaryColor: background,
              textColor: foreground,
              sectionBkgColor: muted,
              sectionBkgColor2: background,
              sectionTextColor: foreground,
              gridColor: border,
              taskBkgColor: primary,
              taskBorderColor: border,
              taskTextColor: foreground,
              activeTaskBkgColor: ring,
              activeTaskBorderColor: ring,
              doneTaskBkgColor: muted,
              doneTaskBorderColor: border,
              critBkgColor: destructive,
              critBorderColor: destructive,
              todayLineColor: destructive,
              fontFamily: "Manrope, Nunito Sans, Segoe UI, sans-serif",
            },
          });
          themedRendered = await tryRenderSources(mermaid);
        } catch {
          themedRendered = false;
        }
        if (themedRendered) return;

        // Attempt 2: plain theme to avoid failures caused by color parsing.
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "neutral",
        });

        const plainRendered = await tryRenderSources(mermaid);
        if (plainRendered) return;
      } catch (error: any) {
        console.error("Mermaid initialization error:", error?.message || error);
        // Import/init failure falls through to visual fallback.
      }

      if (cancelled || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      setErrorMessage("Mermaid no pudo renderizar el diagrama.");
    };

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [candidateSources]);

  if (errorMessage) {
    if (diagramType === "gantt") {
      const ganttItems = extractGanttLabels(mermaidCode, fallbackItems);
      return (
        <div
          className="flex h-full min-h-0 flex-col gap-3 text-sm text-muted-foreground"
          title={errorMessage}
        >
          {zoomControls}
          {renderViewport(
            <div
              className="min-w-[900px] space-y-3 p-4"
              role="img"
              aria-label="Diagrama de gantt simplificado"
            >
              {ganttItems.map((label, index) => {
                const color = FALLBACK_NODE_COLORS[index % FALLBACK_NODE_COLORS.length];
                return (
                  <div key={`${label}-${index}`} className="space-y-1">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="truncate text-foreground">{label}</span>
                      <span className="text-muted-foreground">{index + 1}d</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${Math.max(25, Math.min(100, 30 + index * 10))}%`,
                          backgroundColor: color.stroke,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>,
            "relative flex-1 min-h-0 overflow-hidden rounded-md border border-border/40 bg-background/50",
          )}
        </div>
      );
    }

    const flowItems = extractFlowLabels(mermaidCode, fallbackItems);
    const flowNodes = parseFlowNodes(mermaidCode, fallbackItems);
    const flowEdges = buildFallbackFlowEdges(flowNodes);
    const columns = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(flowNodes.length || 2))));
    const xGap = 260;
    const yGap = 130;
    const nodeWidth = 220;
    const nodeHeight = 56;
    const padding = 32;
    const rows = Math.max(1, Math.ceil(flowNodes.length / columns));
    const svgWidth = padding * 2 + (columns - 1) * xGap + nodeWidth;
    const svgHeight = padding * 2 + (rows - 1) * yGap + nodeHeight;

    const positions = flowNodes.map((node, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = padding + col * xGap;
      const y = padding + row * yGap;
      return { ...node, x, y };
    });

    return (
      <div
        className="flex h-full min-h-0 flex-col gap-3 text-sm text-muted-foreground"
        title={errorMessage}
      >
        {zoomControls}
        {renderViewport(
          positions.length === 0 ? (
            <div className="mx-auto max-w-xl space-y-5 p-2">
              {flowItems.map((label, index) => (
                <div key={`${label}-${index}`} className="rounded-md border border-border bg-card px-4 py-3 text-center text-sm text-foreground shadow-sm">
                  {label}
                </div>
              ))}
            </div>
          ) : (
            <svg
              role="img"
              aria-label="Diagrama de flujo horizontal con dependencias"
              width={svgWidth}
              height={svgHeight}
            >
              <defs>
                <marker
                  id="fallback-arrow"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
                </marker>
              </defs>

              {flowEdges.map((edge, index) => {
                const from = positions[edge.from];
                const to = positions[edge.to];
                if (!from || !to) return null;
                const x1 = from.x + nodeWidth;
                const y1 = from.y + nodeHeight / 2;
                const x2 = to.x;
                const y2 = to.y + nodeHeight / 2;
                const midX = (x1 + x2) / 2;
                const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2 - 6} ${y2}`;
                return (
                  <path
                    key={`edge-${index}`}
                    d={d}
                    fill="none"
                    stroke={edge.dashed ? "#0284c7" : "#334155"}
                    strokeWidth={edge.dashed ? 1.7 : 2.2}
                    strokeDasharray={edge.dashed ? "7 5" : undefined}
                    markerEnd="url(#fallback-arrow)"
                    opacity={edge.dashed ? 0.75 : 0.9}
                  />
                );
              })}

              {positions.map((node) => {
                const color =
                  FALLBACK_NODE_COLORS[
                    hashString(node.owner || node.label) % FALLBACK_NODE_COLORS.length
                  ];
                return (
                  <g key={node.id}>
                    <rect
                      x={node.x}
                      y={node.y}
                      rx={12}
                      ry={12}
                      width={nodeWidth}
                      height={nodeHeight}
                      fill={color.fill}
                      stroke={color.stroke}
                      strokeWidth={2}
                    />
                    <text
                      x={node.x + nodeWidth / 2}
                      y={node.y + nodeHeight / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={color.text}
                      fontSize={12}
                      fontWeight={600}
                    >
                      {node.label.slice(0, 50)}
                    </text>
                  </g>
                );
              })}
            </svg>
          ),
          "relative flex-1 min-h-0 overflow-hidden rounded-md border border-border/40 bg-background/50 p-2",
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {zoomControls}
      {renderViewport(
        <div ref={containerRef} className="min-h-24 p-2" />,
        "relative flex-1 min-h-0 overflow-hidden rounded-md border border-border/40 bg-background/50",
      )}
    </div>
  );
}
