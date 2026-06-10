import type {
  KinematicState,
  SimulatorParams,
  VisibilityState,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Color palettes
// ---------------------------------------------------------------------------

export interface ColorPalette {
  rVector: string;
  radialVelocity: string;
  transverseVelocity: string;
  acceleration: string;
  normalAccel: string;
  pole: string;
  center: string;
  point: string;
  trajectory: string;
  grid: string;
  axes: string;
  // Ring simulator
  weight: string;
  normalForce: string;
  velocity: string;
  energyKE: string;
  energyPE: string;
  ring: string;
  contactLost: string;
  criticalSpeed: string;
}

export const COLORS: ColorPalette = {
  rVector: "#3B8BD4", // blue   — pole→point vector r
  radialVelocity: "#1D9E75", // green  — radial component ṙ·eᵣ
  transverseVelocity: "#E8593C", // coral  — transverse component rθ̇·eθ
  acceleration: "#9B59B6", // purple — polar acceleration components
  normalAccel: "#D97706", // amber  — centripetal (normal) acceleration
  pole: "#888780", // gray   — pole marker O'
  center: "#888780", // gray   — circle center O
  point: "#E8593C", // coral  — material point P
  trajectory: "rgba(0,0,0,0.12)",
  grid: "rgba(0,0,0,0.04)",
  axes: "rgba(0,0,0,0.25)",
  // Ring simulator
  weight: "#E8593C",
  normalForce: "#3B8BD4",
  velocity: "#1D9E75",
  energyKE: "#F5A623",
  energyPE: "#9B59B6",
  ring: "rgba(0,0,0,0.25)",
  contactLost: "rgba(232,89,60,0.15)",
  criticalSpeed: "#F5A623",
};

export const COLORS_DARK: ColorPalette = {
  rVector: "#85B7EB",
  radialVelocity: "#5DCAA5",
  transverseVelocity: "#F0997B",
  acceleration: "#AFA9EC",
  normalAccel: "#FCD34D", // amber  — centripetal (normal) acceleration
  pole: "#B4B2A9",
  center: "#B4B2A9",
  point: "#F0997B",
  trajectory: "rgba(255,255,255,0.15)",
  grid: "rgba(255,255,255,0.05)",
  axes: "rgba(255,255,255,0.30)",
  // Ring simulator
  weight: "#F0997B",
  normalForce: "#85B7EB",
  velocity: "#5DCAA5",
  energyKE: "#FCD34D",
  energyPE: "#C7A6F0",
  ring: "rgba(255,255,255,0.30)",
  contactLost: "rgba(240,153,123,0.20)",
  criticalSpeed: "#FCD34D",
};

// ---------------------------------------------------------------------------
// Vector scale helpers
// ---------------------------------------------------------------------------

/** Scale velocity vectors relative to circle radius so they stay visible at any ω. */
export const velScale = (radius: number) => radius / 150;

/** Scale acceleration vectors relative to circle radius. */
export const accScale = (radius: number) => radius / 280;

/** Fixed screen size (px) for the polar angle arc label. */
export const THETA_ARC_RADIUS = 28;

// ---------------------------------------------------------------------------
// Coordinate transform
// ---------------------------------------------------------------------------

/**
 * Converts world coordinates (Y up, origin at circle center) to canvas screen
 * coordinates (Y down). Circle center is at CX = W×0.45, CY = H×0.50.
 */
export function worldToScreen(
  worldX: number,
  worldY: number,
  canvas: HTMLCanvasElement,
): { x: number; y: number } {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;
  return {
    x: W * 0.45 + worldX,
    y: H * 0.5 - worldY, // flip Y: world Y up → screen Y down
  };
}

// ---------------------------------------------------------------------------
// Drawing primitives
// ---------------------------------------------------------------------------

/** Draws a background grid with the given step size. */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  step: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= W; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
  }
  for (let y = 0; y <= H; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Draws the X and Y Cartesian axes through (cx, cy). */
export function drawAxes(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  W: number,
  H: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(W, cy); // x-axis
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H); // y-axis
  ctx.stroke();
  ctx.restore();
}

