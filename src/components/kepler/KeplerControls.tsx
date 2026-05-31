'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import type { KeplerParams, KeplerVisibility } from '@/types/simulator'

interface Props {
  params:        KeplerParams
  visibility:    KeplerVisibility
  onSetParam:    <K extends keyof KeplerParams>(key: K, value: KeplerParams[K]) => void
  onToggle:      (key: keyof KeplerVisibility) => void
  onReset:       () => void
  paused:        boolean
  onTogglePause: () => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">
      {children}
    </div>
  )
}

function Slider({
  label, value, min, max, step, onChange, format,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format?: (v: number) => string
}) {
  const display = format ? format(value) : value.toFixed(3)
  return (
    <label className="flex flex-col gap-0.5">
      <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <span className="font-mono">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-600"
      />
    </label>
  )
}

function Toggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: () => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox" checked={checked} onChange={onChange}
        className="rounded accent-blue-600"
      />
      <span className="text-[11px] text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  )
}

export function KeplerControls({
  params, visibility, onSetParam, onToggle, onReset, paused, onTogglePause,
}: Props) {
  const { t } = useLanguage()

  return (
    <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-2">

      {/* Problem info */}
      <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-2 leading-relaxed">
        <div className="font-semibold mb-0.5">{t('kepler.controls.info.problem')}</div>
        <div>{t('kepler.controls.info.r_a')}</div>
        <div>{t('kepler.controls.info.r_b')}</div>
        <div>{t('kepler.controls.info.r_c')}</div>
      </div>

      {/* Δv manoeuvres */}
      <SectionLabel>{t('kepler.controls.section.maneuvers')}</SectionLabel>
      <Slider
        label={t('kepler.controls.slider.dv_a')}
        value={params.dvA} min={0} max={2} step={0.001}
        onChange={v => onSetParam('dvA', v)}
      />
      <Slider
        label={t('kepler.controls.slider.dv_b')}
        value={params.dvB} min={0} max={0.1} step={0.001}
        onChange={v => onSetParam('dvB', v)}
      />
      <Slider
        label={t('kepler.controls.slider.dv_c')}
        value={params.dvC} min={0} max={1.5} step={0.001}
        onChange={v => onSetParam('dvC', v)}
      />

      {/* Animation speed */}
      <SectionLabel>{t('kepler.controls.section.animation')}</SectionLabel>
      <Slider
        label={t('kepler.controls.slider.anim_speed')}
        value={params.animSpeed} min={500} max={15_000} step={500}
        onChange={v => onSetParam('animSpeed', v)}
        format={v => `${(v / 1000).toFixed(1)}k×`}
      />

      {/* Visibility */}
      <SectionLabel>{t('kepler.controls.section.visibility')}</SectionLabel>
      <Toggle label={t('kepler.controls.toggle.velocity')}   checked={visibility.showVelocity}  onChange={() => onToggle('showVelocity')} />
      <Toggle label={t('kepler.controls.toggle.orbits')}     checked={visibility.showOrbits}    onChange={() => onToggle('showOrbits')} />
      <Toggle label={t('kepler.controls.toggle.area_sweep')} checked={visibility.showAreaSweep} onChange={() => onToggle('showAreaSweep')} />
      <Toggle label={t('kepler.controls.toggle.trace')}      checked={visibility.showTrace}     onChange={() => onToggle('showTrace')} />

      {/* Buttons */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={onTogglePause}
          className="flex-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 font-medium"
        >
          {paused ? t('kepler.controls.btn.resume') : t('kepler.controls.btn.pause')}
        </button>
        <button
          onClick={onReset}
          className="flex-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs py-1.5 font-medium"
        >
          {t('kepler.controls.btn.reset')}
        </button>
      </div>
    </section>
  )
}
