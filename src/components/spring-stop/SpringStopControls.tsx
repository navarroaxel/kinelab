"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  SpringStopParams,
  SpringStopVisibility,
} from "@/types/simulator";

interface Props {
  params: SpringStopParams;
  visibility: SpringStopVisibility;
  onSetParam: <K extends keyof SpringStopParams>(
    key: K,
    value: SpringStopParams[K],
  ) => void;
  onToggle: (key: keyof SpringStopVisibility) => void;
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

export function SpringStopControls({
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
          {t("spring-stop.controls.section.package")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("spring-stop.controls.slider.mass")}
            id="packageMass"
            min={10}
            max={200}
            step={5}
            value={params.packageMass}
            unit="kg"
            onChange={(v) => onSetParam("packageMass", v)}
          />
          <Slider
            label={t("spring-stop.controls.slider.angle")}
            id="inclineAngle"
            min={5}
            max={45}
            step={1}
            value={params.inclineAngle}
            unit="°"
            onChange={(v) => onSetParam("inclineAngle", v)}
          />
          <Slider
            label={t("spring-stop.controls.slider.friction")}
            id="frictionCoefficient"
            min={0}
            max={0.6}
            step={0.01}
            value={params.frictionCoefficient}
            onChange={(v) => onSetParam("frictionCoefficient", v)}
          />
          <Slider
            label={t("spring-stop.controls.slider.distance")}
            id="distanceToSpring"
            min={1}
            max={20}
            step={0.5}
            value={params.distanceToSpring}
            unit="m"
            onChange={(v) => onSetParam("distanceToSpring", v)}
          />
          <Slider
            label={t("spring-stop.controls.slider.speed")}
            id="speedAtDistance"
            min={0.5}
            max={15}
            step={0.1}
            value={params.speedAtDistance}
            unit="m/s"
            onChange={(v) => onSetParam("speedAtDistance", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("spring-stop.controls.section.spring")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("spring-stop.controls.slider.spring_constant")}
            id="springConstant"
            min={5000}
            max={60000}
            step={500}
            value={params.springConstant}
            unit="N/m"
            onChange={(v) => onSetParam("springConstant", v)}
          />
          <Slider
            label={t("spring-stop.controls.slider.precompression")}
            id="precompression"
            min={0}
            max={0.5}
            step={0.01}
            value={params.precompression}
            unit="m"
            onChange={(v) => onSetParam("precompression", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("spring-stop.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showPackage"
            label={t("spring-stop.controls.toggle.package")}
            checked={visibility.showPackage}
            onChange={() => onToggle("showPackage")}
          />
          <Toggle
            id="showEnergyBar"
            label={t("spring-stop.controls.toggle.energy_bar")}
            checked={visibility.showEnergyBar}
            onChange={() => onToggle("showEnergyBar")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("spring-stop.controls.btn.reset")}
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
            ? t("spring-stop.controls.btn.resume")
            : t("spring-stop.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
