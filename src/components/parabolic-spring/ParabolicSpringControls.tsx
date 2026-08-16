"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { pathEndX } from "@/lib/parabolicSpringKinematics";
import type {
  ParabolicSpringParams,
  ParabolicSpringVisibility,
} from "@/types/simulator";

interface Props {
  params: ParabolicSpringParams;
  visibility: ParabolicSpringVisibility;
  onSetParam: <K extends keyof ParabolicSpringParams>(
    key: K,
    value: ParabolicSpringParams[K],
  ) => void;
  onToggle: (key: keyof ParabolicSpringVisibility) => void;
  onReset: () => void;
  onSnapToStart: () => void;
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

export function ParabolicSpringControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  onSnapToStart,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();
  const endX = pathEndX(params);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ps.controls.section.instant")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("ps.controls.slider.start_x")}
            id="startX"
            min={0}
            max={Number.isFinite(endX) ? Number((endX - 0.05).toFixed(2)) : 3}
            step={0.05}
            value={params.startX}
            unit="m"
            decimals={2}
            onChange={(v) => onSetParam("startX", v)}
          />
          <Slider
            label={t("ps.controls.slider.start_speed")}
            id="startSpeed"
            min={0}
            max={20}
            step={0.1}
            value={params.startSpeed}
            unit="m/s"
            onChange={(v) => onSetParam("startSpeed", v)}
          />
          <button
            onClick={onSnapToStart}
            className="rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {t("ps.controls.btn.statement")}
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ps.controls.section.path")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("ps.controls.slider.vertex")}
            id="vertex"
            min={0.5}
            max={4}
            step={0.1}
            value={params.vertex}
            unit="m"
            onChange={(v) => onSetParam("vertex", v)}
          />
          <Slider
            label={t("ps.controls.slider.curvature")}
            id="curvatureCoeff"
            min={0.1}
            max={1.5}
            step={0.05}
            value={params.curvatureCoeff}
            unit="m⁻¹"
            decimals={2}
            onChange={(v) => onSetParam("curvatureCoeff", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ps.controls.section.spring")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("ps.controls.slider.stiffness")}
            id="stiffness"
            min={0}
            max={80}
            step={1}
            value={params.stiffness}
            unit="N/m"
            decimals={0}
            onChange={(v) => onSetParam("stiffness", v)}
          />
          <Slider
            label={t("ps.controls.slider.natural_length")}
            id="naturalLength"
            min={0}
            max={2}
            step={0.05}
            value={params.naturalLength}
            unit="m"
            decimals={2}
            onChange={(v) => onSetParam("naturalLength", v)}
          />
          <Slider
            label={t("ps.controls.slider.mass")}
            id="mass"
            min={0.5}
            max={30}
            step={0.5}
            value={params.mass}
            unit="kg"
            onChange={(v) => onSetParam("mass", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ps.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showWeight"
            label={t("ps.controls.toggle.weight")}
            checked={visibility.showWeight}
            onChange={() => onToggle("showWeight")}
          />
          <Toggle
            id="showSpringForce"
            label={t("ps.controls.toggle.spring_force")}
            checked={visibility.showSpringForce}
            onChange={() => onToggle("showSpringForce")}
          />
          <Toggle
            id="showNormal"
            label={t("ps.controls.toggle.normal")}
            checked={visibility.showNormal}
            onChange={() => onToggle("showNormal")}
          />
          <Toggle
            id="showTangential"
            label={t("ps.controls.toggle.tangential")}
            checked={visibility.showTangential}
            onChange={() => onToggle("showTangential")}
          />
          <Toggle
            id="showFrame"
            label={t("ps.controls.toggle.frame")}
            checked={visibility.showFrame}
            onChange={() => onToggle("showFrame")}
          />
          <Toggle
            id="showCurvature"
            label={t("ps.controls.toggle.curvature")}
            checked={visibility.showCurvature}
            onChange={() => onToggle("showCurvature")}
          />
          <Toggle
            id="showSpring"
            label={t("ps.controls.toggle.spring")}
            checked={visibility.showSpring}
            onChange={() => onToggle("showSpring")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("ps.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("ps.controls.btn.play") : t("ps.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
