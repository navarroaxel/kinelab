'use client'

import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react'
import { computeBarState } from '@/lib/barKinematics'
import {
  worldToScreen,
  drawGrid,
  drawAxes,
  drawArrow,
  drawDot,
  drawLabel,
  drawTrace,
  drawBar,
  drawRVector,
  drawGhostBars,
  drawEjectionVector,
  barVelScale,
  barAccScale,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from '@/lib/drawing'
import type {
  BarKinematicState,
  BarParams,
  BarVisibility,
} from '@/types/simulator'

// How many ghost-bar samples to keep, and how much θ must change before a new
// one is recorded. With 12 entries spread over half a turn the trail covers
// 180° and refreshes smoothly across ω in [0.5, 5].
const GHOST_MAX = 12
const GHOST_STEP_RAD = Math.PI / GHOST_MAX

export function useBarAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: BarParams,
  visibility: BarVisibility,
  tRef: MutableRefObject<number>,
  traceRef: MutableRefObject<{ x: number; y: number }[]>,
  ghostAnglesRef: MutableRefObject<number[]>,
  onMetrics: (state: BarKinematicState) => void,
  paused: boolean,
): void {
  const lastTimeRef       = useRef<number | null>(null)
  const rafIdRef          = useRef<number>(0)
  const lastMetricUpdate  = useRef(0)
  const lastGhostThetaRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = matchMedia('(prefers-color-scheme: dark)').matches
    const colors: ColorPalette = isDark ? COLORS_DARK : COLORS

    // Paused: render a single static frame from the frozen elapsed time.
    if (paused) {
      const state = computeBarState(tRef.current, params)
      renderBar(ctx, canvas, state, params, visibility, traceRef.current, ghostAnglesRef.current, colors)
      onMetrics(state)
      return
    }

    function frame(now: number) {
      const dt =
        lastTimeRef.current !== null
          ? Math.min((now - lastTimeRef.current) / 1000, 0.05)
          : 0
      lastTimeRef.current = now

      // Advance time and recompute state from the closed-form solution.
      if (dt > 0) tRef.current += dt
      let state = computeBarState(tRef.current, params)

      // Freeze at the ejection moment: roll back the just-applied dt so the
      // particle stays at the last valid in-bar position, but keep ejected=true
      // so the EJECTED overlay renders.
      if (state.ejected && dt > 0) {
        tRef.current -= dt
        state = { ...computeBarState(tRef.current, params), ejected: true }
      }

      // Lab-frame trace
      if (visibility.showTrace && !state.ejected) {
        const sc = worldToScreen(state.px, state.py, canvas!)
        traceRef.current.push(sc)
        if (traceRef.current.length > 600) traceRef.current.shift()
      }

      // Ghost bar history — sample at roughly even angular spacing.
      if (visibility.showRotatingFrame && !state.ejected) {
        const last = lastGhostThetaRef.current
        if (last === null || Math.abs(state.theta - last) >= GHOST_STEP_RAD) {
          ghostAnglesRef.current.push(state.theta)
          if (ghostAnglesRef.current.length > GHOST_MAX) ghostAnglesRef.current.shift()
          lastGhostThetaRef.current = state.theta
        }
      }

      renderBar(ctx!, canvas!, state, params, visibility, traceRef.current, ghostAnglesRef.current, colors)

      if (now - lastMetricUpdate.current > 66) {
        onMetrics(state)
        lastMetricUpdate.current = now
      }

      if (!state.ejected) {
        rafIdRef.current = requestAnimationFrame(frame)
      }
    }

    rafIdRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      lastTimeRef.current = null
      lastGhostThetaRef.current = null
    }
  }, [params, visibility, paused]) // eslint-disable-line react-hooks/exhaustive-deps
}

