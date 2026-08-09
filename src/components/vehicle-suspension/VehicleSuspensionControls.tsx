"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { VehicleSuspensionParams } from "@/types/vehicle-suspension";

interface Props {
  params: VehicleSuspensionParams;
  onSetParam: <K extends keyof VehicleSuspensionParams>(
    key: K,
    value: VehicleSuspensionParams[K],
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

export function VehicleSuspensionControls({
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
          {t("vs.controls.section.vehicle")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vs.controls.slider.mass")}
            id="vehicleMass"
            min={400}
            max={2500}
            step={50}
            value={params.vehicleMass}
            unit="kg"
            onChange={(v) => onSetParam("vehicleMass", v)}
          />
          <Slider
            label={t("vs.controls.slider.static_deflection")}
            id="staticDeflection"
            min={0.02}
            max={0.2}
            step={0.005}
            value={params.staticDeflection}
            unit="m"
            onChange={(v) => onSetParam("staticDeflection", v)}
          />
          <Slider
            label={t("vs.controls.slider.damping")}
            id="dampingPerDamper"
            min={500}
            max={15000}
            step={100}
            value={params.dampingPerDamper}
            unit="N·s/m"
            onChange={(v) => onSetParam("dampingPerDamper", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vs.controls.section.excitation")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vs.controls.slider.amplitude")}
            id="excitationAmplitude"
            min={0.005}
            max={0.08}
            step={0.005}
            value={params.excitationAmplitude}
            unit="m"
            onChange={(v) => onSetParam("excitationAmplitude", v)}
          />
          <Slider
            label={t("vs.controls.slider.frequency_ratio")}
            id="frequencyRatio"
            min={0.1}
            max={3}
            step={0.05}
            value={params.frequencyRatio}
            unit="r"
            onChange={(v) => onSetParam("frequencyRatio", v)}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("vs.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("vs.controls.btn.resume") : t("vs.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
