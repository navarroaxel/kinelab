"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { VibrationIsolationParams } from "@/types/simulator";

interface Props {
  params: VibrationIsolationParams;
  onSetParam: <K extends keyof VibrationIsolationParams>(
    key: K,
    value: VibrationIsolationParams[K],
  ) => void;
  onReset: () => void;
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

export function VibrationIsolationControls({
  params,
  onSetParam,
  onReset,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vib3.controls.section.system")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib3.controls.slider.mass")}
            id="mass"
            min={50}
            max={500}
            step={10}
            value={params.mass}
            unit="kg"
            onChange={(v) => onSetParam("mass", v)}
          />
          <Slider
            label={t("vib3.controls.slider.damping_ratio")}
            id="dampingRatio"
            min={0}
            max={1}
            step={0.01}
            value={params.dampingRatio}
            unit="ζ"
            onChange={(v) => onSetParam("dampingRatio", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vib3.controls.section.target")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib3.controls.slider.target")}
            id="targetTransmissibility"
            min={0.02}
            max={0.95}
            step={0.01}
            value={params.targetTransmissibility}
            unit="T"
            onChange={(v) => onSetParam("targetTransmissibility", v)}
          />
        </div>
      </section>

      <button
        onClick={onReset}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {t("vib3.controls.btn.reset")}
      </button>
    </div>
  );
}
