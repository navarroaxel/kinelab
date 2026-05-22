'use client'

import { memo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { computeVMin } from '@/lib/ringKinematics'
import type { RingKinematicState, RingParams } from '@/types/simulator'

interface Props {
  state: RingKinematicState
  params: RingParams
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI
}

// Normalises θ into [−180°, 180°] so the card stays readable across many loops.
function normalizeDeg(rad: number) {
  const deg = toDeg(rad) % 360
  return deg > 180 ? deg - 360 : deg <= -180 ? deg + 360 : deg
}

export const RingMetrics = memo(function RingMetrics({ state, params }: Props) {
  const { t } = useLanguage()
  const vMin = computeVMin(params.gravity, params.radius)
  // vRatio = v₀ / v_min — used for the "X% of v_min" text (uncapped).
  // barFillPct maps [0, 2·v_min] linearly to [0%, 100%] of the bar width so
  // that the threshold marker sits at the centre and crossing it visually
  // means crossing v_min.
  const vRatio = vMin > 0 ? params.initialSpeed / vMin : 0
  const ratioPct = Math.round(vRatio * 100)
  const barFillPct = Math.min(Math.max(vRatio / 2, 0), 1) * 100

  const lostContact = !state.hasContact
  const cards = [
    { label: t('ring.metrics.theta'), value: normalizeDeg(state.theta).toFixed(1), unit: '°',     danger: false },
    { label: t('ring.metrics.v'),     value: state.v.toFixed(1),                   unit: 'u/s',   danger: false },
    { label: t('ring.metrics.n'),     value: state.N.toFixed(1),                   unit: 'u/s²',  danger: lostContact },
    { label: t('ring.metrics.h'),     value: state.h.toFixed(1),                   unit: 'u',     danger: false },
    { label: t('ring.metrics.ke'),    value: state.KE.toFixed(0),                  unit: 'u²/s²', danger: false },
    { label: t('ring.metrics.pe'),    value: state.PE.toFixed(0),                  unit: 'u²/s²', danger: false },
  ]

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        {t('ring.metrics.heading')}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map(card => (
          <div
            key={card.label}
            className={`rounded-lg p-2 ${
              card.danger
                ? 'bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mb-0.5">
              {card.label}
            </div>
            <div className={`font-mono text-sm font-semibold ${
              card.danger ? 'text-rose-700 dark:text-rose-400' : 'text-gray-800 dark:text-gray-100'
            }`}>
              {card.value}
              <span className="text-xs font-normal text-gray-400 ml-0.5">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* v_min indicator */}
      <div className="mt-3 text-[10px] text-gray-500 dark:text-gray-400">
        <div className="flex justify-between items-baseline mb-1">
          <span>{t('ring.metrics.vmin_label')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-200">{vMin.toFixed(1)} u/s</span>
        </div>
        <div className="relative h-1.5 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-amber-400 dark:bg-amber-500"
            style={{ width: `${barFillPct}%` }}
          />
          {/* Threshold marker at 50% of the bar (= v_min on the [0, 2·v_min] scale) */}
          <div className="absolute inset-y-0" style={{ left: '50%', width: '1px', background: 'currentColor', opacity: 0.4 }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-mono">v₀ = {params.initialSpeed.toFixed(0)} u/s</span>
          <span className="font-mono">{ratioPct}% {t('ring.metrics.vmin_pct')}</span>
        </div>
      </div>
    </div>
  )
})