/** Draws the circular trajectory as a dashed arc. */
export function drawTrajectory(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
): void {
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws an arrow from (x1,y1) to (x2,y2) with a solid arrowhead.
 * Skips rendering when both endpoints coincide.
 */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth = 1.5,
  headLen = 10,
): void {
  if (Math.abs(x2 - x1) < 0.5 && Math.abs(y2 - y1) < 0.5) return;

  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  // Shaft (stop short of the tip so arrowhead fills cleanly)
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - headLen * Math.cos(angle), y2 - headLen * Math.sin(angle));
  ctx.stroke();

  // Arrowhead triangle
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 6),
    y2 - headLen * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 6),
    y2 - headLen * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws a circular arc from 0 to screenTheta to represent the polar angle.
 * screenTheta is the canvas-space angle of the r vector (positive = clockwise).
 */
export function drawThetaArc(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  screenTheta: number,
  arcRadius: number,
  color: string,
): void {
  if (Math.abs(screenTheta) < 0.05) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  // anticlockwise when screenTheta < 0 to always draw the "short arc"
  ctx.arc(px, py, arcRadius, 0, screenTheta, screenTheta < 0);
  ctx.stroke();
  ctx.restore();
}

/** Draws the trace of the point path as a polyline. */
export function drawTrace(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  color: string,
): void {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.45;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Draws a text label, optionally with a semi-transparent background pill. */
export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  textColor: string,
  withBackground = false,
): void {
  ctx.save();
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (withBackground) {
    const w = ctx.measureText(text).width;
    const padX = 4;
    const padY = 2;
    ctx.fillStyle = "rgba(128,128,128,0.2)";
    ctx.beginPath();
    ctx.rect(x - w / 2 - padX, y - 7 - padY, w + 2 * padX, 14 + 2 * padY);
    ctx.fill();
  }

  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** Draws a filled circle (used for the point mass, pole, and center markers). */
export function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fillColor: string,
  strokeColor?: string,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = fillColor;
  ctx.fill();
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Main render entry point
// ---------------------------------------------------------------------------

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: KinematicState,
  params: SimulatorParams,
  visibility: VisibilityState,
  trace: { x: number; y: number }[],
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const center = worldToScreen(0, 0, canvas);
  const pt = worldToScreen(state.ptx, state.pty, canvas);
  const pole = worldToScreen(params.poleX, params.poleY, canvas);

  // ── Background ────────────────────────────────────────────────────────────
  drawGrid(ctx, W, H, 20, colors.grid);
  drawAxes(ctx, center.x, center.y, W, H, colors.axes);

  // Axis labels
  drawLabel(ctx, "x", W - 12, center.y - 10, colors.axes);
  drawLabel(ctx, "y", center.x + 10, 12, colors.axes);

  // ── Trajectory ────────────────────────────────────────────────────────────
  drawTrajectory(
    ctx,
    center.x,
    center.y,
    params.circleRadius,
    colors.trajectory,
  );

  // ── Trace ─────────────────────────────────────────────────────────────────
  if (visibility.showTrace && trace.length > 1) {
    drawTrace(ctx, trace, colors.rVector);
  }

  // ── Cartesian coordinate display ──────────────────────────────────────────
  if (visibility.showCartesian) {
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x, center.y); // vertical to x-axis
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(center.x, pt.y); // horizontal to y-axis
    ctx.stroke();
    ctx.restore();
    drawLabel(
      ctx,
      `x=${state.ptx.toFixed(0)}`,
      pt.x,
      center.y + 14,
      colors.axes,
      true,
    );
    drawLabel(
      ctx,
      `y=${state.pty.toFixed(0)}`,
      center.x - 28,
      pt.y,
      colors.axes,
      true,
    );
  }

  // ── r vector (pole → point) ───────────────────────────────────────────────
  if (visibility.showRVector) {
    drawArrow(ctx, pole.x, pole.y, pt.x, pt.y, colors.rVector, 2);

    // Theta arc uses the screen-space angle of the r vector
    const screenTheta = Math.atan2(pt.y - pole.y, pt.x - pole.x);
    drawThetaArc(
      ctx,
      pole.x,
      pole.y,
      screenTheta,
      THETA_ARC_RADIUS,
      colors.rVector,
    );

    // 'θ' label at arc midpoint
    const midAng = screenTheta / 2;
    drawLabel(
      ctx,
      "θ",
      pole.x + (THETA_ARC_RADIUS + 10) * Math.cos(midAng),
      pole.y + (THETA_ARC_RADIUS + 10) * Math.sin(midAng),
      colors.rVector,
    );

    // 'r' label at midpoint of the vector
    drawLabel(
      ctx,
      "r",
      (pole.x + pt.x) / 2 + 6,
      (pole.y + pt.y) / 2 - 6,
      colors.rVector,
      true,
    );
  }

  // ── Polar velocity vectors ────────────────────────────────────────────────
  if (visibility.showVelocity) {
    const vscale = velScale(params.circleRadius);
    const cosT = Math.cos(state.theta);
    const sinT = Math.sin(state.theta);

    // ṙ · eᵣ  — screen: eᵣ = (cosT, −sinT)
    const rDotEnd = {
      x: pt.x + state.rDot * vscale * cosT,
      y: pt.y - state.rDot * vscale * sinT,
    };
    drawArrow(ctx, pt.x, pt.y, rDotEnd.x, rDotEnd.y, colors.radialVelocity, 2);
    if (Math.abs(state.rDot) > 1) {
      drawLabel(ctx, "ṙ", rDotEnd.x + 5, rDotEnd.y - 5, colors.radialVelocity);
    }

    // rθ̇ · eθ  — screen: eθ = (−sinT, −cosT)
    const rThetaDotEnd = {
      x: pt.x + state.rThetaDot * vscale * -sinT,
      y: pt.y - state.rThetaDot * vscale * cosT,
    };
    drawArrow(
      ctx,
      pt.x,
      pt.y,
      rThetaDotEnd.x,
      rThetaDotEnd.y,
      colors.transverseVelocity,
      2,
    );
    if (Math.abs(state.rThetaDot) > 1) {
      drawLabel(
        ctx,
        "rθ̇",
        rThetaDotEnd.x + 5,
        rThetaDotEnd.y - 5,
        colors.transverseVelocity,
      );
    }
  }

  // ── Polar acceleration vectors ────────────────────────────────────────────
  if (visibility.showAcceleration) {
    const ascale = accScale(params.circleRadius);
    const cosT = Math.cos(state.theta);
    const sinT = Math.sin(state.theta);

    // aᵣ · eᵣ
    const arEnd = {
      x: pt.x + state.ar * ascale * cosT,
      y: pt.y - state.ar * ascale * sinT,
    };
    drawArrow(ctx, pt.x, pt.y, arEnd.x, arEnd.y, colors.acceleration, 2);
    if (Math.abs(state.ar) > 1) {
      drawLabel(ctx, "aᵣ", arEnd.x + 5, arEnd.y - 5, colors.acceleration);
    }

    // aθ · eθ
    const aoEnd = {
      x: pt.x + state.aTheta * ascale * -sinT,
      y: pt.y - state.aTheta * ascale * cosT,
    };
    drawArrow(ctx, pt.x, pt.y, aoEnd.x, aoEnd.y, colors.acceleration, 2);
    if (Math.abs(state.aTheta) > 1) {
      drawLabel(ctx, "aθ", aoEnd.x + 5, aoEnd.y - 5, colors.acceleration);
    }
  }

  // ── Normal (centripetal) acceleration vector ──────────────────────────────
  if (visibility.showNormalAccel) {
    const omega = (state.omega * Math.PI) / 180;
    const aMag = params.circleRadius * omega ** 2; // |aₙ| = R·ω²
    const ascale = accScale(params.circleRadius);
    // Direction: P → O (circle centre) in screen space
    const dx = center.x - pt.x;
    const dy = center.y - pt.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0.5) {
      const nx = dx / dist;
      const ny = dy / dist;
      const len = aMag * ascale;
      const anEnd = { x: pt.x + nx * len, y: pt.y + ny * len };
      drawArrow(ctx, pt.x, pt.y, anEnd.x, anEnd.y, colors.normalAccel, 2.5);
      drawLabel(ctx, "aₙ", anEnd.x + 5, anEnd.y - 5, colors.normalAccel);
    }
  }

  // ── Markers (drawn last so they appear on top) ────────────────────────────
  drawDot(ctx, center.x, center.y, 4, colors.center);
  drawLabel(ctx, "O", center.x + 8, center.y - 8, colors.center);

  drawDot(ctx, pole.x, pole.y, 6, colors.pole, "#fff");
  drawLabel(ctx, "O'", pole.x + 10, pole.y - 10, colors.pole);

  drawDot(ctx, pt.x, pt.y, 7, colors.point, "#fff");
  drawLabel(ctx, "P", pt.x + 10, pt.y - 10, colors.point);
}

