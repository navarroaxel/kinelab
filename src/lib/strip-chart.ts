import type { ColorPalette } from "@/lib/drawing";

export interface Sample {
  t: number;
  rDot: number;
  rThetaDot: number;
  at: number;
}

export type SampleField = "rDot" | "rThetaDot" | "at";

export const WINDOW_SECONDS = 10;
export const MAX_SAMPLES = 1200;
export const FILL_ALPHA = 0.18;
export const Y_DECAY = 0.985;

export interface Padding {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
export const PADDING: Padding = { left: 36, right: 8, top: 14, bottom: 18 };

/**
 * Smoothly-tracked Y max. Grows immediately to `target`, shrinks slowly by
 * `Y_DECAY` per frame to avoid flicker when a transient pops up and vanishes.
 * `floor` is a minimum so flat-line traces near zero don't look noisy.
 */
export function updateYMax(
  prev: number,
  target: number,
  floor: number,
): number {
  const desired = Math.max(target, floor);
  return desired >= prev ? desired : Math.max(prev * Y_DECAY, desired);
}

/** Map a (t, value) point to canvas pixel coordinates inside the plot area. */
function project(
  t: number,
  value: number,
  tNow: number,
  yMax: number,
  W: number,
  H: number,
  p: Padding,
): { x: number; y: number } {
  const plotW = W - p.left - p.right;
  const plotH = H - p.top - p.bottom;
  const tStart = tNow - WINDOW_SECONDS;
  const x = p.left + ((t - tStart) / WINDOW_SECONDS) * plotW;
  const midY = p.top + plotH / 2;
  const y = midY - (value / yMax) * (plotH / 2);
  return { x, y };
}

/** Draw axes, grid lines (every 1s on X, ±yMax/2 on Y), and Y/X tick labels. */
export function drawChartFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  tNow: number,
  yMax: number,
  yUnit: string,
  colors: ColorPalette,
): void {
  const p = PADDING;
  const plotH = H - p.top - p.bottom;
  const midY = p.top + plotH / 2;

  // Background bounding box
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1;
  ctx.strokeRect(p.left, p.top, W - p.left - p.right, plotH);

  // Vertical grid lines at every integer second within the window
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  const tStart = tNow - WINDOW_SECONDS;
  const firstSec = Math.ceil(tStart);
  const lastSec = Math.floor(tNow);
  ctx.beginPath();
  for (let s = firstSec; s <= lastSec; s++) {
    const { x } = project(s, 0, tNow, yMax, W, H, p);
    ctx.moveTo(x, p.top);
    ctx.lineTo(x, H - p.bottom);
  }
  ctx.stroke();

  // Y mid-lines at ±yMax/2
  ctx.beginPath();
  const yHalfUp = project(0, yMax / 2, tNow, yMax, W, H, p).y;
  const yHalfDn = project(0, -yMax / 2, tNow, yMax, W, H, p).y;
  ctx.moveTo(p.left, yHalfUp);
  ctx.lineTo(W - p.right, yHalfUp);
  ctx.moveTo(p.left, yHalfDn);
  ctx.lineTo(W - p.right, yHalfDn);
  ctx.stroke();

  // Y=0 axis line (stronger)
  ctx.strokeStyle = colors.axes;
  ctx.beginPath();
  ctx.moveTo(p.left, midY);
  ctx.lineTo(W - p.right, midY);
  ctx.stroke();

  // Tick labels
  ctx.fillStyle = colors.axes;
  ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(yMax.toFixed(0), p.left - 4, p.top + 6);
  ctx.fillText("0", p.left - 4, midY);
  ctx.fillText((-yMax).toFixed(0), p.left - 4, H - p.bottom - 6);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(yUnit, p.left + 2, p.top + 2);

  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(`t = ${tNow.toFixed(1)} s`, W - p.right - 2, H - 2);
}

/**
 * Draw one series: filled area toward y=0 (single closed polygon — lobes
 * above and below the axis are filled naturally), then stroke the curve.
 */
export function drawChartSeries(
  ctx: CanvasRenderingContext2D,
  samples: Sample[],
  field: SampleField,
  color: string,
  tNow: number,
  yMax: number,
  W: number,
  H: number,
): void {
  if (samples.length < 2) return;
  const p = PADDING;
  const plotH = H - p.top - p.bottom;
  const midY = p.top + plotH / 2;

  // Clip to the plot area so partial samples don't leak past the frame
  ctx.save();
  ctx.beginPath();
  ctx.rect(p.left, p.top, W - p.left - p.right, plotH);
  ctx.clip();

  // Filled area
  ctx.beginPath();
  const first = project(samples[0].t, samples[0][field], tNow, yMax, W, H, p);
  ctx.moveTo(first.x, midY);
  ctx.lineTo(first.x, first.y);
  for (let i = 1; i < samples.length; i++) {
    const s = samples[i];
    const pt = project(s.t, s[field], tNow, yMax, W, H, p);
    ctx.lineTo(pt.x, pt.y);
  }
  const last = project(samples[samples.length - 1].t, 0, tNow, yMax, W, H, p);
  ctx.lineTo(last.x, midY);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = FILL_ALPHA;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Stroked curve
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < samples.length; i++) {
    const s = samples[i];
    const pt = project(s.t, s[field], tNow, yMax, W, H, p);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

/** Largest absolute value among the given fields across the buffer. */
export function maxAbsValue(samples: Sample[], fields: SampleField[]): number {
  let m = 0;
  for (const s of samples) {
    for (const f of fields) {
      const v = Math.abs(s[f]);
      if (v > m) m = v;
    }
  }
  return m;
}
