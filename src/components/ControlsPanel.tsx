'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import type { SimulatorParams, VisibilityState } from '@/types/simulator'

interface Props {
  params: SimulatorParams
  visibility: VisibilityState
  onSetParam: <K extends keyof SimulatorParams>(key: K, value: SimulatorParams[K]) => void
  onToggle: (key: keyof VisibilityState) => void
  onResetPole: () => void
  onResetAlpha: () => void
  paused: boolean
  onTogglePause: () => void
}

interface SliderProps {
  label: string
  id: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

function Slider({ label, id, min, max, step, value, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>{label}</span>
        <span className="font-mono text-gray-400">{value}</span>
      </label>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  )
}

interface ToggleProps {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}

function Toggle({ id, label, checked, onChange }: ToggleProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 accent-blue-500"
      />
      <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  )
}

export function ControlsPanel({
  params,
  visibility,
  onSetParam,
  onToggle,
  onResetPole,
  onResetAlpha,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage()

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900 flex flex-col gap-4">
      {/* Geometry */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('controls.section.geometry')}</h3>
        <div className="flex flex-col gap-3">
          <Slider label={t('controls.slider.pole_x')} id="poleX"        min={-120} max={120} step={1}  value={params.poleX}        onChange={v => onSetParam('poleX', v)} />
          <Slider label={t('controls.slider.pole_y')} id="poleY"        min={-120} max={120} step={1}  value={params.poleY}        onChange={v => onSetParam('poleY', v)} />
          <Slider label={t('controls.slider.radius')} id="circleRadius" min={40}   max={140} step={5}  value={params.circleRadius} onChange={v => onSetParam('circleRadius', v)} />
        </div>
      </section>

      {/* Dynamics */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('controls.section.dynamics')}</h3>
        <div className="flex flex-col gap-3">
          <Slider label="ω (°/s)"  id="angularVelocity"     min={-200} max={200} step={5} value={params.angularVelocity}     onChange={v => onSetParam('angularVelocity', v)} />
          <Slider label="α (°/s²)" id="angularAcceleration" min={-100} max={100} step={5} value={params.angularAcceleration} onChange={v => onSetParam('angularAcceleration', v)} />
        </div>
      </section>

      {/* Visibility */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('controls.section.visibility')}</h3>
        <div className="flex flex-col gap-2">
          <Toggle id="showVelocity" label={t('controls.toggle.polar_velocity')} checked={visibility.showVelocity}     onChange={() => onToggle('showVelocity')} />
          <Toggle id="showCartesian" label={t('controls.toggle.cartesian')} checked={visibility.showCartesian} onChange={() => onToggle('showCartesian')} />
          <Toggle id="showRVector" label={t('controls.toggle.r_vector')} checked={visibility.showRVector} onChange={() => onToggle('showRVector')} />
          <Toggle id="showAcceleration" label={t('controls.toggle.polar_accel')} checked={visibility.showAcceleration} onChange={() => onToggle('showAcceleration')} />
          <Toggle id="showNormalAccel" label={t('controls.toggle.normal_accel')} checked={visibility.showNormalAccel}  onChange={() => onToggle('showNormalAccel')} />
          <Toggle id="showTrace" label={t('controls.toggle.trace')} checked={visibility.showTrace} onChange={() => onToggle('showTrace')} />
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onResetPole}
          className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          {t('controls.btn.pole_center')}
        </button>
        <button
          onClick={onResetAlpha}
          className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          {t('controls.btn.reset_alpha')}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 text-xs px-2 py-1.5 rounded-lg border transition-colors ${
            paused
              ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {paused ? t('controls.btn.resume') : t('controls.btn.pause')}
        </button>
      </div>
    </div>
  )
}
