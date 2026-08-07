"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { HoistParams, HoistState, HoistVisibility } from "@/types/simulator";

interface Props {
  params: HoistParams;
  state: HoistState;
  visibility: HoistVisibility;
  onSetParam: <K extends keyof HoistParams>(
    key: K,
    value: HoistParams[K],
  ) => void;
  onToggle: (key: keyof HoistVisibility) => void;
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

export function HoistControls({
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
          {t("hoist.controls.section.load")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("hoist.controls.slider.load_mass")}
            id="loadMass"
            min={50}
            max={1000}
            step={10}
            value={params.loadMass}
            unit="kg"
            onChange={(v) => onSetParam("loadMass", v)}
          />
          <Slider
            label={t("hoist.controls.slider.speed")}
            id="speed"
            min={0.1}
            max={5}
            step={0.1}
            value={params.speed}
            unit="m/s"
            onChange={(v) => onSetParam("speed", v)}
          />
          <Slider
            label={t("hoist.controls.slider.counterweight_mass")}
            id="counterweightMass"
            min={0}
            max={300}
            step={5}
            value={params.counterweightMass}
            unit="kg"
            onChange={(v) => onSetParam("counterweightMass", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("hoist.controls.section.motor")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("hoist.controls.slider.wattmeter")}
            id="wattmeterReading"
            min={200}
            max={8000}
            step={50}
            value={params.wattmeterReading}
            unit="W"
            onChange={(v) => onSetParam("wattmeterReading", v)}
          />
        </div>
        {state.exceedsInput && (
          <p className="mt-2 text-[10px] leading-relaxed text-rose-600 dark:text-rose-400">
            {t("hoist.controls.warn.exceeds")}
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("hoist.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showLoad"
            label={t("hoist.controls.toggle.load")}
            checked={visibility.showLoad}
            onChange={() => onToggle("showLoad")}
          />
          <Toggle
            id="showPowerFlow"
            label={t("hoist.controls.toggle.power_flow")}
            checked={visibility.showPowerFlow}
            onChange={() => onToggle("showPowerFlow")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("hoist.controls.btn.reset")}
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
            ? t("hoist.controls.btn.resume")
            : t("hoist.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
