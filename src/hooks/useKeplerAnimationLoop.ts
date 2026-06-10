"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";
import {
  orbitPosition,
  orbitRadius,
  nuDot,
  orbitVelocity,
  orbitSpeed,
  R_MARS,
  type MissionData,
  type OrbitData,
} from "@/lib/keplerKinematics";
import {
  drawArrow,
  drawLabel,
  drawDot,
  keplerScale,
  worldToScreenKepler,
} from "@/lib/drawing";
import type {
  KeplerParams,
  KeplerVisibility,
  KeplerMetrics,
} from "@/types/simulator";

// Deterministic star field: 80 dots at fixed fractional canvas positions
const STARS = Array.from({ length: 80 }, (_, i) => {
  const s1 = (i * 1_664_525 + 1_013_904_223) & 0x7fff_ffff;
  const s2 = (s1 * 1_664_525 + 1_013_904_223) & 0x7fff_ffff;
  const s3 = (s2 * 1_664_525 + 1_013_904_223) & 0x7fff_ffff;
  return {
    xf: s1 / 0x7fff_ffff,
    yf: s2 / 0x7fff_ffff,
    r: 0.5 + (s3 % 3) * 0.5,
  };
});

type TracePoint = { x: number; y: number };

function currentOrbit(phase: number, m: MissionData): OrbitData {
  if (phase === 1) return m.orbit1;
  if (phase === 2) return m.orbit2;
  if (phase === 3) return m.hyperbola;
  return m.orbit0;
}

