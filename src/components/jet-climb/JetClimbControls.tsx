"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { JetClimbParams, JetClimbVisibility } from "@/types/simulator";

interface Props {
  params: JetClimbParams;
  visibility: JetClimbVisibility;
  onSetParam: <K extends keyof JetClimbParams>(
    key: K,
    value: JetClimbParams[K],
  ) => void;
  onToggle: (key: keyof JetClimbVisibility) => void;
  onReset: () => void;
  paused: boolean;
  onTogglePause: () => void;
}

interface SliderProps {
  label: ReactNode;
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

export function JetClimbControls({
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
          {t("jc.controls.section.climb")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("jc.controls.slider.mass")}
            id="massMg"
            min={5}
            max={40}
            step={0.5}
            value={params.massMg}
            unit="Mg"
            onChange={(v) => onSetParam("massMg", v)}
          />
          <Slider
            label={t("jc.controls.slider.angle")}
            id="climbAngleDeg"
            min={5}
            max={40}
            step={1}
            value={params.climbAngleDeg}
            unit="°"
            onChange={(v) => onSetParam("climbAngleDeg", v)}
          />
          <Slider
            label={withSubscripts(t("jc.controls.slider.climb_speed"))}
            id="climbSpeedKmh"
            min={300}
            max={1200}
            step={2}
            value={params.climbSpeedKmh}
            unit="km/h"
            onChange={(v) => onSetParam("climbSpeedKmh", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("jc.controls.section.engines")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("jc.controls.slider.mass_flow")}
            id="massFlowRate"
            min={100}
            max={600}
            step={5}
            value={params.massFlowRate}
            unit="kg/s"
            onChange={(v) => onSetParam("massFlowRate", v)}
          />
          <Slider
            label={withSubscripts(t("jc.controls.slider.exhaust_velocity"))}
            id="exhaustVelocity"
            min={300}
            max={1000}
            step={5}
            value={params.exhaustVelocity}
            unit="m/s"
            onChange={(v) => onSetParam("exhaustVelocity", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("jc.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showVectors"
            label={t("jc.controls.toggle.vectors")}
            checked={visibility.showVectors}
            onChange={() => onToggle("showVectors")}
          />
          <Toggle
            id="showSpeedLines"
            label={t("jc.controls.toggle.speed_lines")}
            checked={visibility.showSpeedLines}
            onChange={() => onToggle("showSpeedLines")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("jc.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("jc.controls.btn.resume") : t("jc.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
