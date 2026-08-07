"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  VehiclePowerParams,
  VehiclePowerState,
  VehiclePowerVisibility,
} from "@/types/simulator";

interface Props {
  params: VehiclePowerParams;
  state: VehiclePowerState;
  visibility: VehiclePowerVisibility;
  onSetParam: <K extends keyof VehiclePowerParams>(
    key: K,
    value: VehiclePowerParams[K],
  ) => void;
  onToggle: (key: keyof VehiclePowerVisibility) => void;
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

export function VehiclePowerControls({
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
          {t("vehicle-power.controls.section.vehicle")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vehicle-power.controls.slider.mass")}
            id="vehicleMass"
            min={500}
            max={5000}
            step={50}
            value={params.vehicleMass}
            unit="kg"
            onChange={(v) => onSetParam("vehicleMass", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vehicle-power.controls.section.calibration")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vehicle-power.controls.slider.calib_speed1")}
            id="calibSpeed1Kmh"
            min={10}
            max={100}
            step={1}
            value={params.calibSpeed1Kmh}
            unit="km/h"
            onChange={(v) => onSetParam("calibSpeed1Kmh", v)}
          />
          <Slider
            label={t("vehicle-power.controls.slider.calib_power1")}
            id="calibPower1"
            min={0.5}
            max={30}
            step={0.1}
            value={params.calibPower1}
            unit="kW"
            onChange={(v) => onSetParam("calibPower1", v)}
          />
          <Slider
            label={t("vehicle-power.controls.slider.calib_speed2")}
            id="calibSpeed2Kmh"
            min={10}
            max={100}
            step={1}
            value={params.calibSpeed2Kmh}
            unit="km/h"
            onChange={(v) => onSetParam("calibSpeed2Kmh", v)}
          />
          <Slider
            label={t("vehicle-power.controls.slider.calib_power2")}
            id="calibPower2"
            min={0.5}
            max={30}
            step={0.1}
            value={params.calibPower2}
            unit="kW"
            onChange={(v) => onSetParam("calibPower2", v)}
          />
        </div>
        {state.invalidCalibration && (
          <p className="mt-2 text-[10px] leading-relaxed text-rose-600 dark:text-rose-400">
            {t("vehicle-power.controls.warn.invalid_calibration")}
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vehicle-power.controls.section.prediction")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("vehicle-power.controls.slider.target_speed")}
            id="targetSpeedKmh"
            min={10}
            max={150}
            step={1}
            value={params.targetSpeedKmh}
            unit="km/h"
            onChange={(v) => onSetParam("targetSpeedKmh", v)}
          />
          <Slider
            label={t("vehicle-power.controls.slider.slope_speed")}
            id="slopeSpeedKmh"
            min={10}
            max={150}
            step={1}
            value={params.slopeSpeedKmh}
            unit="km/h"
            onChange={(v) => onSetParam("slopeSpeedKmh", v)}
          />
          <Slider
            label={t("vehicle-power.controls.slider.grade")}
            id="gradeDeg"
            min={0}
            max={20}
            step={0.5}
            value={params.gradeDeg}
            unit="°"
            onChange={(v) => onSetParam("gradeDeg", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("vehicle-power.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showForces"
            label={t("vehicle-power.controls.toggle.forces")}
            checked={visibility.showForces}
            onChange={() => onToggle("showForces")}
          />
          <Toggle
            id="showGradeForce"
            label={t("vehicle-power.controls.toggle.grade_force")}
            checked={visibility.showGradeForce}
            onChange={() => onToggle("showGradeForce")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("vehicle-power.controls.btn.reset")}
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
            ? t("vehicle-power.controls.btn.resume")
            : t("vehicle-power.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
