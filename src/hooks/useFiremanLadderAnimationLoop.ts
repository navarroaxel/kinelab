"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  drawArrow,
  drawDot,
  drawLabel,
  drawLabelWithSubscript,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import {
  S_MAX,
  add,
  computeFiremanLadderState,
  norm,
  scale,
  vec,
} from "@/lib/firemanLadderKinematics";
import type {
  FiremanLadderCamera,
  FiremanLadderParams,
  FiremanLadderState,
  FiremanLadderVisibility,
  Vec3,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Scene geometry, in metres. The pivot A sits at the world origin; the truck
// hangs below it and the ground plane is lower still.
// ---------------------------------------------------------------------------

const GROUND_Z = -2.9;
const TRUCK_MIN = vec(-1.3, -7.2, -2.4);
const TRUCK_MAX = vec(1.3, 1.6, -0.6);
const TURNTABLE_Z = -0.55;
const TURNTABLE_R = 1.5;
const RAIL_HALF_WIDTH = 0.32;
const RUNG_SPACING = 1.2;
const AXIS_LENGTH = 6;
const GRID_HALF = 12;
const GRID_STEP = 2;
const TRACE_MAX = 420;

/** Metres per second of |v| drawn per metre of scene — keeps arrows readable. */
const VEL_SCALE = 0.85;
/** Metres per second² of |a| drawn per metre of scene. */
const ACC_SCALE = 0.7;

const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators

interface Labels {
  pointB: string;
  pivot: string;
  v: string;
  vTransport: string;
  vRel: string;
  a: string;
  aEuler: string;
  aCentripetal: string;
  aCoriolis: string;
  omega1: string;
  omega2: string;
  theta2: string;
}

interface Screen {
  x: number;
  y: number;
}

export function useFiremanLadderAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: FiremanLadderParams,
  visibility: FiremanLadderVisibility,
  phaseRef: MutableRefObject<number>,
  cameraRef: MutableRefObject<FiremanLadderCamera>,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: FiremanLadderState) => void,
): void {
  const { t } = useLanguage();
  const translateRef = useRef(t);
  useEffect(() => {
    translateRef.current = t;
  }, [t]);

  const onMetricsRef = useRef(onMetrics);
  useEffect(() => {
    onMetricsRef.current = onMetrics;
  }, [onMetrics]);

  const lastTimeRef = useRef<number | null>(null);
  const lastMetricUpdateRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const traceRef = useRef<Vec3[]>([]);

  // A fresh cycle starts from an empty trail.
  useEffect(() => {
    traceRef.current = [];
  }, [resetCount, params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function currentLabels(): Labels {
      const tr = translateRef.current;
      return {
        pointB: tr("fl.canvas.point_b"),
        pivot: tr("fl.canvas.pivot"),
        v: tr("fl.canvas.v"),
        vTransport: tr("fl.canvas.v_transport"),
        vRel: tr("fl.canvas.v_rel"),
        a: tr("fl.canvas.a"),
        aEuler: tr("fl.canvas.a_euler"),
        aCentripetal: tr("fl.canvas.a_centripetal"),
        aCoriolis: tr("fl.canvas.a_coriolis"),
        omega1: tr("fl.canvas.omega1"),
        omega2: tr("fl.canvas.omega2"),
        theta2: tr("fl.canvas.theta2"),
      };
    }

    // The loop keeps running while paused so that orbiting the camera still
    // repaints — only the simulation clock stops.
    function frame(now: number) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;

      const dt =
        lastTimeRef.current !== null
          ? Math.min((now - lastTimeRef.current) / 1000, 0.05)
          : 0;
      lastTimeRef.current = now;

      if (!paused && dt > 0) phaseRef.current += dt;

      const state = computeFiremanLadderState(params, phaseRef.current);
      const bWorld = rotZ(state.r, state.azimuth);

      if (!paused) {
        traceRef.current.push(bWorld);
        if (traceRef.current.length > TRACE_MAX) traceRef.current.shift();
      }

      render(
        ctx!,
        canvas!,
        state,
        bWorld,
        traceRef.current,
        visibility,
        cameraRef.current,
        colors,
        currentLabels(),
      );

      if (now - lastMetricUpdateRef.current > METRICS_INTERVAL_MS) {
        lastMetricUpdateRef.current = now;
        onMetricsRef.current(state);
      }

      rafIdRef.current = requestAnimationFrame(frame);
    }

    rafIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lastTimeRef.current = null;
    };
  }, [params, visibility, paused, resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}

