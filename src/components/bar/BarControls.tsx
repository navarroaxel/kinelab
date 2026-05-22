'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import type { BarParams, BarVisibility } from '@/types/simulator'

interface Props {
  params: BarParams
  visibility: BarVisibility
  ejectionTime: number | null
  onSetParam: <K extends keyof BarParams>(key: K, value: BarParams[K]) => void
  onToggle: (key: keyof BarVisibility) => void
  onReset: () => void
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
  unit?: string
  onChange: (value: number) => void
}

function Slider({ label, id, min, max, step, value, unit, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>{label}</span>
        <span className="font-mono text-gray-400">{value}{unit ? ` ${unit}` : ''}</span>
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

export function BarControls({
  params,
  visibility,
  ejectionTime,
  onSetParam,
  onToggle,
  onReset,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage()

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900 flex flex-col gap-4">
      {/* Bar geometry */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {t('bar.controls.section.bar')}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider label={t('bar.controls.slider.omega')}  id="omega"     min={0.5} max={5}   step={0.1} value={params.omega}     unit="rad/s" onChange={v => onSetParam('omega', v)} />
          <Slider label={t('bar.controls.slider.length')} id="barLength" min={80}  max={160} step={5}   value={params.barLength} unit="u"      onChange={v => onSetParam('barLength', v)} />
        </div>
      </section>

      {/* Initial conditions */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {t('bar.controls.section.dynamics')}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider label={t('bar.controls.slider.r0')}    id="r0"    min={10}   max={80}  step={5} value={params.r0}    unit="u"     onChange={v => onSetParam('r0', v)} />
          <Slider label={t('bar.controls.slider.rdot0')} id="rDot0" min={-100} max={100} step={5} value={params.rDot0} unit="u/s"   onChange={v => onSetParam('rDot0', v)} />
        </div>
      </section>

      {/* Visibility */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {t('bar.controls.section.visibility')}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle id="showRadialAcc"          label={t('bar.controls.toggle.ar')}    checked={visibility.showRadialAcc}          onChange={() => onToggle('showRadialAcc')} />
          <Toggle id="showCoriolisAcc"        label={t('bar.controls.toggle.ao')}    checked={visibility.showCoriolisAcc}        onChange={() => onToggle('showCoriolisAcc')} />
          <Toggle id="showNormalForce"        label={t('bar.controls.toggle.n')}     checked={visibility.showNormalForce}        onChange={() => onToggle('showNormalForce')} />
          <Toggle id="showVelocityComponents" label={t('bar.controls.toggle.vcomp')} checked={visibility.showVelocityComponents} onChange={() => onToggle('showVelocityComponents')} />
          <Toggle id="showTrace"              label={t('bar.controls.toggle.trace')} checked={visibility.showTrace}              onChange={() => onToggle('showTrace')} />
          <Toggle id="showRotatingFrame"      label={t('bar.controls.toggle.ghost')} checked={visibility.showRotatingFrame}      onChange={() => onToggle('showRotatingFrame')} />
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          {t('bar.controls.btn.reset')}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 text-xs px-2 py-1.5 rounded-lg border transition-colors ${
            paused
              ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {paused ? t('bar.controls.btn.resume') : t('bar.controls.btn.pause')}
        </button>
      </div>

      {/* Reference info */}
      <section className="text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 flex flex-col gap-1.5">
        <div className="flex justify-between gap-2">
          <span>{t('bar.controls.info.solution')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300 text-right">
            r(t) = r₀·cosh(ωt) + (ṙ₀/ω)·sinh(ωt)
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t('bar.controls.info.ejection')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {ejectionTime !== null ? `${ejectionTime.toFixed(2)} s` : '—'}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t('bar.controls.info.coriolis')}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">N = 2·m·ṙ·ω</span>
        </div>
      </section>
    </div>
  )
}
