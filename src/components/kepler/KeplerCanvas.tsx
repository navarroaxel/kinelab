'use client'

import { useRef, useEffect, type MutableRefObject } from 'react'
import { useKeplerAnimationLoop } from '@/hooks/useKeplerAnimationLoop'
import { useLanguage } from '@/contexts/LanguageContext'
import type { KeplerParams, KeplerVisibility, KeplerMetrics } from '@/types/simulator'
import type { MissionData } from '@/lib/keplerKinematics'

interface Props {
  params:      KeplerParams
  visibility:  KeplerVisibility
  nuRef:       MutableRefObject<number>
  phaseRef:    MutableRefObject<number>
  missionRef:  MutableRefObject<MissionData>
  onMetrics:   (m: KeplerMetrics) => void
  paused:      boolean
  resetCount:  number
}

export function KeplerCanvas({
  params, visibility, nuRef, phaseRef, missionRef, onMetrics, paused, resetCount,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()

  // DPR-aware resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        canvas.width  = width  * dpr
        canvas.height = height * dpr
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.scale(dpr, dpr)
      }
    })
    obs.observe(canvas)
    return () => obs.disconnect()
  }, [])

  useKeplerAnimationLoop(
    canvasRef, params, visibility, nuRef, phaseRef, missionRef,
    onMetrics, paused, resetCount,
  )

  return (
    <canvas
      ref={canvasRef}
      aria-label={t('kepler.page.canvas_aria')}
      className="w-full aspect-[16/9] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-950 dark:bg-gray-950"
      style={{ display: 'block' }}
    />
  )
}
