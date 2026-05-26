'use client'

import { memo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { extremes } from '@/lib/quickReturnKinematics'
import type { QuickReturnParams, QuickReturnState } from '@/types/simulator'

interface Props {
  state: QuickReturnState
  params: QuickReturnParams
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI
}

export const QuickReturnMetrics = memo(function QuickReturnMetrics({ state, params }: Props) {
  const { t } = useLanguage()
  const { xMax, alpha, quickReturnRatio } = extremes(params)

  const vCenter0 = (params.omega * params.L1 * params.r) / (params.L2 - params.r)
  const vCenterPi = -(params.omega * params.L1 * params.r) / (params.L2 + params.r)

  const cards = [
    { label: t('quick-return.metrics.phi'), value: toDeg(state.phi).toFixed(1),  unit: '°' },
    { label: t('quick-return.metrics.x'),   value: state.x.toFixed(1),            unit: 'u' },
    { label: t('quick-return.metrics.v'),   value: state.v.toFixed(2),            unit: 'u/s' },
    { label: t('quick-return.metrics.a'),   value: state.a.toFixed(2),            unit: 'u/s²' },
  ]

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900 flex flex-col gap-3">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {t('quick-return.metrics.heading')}
      </h2>

      {/* Live cards */}
      <div className="grid grid-cols-2 gap-2">
        {cards.map(card => (
          <div key={card.label} className="rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mb-0.5">
              {card.label}
            </div>
            <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
              {card.value}
              <span className="text-xs font-normal text-gray-400 ml-0.5">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Derived results */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex flex-col gap-1.5 text-[10px]">
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
          {t('quick-return.metrics.derived_heading')}
        </h3>

        {/* Quick-return ratio — headline */}
        <div className="rounded-lg p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
          <div className="text-[10px] text-amber-700 dark:text-amber-400 mb-0.5">
            {t('quick-return.metrics.ratio_label')}
          </div>
          <div className="font-mono text-base font-bold text-amber-800 dark:text-amber-300">
            {quickReturnRatio.toFixed(3)} : 1
          </div>
          <div className="text-[9px] text-amber-600 dark:text-amber-500 mt-0.5 leading-tight">
            {t('quick-return.metrics.ratio_note')}
          </div>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('quick-return.metrics.alpha')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">{toDeg(alpha).toFixed(1)}°</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('quick-return.metrics.xmax')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">±{xMax.toFixed(1)} u</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('quick-return.metrics.v_phi0')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">{vCenter0.toFixed(2)} u/s</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('quick-return.metrics.v_phi_pi')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">{vCenterPi.toFixed(2)} u/s</span>
        </div>
      </div>
    </div>
  )
})
