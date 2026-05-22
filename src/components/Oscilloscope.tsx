'use client'

import { memo, useEffect, useRef, type MutableRefObject } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { COLORS, COLORS_DARK, type ColorPalette } from '@/lib/drawing'
import type { TranslationKey } from '@/lib/i18n'
import {
  drawScopeFrame,
  drawScopeSeries,
  maxAbsValue,
  updateYMax,
  type Sample,
  type SampleField,
} from '@/lib/oscilloscope'

export interface OscilloscopeSeries {
  key: SampleField
  color: string
  label: string
}

interface Props {
  titleKey: TranslationKey
  yUnit: string
  minScale: number
  series: readonly OscilloscopeSeries[]
  samplesRef: MutableRefObject<Sample[]>
  tRef: MutableRefObject<number>
}

export const Oscilloscope = memo(function Oscilloscope({
  titleKey,
  yUnit,
  minScale,
  series,
  samplesRef,
  tRef,
}: Props) {
  const { t } = useLanguage()
  const title = t(titleKey)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const yMaxRef = useRef(minScale)
  const rafIdRef = useRef<number>(0)

  // DPR scaling on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    canvas.getContext('2d')?.scale(dpr, dpr)
  }, [])

  // ResizeObserver: re-scale on layout changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const dpr = window.devicePixelRatio || 1
        const { width, height } = entry.contentRect
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.getContext('2d')?.scale(dpr, dpr)
      }
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // Own RAF loop: reads from the shared samplesRef and renders
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = matchMedia('(prefers-color-scheme: dark)').matches
    const colors: ColorPalette = isDark ? COLORS_DARK : COLORS

    const fields = series.map(s => s.key)

    function frame() {
      const dpr = window.devicePixelRatio || 1
      const W = canvas!.width / dpr
      const H = canvas!.height / dpr

      const samples = samplesRef.current
      const tNow = tRef.current

      const target = maxAbsValue(samples, fields)
      yMaxRef.current = updateYMax(yMaxRef.current, target, minScale)
      const yMax = yMaxRef.current

      ctx!.clearRect(0, 0, W, H)
      drawScopeFrame(ctx!, W, H, tNow, yMax, yUnit, colors)
      for (const s of series) {
        drawScopeSeries(ctx!, samples, s.key, s.color, tNow, yMax, W, H)
      }

      rafIdRef.current = requestAnimationFrame(frame)
    }

    rafIdRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafIdRef.current)
  }, [series, minScale, yUnit, samplesRef, tRef])

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-1 pb-1">
        <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <div className="flex gap-3">
          {series.map(s => (
            <div key={s.key} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <span className="inline-block w-3 h-[2px]" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', aspectRatio: '5 / 1' }}
        aria-label={title}
      />
    </div>
  )
})