// ---------------------------------------------------------------------------
// Pin-in-slot simulator helpers
// ---------------------------------------------------------------------------

/**
 * Returns the pixel scale factor so that the full extent (d + r) * margin
 * maps to 65% of the canvas width, keeping proportions intact.
 */
export function pinSlotScale(W: number, d: number, r: number): number {
  const maxExtent = (d + r) * 1.5;
  return (W * 0.65) / maxExtent;
}

/**
 * Maps pin-slot world coords to screen coords with O (pivot) at (W×0.28, H×0.50).
 * scale comes from pinSlotScale().
 */
export function worldToScreenPS(
  worldX: number,
  worldY: number,
  W: number,
  H: number,
  scale: number,
): { x: number; y: number } {
  return {
    x: W * 0.28 + worldX * scale,
    y: H * 0.5 - worldY * scale,
  };
}

// ---------------------------------------------------------------------------
// Quick-return mechanism simulator helpers
// ---------------------------------------------------------------------------

/**
 * Returns the pixel scale factor for the quick-return mechanism so that the
 * full vertical extent L1*1.2 maps to 85% of the canvas height.
 */
export function quickReturnScale(W: number, H: number, L1: number): number {
  return (H * 0.85) / (L1 * 1.2);
}

/**
 * Maps quick-return world coords to screen coords.
 * O (fixed pivot) is placed at (W×0.45, H×0.75).
 * scale comes from quickReturnScale().
 */
