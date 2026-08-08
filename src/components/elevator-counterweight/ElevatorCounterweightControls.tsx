"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type {
  ElevatorCounterweightParams,
  ElevatorCounterweightVisibility,
} from "@/types/simulator";

interface Props {
  params: ElevatorCounterweightParams;
  visibility: ElevatorCounterweightVisibility;
  onSetParam: <K extends keyof ElevatorCounterweightParams>(
    key: K,
    value: ElevatorCounterweightParams[K],
  ) => void;
  onToggle: (key: keyof ElevatorCounterweightVisibility) => void;
  onReset: () => void;
  paused: boolean;
  onTogglePause: () => void;
}

interface SliderProps {
  label: ReactNode;
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

const PRESETS = [
  { key: "a", velocity: -3, acceleration: 0 },
  { key: "b", velocity: 3, acceleration: -0.5 },
] as const;

export function ElevatorCounterweightControls({
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
          {t("elevator-counterweight.controls.section.masses")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={withSubscripts(t("elevator-counterweight.controls.slider.elevator_mass"))}
            id="elevatorMass"
            min={500}
            max={6000}
            step={50}
            value={params.elevatorMass}
            unit="kg"
            onChange={(v) => onSetParam("elevatorMass", v)}
          />
          <Slider
            label={withSubscripts(t("elevator-counterweight.controls.slider.counterweight_mass"))}
            id="counterweightMass"
            min={200}
            max={6000}
            step={50}
            value={params.counterweightMass}
            unit="kg"
            onChange={(v) => onSetParam("counterweightMass", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("elevator-counterweight.controls.section.motion")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("elevator-counterweight.controls.slider.velocity")}
            id="elevatorVelocity"
            min={-6}
            max={6}
            step={0.1}
            value={params.elevatorVelocity}
            unit="m/s"
            onChange={(v) => onSetParam("elevatorVelocity", v)}
          />
          <Slider
            label={t("elevator-counterweight.controls.slider.acceleration")}
            id="elevatorAcceleration"
            min={-2}
            max={2}
            step={0.1}
            value={params.elevatorAcceleration}
            unit="m/s²"
            onChange={(v) => onSetParam("elevatorAcceleration", v)}
          />
        </div>
        <div className="mt-2 flex gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              onClick={() => {
                onSetParam("elevatorVelocity", preset.velocity);
                onSetParam("elevatorAcceleration", preset.acceleration);
              }}
              className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {t(`elevator-counterweight.controls.btn.case_${preset.key}` as const)}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("elevator-counterweight.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showCars"
            label={t("elevator-counterweight.controls.toggle.cars")}
            checked={visibility.showCars}
            onChange={() => onToggle("showCars")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("elevator-counterweight.controls.btn.reset")}
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
            ? t("elevator-counterweight.controls.btn.resume")
            : t("elevator-counterweight.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
