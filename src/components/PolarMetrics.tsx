'use client'

import { memo } from 'react'
import type { KinematicState } from '@/types/simulator'

interface Props {
  state: KinematicState
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI
}

export const PolarMetrics = memo(function PolarMetrics({ state }: Props) {
  const cards = [
    { label: 'r  (magnitude)',        value: state.r.toFixed(1),              unit: 'u',   green: false },
    { label: 'θ  (polar angle)',      value: toDeg(state.theta).toFixed(1),   unit: '°',   green: false },
    { label: 'ṙ  (radial vel.)',      value: state.rDot.toFixed(1),           unit: 'u/s', green: Math.abs(state.rDot) < 1 },
    { label: 'rθ̇  (transverse vel.)', value: state.rThetaDot.toFixed(1),      unit: 'u/s', green: false },
  ]

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        Live Metrics
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map(card => (
          <div
            key={card.label}
            className={`rounded-lg p-2 ${
              card.green
                ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mb-0.5">
              {card.label}
            </div>
            <div className={`font-mono text-sm font-semibold ${card.green ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-100'}`}>
              {card.value}
              <span className="text-xs font-normal text-gray-400 ml-0.5">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
