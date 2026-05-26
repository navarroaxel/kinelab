'use client'

import { useRef, useEffect, type RefObject, type MutableRefObject } from 'react'
import { solve } from '@/lib/quickReturnKinematics'
import {
  drawGrid,
  drawAxes,
  drawLabel,
  drawDot,
  drawArrow,
  drawHinge,
  drawTrajectory,
  quickReturnScale,
  worldToScreenQR,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from '@/lib/drawing'
import type { QuickReturnParams, QuickReturnState, QuickReturnVisibility } from '@/types/simulator'

export function useQuickReturnAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: QuickReturnParams,
  visibility: QuickReturnVisibility,
  phiRef: MutableRefObject<number>,
  onMetrics: (state: QuickReturnState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef      = useRef<number | null>(null)
  const rafIdRef         = useRef<number>(0)
  const lastMetricUpdate = useRef(0)
  const traceRef         = useRef<number[]>([]) // x-positions of P over time

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains('dark') ? COLORS_DARK : COLORS
      const state = solve(params, phiRef.current)
      renderQR(ctx, canvas, state, params, visibility, traceRef.current, colors)
      onMetrics(state)
      return
    }

    function frame(now: number) {
      const colors: ColorPalette = document.documentElement.classList.contains('dark') ? COLORS_DARK : COLORS
      const dt =
        lastTimeRef.current !== null
          ? Math.min((now - lastTimeRef.current) / 1000, 0.05)
          : 0
      lastTimeRef.current = now

      if (dt > 0) {
        phiRef.current += params.omega * dt
        phiRef.current = phiRef.current % (2 * Math.PI)
        if (phiRef.current < 0) phiRef.current += 2 * Math.PI
      }

      const state = solve(params, phiRef.current)

      if (visibility.showTrace) {
        traceRef.current.push(state.xP)
        if (traceRef.current.length > 500) traceRef.current.shift()
      } else {
        traceRef.current = []
      }

      renderQR(ctx!, canvas!, state, params, visibility, traceRef.current, colors)

      if (now - lastMetricUpdate.current > 66) {
        onMetrics(state)
        lastMetricUpdate.current = now
      }

      rafIdRef.current = requestAnimationFrame(frame)
    }

    // Clear trace on reset/param change
    traceRef.current = []

    rafIdRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      lastTimeRef.current = null
    }
  }, [params, visibility, paused, resetCount]) // eslint-disable-line react-hooks/exhaustive-deps
}

