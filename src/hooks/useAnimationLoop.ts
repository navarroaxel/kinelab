'use client'

import { useRef, useEffect, type RefObject, type MutableRefObject } from 'react'
import { computeKinematics } from '@/lib/kinematics'
import { renderFrame, worldToScreen, COLORS, COLORS_DARK, type ColorPalette } from '@/lib/drawing'
import type { SimulatorParams, VisibilityState, KinematicState } from '@/types/simulator'

export function useAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: SimulatorParams,
  visibility: VisibilityState,
  phiRef: MutableRefObject<number>,
  omegaRef: MutableRefObject<number>,
  traceRef: MutableRefObject<{ x: number; y: number }[]>,
  onMetrics: (state: KinematicState) => void,
  paused: boolean
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
      // Freeze time while paused so no sudden jump on resume
      const dt = paused ? 0 : raw
      lastTimeRef.current = now

      // Semi-implicit Euler: update ω from α, then advance φ with the new ω
      omegaRef.current += params.angularAcceleration * dt
      const omegaRad = (omegaRef.current * Math.PI) / 180
      phiRef.current += omegaRad * dt

      const state = computeKinematics(phiRef.current, omegaRef.current, params)

      if (visibility.showTrace) {
        const sc = worldToScreen(state.ptx, state.pty, canvas!)
        traceRef.current.push(sc)
        if (traceRef.current.length > 400) traceRef.current.shift()
      }

      renderFrame(ctx!, canvas!, state, params, visibility, traceRef.current, colors)

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
