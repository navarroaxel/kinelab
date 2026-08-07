"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  StagedRocketParams,
  StagedRocketVisibility,
} from "@/types/simulator";

interface Props {
  params: StagedRocketParams;
  visibility: StagedRocketVisibility;
  onSetParam: <K extends keyof StagedRocketParams>(
    key: K,
    value: StagedRocketParams[K],
  ) => void;
  onToggle: (key: keyof StagedRocketVisibility) => void;
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

export function StagedRocketControls({
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
          {t("staged-rocket.controls.section.payload")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("staged-rocket.controls.slider.payload")}
            id="payloadMass"
            min={100}
            max={2000}
            step={10}
            value={params.payloadMass}
            unit="kg"
            onChange={(v) => onSetParam("payloadMass", v)}
          />
          <Slider
            label={t("staged-rocket.controls.slider.fuel_rate")}
            id="fuelRate"
            min={50}
            max={500}
            step={5}
            value={params.fuelRate}
            unit="kg/s"
            onChange={(v) => onSetParam("fuelRate", v)}
          />
          <Slider
            label={t("staged-rocket.controls.slider.exhaust")}
            id="exhaustVelocity"
            min={1500}
            max={5000}
            step={50}
            value={params.exhaustVelocity}
            unit="m/s"
            onChange={(v) => onSetParam("exhaustVelocity", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("staged-rocket.controls.section.single")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("staged-rocket.controls.slider.single_mass")}
            id="singleStageMass"
            min={2000}
            max={30000}
            step={100}
            value={params.singleStageMass}
            unit="kg"
            onChange={(v) => onSetParam("singleStageMass", v)}
          />
          <Slider
            label={t("staged-rocket.controls.slider.single_fuel")}
            id="singleStageFuelMass"
            min={1000}
            max={params.singleStageMass}
            step={100}
            value={params.singleStageFuelMass}
            unit="kg"
            onChange={(v) => onSetParam("singleStageFuelMass", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("staged-rocket.controls.section.two")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("staged-rocket.controls.slider.two_mass")}
            id="twoStageMassEach"
            min={1000}
            max={15000}
            step={100}
            value={params.twoStageMassEach}
            unit="kg"
            onChange={(v) => onSetParam("twoStageMassEach", v)}
          />
          <Slider
            label={t("staged-rocket.controls.slider.two_fuel")}
            id="twoStageFuelMassEach"
            min={500}
            max={params.twoStageMassEach}
            step={100}
            value={params.twoStageFuelMassEach}
            unit="kg"
            onChange={(v) => onSetParam("twoStageFuelMassEach", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("staged-rocket.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showSingleStage"
            label={t("staged-rocket.controls.toggle.single")}
            checked={visibility.showSingleStage}
            onChange={() => onToggle("showSingleStage")}
          />
          <Toggle
            id="showTwoStage"
            label={t("staged-rocket.controls.toggle.two")}
            checked={visibility.showTwoStage}
            onChange={() => onToggle("showTwoStage")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("staged-rocket.controls.btn.reset")}
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
            ? t("staged-rocket.controls.btn.resume")
            : t("staged-rocket.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
