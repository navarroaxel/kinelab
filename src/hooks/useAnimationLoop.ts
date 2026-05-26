'use client'

import { useRef, useEffect, type RefObject, type MutableRefObject } from 'react'
import { computeKinematics } from '@/lib/kinematics'
import { renderFrame, worldToScreen, COLORS, COLORS_DARK, type ColorPalette } from '@/lib/drawing'
import { WINDOW_SECONDS, MAX_SAMPLES, type Sample } from '@/lib/strip-chart'
import type { SimulatorParams, VisibilityState, KinematicState } from '@/types/simulator'

export function useAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: SimulatorParams,
  visibility: VisibilityState,
  phiRef: MutableRefObject<number>,
  omegaRef: MutableRefObject<number>,
  traceRef: MutableRefObject<{ x: number; y: number }[]>,
  tRef: MutableRefObject<number>,
  samplesRef: MutableRefObject<Sample[]>,
  latestStateRef: MutableRefObject<KinematicState | null>,
  tickListenersRef: MutableRefObject<Set<() => void>>,
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

    function frame(now: number) {
      const colors: ColorPalette = document.documentElement.classList.contains('dark') ? COLORS_DARK : COLORS
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
      latestStateRef.current = state

      if (visibility.showTrace) {
        const sc = worldToScreen(state.ptx, state.pty, canvas!)
        traceRef.current.push(sc)
        if (traceRef.current.length > 400) traceRef.current.shift()
      }

      // Strip chart sampling: only when time is advancing
      if (dt > 0) {
        tRef.current += dt
        samplesRef.current.push({
          t: tRef.current,
          rDot: state.rDot,
          rThetaDot: state.rThetaDot,
          at: state.at,
        })
        const cutoff = tRef.current - WINDOW_SECONDS
        while (samplesRef.current.length > 0 && samplesRef.current[0].t < cutoff) {
          samplesRef.current.shift()
        }
        if (samplesRef.current.length > MAX_SAMPLES) samplesRef.current.shift()
      }

      renderFrame(ctx!, canvas!, state, params, visibility, traceRef.current, colors)

      // Drive subscribed renderers (strip charts, etc.) from this single tick.
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
