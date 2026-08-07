"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  ViscousImpactParams,
  ViscousImpactVisibility,
} from "@/types/simulator";

interface Props {
  params: ViscousImpactParams;
  visibility: ViscousImpactVisibility;
  onSetParam: <K extends keyof ViscousImpactParams>(
    key: K,
    value: ViscousImpactParams[K],
  ) => void;
  onToggle: (key: keyof ViscousImpactVisibility) => void;
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

export function ViscousImpactControls({
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
          {t("viscous-impact.controls.section.bullet")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("viscous-impact.controls.slider.mass")}
            id="bulletMass"
            min={0.002}
            max={0.05}
            step={0.001}
            value={params.bulletMass}
            unit="kg"
            onChange={(v) => onSetParam("bulletMass", v)}
          />
          <Slider
            label={t("viscous-impact.controls.slider.entry_speed")}
            id="entrySpeed"
            min={100}
            max={900}
            step={10}
            value={params.entrySpeed}
            unit="m/s"
            onChange={(v) => onSetParam("entrySpeed", v)}
          />
          <Slider
            label={t("viscous-impact.controls.slider.exit_speed")}
            id="exitSpeed"
            min={0}
            max={800}
            step={10}
            value={params.exitSpeed}
            unit="m/s"
            onChange={(v) => onSetParam("exitSpeed", v)}
          />
          <Slider
            label={t("viscous-impact.controls.slider.thickness")}
            id="plateThickness"
            min={0.005}
            max={0.1}
            step={0.001}
            value={params.plateThickness}
            unit="m"
            onChange={(v) => onSetParam("plateThickness", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("viscous-impact.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showBullet"
            label={t("viscous-impact.controls.toggle.bullet")}
            checked={visibility.showBullet}
            onChange={() => onToggle("showBullet")}
          />
          <Toggle
            id="showVelocityCurve"
            label={t("viscous-impact.controls.toggle.velocity")}
            checked={visibility.showVelocityCurve}
            onChange={() => onToggle("showVelocityCurve")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("viscous-impact.controls.btn.reset")}
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
            ? t("viscous-impact.controls.btn.resume")
            : t("viscous-impact.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
