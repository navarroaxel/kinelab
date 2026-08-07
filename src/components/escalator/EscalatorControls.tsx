"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  EscalatorParams,
  EscalatorVisibility,
} from "@/types/simulator";

interface Props {
  params: EscalatorParams;
  visibility: EscalatorVisibility;
  onSetParam: <K extends keyof EscalatorParams>(
    key: K,
    value: EscalatorParams[K],
  ) => void;
  onToggle: (key: keyof EscalatorVisibility) => void;
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

export function EscalatorControls({
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
          {t("escalator.controls.section.motor")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("escalator.controls.slider.voltage")}
            id="voltage"
            min={200}
            max={500}
            step={5}
            value={params.voltage}
            unit="V"
            onChange={(v) => onSetParam("voltage", v)}
          />
          <Slider
            label={t("escalator.controls.slider.current")}
            id="lineCurrent"
            min={1}
            max={15}
            step={0.005}
            value={params.lineCurrent}
            unit="A"
            onChange={(v) => onSetParam("lineCurrent", v)}
          />
          <Slider
            label={t("escalator.controls.slider.power_factor")}
            id="powerFactor"
            min={0.5}
            max={1}
            step={0.01}
            value={params.powerFactor}
            onChange={(v) => onSetParam("powerFactor", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("escalator.controls.section.load")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("escalator.controls.slider.num_people")}
            id="numPeople"
            min={1}
            max={30}
            step={1}
            value={params.numPeople}
            onChange={(v) => onSetParam("numPeople", v)}
          />
          <Slider
            label={t("escalator.controls.slider.person_mass")}
            id="personMass"
            min={40}
            max={120}
            step={1}
            value={params.personMass}
            unit="kg"
            onChange={(v) => onSetParam("personMass", v)}
          />
          <Slider
            label={t("escalator.controls.slider.height")}
            id="height"
            min={2}
            max={15}
            step={0.5}
            value={params.height}
            unit="m"
            onChange={(v) => onSetParam("height", v)}
          />
          <Slider
            label={t("escalator.controls.slider.lift_time")}
            id="liftTime"
            min={10}
            max={120}
            step={1}
            value={params.liftTime}
            unit="s"
            onChange={(v) => onSetParam("liftTime", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("escalator.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showPassengers"
            label={t("escalator.controls.toggle.passengers")}
            checked={visibility.showPassengers}
            onChange={() => onToggle("showPassengers")}
          />
          <Toggle
            id="showPowerFlow"
            label={t("escalator.controls.toggle.power_flow")}
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
          {t("escalator.controls.btn.reset")}
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
            ? t("escalator.controls.btn.resume")
            : t("escalator.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
