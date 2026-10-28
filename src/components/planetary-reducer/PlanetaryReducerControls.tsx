"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type {
  PlanetaryReducerParams,
  PlanetaryReducerVisibility,
} from "@/types/simulator";

interface Props {
  params: PlanetaryReducerParams;
  visibility: PlanetaryReducerVisibility;
  timeScale: number;
  onSetParam: <K extends keyof PlanetaryReducerParams>(
    key: K,
    value: PlanetaryReducerParams[K],
  ) => void;
  onSetTimeScale: (value: number) => void;
  onToggle: (key: keyof PlanetaryReducerVisibility) => void;
  onReset: () => void;
  onSnapToStatement: () => void;
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
  decimals?: number;
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
  decimals = 1,
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
          {value.toFixed(decimals)}
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

export function PlanetaryReducerControls({
  params,
  visibility,
  timeScale,
  onSetParam,
  onSetTimeScale,
  onToggle,
  onReset,
  onSnapToStatement,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();
  const ringCm = (params.sunRadius + 2 * params.planetRadius) * 100;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("pr.controls.section.mechanism")}
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={onSnapToStatement}
            className="rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {t("pr.controls.btn.statement")}
          </button>
          <Slider
            label={t("pr.controls.slider.rpm_sun")}
            id="rpmSun"
            min={-2400}
            max={2400}
            step={50}
            value={params.rpmSun}
            unit="rpm"
            decimals={0}
            onChange={(v) => onSetParam("rpmSun", v)}
          />
          <Slider
            label={t("pr.controls.slider.sun_radius")}
            id="sunRadius"
            min={10}
            max={40}
            step={1}
            value={params.sunRadius * 100}
            unit="cm"
            decimals={0}
            onChange={(v) => onSetParam("sunRadius", v / 100)}
          />
          <Slider
            label={t("pr.controls.slider.planet_radius")}
            id="planetRadius"
            min={5}
            max={40}
            step={1}
            value={params.planetRadius * 100}
            unit="cm"
            decimals={0}
            onChange={(v) => onSetParam("planetRadius", v / 100)}
          />
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {withSubscripts(t("pr.controls.derived.ring"))} ={" "}
            {ringCm.toFixed(0)} cm
          </p>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("pr.controls.section.animation")}
        </h3>
        <Slider
          label={t("pr.controls.slider.time_scale")}
          id="timeScale"
          min={0.005}
          max={0.2}
          step={0.005}
          value={timeScale}
          decimals={3}
          onChange={onSetTimeScale}
        />
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("pr.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showVelocity"
            label={t("pr.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="showCenter"
            label={t("pr.controls.toggle.center")}
            checked={visibility.showCenter}
            onChange={() => onToggle("showCenter")}
          />
          <Toggle
            id="showCarrier"
            label={t("pr.controls.toggle.carrier")}
            checked={visibility.showCarrier}
            onChange={() => onToggle("showCarrier")}
          />
          <Toggle
            id="showMarks"
            label={t("pr.controls.toggle.marks")}
            checked={visibility.showMarks}
            onChange={() => onToggle("showMarks")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("pr.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("pr.controls.btn.play") : t("pr.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
