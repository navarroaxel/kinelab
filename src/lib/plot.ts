// Pure helpers for FunctionPlot — a static function plotter (as opposed to
// strip-chart.ts, which is a rolling real-time sample buffer). No React, no DOM
// except where a CanvasRenderingContext2D is passed in explicitly.

export interface PlotSeries {
  label: string;
  color: string;
  points: [number, number][];
  dashed?: boolean;
}

export interface PlotMarker {
  x: number;
  y: number;
  label: string;
}

export interface PlotRefLine {
  orientation: "h" | "v";
  value: number;
  label?: string;
  dashed?: boolean;
}

export interface PlotShadedArea {
  seriesIndex: number;
  x0: number;
  x1: number;
  color?: string;
}

export interface PlotDomain {
  min: number;
  max: number;
}

export const PLOT_PADDING = { left: 44, right: 12, top: 12, bottom: 24 };

export function seriesExtent(series: readonly PlotSeries[]): {
  x: PlotDomain;
  y: PlotDomain;
} {
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const s of series) {
    for (const [x, y] of s.points) {
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
  }
  if (!isFinite(xMin)) {
    xMin = 0;
    xMax = 1;
  }
  if (!isFinite(yMin)) {
    yMin = 0;
    yMax = 1;
  }
  if (xMin === xMax) {
    xMin -= 1;
    xMax += 1;
  }
  if (yMin === yMax) {
    yMin -= 1;
    yMax += 1;
  }
  return { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } };
}

/** Adds ~8% breathing room on each side of a domain. */
export function padDomain(d: PlotDomain, fraction = 0.08): PlotDomain {
  const span = d.max - d.min;
  const pad = span * fraction;
  return { min: d.min - pad, max: d.max + pad };
}

/** "Nice" tick step (1/2/5 × 10^n) that produces roughly `targetCount` ticks. */
export function niceStep(span: number, targetCount: number): number {
  if (span <= 0) return 1;
  const raw = span / Math.max(1, targetCount);
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const residual = raw / magnitude;
  let niceResidual: number;
  if (residual < 1.5) niceResidual = 1;
  else if (residual < 3.5) niceResidual = 2;
  else if (residual < 7.5) niceResidual = 5;
  else niceResidual = 10;
  return niceResidual * magnitude;
}

export function ticksFor(d: PlotDomain, targetCount = 6): number[] {
  const step = niceStep(d.max - d.min, targetCount);
  const start = Math.ceil(d.min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= d.max + step * 1e-6; v += step) {
    ticks.push(Math.round(v / step) * step);
  }
  return ticks;
}

export function makeScale(
  domain: PlotDomain,
  pixelMin: number,
  pixelMax: number,
) {
  const span = domain.max - domain.min || 1;
  return (value: number) =>
    pixelMin + ((value - domain.min) / span) * (pixelMax - pixelMin);
}

export function makeInverseScale(
  domain: PlotDomain,
  pixelMin: number,
  pixelMax: number,
) {
  const span = pixelMax - pixelMin || 1;
  return (px: number) =>
    domain.min + ((px - pixelMin) / span) * (domain.max - domain.min);
}

/** Linear interpolation of a series' y value at a given x (points must be x-sorted). */
export function interpolateY(
  points: [number, number][],
  x: number,
): number | null {
  if (points.length === 0) return null;
  if (x <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    if (x >= x0 && x <= x1) {
      if (x1 === x0) return y0;
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return null;
}

export function formatTick(value: number): string {
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.01 || abs >= 100000)) return value.toExponential(1);
  const rounded = Math.round(value * 1000) / 1000;
  return rounded.toString();
}
