import { useEffect, useMemo, useRef, useState } from "react";

type DiagramType = "flowchart" | "gantt";

interface DiagramViewerProps {
  mermaidCode: string;
  fallbackItems?: string[];
  diagramType?: DiagramType;
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
}: DiagramViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const candidateSources = useMemo(
    () => buildCandidateSources(mermaidCode, fallbackItems, diagramType),
    [diagramType, fallbackItems, mermaidCode],
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
          className="space-y-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground"
          title={errorMessage}
        >
          <div className="rounded-md border border-border bg-background p-3">
            <div className="space-y-3" role="img" aria-label="Diagrama de gantt simplificado">
              {ganttItems.map((label, index) => (
                <div key={`${label}-${index}`} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate text-foreground">{label}</span>
                    <span className="text-muted-foreground">{index + 1}d</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div
                      className="h-3 rounded-full bg-primary/70"
                      style={{ width: `${Math.max(25, Math.min(100, 30 + index * 10))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
        className="space-y-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground"
        title={errorMessage}
      >
        <div className="rounded-md border border-border bg-background p-3">
          {positions.length === 0 ? (
            <div className="mx-auto max-w-xl space-y-5">
              {flowItems.map((label, index) => (
                <div key={`${label}-${index}`} className="rounded-md border border-border bg-card px-4 py-3 text-center text-sm text-foreground shadow-sm">
                  {label}
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground" />
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
                      className="stroke-foreground"
                      strokeWidth={edge.dashed ? 1.5 : 2}
                      strokeDasharray={edge.dashed ? "6 5" : undefined}
                      markerEnd="url(#fallback-arrow)"
                      opacity={edge.dashed ? 0.65 : 0.9}
                    />
                  );
                })}

                {positions.map((node) => (
                  <g key={node.id}>
                    <rect
                      x={node.x}
                      y={node.y}
                      rx={12}
                      ry={12}
                      width={nodeWidth}
                      height={nodeHeight}
                      className="fill-card stroke-border"
                    />
                    <text
                      x={node.x + nodeWidth / 2}
                      y={node.y + nodeHeight / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-[12px]"
                    >
                      {node.label.slice(0, 50)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div ref={containerRef} className="min-h-24 overflow-x-auto" />
    </div>
  );
}
