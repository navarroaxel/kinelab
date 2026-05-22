'use client'

import { memo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { COLORS } from '@/lib/drawing'
import type { TranslationKey } from '@/lib/i18n'

const items: { color: string; key: TranslationKey }[] = [
  { color: COLORS.weight,      key: 'ring.legend.weight' },
  { color: COLORS.normalForce, key: 'ring.legend.normal' },
  { color: COLORS.velocity,    key: 'ring.legend.velocity' },
  { color: COLORS.energyKE,    key: 'ring.legend.ke' },
  { color: COLORS.energyPE,    key: 'ring.legend.pe' },
]

export const RingLegend = memo(function RingLegend() {
  const { t } = useLanguage()
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {t('ring.legend.heading')}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {items.map(item => (
          <li key={item.key} className="flex items-center gap-2">
            <span
              style={{ background: item.color }}
              className="w-3 h-3 rounded-full shrink-0"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">{t(item.key)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})
