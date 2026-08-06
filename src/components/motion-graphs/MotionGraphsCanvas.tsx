"use client";

import { useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import {
  makeScale,
  makeInverseScale,
  padDomain,
  ticksFor,
  formatTick,
  PLOT_PADDING,
  type PlotDomain,
} from "@/lib/plot";
import type { MotionVertex } from "@/types/simulator";

interface Props {
  vertices: MotionVertex[];
  tEnd: number;
  scrubT: number;
  onScrub: (t: number) => void;
  onMoveVertex: (index: number, t: number, v: number) => void;
}

const HIT_RADIUS = 12;

export function MotionGraphsCanvas({
  vertices,
  tEnd,
  scrubT,
  onScrub,
  onMoveVertex,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();
  const dragRef = useRef<
    { kind: "vertex"; index: number } | { kind: "scrub" } | null
  >(null);

  const domainsRef = useRef<{ x: PlotDomain; y: PlotDomain }>({
    x: { min: 0, max: 60 },
    y: { min: -10, max: 10 },
  });

  const computeDomains = useCallback(() => {
    const vs = vertices.map((v) => v.v);
    const xDomain = padDomain({ min: 0, max: Math.max(tEnd, 1) }, 0.04);
    const yDomain = padDomain(
      { min: Math.min(0, ...vs), max: Math.max(0, ...vs) },
      0.15,
    );
    domainsRef.current = { x: xDomain, y: yDomain };
  }, [vertices, tEnd]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    computeDomains();
    const { x: xDomain, y: yDomain } = domainsRef.current;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const colors: ColorPalette = isDark ? COLORS_DARK : COLORS;

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
    const xTicks = ticksFor(
      xDomain,
      Math.max(3, Math.round((right - left) / 70)),
    );
    const yTicks = ticksFor(
      yDomain,
      Math.max(3, Math.round((bottom - top) / 36)),
    );
    ctx.beginPath();
    for (const tick of xTicks) {
      ctx.moveTo(sx(tick), top);
      ctx.lineTo(sx(tick), bottom);
    }
    for (const tick of yTicks) {
      ctx.moveTo(left, sy(tick));
      ctx.lineTo(right, sy(tick));
    }
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (const tick of xTicks)
      ctx.fillText(formatTick(tick), sx(tick), bottom + 4);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (const tick of yTicks)
      ctx.fillText(formatTick(tick), left - 5, sy(tick));
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 1;
    ctx.strokeRect(left, top, right - left, bottom - top);
    ctx.restore();

    // Zero line
    if (yDomain.min < 0 && yDomain.max > 0) {
      ctx.save();
      ctx.strokeStyle = colors.axes;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(left, sy(0));
      ctx.lineTo(right, sy(0));
      ctx.stroke();
      ctx.restore();
    }

    // Polyline
    ctx.save();
    ctx.strokeStyle = colors.velocity;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    vertices.forEach((v, i) => {
      const px = sx(v.t);
      const py = sy(v.v);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();

    // Vertices
    vertices.forEach((v) => {
      ctx.save();
      ctx.fillStyle = colors.velocity;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx(v.t), sy(v.v), 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // Scrub marker
    const clampedScrub = Math.min(Math.max(scrubT, 0), tEnd);
    ctx.save();
    ctx.strokeStyle = colors.point;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx(clampedScrub), top);
    ctx.lineTo(sx(clampedScrub), bottom);
    ctx.stroke();
    ctx.restore();
  }, [vertices, tEnd, scrubT, computeDomains]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }, [render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = entry.contentRect;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
        render();
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  const toDomain = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const left = PLOT_PADDING.left;
    const right = rect.width - PLOT_PADDING.right;
    const top = PLOT_PADDING.top;
    const bottom = rect.height - PLOT_PADDING.bottom;
    const { x: xDomain, y: yDomain } = domainsRef.current;
    const invX = makeInverseScale(xDomain, left, right);
    const invY = makeInverseScale(yDomain, bottom, top);
    return { t: invX(screenX), v: invY(screenY), screenX, screenY, rect };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const domain = toDomain(e.clientX, e.clientY);
    if (!domain) return;
    const { x: xDomain, y: yDomain } = domainsRef.current;
    const left = PLOT_PADDING.left;
    const right = domain.rect.width - PLOT_PADDING.right;
    const top = PLOT_PADDING.top;
    const bottom = domain.rect.height - PLOT_PADDING.bottom;
    const sx = makeScale(xDomain, left, right);
    const sy = makeScale(yDomain, bottom, top);

    let hitIndex = -1;
    let hitDist = HIT_RADIUS;
    vertices.forEach((v, i) => {
      const dx = sx(v.t) - domain.screenX;
      const dy = sy(v.v) - domain.screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < hitDist) {
        hitDist = dist;
        hitIndex = i;
      }
    });

    if (hitIndex >= 0) {
      dragRef.current = { kind: "vertex", index: hitIndex };
    } else {
      dragRef.current = { kind: "scrub" };
      onScrub(Math.min(Math.max(domain.t, 0), tEnd));
    }
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const domain = toDomain(e.clientX, e.clientY);
    if (!domain) return;
    if (drag.kind === "vertex") {
      onMoveVertex(drag.index, domain.t, domain.v);
    } else {
      onScrub(Math.min(Math.max(domain.t, 0), tEnd));
    }
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{ width: "100%", aspectRatio: "16 / 9", touchAction: "none" }}
      className="cursor-crosshair rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t("motion-graphs.page.canvas_aria")}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}
