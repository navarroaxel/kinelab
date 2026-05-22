'use client'

import { memo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { BarKinematicState, BarParams } from '@/types/simulator'

interface Props {
  state: BarKinematicState
  params: BarParams
  ejectionTime: number | null
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI
}

// Normalises θ into [0°, 360°) so the card stays readable across many turns.
function wrapDeg(rad: number) {
  let deg = toDeg(rad) % 360
  if (deg < 0) deg += 360
  return deg
}

export const BarMetrics = memo(function BarMetrics({ state, params, ejectionTime }: Props) {
  const { t } = useLanguage()
  const fillPct = Math.min(state.r / params.barLength, 1) * 100

  // aᵣ card is highlighted in green to stress the "net radial force = 0" point.
  const cards = [
    { label: t('bar.metrics.r'),     value: state.r.toFixed(1),         unit: 'u',     accent: false, highlight: false },
    { label: t('bar.metrics.r_dot'), value: state.rDot.toFixed(1),      unit: 'u/s',   accent: false, highlight: false },
    { label: t('bar.metrics.theta'), value: wrapDeg(state.theta).toFixed(1), unit: '°', accent: false, highlight: false },
    { label: t('bar.metrics.v'),     value: state.v.toFixed(1),         unit: 'u/s',   accent: false, highlight: false },
    { label: t('bar.metrics.ar'),    value: '0.0',                       unit: 'u/s²',  accent: false, highlight: true  },
    { label: t('bar.metrics.ao'),    value: state.ao.toFixed(1),         unit: 'u/s²',  accent: false, highlight: false },
    { label: t('bar.metrics.n'),     value: state.N.toFixed(1),          unit: 'u/s²',  accent: false, highlight: false },
    { label: t('bar.metrics.t'),     value: state.t.toFixed(2),          unit: 's',     accent: state.ejected, highlight: false },
  ]

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        {t('bar.metrics.heading')}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map(card => (
          <div
            key={card.label}
            title={card.highlight ? t('bar.metrics.ar_note') : undefined}
            className={`rounded-lg p-2 ${
              card.highlight
                ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800'
                : card.accent
                ? 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mb-0.5">
              {card.label}
            </div>
            <div className={`font-mono text-sm font-semibold ${
              card.highlight
                ? 'text-emerald-700 dark:text-emerald-300'
                : card.accent
                ? 'text-amber-700 dark:text-amber-300'
                : 'text-gray-800 dark:text-gray-100'
            }`}>
              {card.value}
              <span className="text-xs font-normal text-gray-400 ml-0.5">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar-length / ejection indicator */}
      <div className="mt-3 text-[10px] text-gray-500 dark:text-gray-400">
        <div className="flex justify-between items-baseline mb-1">
          <span>{t('bar.metrics.bar_length')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-200">
            {params.barLength.toFixed(0)} u
          </span>
        </div>
        <div className="relative h-1.5 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 ${state.ejected ? 'bg-rose-500' : 'bg-amber-400 dark:bg-amber-500'}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 gap-2">
          <span className="font-mono">r / L = {(fillPct).toFixed(0)}%</span>
          <span className="font-mono text-right">
            {ejectionTime !== null
              ? `${t('bar.metrics.ejection')} t = ${ejectionTime.toFixed(2)} s`
              : t('bar.metrics.never')}
          </span>
        </div>
        {state.ejected && (
          <p className="mt-1 text-rose-600 dark:text-rose-400 font-medium">
            {t('bar.metrics.ejected')}
          </p>
        )}
      </div>
    </div>
  )
})
