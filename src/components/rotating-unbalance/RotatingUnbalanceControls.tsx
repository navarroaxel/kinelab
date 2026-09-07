"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { RotatingUnbalanceParams } from "@/types/simulator";

interface Props {
  params: RotatingUnbalanceParams;
  onSetParam: <K extends keyof RotatingUnbalanceParams>(
    key: K,
    value: RotatingUnbalanceParams[K],
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

export function RotatingUnbalanceControls({
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
          {t("vib1.controls.section.motor")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib1.controls.slider.motor_mass")}
            id="motorMass"
            min={10}
            max={60}
            step={1}
            value={params.motorMass}
            unit="kg"
            onChange={(v) => onSetParam("motorMass", v)}
          />
          <Slider
            label={t("vib1.controls.slider.rpm")}
            id="rpm"
            min={0}
            max={3000}
            step={10}
            value={params.rpm}
            unit="rpm"
            onChange={(v) => onSetParam("rpm", v)}
          />
          <Slider
            label={t("vib1.controls.slider.damping_ratio")}
            id="dampingRatio"
            min={0}
            max={0.5}
            step={0.005}
            value={params.dampingRatio}
            unit="ζ"
            onChange={(v) => onSetParam("dampingRatio", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vib1.controls.section.unbalance")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib1.controls.slider.unbalance_mass")}
            id="unbalanceMass"
            min={0.005}
            max={0.1}
            step={0.001}
            value={params.unbalanceMass}
            unit="kg"
            onChange={(v) => onSetParam("unbalanceMass", v)}
          />
          <Slider
            label={t("vib1.controls.slider.eccentricity")}
            id="eccentricity"
            min={0.02}
            max={0.3}
            step={0.005}
            value={params.eccentricity}
            unit="m"
            onChange={(v) => onSetParam("eccentricity", v)}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("vib1.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("vib1.controls.btn.resume") : t("vib1.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
