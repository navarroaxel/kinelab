"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  ParabolicBowlParams,
  ParabolicBowlVisibility,
} from "@/types/simulator";

interface Props {
  params: ParabolicBowlParams;
  visibility: ParabolicBowlVisibility;
  onSetParam: <K extends keyof ParabolicBowlParams>(
    key: K,
    value: ParabolicBowlParams[K],
  ) => void;
  onToggle: (key: keyof ParabolicBowlVisibility) => void;
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

export function ParabolicBowlControls({
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
          {t("parabolic-bowl.controls.section.track")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("parabolic-bowl.controls.slider.mass")}
            id="sphereMass"
            min={0.1}
            max={10}
            step={0.1}
            value={params.sphereMass}
            unit="kg"
            onChange={(v) => onSetParam("sphereMass", v)}
          />
          <Slider
            label={t("parabolic-bowl.controls.slider.sag")}
            id="sag"
            min={0.5}
            max={10}
            step={0.1}
            value={params.sag}
            unit="m"
            onChange={(v) => onSetParam("sag", v)}
          />
          <Slider
            label={t("parabolic-bowl.controls.slider.span")}
            id="span"
            min={1}
            max={30}
            step={0.5}
            value={params.span}
            unit="m"
            onChange={(v) => onSetParam("span", v)}
          />
          <Slider
            label={t("parabolic-bowl.controls.slider.g_limit")}
            id="gLimit"
            min={1}
            max={10}
            step={0.5}
            value={params.gLimit}
            unit="g"
            onChange={(v) => onSetParam("gLimit", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("parabolic-bowl.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showSphere"
            label={t("parabolic-bowl.controls.toggle.sphere")}
            checked={visibility.showSphere}
            onChange={() => onToggle("showSphere")}
          />
          <Toggle
            id="showNormalForce"
            label={t("parabolic-bowl.controls.toggle.normal")}
            checked={visibility.showNormalForce}
            onChange={() => onToggle("showNormalForce")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("parabolic-bowl.controls.btn.reset")}
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
            ? t("parabolic-bowl.controls.btn.resume")
            : t("parabolic-bowl.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
