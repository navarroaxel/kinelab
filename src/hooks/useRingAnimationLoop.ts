'use client'

import { useRef, useEffect, type RefObject, type MutableRefObject } from 'react'
import { rk4Step, computeRingState } from '@/lib/ringKinematics'
import {
  worldToScreen,
  drawGrid,
  drawAxes,
  drawLabel,
  drawDot,
  drawRing,
  drawTrace,
  drawWeightVector,
  drawNormalVector,
  drawVelocityVector,
  drawContactWarning,
  forceScale,
  velScale,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from '@/lib/drawing'
import { WINDOW_SECONDS, MAX_SAMPLES } from '@/lib/strip-chart'
import type {
  RingParams,
  RingSample,
  RingVisibility,
  RingKinematicState,
} from '@/types/simulator'

export function useRingAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: RingParams,
  visibility: RingVisibility,
  thetaRef: MutableRefObject<number>,
  thetaDotRef: MutableRefObject<number>,
  traceRef: MutableRefObject<{ x: number; y: number }[]>,
  tRef: MutableRefObject<number>,
  samplesRef: MutableRefObject<RingSample[]>,
  tickListenersRef: MutableRefObject<Set<() => void>>,
  onMetrics: (state: RingKinematicState) => void,
  paused: boolean,
): void {
  const lastTimeRef      = useRef<number | null>(null)
  const rafIdRef         = useRef<number>(0)
  const lastMetricUpdate = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = matchMedia('(prefers-color-scheme: dark)').matches
    const colors: ColorPalette = isDark ? COLORS_DARK : COLORS

    function frame(now: number) {
      const raw =
        lastTimeRef.current !== null
          ? Math.min((now - lastTimeRef.current) / 1000, 0.05)
          : 0
      const dt = paused ? 0 : raw
      lastTimeRef.current = now

      // RK4 integration of θ̈ = −(g/R)·sin θ
      if (dt > 0) {
        const next = rk4Step(
          thetaRef.current,
          thetaDotRef.current,
          dt,
          params.gravity,
          params.radius,
        )
        thetaRef.current    = next.theta
        thetaDotRef.current = next.thetaDot
      }

      const state = computeRingState(thetaRef.current, thetaDotRef.current, params)

      // Trace in screen coordinates
      if (visibility.showTrace) {
        const sc = worldToScreen(state.px, state.py, canvas!)
        traceRef.current.push(sc)
        if (traceRef.current.length > 400) traceRef.current.shift()
      }

      // Sample buffer for the energy strip chart (only when time advances)
      if (dt > 0) {
        tRef.current += dt
        samplesRef.current.push({ t: tRef.current, KE: state.KE, PE: state.PE })
        const cutoff = tRef.current - WINDOW_SECONDS
        while (samplesRef.current.length > 0 && samplesRef.current[0].t < cutoff) {
          samplesRef.current.shift()
        }
        if (samplesRef.current.length > MAX_SAMPLES) samplesRef.current.shift()
      }

      renderRing(ctx!, canvas!, state, params, visibility, traceRef.current, colors)

      // Drive subscribed renderers (energy strip chart, etc.) from this tick.
      for (const listener of tickListenersRef.current) {
        listener()
      }

      if (now - lastMetricUpdate.current > 66) {
        onMetrics(state)
        lastMetricUpdate.current = now
      }

      rafIdRef.current = requestAnimationFrame(frame)
    }

    rafIdRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      lastTimeRef.current = null
    }
  }, [params, visibility, paused]) // eslint-disable-line react-hooks/exhaustive-deps
}

function renderRing(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: RingKinematicState,
  params: RingParams,
  visibility: RingVisibility,
  trace: { x: number; y: number }[],
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1
  const W = canvas.width  / dpr
  const H = canvas.height / dpr

  ctx.clearRect(0, 0, W, H)

  const center = worldToScreen(0, 0, canvas)
  const pt     = worldToScreen(state.px, state.py, canvas)
  const bottom = worldToScreen(state.px, -params.radius, canvas)

  // ── Background ────────────────────────────────────────────────────────────
  drawGrid(ctx, W, H, 20, colors.grid)
  drawAxes(ctx, center.x, center.y, W, H, colors.axes)
  drawLabel(ctx, 'x', W - 12, center.y - 10, colors.axes)
  drawLabel(ctx, 'y', center.x + 10, 12, colors.axes)

  // ── Ring outline ──────────────────────────────────────────────────────────
  drawRing(ctx, center.x, center.y, params.radius, colors.ring)

  // ── Trace ─────────────────────────────────────────────────────────────────
  if (visibility.showTrace && trace.length > 1) {
    drawTrace(ctx, trace, colors.velocity)
  }

  // ── Contact-lost warning ──────────────────────────────────────────────────
  if (visibility.showCriticalMark && !state.hasContact) {
    drawContactWarning(ctx, center.x, center.y, params.radius, state.theta, colors.contactLost)
  }

  // ── Height dimension line (dashed vertical from bottom-of-ring up to P) ───
  if (state.h > 0.5) {
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = colors.axes
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.moveTo(bottom.x, bottom.y)
    ctx.lineTo(pt.x, bottom.y)
    ctx.moveTo(pt.x, bottom.y)
    ctx.lineTo(pt.x, pt.y)
    ctx.stroke()
    ctx.restore()
    drawLabel(ctx, `h=${state.h.toFixed(0)}`, pt.x + 18, (bottom.y + pt.y) / 2, colors.axes, true)
  }

  // ── Force / velocity vectors ──────────────────────────────────────────────
  const fScale = forceScale(params.gravity)
  const vScale = velScale(params.radius)

  if (visibility.showNormal) {
    drawNormalVector(ctx, pt.x, pt.y, center.x, center.y, state.N, fScale, colors.normalForce)
  }
  if (visibility.showWeight) {
    drawWeightVector(ctx, pt.x, pt.y, params.gravity, fScale, colors.weight)
  }
  if (visibility.showVelocity) {
    drawVelocityVector(ctx, pt.x, pt.y, state.theta, state.thetaDot, params.radius, vScale, colors.velocity)
  }

  // ── Markers ──────────────────────────────────────────────────────────────
  drawDot(ctx, center.x, center.y, 4, colors.center)
  drawLabel(ctx, 'O', center.x + 10, center.y - 8, colors.center)

  drawDot(ctx, pt.x, pt.y, 10, colors.point, '#fff')
  drawLabel(ctx, 'P', pt.x + 14, pt.y - 12, colors.point)
}