export function worldToScreenQR(
  worldX: number,
  worldY: number,
  W: number,
  H: number,
  scale: number,
): { x: number; y: number } {
  return {
    x: W * 0.45 + worldX * scale,
    y: H * 0.75 - worldY * scale,
  };
}

/**
 * Draws a hinge symbol: a filled circle with a small triangle below it,
 * representing a pinned pivot fixed to ground.
 */
export function drawHinge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
): void {
  const r = 6;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();

  // Small ground triangle below
  const h = 8;
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.lineTo(x - h, y + r + h);
  ctx.lineTo(x + h, y + r + h);
  ctx.closePath();
  ctx.stroke();

  // Hatching lines under triangle
  ctx.lineWidth = 1;
  for (let i = -h; i <= h; i += 4) {
    ctx.beginPath();
    ctx.moveTo(x + i - 3, y + r + h);
    ctx.lineTo(x + i, y + r + h + 4);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws a circular arc representing an angle from startAngle to endAngle
 * (both in screen/canvas space, i.e. 0 = right, CW positive).
 * Used for the Phi arc at A and the theta arc at O.
 */
export function drawAngleArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  arcRadius: number,
  startAngle: number,
  endAngle: number,
  color: string,
  label: string,
): void {
  const span = endAngle - startAngle;
  if (Math.abs(span) < 0.02) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(cx, cy, arcRadius, startAngle, endAngle, span < 0);
  ctx.stroke();
  ctx.restore();

  // Label at arc midpoint
  const midAngle = startAngle + span / 2;
  const labelR = arcRadius + 12;
  drawLabel(
    ctx,
    label,
    cx + labelR * Math.cos(midAngle),
    cy + labelR * Math.sin(midAngle),
    color,
  );
}

// ---------------------------------------------------------------------------
// Kepler / orbital mechanics simulator helpers
// ---------------------------------------------------------------------------

/**
 * Returns the pixel scale factor for the Kepler simulator.
 * Maps the apoapsis distance R_B = 103 400 km to 87% of the canvas width,
 * placing Mars at 92% from the left so that point B is near the left edge.
 */
export function keplerScale(W: number): number {
  return (W * 0.87) / 103_400;
}

/**
 * Maps Kepler world coords (km, Y up, Mars at origin) to screen coords.
 * Mars centre is placed at (W × 0.92, H × 0.50).
 */
export function worldToScreenKepler(
  worldX: number,
  worldY: number,
  W: number,
  H: number,
  scale: number,
): { x: number; y: number } {
  return {
    x: W * 0.92 + worldX * scale,
    y: H * 0.5 - worldY * scale,
  };
}

// ---------------------------------------------------------------------------
// Ring simulator drawing helpers
// ---------------------------------------------------------------------------

/** Scale force vectors (weight, normal) relative to gravity so they stay readable. */
export const forceScale = (g: number) => 60 / Math.max(g, 1);

/** Draws the ring as a solid circle outline. */
export function drawRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

/** Draws the weight vector (mg) as a downward arrow from the particle. */
export function drawWeightVector(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  g: number,
  scale: number,
  color: string,
): void {
  // Screen Y down ⇒ "down" is +y. Length proportional to g.
  const length = g * scale;
  drawArrow(ctx, px, py, px, py + length, color, 2);
  drawLabel(ctx, "mg", px + 8, py + length + 8, color);
}

/**
 * Draws the normal-force vector pointing from the particle toward the ring
 * centre. When N < 0 (constraint violated) the shaft is dashed.
 */
export function drawNormalVector(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  cx: number,
  cy: number,
  N: number,
  scale: number,
  color: string,
): void {
  const dx = cx - px;
  const dy = cy - py;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) return;
  const nx = dx / dist;
  const ny = dy / dist;
  const length = Math.abs(N) * scale;
  const endX = px + nx * length;
  const endY = py + ny * length;

  if (N < 0) {
    // Lost contact — draw a dashed shaft to flag the constraint violation.
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
  } else {
    drawArrow(ctx, px, py, endX, endY, color, 2);
  }
  drawLabel(ctx, "N", endX + 8, endY - 6, color);
}