// ---------------------------------------------------------------------------
// 3D helpers — local to this simulator, the way worldToScreenQR & friends are
// local to theirs.
// ---------------------------------------------------------------------------

/** Rotates a body-frame vector by the turret heading θ₁ about the vertical. */
function rotZ(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return vec(v.x * c - v.y * s, v.x * s + v.y * c, v.z);
}

interface View {
  cam: FiremanLadderCamera;
  k: number; // px per metre
  cx: number;
  cy: number;
}

/** Orthographic (axonometric) projection — no foreshortening by distance. */
function project(p: Vec3, view: View): Screen {
  const ca = Math.cos(view.cam.az);
  const sa = Math.sin(view.cam.az);
  const ce = Math.cos(view.cam.el);
  const se = Math.sin(view.cam.el);
  const right = -p.x * sa + p.y * ca;
  const inward = p.x * ca + p.y * sa;
  const up = p.z * ce - inward * se;
  return { x: view.cx + view.k * right, y: view.cy - view.k * up };
}

/** Camera-space depth, for painter-ordering the truck's faces. */
function depth(p: Vec3, cam: FiremanLadderCamera): number {
  const inward = p.x * Math.cos(cam.az) + p.y * Math.sin(cam.az);
  return inward * Math.cos(cam.el) + p.z * Math.sin(cam.el);
}

/** Samples a circular arc lying in the plane spanned by u1 and u2. */
function arcPoints(
  center: Vec3,
  u1: Vec3,
  u2: Vec3,
  radius: number,
  from: number,
  to: number,
  steps = 24,
): Vec3[] {
  const points: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = from + ((to - from) * i) / steps;
    points.push(
      add(
        center,
        add(
          scale(u1, radius * Math.cos(angle)),
          scale(u2, radius * Math.sin(angle)),
        ),
      ),
    );
  }
  return points;
}

