"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { MachineElementBaseParams } from "@/types/simulator";

interface Props {
  params: MachineElementBaseParams;
  onSetParam: <K extends keyof MachineElementBaseParams>(
    key: K,
    value: MachineElementBaseParams[K],
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

export function MachineElementBaseControls({
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
          {t("vib4.controls.section.element")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib4.controls.slider.mass")}
            id="mass"
            min={100}
            max={1000}
            step={10}
            value={params.mass}
            unit="kg"
            onChange={(v) => onSetParam("mass", v)}
          />
          <Slider
            label={t("vib4.controls.slider.damping")}
            id="damping"
            min={0}
            max={10000}
            step={100}
            value={params.damping}
            unit="N·s/m"
            onChange={(v) => onSetParam("damping", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vib4.controls.section.support")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vib4.controls.slider.amplitude")}
            id="supportAmplitude"
            min={0.001}
            max={0.02}
            step={0.001}
            value={params.supportAmplitude}
            unit="m"
            onChange={(v) => onSetParam("supportAmplitude", v)}
          />
          <Slider
            label={t("vib4.controls.slider.omega")}
            id="supportOmega"
            min={0.5}
            max={30}
            step={0.1}
            value={params.supportOmega}
            unit="rad/s"
            onChange={(v) => onSetParam("supportOmega", v)}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("vib4.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("vib4.controls.btn.resume") : t("vib4.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
