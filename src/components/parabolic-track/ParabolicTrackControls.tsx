"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type {
  ParabolicTrackParams,
  ParabolicTrackVisibility,
} from "@/types/simulator";

interface Props {
  params: ParabolicTrackParams;
  visibility: ParabolicTrackVisibility;
  onSetParam: <K extends keyof ParabolicTrackParams>(
    key: K,
    value: ParabolicTrackParams[K],
  ) => void;
  onToggle: (key: keyof ParabolicTrackVisibility) => void;
  onReset: () => void;
}

interface SliderProps {
  label: React.ReactNode;
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

export function ParabolicTrackControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("parabolic-track.controls.section.parameters")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("parabolic-track.controls.slider.coeff")}
            id="coeff"
            min={40}
            max={160}
            step={5}
            value={Math.round(1 / params.coeff)}
            onChange={(k) => onSetParam("coeff", 1 / k)}
          />
          <Slider
            label={withSubscripts(t("parabolic-track.controls.slider.xa"))}
            id="xA"
            min={-30}
            max={30}
            step={1}
            value={params.xA}
            unit="m"
            onChange={(v) => onSetParam("xA", v)}
          />
          <Slider
            label={t("parabolic-track.controls.slider.v")}
            id="v"
            min={0}
            max={30}
            step={0.5}
            value={params.v}
            unit="m/s"
            onChange={(v) => onSetParam("v", v)}
          />
          <Slider
            label={withSubscripts(t("parabolic-track.controls.slider.vdot"))}
            id="vDot"
            min={-10}
            max={10}
            step={0.5}
            value={params.vDot}
            unit="m/s²"
            onChange={(v) => onSetParam("vDot", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("parabolic-track.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showOsculatingCircle"
            label={t("parabolic-track.controls.toggle.osculating")}
            checked={visibility.showOsculatingCircle}
            onChange={() => onToggle("showOsculatingCircle")}
          />
          <Toggle
            id="showVelocity"
            label={t("parabolic-track.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="showAcceleration"
            label={t("parabolic-track.controls.toggle.acceleration")}
            checked={visibility.showAcceleration}
            onChange={() => onToggle("showAcceleration")}
          />
          <Toggle
            id="showParallelogram"
            label={t("parabolic-track.controls.toggle.parallelogram")}
            checked={visibility.showParallelogram}
            onChange={() => onToggle("showParallelogram")}
          />
        </div>
      </section>

      <button
        onClick={onReset}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {t("parabolic-track.controls.btn.reset")}
      </button>
    </div>
  );
}
