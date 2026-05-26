'use client'

import { memo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { COLORS } from '@/lib/drawing'
import type { TranslationKey } from '@/lib/i18n'

const items: { color: string; key: TranslationKey }[] = [
  { color: COLORS.velocity,           key: 'pin-slot.legend.v0' },
  { color: COLORS.radialVelocity,     key: 'pin-slot.legend.vr' },
  { color: COLORS.transverseVelocity, key: 'pin-slot.legend.vperp' },
  { color: COLORS.rVector,            key: 'pin-slot.legend.rho' },
  { color: COLORS.normalForce,        key: 'pin-slot.legend.bar' },
]

export const PinSlotLegend = memo(function PinSlotLegend() {
  const { t } = useLanguage()
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {t('pin-slot.legend.heading')}
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
