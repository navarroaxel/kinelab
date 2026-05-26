'use client'

import { useRef, useEffect } from 'react'
import { useQuickReturnAnimationLoop } from '@/hooks/useQuickReturnAnimationLoop'
import { useLanguage } from '@/contexts/LanguageContext'
import type { QuickReturnParams, QuickReturnState, QuickReturnVisibility } from '@/types/simulator'

interface Props {
  params: QuickReturnParams
  visibility: QuickReturnVisibility
  phiRef: React.MutableRefObject<number>
  onMetrics: (state: QuickReturnState) => void
  paused: boolean
  resetCount: number
}

export function QuickReturnCanvas({ params, visibility, phiRef, onMetrics, paused, resetCount }: Props) {
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

  useQuickReturnAnimationLoop(canvasRef, params, visibility, phiRef, onMetrics, paused, resetCount)

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', aspectRatio: '4 / 3' }}
      className="rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t('quick-return.page.canvas_aria')}
    />
  )
}