function renderQR(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: QuickReturnState,
  params: QuickReturnParams,
  visibility: QuickReturnVisibility,
  trace: number[],
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1
  const W = canvas.width  / dpr
  const H = canvas.height / dpr

  ctx.clearRect(0, 0, W, H)

  const scale = quickReturnScale(W, H, params.L1)
  const sc = (wx: number, wy: number) => worldToScreenQR(wx, wy, W, H, scale)

  const oSc = sc(state.xO, state.yO)  // fixed pivot O
  const aSc = sc(state.xA, state.yA)  // crank centre A
  const bSc = sc(state.xB, state.yB)  // crank pin B
  const pSc = sc(state.xP, state.yP)  // tool slider P
  const dSc = sc(state.xD, state.yD)  // reference point D
  const qSc = sc(state.xQ, state.yQ)  // bar far end Q

  // Horizontal slot extents
  const slotLeft  = sc(-params.L1 * 0.65, params.L1)
  const slotRight = sc( params.L1 * 0.65, params.L1)

  // ── Background ─────────────────────────────────────────────────────────────
  drawGrid(ctx, W, H, 20, colors.grid)
  drawAxes(ctx, oSc.x, oSc.y, W, H, colors.axes)
  drawLabel(ctx, 'x', W - 12, oSc.y - 10, colors.axes)
  drawLabel(ctx, 'y', oSc.x + 10, 12, colors.axes)

  // ── Guides ─────────────────────────────────────────────────────────────────
  if (visibility.showGuides) {
    // Dashed circle: crank path of B around A
    drawTrajectory(ctx, aSc.x, aSc.y, params.r * scale, colors.trajectory)

    // Vertical dashed line from O through A (the axis of symmetry)
    ctx.save()
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = colors.axes
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.moveTo(oSc.x, H)
    ctx.lineTo(oSc.x, 0)
    ctx.stroke()
    ctx.restore()
  }

  // ── Horizontal slot ────────────────────────────────────────────────────────
  ctx.save()
  ctx.strokeStyle = colors.axes
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(slotLeft.x,  pSc.y)
  ctx.lineTo(slotRight.x, pSc.y)
  ctx.stroke()
  // Slot end caps (hatch marks)
  ctx.lineWidth = 2
  for (let dx = -6; dx <= 6; dx += 4) {
    ctx.beginPath()
    ctx.moveTo(slotLeft.x + dx - 3,  pSc.y + 6)
    ctx.lineTo(slotLeft.x + dx,      pSc.y + 11)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(slotRight.x + dx - 3, pSc.y + 6)
    ctx.lineTo(slotRight.x + dx,     pSc.y + 11)
    ctx.stroke()
  }
  ctx.restore()
  drawLabel(ctx, 'L₁', oSc.x - 24, (oSc.y + pSc.y) / 2, colors.axes)

  // ── Tool trace (x positions mapped to slot height) ─────────────────────────
  if (visibility.showTrace && trace.length > 1) {
    ctx.save()
    ctx.strokeStyle = colors.velocity
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.35
    ctx.lineJoin = 'round'
    ctx.beginPath()
    const n = trace.length
    ctx.moveTo(sc(trace[0], params.L1).x, pSc.y)
    for (let i = 1; i < n; i++) {
      ctx.lineTo(sc(trace[i], params.L1).x, pSc.y)
    }
    ctx.stroke()
    ctx.restore()
  }

  // ── Oscillating bar OQ ──────────────────────────────────────────────────────
  ctx.save()
  ctx.strokeStyle = colors.normalForce
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(oSc.x, oSc.y)
  ctx.lineTo(qSc.x, qSc.y)
  ctx.stroke()
  ctx.restore()

  // ── Crank AB ────────────────────────────────────────────────────────────────
  ctx.save()
  ctx.strokeStyle = colors.rVector
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(aSc.x, aSc.y)
  ctx.lineTo(bSc.x, bSc.y)
  ctx.stroke()
  ctx.restore()

  // ── Dashed connector from B to P (along the bar, already drawn as OQ) ──────
  // B is on the bar — highlight the B→P segment with a dashed line
  ctx.save()
  ctx.setLineDash([4, 4])
  ctx.strokeStyle = colors.axes
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.moveTo(bSc.x, bSc.y)
  ctx.lineTo(pSc.x, pSc.y)
  ctx.stroke()
  ctx.restore()

  // ── Reference point D and its label ───────────────────────────────────────
  drawDot(ctx, dSc.x, dSc.y, 4, colors.center)
  drawLabel(ctx, 'D', dSc.x - 14, dSc.y - 8, colors.center)

  // Dashed vertical from O up to D
  if (visibility.showGuides) {
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = colors.axes
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.moveTo(oSc.x, oSc.y)
    ctx.lineTo(dSc.x, dSc.y)
    ctx.stroke()
    ctx.restore()
  }

  // ── Velocity arrow at P ────────────────────────────────────────────────────
  if (visibility.showVelocity) {
    const vLen = state.v * scale * 0.3
    if (Math.abs(vLen) > 3) {
      drawArrow(ctx, pSc.x, pSc.y, pSc.x + vLen, pSc.y, colors.velocity, 2)
      drawLabel(ctx, 'v', pSc.x + vLen + (vLen > 0 ? 8 : -8), pSc.y - 10, colors.velocity)
    }
  }

  // ── Acceleration arrow at P ────────────────────────────────────────────────
  if (visibility.showAcceleration) {
    const aLen = state.a * scale * 0.06
    if (Math.abs(aLen) > 3) {
      drawArrow(ctx, pSc.x, pSc.y + 16, pSc.x + aLen, pSc.y + 16, colors.acceleration, 2)
      drawLabel(ctx, 'a', pSc.x + aLen + (aLen > 0 ? 8 : -8), pSc.y + 16, colors.acceleration)
    }
  }

  // ── Crank pin B (slider block on bar) ─────────────────────────────────────
  drawSliderBlock(ctx, bSc.x, bSc.y, 10, colors.normalAccel)
  drawLabel(ctx, 'B', bSc.x + 14, bSc.y - 12, colors.normalAccel)

  // ── Tool slider P ──────────────────────────────────────────────────────────
  drawSliderBlock(ctx, pSc.x, pSc.y, 12, colors.point)
  drawLabel(ctx, 'P', pSc.x + 16, pSc.y - 14, colors.point)

  // ── Fixed pivot O ──────────────────────────────────────────────────────────
  drawHinge(ctx, oSc.x, oSc.y, colors.center)
  drawLabel(ctx, 'O', oSc.x - 18, oSc.y - 14, colors.center)

  // ── Crank centre A (fixed to ground) ──────────────────────────────────────
  drawDot(ctx, aSc.x, aSc.y, 5, colors.center)
  drawLabel(ctx, 'A', aSc.x + 8, aSc.y - 10, colors.center)
}

/** Draws a rectangular slider block centred at (cx, cy). */
function drawSliderBlock(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  half: number,
  color: string,
): void {
  ctx.save()
  ctx.fillStyle = color
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.rect(cx - half, cy - half, half * 2, half * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}
