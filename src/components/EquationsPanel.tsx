'use client'

import { useState, memo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { VisibilityState } from '@/types/simulator'

interface Props {
  visibility: VisibilityState
}

export const EquationsPanel = memo(function EquationsPanel({ visibility }: Props) {
  const [open, setOpen] = useState(true)
  const { t } = useLanguage()

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="equations-panel-content"
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span>{t('equations.heading')}</span>
        <span aria-hidden="true" className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="equations-panel-content" className="px-3 pb-3 flex flex-col gap-1.5 text-xs font-mono text-gray-700 dark:text-gray-300">
          <p className="text-gray-500 dark:text-gray-300 font-sans text-xs mt-1 mb-0.5">{t('equations.section.position')}</p>
          <p>r = √[(x−x₀)² + (y−y₀)²]</p>
          <p>θ = atan2(y−y₀, x−x₀)</p>

          {visibility.showVelocity && (
            <>
              <p className="text-gray-500 dark:text-gray-300 font-sans text-xs mt-1 mb-0.5">{t('equations.section.polar_velocity')}</p>
              <p>ṙ  = R · ω · sin(θ − φ)</p>
              <p>rθ̇ = R · ω · cos(φ − θ)</p>
              <p className="text-gray-400 dark:text-gray-300">{t('equations.note.omega_dot')}</p>
            </>
          )}

          {visibility.showAcceleration && (
            <>
              <p className="text-gray-500 dark:text-gray-300 font-sans text-xs mt-1 mb-0.5">{t('equations.section.polar_accel')}</p>
              <p>aᵣ = r̈ − r · θ̇²</p>
              <p>aθ = r · θ̈ + 2 · ṙ · θ̇</p>
              <p className="text-gray-500 dark:text-gray-300 font-sans text-xs mt-1 mb-0.5">{t('equations.section.tangential')}</p>
              <p>aₜ = R · α   (∥ v)</p>
            </>
          )}

          {visibility.showNormalAccel && (
            <>
              <p className="text-gray-500 dark:text-gray-300 font-sans text-xs mt-1 mb-0.5">{t('equations.section.normal')}</p>
              <p>aₙ = R · ω²  (→ O)</p>
            </>
          )}

          <p className="mt-2 text-gray-500 dark:text-gray-300 font-sans text-xs mb-0.5 border-t border-gray-100 dark:border-gray-800 pt-2">
            {t('equations.section.decomp_heading')}
          </p>
          <p className="text-gray-500 dark:text-gray-300 font-sans text-xs mt-1 mb-0.5">{t('equations.decomp.intrinsic_heading')}</p>
          <p className="text-xs font-sans text-gray-500 dark:text-gray-300 leading-relaxed">
            {t('equations.decomp.at')}
          </p>
          <p className="text-xs font-sans text-gray-500 dark:text-gray-300 leading-relaxed">
            {t('equations.decomp.an')}
          </p>
          <p className="text-gray-500 dark:text-gray-300 font-sans text-xs mt-1 mb-0.5">{t('equations.decomp.polar_heading')}</p>
          <p className="text-xs font-sans text-gray-500 dark:text-gray-300 leading-relaxed">
            {t('equations.decomp.ar')}
          </p>
          <p className="text-xs font-sans text-gray-500 dark:text-gray-300 leading-relaxed">
            {t('equations.decomp.atheta')}
          </p>
          <p className="text-xs font-sans text-gray-500 dark:text-gray-300 leading-relaxed">
            {t('equations.decomp.relation')}
          </p>

          <p className="mt-2 text-xs font-sans text-gray-500 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-2">
            {t('equations.footer')}
          </p>
          <p className="text-xs font-sans text-gray-500 dark:text-gray-300 leading-relaxed">
            {t('units.note')}
          </p>
        </div>
      )}
    </div>
  )
})
