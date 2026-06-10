"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { computeVMin } from "@/lib/ringKinematics";
import type { RingParams, RingVisibility } from "@/types/simulator";

interface Props {
  params: RingParams;
  visibility: RingVisibility;
  onSetParam: <K extends keyof RingParams>(
    key: K,
    value: RingParams[K],
  ) => void;
  onToggle: (key: keyof RingVisibility) => void;
  onReset: () => void;
  paused: boolean;
  onTogglePause: () => void;
}

interface SliderProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
}

function Slider({
  label,
  id,
  min,
  max,
  step,
  value,
  unit,
  onChange,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="flex justify-between text-xs text-gray-600 dark:text-gray-400"
      >
        <span>{label}</span>
        <span className="font-mono text-gray-400">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </label>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function Toggle({ id, label, checked, onChange }: ToggleProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-blue-500"
      />
      <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );
}

export function RingControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();
  const vMin = computeVMin(params.gravity, params.radius);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      {/* Geometry & gravity */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ring.controls.section.geometry")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("ring.controls.slider.radius")}
            id="radius"
            min={60}
            max={130}
            step={5}
            value={params.radius}
            unit="u"
            onChange={(v) => onSetParam("radius", v)}
          />
          <Slider
            label={t("ring.controls.slider.gravity")}
            id="gravity"
            min={50}
            max={400}
            step={10}
            value={params.gravity}
            unit="u/s²"
            onChange={(v) => onSetParam("gravity", v)}
          />
        </div>
      </section>

      {/* Initial conditions */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ring.controls.section.dynamics")}
        </h3>
        <Slider
          label={t("ring.controls.slider.v0")}
          id="initialSpeed"
          min={0}
          max={600}
          step={5}
          value={params.initialSpeed}
          unit="u/s"
          onChange={(v) => onSetParam("initialSpeed", v)}
        />
        <p className="mt-1.5 font-mono text-[10px] text-gray-500 dark:text-gray-400">
          v_min = {vMin.toFixed(1)} u/s
        </p>
      </section>

      {/* Visibility */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ring.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showWeight"
            label={t("ring.controls.toggle.weight")}
            checked={visibility.showWeight}
            onChange={() => onToggle("showWeight")}
          />
          <Toggle
            id="showNormal"
            label={t("ring.controls.toggle.normal")}
            checked={visibility.showNormal}
            onChange={() => onToggle("showNormal")}
          />
          <Toggle
            id="showVelocity"
            label={t("ring.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="showEnergyBar"
            label={t("ring.controls.toggle.energy_bar")}
            checked={visibility.showEnergyBar}
            onChange={() => onToggle("showEnergyBar")}
          />
          <Toggle
            id="showTrace"
            label={t("ring.controls.toggle.trace")}
            checked={visibility.showTrace}
            onChange={() => onToggle("showTrace")}
          />
          <Toggle
            id="showCriticalMark"
            label={t("ring.controls.toggle.vmin")}
            checked={visibility.showCriticalMark}
            onChange={() => onToggle("showCriticalMark")}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("ring.controls.btn.reset")}
        </button>
        <button
          onClick={() => onSetParam("initialSpeed", vMin)}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("ring.controls.btn.vmin")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused
            ? t("ring.controls.btn.resume")
            : t("ring.controls.btn.pause")}
        </button>
      </div>

      {/* Formulas — quick reference */}
      <section className="flex flex-col gap-1.5 border-t border-gray-100 pt-3 text-[10px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="flex justify-between gap-2">
          <span>{t("ring.controls.info.eom")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            θ̈ = −(g/R)·sin θ
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t("ring.controls.info.normal")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            N = m·(g·cos θ + R·θ̇²)
          </span>
        </div>
      </section>
    </div>
  );
}
