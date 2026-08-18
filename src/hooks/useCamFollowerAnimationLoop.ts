"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  drawDot,
  drawLabel,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import {
  arcPoints,
  depth,
  drawBox3D,
  drawVector3D,
  fillPolygon3D,
  horizontalCircle,
  project,
  strokePolyline3D,
  type View3D,
} from "@/lib/projection3d";
import { vec } from "@/lib/vec3";
import {
  camHeight,
  computeCamFollowerState,
} from "@/lib/camFollowerKinematics";
import type {
  Camera3D,
  CamFollowerParams,
  CamFollowerState,
  CamFollowerVisibility,
  Vec3,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Scene geometry, in metres. The cam's mean surface sits at z = 0, so the
// follower's height *is* the state's z.
// ---------------------------------------------------------------------------

const CAM_BASE_Z = -0.22; // bottom face of the cam body
const SHAFT_BOTTOM_Z = -0.46;
const SHAFT_RADIUS = 0.022;
const ROLLER_RADIUS = 0.013;
const ROD_TOP_Z = 0.5;
const BEARING_Z0 = 0.29;
const BEARING_Z1 = 0.345;
const BEARING_HALF_X = 0.045;
const BEARING_Y0 = -0.05;
const BEARING_Y1 = 0.42;
const AXIS_TOP_Z = 0.6;
const CAM_SEGMENTS = 60;

/** Metres of arrow drawn per newton of force. */
const FORCE_SCALE = 0.012;
/** Sideways offset of the force arrows so they clear the rod. */
const FORCE_OFFSET_Y = 0.075;

const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators

interface Labels {
  pointA: string;
  pointB: string;
  bearing: string;
  normal: string;
  normalTrue: string;
  weight: string;
  thetaDot: string;
  contactLost: string;
}

export function useCamFollowerAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: CamFollowerParams,
  visibility: CamFollowerVisibility,
  phaseRef: MutableRefObject<number>,
  cameraRef: MutableRefObject<Camera3D>,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: CamFollowerState) => void,
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function currentLabels(): Labels {
      const tr = translateRef.current;
      return {
        pointA: tr("cf.canvas.point_a"),
        pointB: tr("cf.canvas.point_b"),
        bearing: tr("cf.canvas.bearing"),
        normal: tr("cf.canvas.normal"),
        normalTrue: tr("cf.canvas.normal_true"),
        weight: tr("cf.canvas.weight"),
        thetaDot: tr("cf.canvas.theta_dot"),
        contactLost: tr("cf.canvas.contact_lost"),
      };
    }

    // Keeps running while paused so that orbiting the camera still repaints —
    // only the cam stops turning.
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

      const theta = params.thetaDot * phaseRef.current;
      const state = computeCamFollowerState(params, theta);

      render(
        ctx!,
        canvas!,
        params,
        state,
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

/**
 * A point on the cam's rim at *world* azimuth ψ, for a cam turned by θ. The
 * follower stands still at ψ = 0, so its height is camHeight(θ) — exactly what
 * the physics module assumes.
 */
const rimPoint = (
  psi: number,
  theta: number,
  radius: number,
  amplitude: number,
): Vec3 =>
  vec(
    radius * Math.cos(psi),
    radius * Math.sin(psi),
    camHeight(psi + theta, amplitude),
  );

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: CamFollowerParams,
  state: CamFollowerState,
  visibility: CamFollowerVisibility,
  cam: Camera3D,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const view: View3D = {
    cam,
    k: Math.min(W / 0.9, H / 1.25),
    cx: W * 0.45,
    cy: H * 0.62,
  };

  const { radius, amplitude } = params;
  const theta = state.theta;

  // --- vertical axis and the drive shaft ----------------------------------
  if (visibility.showAxes) {
    strokePolyline3D(
      ctx,
      [vec(0, 0, SHAFT_BOTTOM_Z - 0.06), vec(0, 0, AXIS_TOP_Z)],
      view,
      colors.axes,
      1,
      [4, 4],
    );
    const spin = arcPoints(
      vec(0, 0, SHAFT_BOTTOM_Z + 0.07),
      vec(1, 0, 0),
      vec(0, 1, 0),
      SHAFT_RADIUS * 2.6,
      0,
      Math.PI * 1.55,
      28,
    );
    strokePolyline3D(ctx, spin, view, colors.pole, 1.6);
    const spinTip = project(spin[spin.length - 1], view);
    drawLabel(ctx, labels.thetaDot, spinTip.x + 16, spinTip.y, colors.pole);
  }

  // Shaft below the cam — two silhouette lines plus a closing disc.
  for (const side of [1, -1]) {
    strokePolyline3D(
      ctx,
      [
        vec(0, side * SHAFT_RADIUS, SHAFT_BOTTOM_Z),
        vec(0, side * SHAFT_RADIUS, CAM_BASE_Z),
      ],
      view,
      colors.axes,
      1.4,
    );
  }
  fillPolygon3D(
    ctx,
    horizontalCircle(SHAFT_BOTTOM_Z, SHAFT_RADIUS, 20),
    view,
    "rgba(150,150,150,0.5)",
    colors.axes,
  );

  // --- cam body -----------------------------------------------------------
  // The lateral surface as painter-ordered quads: the rim is a sine wave in
  // 3D, so a single silhouette polygon would fold over itself as you orbit.
  const quads: { pts: Vec3[]; d: number }[] = [];
  for (let i = 0; i < CAM_SEGMENTS; i++) {
    const psi0 = (2 * Math.PI * i) / CAM_SEGMENTS;
    const psi1 = (2 * Math.PI * (i + 1)) / CAM_SEGMENTS;
    const a = rimPoint(psi0, theta, radius, amplitude);
    const b = rimPoint(psi1, theta, radius, amplitude);
    const pts = [vec(a.x, a.y, CAM_BASE_Z), vec(b.x, b.y, CAM_BASE_Z), b, a];
    quads.push({
      pts,
      d: (depth(a, cam) + depth(b, cam)) / 2,
    });
  }
  quads.sort((p, q) => q.d - p.d);
  for (const quad of quads) {
    fillPolygon3D(ctx, quad.pts, view, "rgba(150,155,160,0.55)");
  }

  fillPolygon3D(
    ctx,
    horizontalCircle(CAM_BASE_Z, radius, 40),
    view,
    "rgba(120,125,130,0.5)",
    colors.axes,
  );

  // Top (contoured) face, and the rim highlighted as the cam profile.
  const rim: Vec3[] = [];
  for (let i = 0; i <= CAM_SEGMENTS; i++) {
    rim.push(
      rimPoint((2 * Math.PI * i) / CAM_SEGMENTS, theta, radius, amplitude),
    );
  }
  fillPolygon3D(ctx, rim, view, "rgba(190,195,200,0.55)");
  if (visibility.showProfile) {
    strokePolyline3D(ctx, rim, view, colors.rVector, 2.2);
  }

  // A material mark on the rim, so the rotation is visible at a glance.
  const markPsi = -theta;
  const markTop = rimPoint(markPsi, theta, radius, amplitude);
  strokePolyline3D(
    ctx,
    [markTop, vec(markTop.x, markTop.y, CAM_BASE_Z)],
    view,
    colors.pole,
    1.6,
  );

  // --- the follower -------------------------------------------------------
  const contact = vec(radius, 0, state.z);
  const rodTop = vec(radius, 0, ROD_TOP_Z);

  strokePolyline3D(
    ctx,
    [vec(radius, 0, state.z + ROLLER_RADIUS), rodTop],
    view,
    colors.point,
    5,
  );

  // Roller at A — a small circle standing in the vertical plane through the
  // contact, which is the plane the follower actually moves in.
  const radialDir = vec(1, 0, 0);
  const rollerCentre = vec(radius, 0, state.z + ROLLER_RADIUS);
  const roller = arcPoints(
    rollerCentre,
    radialDir,
    vec(0, 0, 1),
    ROLLER_RADIUS,
    0,
    Math.PI * 2,
    24,
  );
  fillPolygon3D(ctx, roller, view, "rgba(232,89,60,0.35)", colors.point, 1.4);

  const contactScreen = project(contact, view);
  drawLabel(
    ctx,
    labels.pointA,
    contactScreen.x + 22,
    contactScreen.y + 4,
    colors.point,
  );

  if (visibility.showFrame) {
    drawBox3D(
      ctx,
      vec(-BEARING_HALF_X, BEARING_Y0, BEARING_Z0),
      vec(BEARING_HALF_X + radius, BEARING_Y1, BEARING_Z1),
      view,
      "rgba(160,165,170,0.6)",
      colors.axes,
    );
    const bearingScreen = project(
      vec(-BEARING_HALF_X, BEARING_Y0, BEARING_Z1),
      view,
    );
    drawLabel(
      ctx,
      labels.bearing,
      bearingScreen.x - 16,
      bearingScreen.y,
      colors.axes,
    );
    const topScreen = project(rodTop, view);
    drawLabel(ctx, labels.pointB, topScreen.x + 14, topScreen.y, colors.point);
  }

  // --- slope of the cam surface at the contact ----------------------------
  if (visibility.showSlope) {
    // Tangent to the profile, in the vertical plane containing the follower:
    // one unit along the rim direction, dz/(r dψ) up.
    const tangentRise = amplitude * Math.cos(theta);
    const half = 0.055;
    const tangent = [
      vec(
        radius,
        -half,
        state.z - (half * tangentRise) / Math.max(radius, 1e-9),
      ),
      vec(
        radius,
        half,
        state.z + (half * tangentRise) / Math.max(radius, 1e-9),
      ),
    ];
    strokePolyline3D(ctx, tangent, view, colors.normalAccel, 1.8, [4, 3]);
  }

  // --- forces -------------------------------------------------------------
  if (visibility.showForces) {
    // Both forces act along the rod's own line, so drawing them there would
    // bury them inside it — they are shifted sideways, free-body-diagram
    // style, with a thin tie line back to the point they actually act on.
    const offset = FORCE_OFFSET_Y;
    const normalAnchor = vec(radius, -offset, state.z);
    strokePolyline3D(ctx, [contact, normalAnchor], view, colors.axes, 1, [
      2, 3,
    ]);
    drawVector3D(
      ctx,
      normalAnchor,
      vec(0, 0, state.normalVertical),
      FORCE_SCALE,
      view,
      colors.normalForce,
      labels.normal,
    );
    if (visibility.showSlope) {
      // True surface normal: tilted back against the rim direction by φ.
      const s = Math.sin(state.slope);
      const c = Math.cos(state.slope);
      drawVector3D(
        ctx,
        contact,
        vec(0, -s * state.normalMagnitude, c * state.normalMagnitude),
        FORCE_SCALE,
        view,
        colors.coriolis,
        labels.normalTrue,
      );
    }
    const weightAnchor = vec(radius, offset, (state.z + ROD_TOP_Z) / 2);
    strokePolyline3D(
      ctx,
      [vec(radius, 0, weightAnchor.z), weightAnchor],
      view,
      colors.axes,
      1,
      [2, 3],
    );
    drawVector3D(
      ctx,
      weightAnchor,
      vec(0, 0, -params.mass * params.gravity),
      FORCE_SCALE,
      view,
      colors.weight,
      labels.weight,
    );
  }

  const rollerScreen = project(rollerCentre, view);
  drawDot(ctx, rollerScreen.x, rollerScreen.y, 2.5, colors.point);

  if (state.contactLost) {
    drawLabel(ctx, labels.contactLost, W * 0.5, 22, colors.point, true);
  }
}
