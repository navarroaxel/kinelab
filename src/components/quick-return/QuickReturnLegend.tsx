'use client'

import { memo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { COLORS } from '@/lib/drawing'

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-3 h-3 rounded-sm flex-shrink-0 mt-0.5"
      style={{ background: color }}
    />
  )
}

export const QuickReturnLegend = memo(function QuickReturnLegend() {
  const { t } = useLanguage()

  const items = [
    { color: COLORS.rVector,    label: t('quick-return.legend.crank') },
    { color: COLORS.normalForce, label: t('quick-return.legend.bar') },
    { color: COLORS.normalAccel, label: t('quick-return.legend.sliderB') },
    { color: COLORS.point,      label: t('quick-return.legend.sliderP') },
    { color: COLORS.velocity,   label: t('quick-return.legend.velocity') },
    { color: COLORS.acceleration, label: t('quick-return.legend.acceleration') },
  ]

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        {t('quick-return.legend.heading')}
      </h2>
      <ul className="flex flex-col gap-1.5">
        {items.map(item => (
          <li key={item.label} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
            <Swatch color={item.color} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})
