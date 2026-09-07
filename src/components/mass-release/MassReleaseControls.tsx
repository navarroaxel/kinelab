"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { MassReleaseParams } from "@/types/simulator";

interface Props {
  params: MassReleaseParams;
  onSetParam: <K extends keyof MassReleaseParams>(
    key: K,
    value: MassReleaseParams[K],
  ) => void;
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

function Slider({ label, id, min, max, step, value, unit, onChange }: SliderProps) {
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

export function MassReleaseControls({
  params,
  onSetParam,
  onReset,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vib6.controls.section.masses")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib6.controls.slider.remaining_mass")}
            id="remainingMass"
            min={0.1}
            max={2}
            step={0.05}
            value={params.remainingMass}
            unit="kg"
            onChange={(v) => onSetParam("remainingMass", v)}
          />
          <Slider
            label={t("vib6.controls.slider.hanging_mass")}
            id="hangingMass"
            min={0.1}
            max={2}
            step={0.05}
            value={params.hangingMass}
            unit="kg"
            onChange={(v) => onSetParam("hangingMass", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vib6.controls.section.spring")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib6.controls.slider.stiffness")}
            id="stiffness"
            min={2}
            max={500}
            step={1}
            value={params.stiffness}
            unit="N/m"
            onChange={(v) => onSetParam("stiffness", v)}
          />
          <Slider
            label={t("vib6.controls.slider.damping")}
            id="damping"
            min={0}
            max={150}
            step={1}
            value={params.damping}
            unit="N·s/m"
            onChange={(v) => onSetParam("damping", v)}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("vib6.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("vib6.controls.btn.resume") : t("vib6.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
