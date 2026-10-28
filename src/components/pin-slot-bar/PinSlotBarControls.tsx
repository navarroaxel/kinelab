"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { PinSlotBarParams, PinSlotBarVisibility } from "@/types/simulator";

interface Props {
  params: PinSlotBarParams;
  visibility: PinSlotBarVisibility;
  onSetParam: <K extends keyof PinSlotBarParams>(
    key: K,
    value: PinSlotBarParams[K],
  ) => void;
  onToggle: (key: keyof PinSlotBarVisibility) => void;
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

export function PinSlotBarControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  onSnapToStatement,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("psb.controls.section.instant")}
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={onSnapToStatement}
            className="rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {t("psb.controls.btn.statement")}
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("psb.controls.section.mechanism")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("psb.controls.slider.omega_bo")}
            id="omegaBO"
            min={-4}
            max={4}
            step={0.1}
            value={params.omegaBO}
            unit="rad/s"
            onChange={(v) => onSetParam("omegaBO", v)}
          />
          <Slider
            label={t("psb.controls.slider.arm_length")}
            id="armLength"
            min={8}
            max={30}
            step={0.5}
            value={params.armLength}
            unit="cm"
            onChange={(v) => onSetParam("armLength", v)}
          />
          <Slider
            label={t("psb.controls.slider.pivot_ox")}
            id="pivotOx"
            min={20}
            max={60}
            step={1}
            value={params.pivotOx}
            unit="cm"
            decimals={0}
            onChange={(v) => onSetParam("pivotOx", v)}
          />
          <Slider
            label={t("psb.controls.slider.pivot_oy")}
            id="pivotOy"
            min={5}
            max={40}
            step={1}
            value={params.pivotOy}
            unit="cm"
            decimals={0}
            onChange={(v) => onSetParam("pivotOy", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("psb.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showVelocity"
            label={t("psb.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="showVelocityParts"
            label={t("psb.controls.toggle.velocity_parts")}
            checked={visibility.showVelocityParts}
            onChange={() => onToggle("showVelocityParts")}
          />
          <Toggle
            id="showAccel"
            label={t("psb.controls.toggle.accel")}
            checked={visibility.showAccel}
            onChange={() => onToggle("showAccel")}
          />
          <Toggle
            id="showAccelParts"
            label={t("psb.controls.toggle.accel_parts")}
            checked={visibility.showAccelParts}
            onChange={() => onToggle("showAccelParts")}
          />
          <Toggle
            id="showAngles"
            label={t("psb.controls.toggle.angles")}
            checked={visibility.showAngles}
            onChange={() => onToggle("showAngles")}
          />
          <Toggle
            id="showTrace"
            label={t("psb.controls.toggle.trace")}
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
          {t("psb.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("psb.controls.btn.play") : t("psb.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
