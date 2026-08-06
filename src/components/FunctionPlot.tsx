"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import {
  formatTick,
  interpolateY,
  makeInverseScale,
  makeScale,
  padDomain,
  seriesExtent,
  ticksFor,
  PLOT_PADDING,
  type PlotDomain,
  type PlotMarker,
  type PlotRefLine,
  type PlotSeries,
  type PlotShadedArea,
} from "@/lib/plot";

interface Props {
  series: readonly PlotSeries[];
  markers?: readonly PlotMarker[];
  refLines?: readonly PlotRefLine[];
  shadedAreas?: readonly PlotShadedArea[];
  domain?: PlotDomain;
  range?: PlotDomain;
  xUnit?: string;
  yUnit?: string;
  ariaLabel: string;
  heightClassName?: string;
}

interface HoverInfo {
  screenX: number;
  screenY: number;
  x: number;
  values: { label: string; color: string; y: number }[];
}

function draw(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  colors: ColorPalette,
  props: Props,
  xDomain: PlotDomain,
  yDomain: PlotDomain,
) {
  const left = PLOT_PADDING.left;
  const right = W - PLOT_PADDING.right;
  const top = PLOT_PADDING.top;
  const bottom = H - PLOT_PADDING.bottom;

  const sx = makeScale(xDomain, left, right);
  const sy = makeScale(yDomain, bottom, top);

  ctx.clearRect(0, 0, W, H);

  // Grid + ticks
  ctx.save();
  ctx.strokeStyle = colors.grid;
  ctx.fillStyle = colors.axes;
  ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
  ctx.lineWidth = 1;

  const xTicks = ticksFor(
    xDomain,
    Math.max(3, Math.round((right - left) / 80)),
  );
  const yTicks = ticksFor(
    yDomain,
    Math.max(3, Math.round((bottom - top) / 40)),
  );

  ctx.beginPath();
  for (const t of xTicks) {
    const px = sx(t);
    ctx.moveTo(px, top);
    ctx.lineTo(px, bottom);
  }
  for (const t of yTicks) {
    const py = sy(t);
    ctx.moveTo(left, py);
    ctx.lineTo(right, py);
  }
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const t of xTicks) {
    ctx.fillText(
      formatTick(t) + (props.xUnit ? ` ${props.xUnit}` : ""),
      sx(t),
      bottom + 4,
    );
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const t of yTicks) {
    ctx.fillText(formatTick(t), left - 5, sy(t));
  }
  ctx.restore();

  // Axes frame
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1;
  ctx.strokeRect(left, top, right - left, bottom - top);
  ctx.restore();

  // Shaded areas (drawn before series lines so strokes stay crisp on top)
  for (const area of props.shadedAreas ?? []) {
    const s = props.series[area.seriesIndex];
    if (!s) continue;
    const pts = s.points.filter(([x]) => x >= area.x0 && x <= area.x1);
    if (pts.length < 2) continue;
    ctx.save();
    ctx.fillStyle = area.color ?? s.color;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.moveTo(sx(pts[0][0]), sy(0));
    for (const [x, y] of pts) ctx.lineTo(sx(x), sy(y));
    ctx.lineTo(sx(pts[pts.length - 1][0]), sy(0));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Reference lines (dashed h/v, e.g. asymptotes)
  for (const ref of props.refLines ?? []) {
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.setLineDash(ref.dashed === false ? [] : [5, 4]);
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    if (ref.orientation === "h") {
      const py = sy(ref.value);
      ctx.moveTo(left, py);
      ctx.lineTo(right, py);
    } else {
      const px = sx(ref.value);
      ctx.moveTo(px, top);
      ctx.lineTo(px, bottom);
    }
    ctx.stroke();
    if (ref.label) {
      ctx.setLineDash([]);
      ctx.fillStyle = colors.axes;
      ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
      if (ref.orientation === "h") {
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText(ref.label, left + 4, sy(ref.value) - 2);
      } else {
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(ref.label, sx(ref.value) + 4, top + 2);
      }
    }
    ctx.restore();
  }

  // Series lines
  for (const s of props.series) {
    if (s.points.length === 0) continue;
    ctx.save();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    if (s.dashed) ctx.setLineDash([6, 4]);
    ctx.beginPath();
    s.points.forEach(([x, y], i) => {
      const px = sx(x);
      const py = sy(y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
  }

  // Markers with labels
  for (const m of props.markers ?? []) {
    const px = sx(m.x);
    const py = sy(m.y);
    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = colors.axes;
    ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(m.label, px + 6, py - 4);
    ctx.restore();
  }
}

export const FunctionPlot = memo(function FunctionPlot({
  series,
  markers,
  refLines,
  shadedAreas,
  domain,
  range,
  xUnit,
  yUnit,
  ariaLabel,
  heightClassName = "aspect-[16/9]",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const propsRef = useRef<Props>({
    series,
    markers,
    refLines,
    shadedAreas,
    domain,
    range,
    xUnit,
    yUnit,
    ariaLabel,
  });
  propsRef.current = {
    series,
    markers,
    refLines,
    shadedAreas,
    domain,
    range,
    xUnit,
    yUnit,
    ariaLabel,
  };

  const { xDomain, yDomain } = useMemo(() => {
    const extent = seriesExtent(series);
    return {
      xDomain: domain ?? padDomain(extent.x),
      yDomain: range ?? padDomain(extent.y),
    };
  }, [series, domain, range]);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const colors = isDark ? COLORS_DARK : COLORS;
    draw(ctx, W, H, colors, propsRef.current, xDomain, yDomain);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      const ctx = canvas!.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      render();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xDomain, yDomain]);

  useEffect(() => {
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, markers, refLines, shadedAreas, xDomain, yDomain]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const left = PLOT_PADDING.left;
    const right = rect.width - PLOT_PADDING.right;
    if (screenX < left || screenX > right) {
      setHover(null);
      return;
    }
    const inv = makeInverseScale(xDomain, left, right);
    const x = inv(screenX);
    const values = series.map((s) => ({
      label: s.label,
      color: s.color,
      y: interpolateY(s.points, x) ?? NaN,
    }));
    setHover({ screenX, screenY, x, values });
  };

  return (
    <div ref={containerRef} className="relative">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        className={`w-full ${heightClassName}`}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      />
      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-gray-200 bg-white/95 px-2 py-1 text-[10px] shadow-sm dark:border-gray-700 dark:bg-gray-900/95"
          style={{
            left: Math.min(hover.screenX + 8, (sizeRef.current.w || 0) - 140),
            top: 4,
          }}
        >
          <div className="font-medium text-gray-700 dark:text-gray-300">
            x = {formatTick(hover.x)} {xUnit}
          </div>
          {hover.values.map((v) => (
            <div
              key={v.label}
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
            >
              <span
                className="inline-block h-[2px] w-2"
                style={{ backgroundColor: v.color }}
              />
              {v.label}: {formatTick(v.y)} {yUnit}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
