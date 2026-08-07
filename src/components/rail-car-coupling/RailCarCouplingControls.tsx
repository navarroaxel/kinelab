"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  RailCarCouplingParams,
  RailCarCouplingVisibility,
} from "@/types/simulator";

interface Props {
  params: RailCarCouplingParams;
  visibility: RailCarCouplingVisibility;
  onSetParam: <K extends keyof RailCarCouplingParams>(
    key: K,
    value: RailCarCouplingParams[K],
  ) => void;
  onToggle: (key: keyof RailCarCouplingVisibility) => void;
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

export function RailCarCouplingControls({
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
          {t("rail-car-coupling.controls.section.cars")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("rail-car-coupling.controls.slider.mass1")}
            id="mass1"
            min={5000}
            max={100000}
            step={1000}
            value={params.mass1}
            unit="kg"
            onChange={(v) => onSetParam("mass1", v)}
          />
          <Slider
            label={t("rail-car-coupling.controls.slider.speed1")}
            id="speed1Kmh"
            min={0.5}
            max={20}
            step={0.1}
            value={params.speed1Kmh}
            unit="km/h"
            onChange={(v) => onSetParam("speed1Kmh", v)}
          />
          <Slider
            label={t("rail-car-coupling.controls.slider.mass2")}
            id="mass2"
            min={5000}
            max={100000}
            step={1000}
            value={params.mass2}
            unit="kg"
            onChange={(v) => onSetParam("mass2", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("rail-car-coupling.controls.section.coupling")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("rail-car-coupling.controls.slider.coupling_time")}
            id="couplingTime"
            min={0.5}
            max={10}
            step={0.1}
            value={params.couplingTime}
            unit="s"
            onChange={(v) => onSetParam("couplingTime", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("rail-car-coupling.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showForces"
            label={t("rail-car-coupling.controls.toggle.forces")}
            checked={visibility.showForces}
            onChange={() => onToggle("showForces")}
          />
          <Toggle
            id="showVelocityLabels"
            label={t("rail-car-coupling.controls.toggle.velocity_labels")}
            checked={visibility.showVelocityLabels}
            onChange={() => onToggle("showVelocityLabels")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("rail-car-coupling.controls.btn.reset")}
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
            ? t("rail-car-coupling.controls.btn.resume")
            : t("rail-car-coupling.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