function strokePolyline(
  ctx: CanvasRenderingContext2D,
  points: Vec3[],
  view: View,
  color: string,
  width: number,
  dash: number[] = [],
): void {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  points.forEach((p, i) => {
    const s = project(p, view);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.stroke();
  ctx.restore();
}

/** Draws a 3D vector anchored at `origin`, scaled into scene metres. */
function drawVector(
  ctx: CanvasRenderingContext2D,
  origin: Vec3,
  v: Vec3,
  factor: number,
  view: View,
  color: string,
  label: string,
): void {
  if (norm(v) < 1e-6) return;
  const tip = add(origin, scale(v, factor));
  const a = project(origin, view);
  const b = project(tip, view);
  drawArrow(ctx, a.x, a.y, b.x, b.y, color, 2.2, 9);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  drawLabelWithSubscript(
    ctx,
    label,
    b.x + (dx / len) * 14,
    b.y + (dy / len) * 12,
    color,
  );
}

const BOX_FACES: [number, number, number, number][] = [
  [0, 1, 3, 2], // z = min
  [4, 5, 7, 6], // z = max
  [0, 1, 5, 4], // y = min
  [2, 3, 7, 6], // y = max
  [0, 2, 6, 4], // x = min
  [1, 3, 7, 5], // x = max
];

/** Painter-ordered axis-aligned box. */
function drawBox(
  ctx: CanvasRenderingContext2D,
  min: Vec3,
  max: Vec3,
  view: View,
  fill: string,
  stroke: string,
): void {
  const corners: Vec3[] = [];
  for (const z of [min.z, max.z])
    for (const y of [min.y, max.y]) for (const x of [min.x, max.x])
      corners.push(vec(x, y, z));
  // corners index = x + 2y + 4z, matching BOX_FACES above.

  const faces = BOX_FACES.map((idx) => ({
    idx,
    d: idx.reduce((sum, i) => sum + depth(corners[i], view.cam), 0) / 4,
  })).sort((a, b) => b.d - a.d);

  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = stroke;
  for (const face of faces) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    face.idx.forEach((i, n) => {
      const s = project(corners[i], view);
      if (n === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: FiremanLadderState,
  bWorld: Vec3,
  trace: Vec3[],
  visibility: FiremanLadderVisibility,
  cam: FiremanLadderCamera,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const view: View = {
    cam,
    // Sized so that a fully extended, fully elevated ladder plus its vector
    // arrows still fit; the default configuration then fills the frame.
    k: Math.min(W / 40, H / 26),
    cx: W * 0.46,
    cy: H * 0.74,
  };

  const heading = state.azimuth;
  const toWorld = (v: Vec3) => rotZ(v, heading);

  // --- ground plane -------------------------------------------------------
  if (visibility.showGrid) {
    for (let i = -GRID_HALF; i <= GRID_HALF; i += GRID_STEP) {
      strokePolyline(
        ctx,
        [vec(i, -GRID_HALF, GROUND_Z), vec(i, GRID_HALF, GROUND_Z)],
        view,
        colors.grid,
        1,
      );
      strokePolyline(
        ctx,
        [vec(-GRID_HALF, i, GROUND_Z), vec(GRID_HALF, i, GROUND_Z)],
        view,
        colors.grid,
        1,
      );
    }
    // Ground shadow of B plus its plumb line — the only depth cue an
    // orthographic view can offer for a point floating in mid-air.
    strokePolyline(
      ctx,
      [bWorld, vec(bWorld.x, bWorld.y, GROUND_Z)],
      view,
      colors.trajectory,
      1,
      [3, 4],
    );
    const shadow = project(vec(bWorld.x, bWorld.y, GROUND_Z), view);
    drawDot(ctx, shadow.x, shadow.y, 2.5, colors.trajectory);
  }

  // --- truck --------------------------------------------------------------
  if (visibility.showTruck) {
    drawBox(ctx, TRUCK_MIN, TRUCK_MAX, view, "rgba(200,64,52,0.55)", colors.axes);
    // Turntable: a disc in the horizontal plane, drawn as a projected circle.
    const disc = arcPoints(
      vec(0, 0, TURNTABLE_Z),
      vec(1, 0, 0),
      vec(0, 1, 0),
      TURNTABLE_R,
      0,
      Math.PI * 2,
      36,
    );
    ctx.save();
    ctx.fillStyle = "rgba(128,135,128,0.45)";
    ctx.beginPath();
    disc.forEach((p, i) => {
      const s = project(p, view);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    strokePolyline(ctx, disc, view, colors.axes, 1.2);
  }

  // --- world axes and rotation arcs ---------------------------------------
  if (visibility.showAxes) {
    const origin = project(vec(0, 0, 0), view);
    const axes: [Vec3, string][] = [
      [vec(AXIS_LENGTH, 0, 0), "x"],
      [vec(0, AXIS_LENGTH, 0), "y"],
      [vec(0, 0, AXIS_LENGTH), "z"],
    ];
    for (const [dir, name] of axes) {
      const tip = project(dir, view);
      drawArrow(ctx, origin.x, origin.y, tip.x, tip.y, colors.axes, 1.4, 7);
      drawLabel(ctx, name, tip.x + 8, tip.y - 6, colors.axes);
    }

    // ω₁ — about the vertical axis, near the top of z.
    const spin1 = arcPoints(
      vec(0, 0, AXIS_LENGTH * 0.82),
      vec(1, 0, 0),
      vec(0, 1, 0),
      1.5,
      0,
      Math.PI * 1.5,
    );
    strokePolyline(ctx, spin1, view, colors.pole, 1.6);
    const spin1Tip = project(spin1[spin1.length - 1], view);
    drawLabel(ctx, labels.omega1, spin1Tip.x + 12, spin1Tip.y, colors.pole);

    // ω₂ — about the turret's elevation axis x̂, which the heading carries around.
    const xHat = toWorld(vec(1, 0, 0));
    const yHat = toWorld(vec(0, 1, 0));
    const spin2 = arcPoints(
      scale(xHat, 2.6),
      yHat,
      vec(0, 0, 1),
      1.1,
      -Math.PI * 0.35,
      Math.PI * 0.9,
    );
    strokePolyline(ctx, spin2, view, colors.pole, 1.6);
    const spin2Tip = project(spin2[spin2.length - 1], view);
    drawLabel(ctx, labels.omega2, spin2Tip.x + 12, spin2Tip.y, colors.pole);

    // θ₂ — from the horizontal to the ladder, inside the ladder plane.
    const theta2Arc = arcPoints(
      vec(0, 0, 0),
      yHat,
      vec(0, 0, 1),
      3,
      0,
      state.theta2,
    );
    strokePolyline(ctx, theta2Arc, view, colors.axes, 1.4);
    const mid = project(
      arcPoints(vec(0, 0, 0), yHat, vec(0, 0, 1), 3.7, 0, state.theta2, 2)[1],
      view,
    );
    drawLabel(ctx, labels.theta2, mid.x, mid.y, colors.axes);
  }

  // --- trail of B ---------------------------------------------------------
  if (visibility.showTrace && trace.length > 1) {
    // colors.trajectory is tuned for a flat 2D trail on a light background and
    // all but disappears here, so the 3D trail borrows the axis colour.
    strokePolyline(ctx, trace, view, colors.axes, 1.6);
  }

  // --- the ladder ---------------------------------------------------------
  const uWorld = toWorld(state.u);
  const railOffset = scale(toWorld(vec(1, 0, 0)), RAIL_HALF_WIDTH);
  const bodyEnd = scale(uWorld, state.s);
  // The fixed base section first, so the telescoping rails ride on top of it.
  strokePolyline(
    ctx,
    [vec(0, 0, 0), scale(uWorld, Math.min(state.s, S_MAX * 0.45))],
    view,
    colors.pole,
    7,
  );
  for (const sign of [1, -1]) {
    const off = scale(railOffset, sign);
    strokePolyline(
      ctx,
      [off, add(bodyEnd, off)],
      view,
      colors.rVector,
      3,
    );
  }
  for (let d = RUNG_SPACING; d < state.s; d += RUNG_SPACING) {
    const at = scale(uWorld, d);
    strokePolyline(
      ctx,
      [add(at, railOffset), add(at, scale(railOffset, -1))],
      view,
      colors.rVector,
      1.2,
    );
  }
  const pivot = project(vec(0, 0, 0), view);
  drawDot(ctx, pivot.x, pivot.y, 4, colors.pole);
  drawLabel(ctx, labels.pivot, pivot.x - 12, pivot.y + 10, colors.pole);

  const bScreen = project(bWorld, view);
  drawDot(ctx, bScreen.x, bScreen.y, 5, colors.point);
  drawLabel(ctx, labels.pointB, bScreen.x + 10, bScreen.y - 12, colors.point);

  // --- vectors at B -------------------------------------------------------
  if (visibility.showVelocityParts) {
    drawVector(
      ctx,
      bWorld,
      toWorld(state.vTransport),
      VEL_SCALE,
      view,
      colors.transverseVelocity,
      labels.vTransport,
    );
    drawVector(
      ctx,
      bWorld,
      toWorld(state.vRel),
      VEL_SCALE,
      view,
      colors.radialVelocity,
      labels.vRel,
    );
  }
  if (visibility.showVelocity) {
    drawVector(
      ctx,
      bWorld,
      toWorld(state.v),
      VEL_SCALE,
      view,
      colors.velocity,
      labels.v,
    );
  }
  if (visibility.showAccelParts) {
    drawVector(
      ctx,
      bWorld,
      toWorld(state.aEuler),
      ACC_SCALE,
      view,
      colors.euler,
      labels.aEuler,
    );
    drawVector(
      ctx,
      bWorld,
      toWorld(state.aCentripetal),
      ACC_SCALE,
      view,
      colors.normalAccel,
      labels.aCentripetal,
    );
    drawVector(
      ctx,
      bWorld,
      toWorld(state.aCoriolis),
      ACC_SCALE,
      view,
      colors.coriolis,
      labels.aCoriolis,
    );
  }
  if (visibility.showAccel) {
    drawVector(
      ctx,
      bWorld,
      toWorld(state.a),
      ACC_SCALE,
      view,
      colors.acceleration,
      labels.a,
    );
  }
}
