"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  CircularOrbitParams,
  CircularOrbitState,
  CircularOrbitVisibility,
} from "@/types/simulator";

interface Props {
  params: CircularOrbitParams;
  state: CircularOrbitState;
  visibility: CircularOrbitVisibility;
  onSetParam: <K extends keyof CircularOrbitParams>(
    key: K,
    value: CircularOrbitParams[K],
  ) => void;
  onToggle: (key: keyof CircularOrbitVisibility) => void;
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

export function CircularOrbitControls({
  params,
  state,
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
          {t("circular-orbit.controls.section.parameters")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("circular-orbit.controls.slider.v")}
            id="vKmh"
            min={15000}
            max={40000}
            step={500}
            value={params.vKmh}
            unit="km/h"
            onChange={(v) => onSetParam("vKmh", v)}
          />
          <Slider
            label={t("circular-orbit.controls.slider.r_planet")}
            id="R"
            min={1500}
            max={70000}
            step={100}
            value={params.R}
            unit="km"
            onChange={(v) => onSetParam("R", v)}
          />
          <Slider
            label={t("circular-orbit.controls.slider.g")}
            id="g"
            min={1}
            max={25}
            step={0.1}
            value={params.g}
            unit="m/s²"
            onChange={(v) => onSetParam("g", v)}
          />
        </div>
        {state.hitsSurface && (
          <p className="mt-2 text-[10px] leading-relaxed text-rose-600 dark:text-rose-400">
            {t("circular-orbit.controls.warn.surface")}
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("circular-orbit.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showVelocity"
            label={t("circular-orbit.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="showNormalAccel"
            label={t("circular-orbit.controls.toggle.normal_accel")}
            checked={visibility.showNormalAccel}
            onChange={() => onToggle("showNormalAccel")}
          />
          <Toggle
            id="showDimensions"
            label={t("circular-orbit.controls.toggle.dimensions")}
            checked={visibility.showDimensions}
            onChange={() => onToggle("showDimensions")}
          />
          <Toggle
            id="showTrace"
            label={t("circular-orbit.controls.toggle.trace")}
            checked={visibility.showTrace}
            onChange={() => onToggle("showTrace")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("circular-orbit.controls.btn.reset")}
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
            ? t("circular-orbit.controls.btn.resume")
            : t("circular-orbit.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
