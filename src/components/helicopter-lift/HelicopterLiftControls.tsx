"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  HelicopterLiftParams,
  HelicopterLiftVisibility,
} from "@/types/simulator";

interface Props {
  params: HelicopterLiftParams;
  visibility: HelicopterLiftVisibility;
  onSetParam: <K extends keyof HelicopterLiftParams>(
    key: K,
    value: HelicopterLiftParams[K],
  ) => void;
  onToggle: (key: keyof HelicopterLiftVisibility) => void;
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

export function HelicopterLiftControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("hl.controls.section.rotor")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("hl.controls.slider.exhaust_velocity")}
            id="exhaustVelocity"
            min={20}
            max={140}
            step={1}
            value={params.exhaustVelocity}
            unit="ft/s"
            onChange={(v) => onSetParam("exhaustVelocity", v)}
          />
          <Slider
            label={t("hl.controls.slider.wake_diameter")}
            id="wakeDiameter"
            min={10}
            max={50}
            step={1}
            value={params.wakeDiameter}
            unit="ft"
            onChange={(v) => onSetParam("wakeDiameter", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("hl.controls.section.craft")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("hl.controls.slider.heli_weight")}
            id="heliWeight"
            min={1000}
            max={8000}
            step={50}
            value={params.heliWeight}
            unit="lb"
            onChange={(v) => onSetParam("heliWeight", v)}
          />
          <Slider
            label={t("hl.controls.slider.air_density")}
            id="airDensity"
            min={0.05}
            max={0.1}
            step={0.001}
            value={params.airDensity}
            unit="lb/ft³"
            onChange={(v) => onSetParam("airDensity", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("hl.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showAirflow"
            label={t("hl.controls.toggle.airflow")}
            checked={visibility.showAirflow}
            onChange={() => onToggle("showAirflow")}
          />
          <Toggle
            id="showForces"
            label={t("hl.controls.toggle.forces")}
            checked={visibility.showForces}
            onChange={() => onToggle("showForces")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("hl.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("hl.controls.btn.resume") : t("hl.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
