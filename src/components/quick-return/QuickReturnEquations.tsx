'use client'

import { memo, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export const QuickReturnEquations = memo(function QuickReturnEquations() {
  const [open, setOpen] = useState(true)
  const { t } = useLanguage()

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="qr-equations-content"
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span>{t('quick-return.equations.heading')}</span>
        <span aria-hidden="true" className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="qr-equations-content" className="px-3 pb-3 flex flex-col gap-1.5 text-xs font-mono text-gray-700 dark:text-gray-300">
          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-1 mb-0.5">
            {t('quick-return.equations.section.geometry')}
          </p>
          <p>O = (0, 0),  A = (0, L₂)</p>
          <p>φ(t) = ω·t  (from downward vert.)</p>
          <p>x_B = r·sin φ</p>
          <p>y_B = L₂ − r·cos φ</p>
          <p>x_P = L₁·x_B / y_B</p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-2 mb-0.5">
            {t('quick-return.equations.section.kinematics')}
          </p>
          <p>x(t) = L₁·r·sin φ / (L₂ − r·cos φ)</p>
          <p>v(t) = ω·L₁·r·(L₂·cos φ − r) / (L₂ − r·cos φ)²</p>
          <p className="leading-tight">a(t) = −ω²·L₁·r·sin φ·(L₂² + r·L₂·cos φ − 2r²) / (L₂ − r·cos φ)³</p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-2 mb-0.5">
            {t('quick-return.equations.section.extremes')}
          </p>
          <p>α = arccos(r / L₂)</p>
          <p>x_max = ± L₁·r / √(L₂² − r²)</p>
          <p>ratio = (2π − 2α) / (2α)</p>
          <p className="text-gray-400 dark:text-gray-500 font-sans text-xs leading-relaxed">
            {t('quick-return.equations.note.ratio')}
          </p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-xs mt-2 mb-0.5">
            {t('quick-return.equations.section.center')}
          </p>
          <p>v(φ=0)  = +ω·L₁·r / (L₂ − r)  <span className="text-gray-400">(fast)</span></p>
          <p>v(φ=π)  = −ω·L₁·r / (L₂ + r)  <span className="text-gray-400">(slow)</span></p>
          <p className="text-gray-400 dark:text-gray-500 font-sans text-xs">
            {t('quick-return.equations.note.center')}
          </p>

          <p className="mt-2 text-xs font-sans text-gray-500 dark:text-gray-500 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-2">
            {t('units.note')}
          </p>
        </div>
      )}
    </div>
  )
})
