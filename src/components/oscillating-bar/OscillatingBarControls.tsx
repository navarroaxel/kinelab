"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { toDegrees } from "@/lib/oscillatingBarKinematics";
import type {
  OscillatingBarLimits,
  OscillatingBarParams,
  OscillatingBarVisibility,
} from "@/types/simulator";

interface Props {
  params: OscillatingBarParams;
  visibility: OscillatingBarVisibility;
  limits: OscillatingBarLimits;
  onSetParam: <K extends keyof OscillatingBarParams>(
    key: K,
    value: OscillatingBarParams[K],
  ) => void;
  onToggle: (key: keyof OscillatingBarVisibility) => void;
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

export function OscillatingBarControls({
  params,
  visibility,
  limits,
  onSetParam,
  onToggle,
  onReset,
  onSnapToStatement,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();
  const maxDeg = toDegrees(limits.maxBarAngle);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ob.controls.section.instant")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("ob.controls.slider.target_theta")}
            id="targetThetaDeg"
            min={-Math.floor(maxDeg)}
            max={Math.floor(maxDeg)}
            step={1}
            value={params.targetThetaDeg}
            unit="°"
            decimals={0}
            onChange={(v) => onSetParam("targetThetaDeg", v)}
          />
          <p className="text-[10px] leading-tight text-gray-400">
            {t("ob.controls.hint.swing")} ±{maxDeg.toFixed(1)}°
          </p>
          <button
            onClick={onSnapToStatement}
            disabled={!limits.reachable}
            className="rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {t("ob.controls.btn.statement")}
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ob.controls.section.mechanism")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("ob.controls.slider.omega")}
            id="omega"
            min={0.5}
            max={8}
            step={0.1}
            value={params.omega}
            unit="rad/s"
            onChange={(v) => onSetParam("omega", v)}
          />
          <Slider
            label={t("ob.controls.slider.bar_length")}
            id="barLength"
            min={0.3}
            max={2.5}
            step={0.05}
            value={params.barLength}
            unit="m"
            decimals={2}
            onChange={(v) => onSetParam("barLength", v)}
          />
          <Slider
            label={t("ob.controls.slider.separation")}
            id="separation"
            min={0.5}
            max={5}
            step={0.05}
            value={params.separation}
            unit="m"
            decimals={2}
            onChange={(v) => onSetParam("separation", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ob.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showVelocity"
            label={t("ob.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="showVelocityParts"
            label={t("ob.controls.toggle.velocity_parts")}
            checked={visibility.showVelocityParts}
            onChange={() => onToggle("showVelocityParts")}
          />
          <Toggle
            id="showAccel"
            label={t("ob.controls.toggle.accel")}
            checked={visibility.showAccel}
            onChange={() => onToggle("showAccel")}
          />
          <Toggle
            id="showAccelParts"
            label={t("ob.controls.toggle.accel_parts")}
            checked={visibility.showAccelParts}
            onChange={() => onToggle("showAccelParts")}
          />
          <Toggle
            id="showAngles"
            label={t("ob.controls.toggle.angles")}
            checked={visibility.showAngles}
            onChange={() => onToggle("showAngles")}
          />
          <Toggle
            id="showTrace"
            label={t("ob.controls.toggle.trace")}
            checked={visibility.showTrace}
            onChange={() => onToggle("showTrace")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("ob.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("ob.controls.btn.play") : t("ob.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