function renderBar(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: BarKinematicState,
  params: BarParams,
  visibility: BarVisibility,
  trace: { x: number; y: number }[],
  ghostAngles: number[],
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1
  const W = canvas.width  / dpr
  const H = canvas.height / dpr

  ctx.clearRect(0, 0, W, H)

  const pivot = worldToScreen(0, 0, canvas)
  const pt    = worldToScreen(state.px, state.py, canvas)

  // ── Background ────────────────────────────────────────────────────────────
  drawGrid(ctx, W, H, 20, colors.grid)
  drawAxes(ctx, pivot.x, pivot.y, W, H, colors.axes)
  drawLabel(ctx, 'x', W - 12, pivot.y - 10, colors.axes)
  drawLabel(ctx, 'y', pivot.x + 10, 12, colors.axes)

  // World θ (CCW from +x, Y up) → screen θ (CW from +x, Y down) is `-θ`.
  const screenTheta = -state.theta

  // ── Ghost bars (back layer) ───────────────────────────────────────────────
  if (visibility.showRotatingFrame && ghostAngles.length > 0) {
    const screenAngles = ghostAngles.map(a => -a)
    drawGhostBars(ctx, pivot.x, pivot.y, screenAngles, params.barLength, colors.ghostBar)
  }

  // ── Bar ────────────────────────────────────────────────────────────────────
  drawBar(ctx, pivot.x, pivot.y, screenTheta, params.barLength, colors.bar)

  // ── Lab-frame trace ───────────────────────────────────────────────────────
  if (visibility.showTrace && trace.length > 1) {
    drawTrace(ctx, trace, colors.rVectorBar)
  }

  // ── r vector (dashed) ─────────────────────────────────────────────────────
  drawRVector(ctx, pivot.x, pivot.y, pt.x, pt.y, colors.rVectorBar)
  drawLabel(ctx, `r=${state.r.toFixed(0)}`, (pivot.x + pt.x) / 2 + 8, (pivot.y + pt.y) / 2 - 8, colors.rVectorBar, true)

  // Polar basis vectors in screen coords (Y flip):
  //   eᵣ_screen = ( cosθ, −sinθ)
  //   eₒ_screen = (−sinθ, −cosθ)
  const cosT = Math.cos(state.theta)
  const sinT = Math.sin(state.theta)

  // ── Velocity components (ṙ along eᵣ, r·ω along eₒ) ───────────────────────
  if (visibility.showVelocityComponents && !state.ejected) {
    const vscale = barVelScale(params.barLength)
    // ṙ · eᵣ
    if (Math.abs(state.vr) > 0.5) {
      const vrEnd = {
        x: pt.x + state.vr * vscale * cosT,
        y: pt.y - state.vr * vscale * sinT,
      }
      drawArrow(ctx, pt.x, pt.y, vrEnd.x, vrEnd.y, colors.radialVel, 2)
      drawLabel(ctx, 'ṙ', vrEnd.x + 8, vrEnd.y - 4, colors.radialVel)
    }
    // r·ω · eₒ
    if (Math.abs(state.vt) > 0.5) {
      const vtEnd = {
        x: pt.x + state.vt * vscale * (-sinT),
        y: pt.y - state.vt * vscale * cosT,
      }
      drawArrow(ctx, pt.x, pt.y, vtEnd.x, vtEnd.y, colors.transVel, 2)
      drawLabel(ctx, 'rω', vtEnd.x + 8, vtEnd.y - 4, colors.transVel)
    }
  }

  // ── Coriolis acceleration aₒ · eₒ ─────────────────────────────────────────
  if (visibility.showCoriolisAcc && !state.ejected && Math.abs(state.ao) > 0.5) {
    const ascale = barAccScale(params.barLength)
    const aoEnd = {
      x: pt.x + state.ao * ascale * (-sinT),
      y: pt.y - state.ao * ascale * cosT,
    }
    drawArrow(ctx, pt.x, pt.y, aoEnd.x, aoEnd.y, colors.coriolisAcc, 2)
    drawLabel(ctx, 'aₒ', aoEnd.x - 12, aoEnd.y - 6, colors.coriolisAcc)
  }

  // ── Normal force from bar (same direction as aₒ, slightly offset) ────────
  if (visibility.showNormalForce && !state.ejected && Math.abs(state.N) > 0.5) {
    const ascale = barAccScale(params.barLength)
    // Offset start a few pixels along eᵣ so the N and aₒ arrows don't overlap.
    const offset = 6
    const sx = pt.x + offset * cosT
    const sy = pt.y - offset * sinT
    const nEnd = {
      x: sx + state.N * ascale * (-sinT),
      y: sy - state.N * ascale * cosT,
    }
    drawArrow(ctx, sx, sy, nEnd.x, nEnd.y, colors.normalForceBar, 2)
    drawLabel(ctx, 'N', nEnd.x + 10, nEnd.y - 6, colors.normalForceBar)
  }

  // ── Radial acceleration aᵣ ≡ 0 — illustrate with a dot and "0" label ─────
  if (visibility.showRadialAcc && !state.ejected) {
    const ascale = barAccScale(params.barLength)
    // A short stub along eᵣ marks where aᵣ would be drawn if non-zero.
    const stub = 8
    const sx = pt.x + stub * cosT
    const sy = pt.y - stub * sinT
    drawDot(ctx, sx, sy, 3, colors.arZero)
    drawLabel(ctx, 'aᵣ=0', sx + 16 * cosT, sy - 16 * sinT, colors.arZero, true)
    // Faint segment to convey the "zero vector" idea visually.
    ctx.save()
    ctx.strokeStyle = colors.arZero
    ctx.globalAlpha = 0.35
    ctx.lineWidth = 1.5
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(pt.x, pt.y)
    ctx.lineTo(pt.x + 10 * ascale * cosT, pt.y - 10 * ascale * sinT)
    ctx.stroke()
    ctx.restore()
  }

  // ── Ejection overlay ──────────────────────────────────────────────────────
  if (state.ejected) {
    // Show ejection velocity in the lab frame (vr·eᵣ + vt·eₒ).
    const vscale = barVelScale(params.barLength) * 1.3
    drawEjectionVector(ctx, pt.x, pt.y, state.theta, state.vr, state.vt, vscale, colors.ejection)
    drawLabel(ctx, 'EJECTED', pt.x, pt.y - 22, colors.ejection, true)
  }

  // ── Markers (on top) ──────────────────────────────────────────────────────
  drawDot(ctx, pivot.x, pivot.y, 5, colors.pole, '#fff')
  drawLabel(ctx, 'O', pivot.x + 12, pivot.y - 10, colors.pole)

  drawDot(ctx, pt.x, pt.y, 9, colors.point, '#fff')
  drawLabel(ctx, 'P', pt.x + 12, pt.y - 12, colors.point)
}
