"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  CamFollowerExtremes,
  CamFollowerParams,
  CamFollowerVisibility,
} from "@/types/simulator";

interface Props {
  params: CamFollowerParams;
  visibility: CamFollowerVisibility;
  extremes: CamFollowerExtremes;
  onSetParam: <K extends keyof CamFollowerParams>(
    key: K,
    value: CamFollowerParams[K],
  ) => void;
  onToggle: (key: keyof CamFollowerVisibility) => void;
  onReset: () => void;
  onGoToAngle: (theta: number) => void;
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

export function CamFollowerControls({
  params,
  visibility,
  extremes,
  onSetParam,
  onToggle,
  onReset,
  onGoToAngle,
  onResetCamera,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("cf.controls.section.cam")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("cf.controls.slider.theta_dot")}
            id="thetaDot"
            min={0}
            max={30}
            step={0.5}
            value={params.thetaDot}
            unit="rad/s"
            onChange={(v) => onSetParam("thetaDot", v)}
          />
          <Slider
            label={t("cf.controls.slider.amplitude")}
            id="amplitude"
            min={0.005}
            max={0.06}
            step={0.005}
            value={params.amplitude}
            unit="m"
            onChange={(v) => onSetParam("amplitude", v)}
          />
          <Slider
            label={t("cf.controls.slider.radius")}
            id="radius"
            min={0.05}
            max={0.25}
            step={0.01}
            value={params.radius}
            unit="m"
            onChange={(v) => onSetParam("radius", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("cf.controls.section.rod")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("cf.controls.slider.mass")}
            id="mass"
            min={0.5}
            max={10}
            step={0.5}
            value={params.mass}
            unit="kg"
            onChange={(v) => onSetParam("mass", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("cf.controls.section.jump")}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onGoToAngle(extremes.verticalMaxTheta)}
            className="flex-1 rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {t("cf.controls.btn.max")}
          </button>
          <button
            onClick={() => onGoToAngle(extremes.verticalMinTheta)}
            className="flex-1 rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {t("cf.controls.btn.min")}
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("cf.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showForces"
            label={t("cf.controls.toggle.forces")}
            checked={visibility.showForces}
            onChange={() => onToggle("showForces")}
          />
          <Toggle
            id="showSlope"
            label={t("cf.controls.toggle.slope")}
            checked={visibility.showSlope}
            onChange={() => onToggle("showSlope")}
          />
          <Toggle
            id="showProfile"
            label={t("cf.controls.toggle.profile")}
            checked={visibility.showProfile}
            onChange={() => onToggle("showProfile")}
          />
          <Toggle
            id="showFrame"
            label={t("cf.controls.toggle.frame")}
            checked={visibility.showFrame}
            onChange={() => onToggle("showFrame")}
          />
          <Toggle
            id="showAxes"
            label={t("cf.controls.toggle.axes")}
            checked={visibility.showAxes}
            onChange={() => onToggle("showAxes")}
          />
        </div>
        <button
          onClick={onResetCamera}
          className="mt-3 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("cf.controls.btn.reset_camera")}
        </button>
        <p className="mt-2 text-[10px] leading-tight text-gray-400">
          {t("cf.controls.hint.drag")}
        </p>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("cf.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("cf.controls.btn.resume") : t("cf.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
