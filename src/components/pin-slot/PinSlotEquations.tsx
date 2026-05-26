'use client'

import { memo, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export const PinSlotEquations = memo(function PinSlotEquations() {
  const [open, setOpen] = useState(true)
  const { t } = useLanguage()

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="pin-slot-equations-content"
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span>{t('pin-slot.equations.heading')}</span>
        <span aria-hidden="true" className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="pin-slot-equations-content" className="px-3 pb-3 flex flex-col gap-1.5 text-xs font-mono text-gray-700 dark:text-gray-300">
          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-1 mb-0.5">
            {t('pin-slot.equations.section.setup')}
          </p>
          <p>B = (d + r·cosΦ,  r·sinΦ)</p>
          <p>ρ = |OB| = √(d² + r² + 2·d·r·cosΦ)</p>
          <p>θ = atan2(r·sinΦ,  d + r·cosΦ)</p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-2 mb-0.5">
            {t('pin-slot.equations.section.pin')}
          </p>
          <p>Ω = Φ̇ = V₀ / r  (constant)</p>
          <p>Φ̈ = 0</p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-2 mb-0.5">
            {t('pin-slot.equations.section.bar')}
          </p>
          <p>Vᵣ = ρ̇ = −(d·V₀·sinΦ) / ρ</p>
          <p>ω  = θ̇ = V₀·(r + d·cosΦ) / ρ²</p>
          <p>γ  = θ̈ = Vᵣ·(Ω − 2ω) / ρ</p>
          <p>V⊥ = ρ·ω</p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-2 mb-0.5">
            {t('pin-slot.equations.section.swing')}
          </p>
          <p>|θ|_max = arcsin(r / d)</p>
          <p className="text-gray-400 dark:text-gray-500 font-sans text-xs leading-relaxed">
            {t('pin-slot.equations.note.swing')}
          </p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-2 mb-0.5">
            {t('pin-slot.equations.section.invariant')}
          </p>
          <p>Vᵣ² + V⊥² = V₀²</p>
          <p className="text-gray-400 dark:text-gray-500 font-sans text-xs">
            {t('pin-slot.equations.note.invariant')}
          </p>

          <p className="mt-2 text-xs font-sans text-gray-500 dark:text-gray-500 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-2">
            {t('units.note')}
          </p>
        </div>
      )}
    </div>
  )
})
