'use client'

import { memo, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export const BarEquations = memo(function BarEquations() {
  const [open, setOpen] = useState(true)
  const { t } = useLanguage()

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="bar-equations-content"
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span>{t('bar.equations.heading')}</span>
        <span aria-hidden="true" className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="bar-equations-content" className="px-3 pb-3 flex flex-col gap-1.5 text-xs font-mono text-gray-700 dark:text-gray-300">
          <p className="text-gray-500 dark:text-gray-500 font-sans text-[10px] mt-1 mb-0.5">
            {t('bar.equations.section.radial')}
          </p>
          <p>m·(r̈ − r·ω²) = 0   →   r̈ = ω²·r</p>
          <p className="text-gray-400 dark:text-gray-500 font-sans text-[10px] leading-relaxed">
            {t('bar.equations.note.radial')}
          </p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-[10px] mt-2 mb-0.5">
            {t('bar.equations.section.normal')}
          </p>
          <p>N = m·(r·θ̈ + 2·ṙ·θ̇) = 2·m·ṙ·ω</p>
          <p className="text-gray-400 dark:text-gray-500 font-sans text-[10px] leading-relaxed">
            {t('bar.equations.note.normal')}
          </p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-[10px] mt-2 mb-0.5">
            {t('bar.equations.section.solution')}
          </p>
          <p>r(t)  = r₀·cosh(ω·t) + (ṙ₀/ω)·sinh(ω·t)</p>
          <p>ṙ(t)  = r₀·ω·sinh(ω·t) + ṙ₀·cosh(ω·t)</p>
          <p className="text-gray-400 dark:text-gray-500 font-sans text-[10px] leading-relaxed">
            {t('bar.equations.note.solution')}
          </p>

          <p className="text-gray-500 dark:text-gray-500 font-sans text-[10px] mt-2 mb-0.5">
            {t('bar.equations.section.insight')}
          </p>
          <p>aᵣ = r̈ − r·ω² = ω²·r − ω²·r = 0</p>
          <p className="text-gray-400 dark:text-gray-500 font-sans text-[10px] leading-relaxed">
            {t('bar.equations.note.insight')}
          </p>

          <p className="mt-2 text-[10px] font-sans text-gray-500 dark:text-gray-500 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-2">
            {t('units.note')}
          </p>
        </div>
      )}
    </div>
  )
})
