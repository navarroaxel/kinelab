"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  BankedCurveLimits,
  BankedCurveParams,
  BankedCurveVisibility,
} from "@/types/simulator";

interface Props {
  params: BankedCurveParams;
  visibility: BankedCurveVisibility;
  limits: BankedCurveLimits;
  onSetParam: <K extends keyof BankedCurveParams>(
    key: K,
    value: BankedCurveParams[K],
  ) => void;
  onToggle: (key: keyof BankedCurveVisibility) => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onResetCamera: () => void;
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
  decimals = 0,
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

export function BankedCurveControls({
  params,
  visibility,
  limits,
  onSetParam,
  onToggle,
  onReset,
  onSetSpeed,
  onResetCamera,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();

  const jumpButton = (
    key: string,
    label: string,
    speed: number | null,
  ) => (
    <button
      key={key}
      onClick={() => speed !== null && onSetSpeed(speed)}
      disabled={speed === null}
      className="flex-1 rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("bc.controls.section.driving")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("bc.controls.slider.speed")}
            id="speed"
            min={0}
            max={45}
            step={0.1}
            value={params.speed}
            unit="m/s"
            decimals={1}
            onChange={(v) => onSetParam("speed", v)}
          />
        </div>
        <div className="mt-3 flex gap-2">
          {jumpButton("min", t("bc.controls.btn.v_min"), limits.minSpeed)}
          {jumpButton("ideal", t("bc.controls.btn.v_ideal"), limits.idealSpeed)}
          {jumpButton("max", t("bc.controls.btn.v_max"), limits.maxSpeed)}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("bc.controls.section.track")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("bc.controls.slider.bank")}
            id="bankDeg"
            min={0}
            max={60}
            step={1}
            value={params.bankDeg}
            unit="°"
            onChange={(v) => onSetParam("bankDeg", v)}
          />
          <Slider
            label={t("bc.controls.slider.radius")}
            id="radius"
            min={30}
            max={300}
            step={5}
            value={params.radius}
            unit="m"
            onChange={(v) => onSetParam("radius", v)}
          />
          <Slider
            label={t("bc.controls.slider.mu")}
            id="mu"
            min={0}
            max={1.2}
            step={0.05}
            value={params.mu}
            decimals={2}
            onChange={(v) => onSetParam("mu", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("bc.controls.section.car")}
        </h3>
        <Slider
          label={t("bc.controls.slider.mass")}
          id="mass"
          min={500}
          max={4000}
          step={50}
          value={params.mass}
          unit="kg"
          onChange={(v) => onSetParam("mass", v)}
        />
        <p className="mt-2 text-[10px] leading-tight text-gray-400">
          {t("bc.controls.hint.mass")}
        </p>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("bc.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showForces"
            label={t("bc.controls.toggle.forces")}
            checked={visibility.showForces}
            onChange={() => onToggle("showForces")}
          />
          <Toggle
            id="showNet"
            label={t("bc.controls.toggle.net")}
            checked={visibility.showNet}
            onChange={() => onToggle("showNet")}
          />
          <Toggle
            id="showTrack"
            label={t("bc.controls.toggle.track")}
            checked={visibility.showTrack}
            onChange={() => onToggle("showTrack")}
          />
          <Toggle
            id="showPath"
            label={t("bc.controls.toggle.path")}
            checked={visibility.showPath}
            onChange={() => onToggle("showPath")}
          />
          <Toggle
            id="showAxes"
            label={t("bc.controls.toggle.axes")}
            checked={visibility.showAxes}
            onChange={() => onToggle("showAxes")}
          />
        </div>
        <button
          onClick={onResetCamera}
          className="mt-3 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("bc.controls.btn.reset_camera")}
        </button>
        <p className="mt-2 text-[10px] leading-tight text-gray-400">
          {t("bc.controls.hint.drag")}
        </p>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("bc.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("bc.controls.btn.resume") : t("bc.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
