'use client'

import { useRef, useEffect, type MutableRefObject } from 'react'
import { useRingAnimationLoop } from '@/hooks/useRingAnimationLoop'
import { useLanguage } from '@/contexts/LanguageContext'
import type {
  RingKinematicState,
  RingParams,
  RingSample,
  RingVisibility,
} from '@/types/simulator'

interface Props {
  params: RingParams
  visibility: RingVisibility
  thetaRef: MutableRefObject<number>
  thetaDotRef: MutableRefObject<number>
  traceRef: MutableRefObject<{ x: number; y: number }[]>
  tRef: MutableRefObject<number>
  samplesRef: MutableRefObject<RingSample[]>
  tickListenersRef: MutableRefObject<Set<() => void>>
  onMetrics: (state: RingKinematicState) => void
  paused: boolean
}

export function RingCanvas({
  params,
  visibility,
  thetaRef,
  thetaDotRef,
  traceRef,
  tRef,
  samplesRef,
  tickListenersRef,
  onMetrics,
  paused,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()

  // Initial DPR scaling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width  = Math.round(rect.width  * dpr)
    canvas.height = Math.round(rect.height * dpr)
    canvas.getContext('2d')?.scale(dpr, dpr)
  }, [])

  // Rescale on layout changes
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

  useRingAnimationLoop(
    canvasRef,
    params,
    visibility,
    thetaRef,
    thetaDotRef,
    traceRef,
    tRef,
    samplesRef,
    tickListenersRef,
    onMetrics,
    paused,
  )

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', aspectRatio: '4 / 3' }}
      className="rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t('ring.page.canvas_aria')}
    />
  )
}
