'use client'

import { useRef, useEffect, type MutableRefObject } from 'react'
import { useAnimationLoop } from '@/hooks/useAnimationLoop'
import type { Sample } from '@/lib/strip-chart'
import type { KinematicState, SimulatorParams, VisibilityState } from '@/types/simulator'

interface Props {
  params: SimulatorParams
  visibility: VisibilityState
  phiRef: MutableRefObject<number>
  omegaRef: MutableRefObject<number>
  traceRef: MutableRefObject<{ x: number; y: number }[]>
  tRef: MutableRefObject<number>
  samplesRef: MutableRefObject<Sample[]>
  tickListenersRef: MutableRefObject<Set<() => void>>
  onMetrics: (state: KinematicState) => void
  paused: boolean
}

export function SimulatorCanvas({
  params,
  visibility,
  phiRef,
  omegaRef,
  traceRef,
  tRef,
  samplesRef,
  tickListenersRef,
  onMetrics,
  paused,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Apply DPR scaling once on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width  = Math.round(rect.width  * dpr)
    canvas.height = Math.round(rect.height * dpr)
    canvas.getContext('2d')?.scale(dpr, dpr)
  }, [])

  // Re-scale whenever the container resizes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const dpr = window.devicePixelRatio || 1
        const { width, height } = entry.contentRect
        canvas.width  = Math.round(width  * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.getContext('2d')?.scale(dpr, dpr)
      }
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  useAnimationLoop(canvasRef, params, visibility, phiRef, omegaRef, traceRef, tRef, samplesRef, tickListenersRef, onMetrics, paused)

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', aspectRatio: '4 / 3' }}
      className="rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label="Polar coordinates simulator — animated circular motion"
    />
  )
}
