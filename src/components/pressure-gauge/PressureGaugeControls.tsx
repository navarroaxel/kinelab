"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { PressureGaugeParams } from "@/types/simulator";

interface Props {
  params: PressureGaugeParams;
  onSetParam: <K extends keyof PressureGaugeParams>(
    key: K,
    value: PressureGaugeParams[K],
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

const ERROR_LIMIT_PRESETS = [0.01, 0.02, 0.05] as const;

export function PressureGaugeControls({ params, onSetParam, onReset }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vib5.controls.section.gauge")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib5.controls.slider.stiffness")}
            id="stiffness"
            min={5_000}
            max={50_000}
            step={500}
            value={params.stiffness}
            unit="N/m"
            onChange={(v) => onSetParam("stiffness", v)}
          />
          <Slider
            label={t("vib5.controls.slider.cycles_per_minute")}
            id="cyclesPerMinute"
            min={100}
            max={2000}
            step={10}
            value={params.cyclesPerMinute}
            unit="cpm"
            onChange={(v) => onSetParam("cyclesPerMinute", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vib5.controls.section.error_limit")}
        </h3>
        <div className="flex gap-2">
          {ERROR_LIMIT_PRESETS.map((eps) => (
            <button
              key={eps}
              onClick={() => onSetParam("errorLimit", eps)}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                params.errorLimit === eps
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {(eps * 100).toFixed(0)}%
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={onReset}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {t("vib5.controls.btn.reset")}
      </button>
    </div>
  );
}