export function useKeplerAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: KeplerParams,
  visibility: KeplerVisibility,
  nuRef: MutableRefObject<number>,
  phaseRef: MutableRefObject<number>,
  missionRef: MutableRefObject<MissionData>,
  onMetrics: (m: KeplerMetrics) => void,
  paused: boolean,
  resetCount: number,
): void {
  const { t } = useLanguage();
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);
  const traceRef = useRef<TracePoint[]>([]);
  const sweepRef = useRef<TracePoint[]>([]); // for area-sweep visualisation
  const lastSweepTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    traceRef.current = [];
    sweepRef.current = [];

    if (paused) {
      const m = missionRef.current;
      const orbit = currentOrbit(phaseRef.current, m);
      const r = orbitRadius(orbit, nuRef.current);
      const pos = orbitPosition(orbit, nuRef.current);
      renderKepler(
        ctx,
        canvas,
        pos,
        r,
        phaseRef.current,
        m,
        params,
        visibility,
        traceRef.current,
        sweepRef.current,
        tRef.current,
      );
      onMetrics(buildMetrics(phaseRef.current, r, orbit, m));
      return;
    }

    function frame(now: number) {
      const dt =
        lastTimeRef.current !== null
          ? Math.min((now - lastTimeRef.current) / 1000, 0.05)
          : 0;
      lastTimeRef.current = now;

      const m = missionRef.current;
      const phase = phaseRef.current;
      let nu = nuRef.current;
      const orbit = currentOrbit(phase, m);

      if (dt > 0) {
        const r = orbitRadius(orbit, nu);
        const dndt = nuDot(orbit, r) * params.animSpeed;
        nu += dndt * dt;
        nuRef.current = nu;

        // Phase transitions
        if (phase === 0 && nu >= 2 * Math.PI) {
          phaseRef.current = 1;
          nuRef.current = 0;
          traceRef.current = [];
          sweepRef.current = [];
        } else if (phase === 1 && nu >= Math.PI) {
          phaseRef.current = 2;
          nuRef.current = Math.PI;
          traceRef.current = [];
          sweepRef.current = [];
        } else if (phase === 2 && nu >= 2 * Math.PI) {
          phaseRef.current = 3;
          nuRef.current = 0;
          traceRef.current = [];
          sweepRef.current = [];
        } else if (phase === 3 && nu >= m.nuMax * 0.92) {
          // Approaching asymptote — reset cycle
          phaseRef.current = 0;
          nuRef.current = 0;
          traceRef.current = [];
          sweepRef.current = [];
        }
      }

      const phase2 = phaseRef.current;
      const nu2 = nuRef.current;
      const orbit2 = currentOrbit(phase2, missionRef.current);
      const r2 = orbitRadius(orbit2, nu2);
      const pos = orbitPosition(orbit2, nu2);

      // Trace buffer
      if (visibility.showTrace) {
        traceRef.current.push({ x: pos.x, y: pos.y });
        if (traceRef.current.length > 600) traceRef.current.shift();
      } else {
        traceRef.current = [];
      }

      // Area-sweep buffer (sampled less frequently)
      if (visibility.showAreaSweep) {
        if (now - lastSweepTime.current > 150) {
          sweepRef.current.push({ x: pos.x, y: pos.y });
          if (sweepRef.current.length > 24) sweepRef.current.shift();
          lastSweepTime.current = now;
        }
      } else {
        sweepRef.current = [];
      }

      renderKepler(
        ctx!,
        canvas!,
        pos,
        r2,
        phase2,
        missionRef.current,
        params,
        visibility,
        traceRef.current,
        sweepRef.current,
        tRef.current,
      );

      if (now - lastMetricUpdate.current > 66) {
        onMetrics(buildMetrics(phase2, r2, orbit2, missionRef.current));
        lastMetricUpdate.current = now;
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
// Metrics builder
// ---------------------------------------------------------------------------

function buildMetrics(
  phase: number,
  r: number,
  orbit: OrbitData,
  m: MissionData,
): KeplerMetrics {
  return {
    phase,
    altitudeKm: Math.max(0, r - R_MARS),
    speedKms: orbitSpeed(orbit, r),
    vFinalKms: m.vFinal,
    orbit1THr: m.orbit1.T / 3600,
    orbit2THr: m.orbit2.T / 3600,
    h1Kms: m.orbit1.h,
    h2Kms: m.orbit2.h,
  };
}

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

function renderKepler(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  pos: { x: number; y: number },
  r: number,
  phase: number,
  m: MissionData,
  params: KeplerParams,
  visibility: KeplerVisibility,
  trace: TracePoint[],
  sweep: TracePoint[],
  t: (key: TranslationKey) => string,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;
  const dark = document.documentElement.classList.contains("dark");
  const S = keplerScale(W);

  const sc = (wx: number, wy: number) => worldToScreenKepler(wx, wy, W, H, S);

  // ── Clear ──────────────────────────────────────────────────────────────────
  ctx.clearRect(0, 0, W, H);

  // ── Stars ─────────────────────────────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.12)";
  for (const star of STARS) {
    ctx.beginPath();
    ctx.arc(star.xf * W, star.yf * H, star.r, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();

  // ── Orbit ellipses ─────────────────────────────────────────────────────────
  if (visibility.showOrbits) {
    drawOrbitCurve(
      ctx,
      m.orbit0,
      sc,
      dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)",
      0,
      2 * Math.PI,
      false,
    );
    drawOrbitCurve(
      ctx,
      m.orbit1,
      sc,
      dark ? "rgba(100,160,245,0.55)" : "rgba(59,139,212,0.65)",
      0,
      Math.PI,
      false,
    );
    drawOrbitCurve(
      ctx,
      m.orbit2,
      sc,
      dark ? "rgba(175,115,240,0.55)" : "rgba(120,60,185,0.65)",
      Math.PI,
      2 * Math.PI,
      false,
    );
    if (phase === 3) {
      drawOrbitCurve(
        ctx,
        m.hyperbola,
        sc,
        dark ? "rgba(250,185,55,0.65)" : "rgba(215,145,30,0.75)",
        0,
        m.nuMax * 0.9,
        true,
      );
    }
  }

  // ── Manoeuvre point markers ────────────────────────────────────────────────
  const pA = sc(m.orbit1.p / (1 + m.orbit1.e), 0); // nu=0 on orbit1 = A
  const pB = sc(-m.orbit1.p / (1 - m.orbit1.e), 0); // nu=π on orbit1 = B
  const pC = sc(m.orbit2.p / (1 + m.orbit2.e), 0); // nu=0 on orbit2 = C

  const markerColor = dark ? "#E0E0E0" : "#444444";
  drawManoeuvrePoint(ctx, pA.x, pA.y, "A", markerColor);
  drawManoeuvrePoint(ctx, pB.x, pB.y, "B", markerColor);
  drawManoeuvrePoint(ctx, pC.x, pC.y, "C", markerColor);

  // ── Spacecraft trail ───────────────────────────────────────────────────────
  if (visibility.showTrace && trace.length > 1) {
    ctx.save();
    ctx.strokeStyle = dark ? "rgba(255,228,90,0.30)" : "rgba(200,150,0,0.30)";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.globalAlpha = 1;
    ctx.beginPath();
    const p0 = sc(trace[0].x, trace[0].y);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < trace.length; i++) {
      const pi = sc(trace[i].x, trace[i].y);
      ctx.lineTo(pi.x, pi.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // ── Area sweep ─────────────────────────────────────────────────────────────
  if (visibility.showAreaSweep && sweep.length > 1) {
    const mars = sc(0, 0);
    ctx.save();
    ctx.fillStyle = dark ? "rgba(60,220,180,0.18)" : "rgba(0,175,140,0.13)";
    ctx.strokeStyle = dark ? "rgba(60,220,180,0.45)" : "rgba(0,175,140,0.40)";
    ctx.lineWidth = 1;
    for (let i = 1; i < sweep.length; i++) {
      const p0 = sc(sweep[i - 1].x, sweep[i - 1].y);
      const p1 = sc(sweep[i].x, sweep[i].y);
      ctx.beginPath();
      ctx.moveTo(mars.x, mars.y);
      ctx.lineTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── Mars ──────────────────────────────────────────────────────────────────
  const mars = sc(0, 0);
  const marsR = R_MARS * S;
  // Atmosphere glow
  const grd = ctx.createRadialGradient(
    mars.x,
    mars.y,
    marsR * 0.8,
    mars.x,
    mars.y,
    marsR * 1.35,
  );
  grd.addColorStop(0, dark ? "rgba(200,90,50,0.25)" : "rgba(180,70,30,0.20)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(mars.x, mars.y, marsR * 1.35, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  // Planet body
  drawDot(
    ctx,
    mars.x,
    mars.y,
    Math.max(marsR, 6),
    dark ? "#D06040" : "#CD5C3A",
    dark ? "#8B3020" : "#8B3A20",
  );
  drawLabel(
    ctx,
    "Mars",
    mars.x - marsR - 22,
    mars.y,
    dark ? "#D0A090" : "#8B3A20",
  );

  // ── Velocity arrow ─────────────────────────────────────────────────────────
  if (visibility.showVelocity) {
    const orbit = currentOrbit(phase, m);
    const nu = (() => {
      // find nu from pos (approximate: use phase and nuRef is not accessible here)
      // We derive nu from the position — but we have pos directly so just use it
      return Math.atan2(pos.y, pos.x);
    })();
    const vel = orbitVelocity(orbit, nu);
    const vMag = Math.hypot(vel.vx, vel.vy);
    if (vMag > 0) {
      const arrowScale = 40 * S; // visual length per (km/s)
      const spSc = sc(pos.x, pos.y);
      const endX = spSc.x + (vel.vx / vMag) * vMag * arrowScale;
      const endY = spSc.y - (vel.vy / vMag) * vMag * arrowScale; // Y flip
      drawArrow(
        ctx,
        spSc.x,
        spSc.y,
        endX,
        endY,
        dark ? "#5DCAA5" : "#1D9E75",
        2,
      );
      drawLabel(ctx, "v", endX + 8, endY - 8, dark ? "#5DCAA5" : "#1D9E75");
    }
  }

  // ── Spacecraft ────────────────────────────────────────────────────────────
  const spSc = sc(pos.x, pos.y);
  // Glow halo
  const spGrd = ctx.createRadialGradient(spSc.x, spSc.y, 0, spSc.x, spSc.y, 8);
  spGrd.addColorStop(0, dark ? "rgba(255,240,120,0.9)" : "rgba(255,215,0,0.9)");
  spGrd.addColorStop(1, "rgba(255,200,0,0)");
  ctx.save();
  ctx.fillStyle = spGrd;
  ctx.beginPath();
  ctx.arc(spSc.x, spSc.y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  drawDot(ctx, spSc.x, spSc.y, 4, dark ? "#FFE45A" : "#FFD700", "#fff");

  // ── Phase banner ──────────────────────────────────────────────────────────
  const phaseLabels = [
    t("kepler.phase.circular"),
    t("kepler.phase.transfer1"),
    t("kepler.phase.transfer2"),
    t("kepler.phase.escape"),
  ];
  const phaseColors = [
    dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)",
    dark ? "rgba(100,160,245,0.25)" : "rgba(59,139,212,0.20)",
    dark ? "rgba(175,115,240,0.25)" : "rgba(120,60,185,0.20)",
    dark ? "rgba(250,185,55,0.30)" : "rgba(215,145,30,0.25)",
  ];
  ctx.save();
  ctx.fillStyle = phaseColors[phase];
  ctx.beginPath();
  ctx.roundRect(8, 8, 160, 26, 4);
  ctx.fill();
  ctx.fillStyle = dark ? "#E0E0E0" : "#333333";
  ctx.font = "11px sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(phaseLabels[phase], 14, 21);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Orbit curve drawing
// ---------------------------------------------------------------------------

function drawOrbitCurve(
  ctx: CanvasRenderingContext2D,
  orbit: OrbitData,
  sc: (wx: number, wy: number) => { x: number; y: number },
  color: string,
  nuStart: number,
  nuEnd: number,
  dashed: boolean,
): void {
  const steps = 240;
  const dNu = (nuEnd - nuStart) / steps;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  if (dashed) ctx.setLineDash([6, 5]);
  ctx.beginPath();

  let first = true;
  for (let i = 0; i <= steps; i++) {
    const nu = nuStart + i * dNu;
    const r = orbit.p / (1 + orbit.e * Math.cos(nu));
    if (r <= 0 || !isFinite(r)) continue;
    const wx = r * Math.cos(nu);
    const wy = r * Math.sin(nu);
    const p = sc(wx, wy);
    if (first) {
      ctx.moveTo(p.x, p.y);
      first = false;
    } else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Manoeuvre point helper
// ---------------------------------------------------------------------------

function drawManoeuvrePoint(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  label: string,
  color: string,
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sx, sy, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, label, sx + 10, sy - 10, color);
}
