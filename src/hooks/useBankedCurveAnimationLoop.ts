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
  depth,
  drawOrientedBox3D,
  drawVector3D,
  fillPolygon3D,
  horizontalCircle,
  project,
  strokePolyline3D,
  type View3D,
} from "@/lib/projection3d";
import { add, scale, vec } from "@/lib/vec3";
import { computeBankedCurveState } from "@/lib/bankedCurveKinematics";
import type {
  BankedCurveParams,
  BankedCurveState,
  BankedCurveVisibility,
  Camera3D,
  Vec3,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Scene geometry. World units are metres and the car's circle sits at z = 0,
// so the banked surface is z = (r − ρ)·tan θ: it rises outward and drops
// inward, exactly as the road does.
//
// The track is drawn a generous 0.3ρ wide. At the statement's numbers a
// realistically narrow road would put the whole bank inside a couple of
// metres of rise over a 200 m circle and the tilt would be invisible.
// ---------------------------------------------------------------------------

const TRACK_WIDTH_FRACTION = 0.3;
const SEGMENTS = 72;
const DEG = Math.PI / 180;

const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators

interface Labels {
  normal: string;
  weight: string;
  friction: string;
  net: string;
  centre: string;
  slipUp: string;
  slipDown: string;
}

export function useBankedCurveAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: BankedCurveParams,
  visibility: BankedCurveVisibility,
  phaseRef: MutableRefObject<number>,
  cameraRef: MutableRefObject<Camera3D>,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: BankedCurveState) => void,
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
        normal: tr("bc.canvas.normal"),
        weight: tr("bc.canvas.weight"),
        friction: tr("bc.canvas.friction"),
        net: tr("bc.canvas.net"),
        centre: tr("bc.canvas.centre"),
        slipUp: tr("bc.canvas.slip_up"),
        slipDown: tr("bc.canvas.slip_down"),
      };
    }

    // Keeps running while paused so that orbiting the camera still repaints —
    // only the car stops going round.
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

      // Angular rate straight from v = ω·ρ, so the lap time you see on screen
      // is the real one for the chosen speed.
      const azimuth =
        (params.speed / Math.max(params.radius, 1e-9)) * phaseRef.current;
      const state = computeBankedCurveState(params, azimuth);

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

/** A point on the road surface at azimuth ψ and radius r. */
const surfacePoint = (
  psi: number,
  r: number,
  radius: number,
  theta: number,
): Vec3 =>
  vec(r * Math.cos(psi), r * Math.sin(psi), (r - radius) * Math.tan(theta));

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: BankedCurveParams,
  state: BankedCurveState,
  visibility: BankedCurveVisibility,
  cam: Camera3D,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const { radius, bankDeg } = params;
  const theta = bankDeg * DEG;
  const halfWidth = (radius * TRACK_WIDTH_FRACTION) / 2;
  const inner = radius - halfWidth;
  const outer = radius + halfWidth;

  const view: View3D = {
    cam,
    k: Math.min(W / (2.5 * outer), H / (1.9 * outer)),
    cx: W * 0.47,
    cy: H * 0.58,
  };

  // Force arrows are scaled so that the weight always draws about a fifth of
  // the circle's radius — readable at any mass, gravity or track size.
  const forceScale =
    (0.22 * radius) / Math.max(params.mass * params.gravity, 1e-9);

  // --- the banked road, painter-ordered ring by ring -----------------------
  if (visibility.showTrack) {
    const quads: { pts: Vec3[]; d: number }[] = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const psi0 = (2 * Math.PI * i) / SEGMENTS;
      const psi1 = (2 * Math.PI * (i + 1)) / SEGMENTS;
      const pts = [
        surfacePoint(psi0, inner, radius, theta),
        surfacePoint(psi1, inner, radius, theta),
        surfacePoint(psi1, outer, radius, theta),
        surfacePoint(psi0, outer, radius, theta),
      ];
      quads.push({
        pts,
        d: pts.reduce((sum, p) => sum + depth(p, cam), 0) / 4,
      });
    }
    quads.sort((a, b) => b.d - a.d);
    for (const quad of quads) {
      fillPolygon3D(ctx, quad.pts, view, "rgba(120,126,134,0.5)");
    }
    // Kerbs.
    for (const r of [inner, outer]) {
      const edge: Vec3[] = [];
      for (let i = 0; i <= SEGMENTS; i++) {
        edge.push(
          surfacePoint((2 * Math.PI * i) / SEGMENTS, r, radius, theta),
        );
      }
      strokePolyline3D(ctx, edge, view, colors.axes, 1.6);
    }
  }

  // --- the car's own circular path ----------------------------------------
  if (visibility.showPath) {
    strokePolyline3D(
      ctx,
      horizontalCircle(0, radius, SEGMENTS),
      view,
      colors.trajectory,
      1.6,
      [6, 5],
    );
  }

  if (visibility.showAxes) {
    strokePolyline3D(
      ctx,
      [vec(0, 0, -halfWidth), vec(0, 0, radius * 0.5)],
      view,
      colors.axes,
      1,
      [4, 4],
    );
    const centre = project(vec(0, 0, 0), view);
    drawDot(ctx, centre.x, centre.y, 3, colors.pole);
    drawLabel(ctx, labels.centre, centre.x, centre.y - 14, colors.pole);
  }

  // --- the car ------------------------------------------------------------
  const psi = state.azimuth;
  const cosPsi = Math.cos(psi);
  const sinPsi = Math.sin(psi);

  // Local frame at the contact point: tangent (direction of travel), up-slope
  // (outward along the road surface) and the surface normal.
  const tangent = vec(-sinPsi, cosPsi, 0);
  const upSlope = vec(
    cosPsi * Math.cos(theta),
    sinPsi * Math.cos(theta),
    Math.sin(theta),
  );
  const surfaceNormal = vec(
    -cosPsi * Math.sin(theta),
    -sinPsi * Math.sin(theta),
    Math.cos(theta),
  );
  const inward = vec(-cosPsi, -sinPsi, 0);

  const contact = vec(radius * cosPsi, radius * sinPsi, 0);
  const carHalf = radius * 0.032;
  drawOrientedBox3D(
    ctx,
    add(contact, scale(surfaceNormal, carHalf * 0.7)),
    [tangent, upSlope, surfaceNormal],
    [carHalf * 2, carHalf, carHalf * 0.7],
    view,
    state.slipping ? "rgba(232,89,60,0.75)" : "rgba(200,64,52,0.7)",
    colors.axes,
  );

  // --- free body at the contact point -------------------------------------
  if (visibility.showForces) {
    drawVector3D(
      ctx,
      contact,
      scale(surfaceNormal, state.normal),
      forceScale,
      view,
      colors.normalForce,
      labels.normal,
    );
    drawVector3D(
      ctx,
      contact,
      vec(0, 0, -params.mass * params.gravity),
      forceScale,
      view,
      colors.weight,
      labels.weight,
    );
    // f > 0 means the road pushes the car down the slope.
    drawVector3D(
      ctx,
      contact,
      scale(upSlope, -state.friction),
      forceScale,
      view,
      colors.coriolis,
      labels.friction,
    );
  }

  if (visibility.showNet) {
    drawVector3D(
      ctx,
      contact,
      scale(inward, state.netForce),
      forceScale,
      view,
      colors.acceleration,
      labels.net,
    );
  }

  if (state.slipping) {
    drawLabel(
      ctx,
      state.slipsUphill ? labels.slipUp : labels.slipDown,
      W * 0.5,
      22,
      colors.point,
      true,
    );
  }
}