/**
 * Draws the velocity vector tangent to the ring at the particle.
 * Tangent direction is +(cos θ, sin θ) in world coords (Y up) for CCW motion;
 * we flip sign with θ̇.
 */
export function drawVelocityVector(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  theta: number,
  thetaDot: number,
  R: number,
  scale: number,
  color: string,
): void {
  const speed = R * Math.abs(thetaDot);
  if (speed < 0.5) return;
  const dir = Math.sign(thetaDot) || 1;
  // World-space tangent = (cos θ, sin θ); screen Y flips, so screen tangent = (cos θ, −sin θ).
  const tx = dir * Math.cos(theta);
  const ty = dir * -Math.sin(theta);
  const length = speed * scale;
  const endX = px + tx * length;
  const endY = py + ty * length;
  drawArrow(ctx, px, py, endX, endY, color, 2);
  drawLabel(ctx, "v", endX + 6, endY - 6, color);
}

/**
 * Highlights the segment of the ring around the current angle with a soft red
 * fill when contact is lost (N < 0). Drawn as a tinted band over the ring arc.
 */
export function drawContactWarning(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  theta: number,
  fillColor: string,
): void {
  // Convert world angle (from bottom, CCW) to screen angle (from +x, CW).
  // World position of particle: (R sin θ, −R cos θ).
  // Screen angle relative to centre: atan2(screenY − cy, screenX − cx)
  //   = atan2(R cos θ, R sin θ) — since worldToScreen flips Y.
  const screenAng = Math.atan2(Math.cos(theta), Math.sin(theta));
  const span = Math.PI / 6; // 30° arc band
  ctx.save();
  ctx.lineWidth = 10;
  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, screenAng - span / 2, screenAng + span / 2);
  ctx.stroke();
  ctx.restore();
}
