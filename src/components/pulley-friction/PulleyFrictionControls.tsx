"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { optimalAngle } from "@/lib/pulleyFrictionKinematics";
import type {
  PulleyFrictionParams,
  PulleyFrictionVisibility,
} from "@/types/simulator";

interface Props {
  params: PulleyFrictionParams;
  visibility: PulleyFrictionVisibility;
  onSetParam: <K extends keyof PulleyFrictionParams>(
    key: K,
    value: PulleyFrictionParams[K],
  ) => void;
  onToggle: (key: keyof PulleyFrictionVisibility) => void;
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

export function PulleyFrictionControls({
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
          {t("pulley-friction.controls.section.blocks")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("pulley-friction.controls.slider.weight_a")}
            id="weightA"
            min={100}
            max={3000}
            step={10}
            value={params.weightA}
            unit="N"
            onChange={(v) => onSetParam("weightA", v)}
          />
          <Slider
            label={t("pulley-friction.controls.slider.weight_b")}
            id="weightB"
            min={50}
            max={1000}
            step={10}
            value={params.weightB}
            unit="N"
            onChange={(v) => onSetParam("weightB", v)}
          />
          <Slider
            label={t("pulley-friction.controls.slider.friction")}
            id="frictionCoefficient"
            min={0}
            max={0.6}
            step={0.01}
            value={params.frictionCoefficient}
            onChange={(v) => onSetParam("frictionCoefficient", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("pulley-friction.controls.section.geometry")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("pulley-friction.controls.slider.incline_angle")}
            id="inclineAngle"
            min={5}
            max={60}
            step={1}
            value={params.inclineAngle}
            unit="°"
            onChange={(v) => onSetParam("inclineAngle", v)}
          />
          <Slider
            label={t("pulley-friction.controls.slider.pull_angle")}
            id="pullAngle"
            min={0}
            max={60}
            step={0.5}
            value={params.pullAngle}
            unit="°"
            onChange={(v) => onSetParam("pullAngle", v)}
          />
          <button
            onClick={() => onSetParam("pullAngle", optimalAngle(params))}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("pulley-friction.controls.btn.set_optimal")}
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("pulley-friction.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showBlocks"
            label={t("pulley-friction.controls.toggle.blocks")}
            checked={visibility.showBlocks}
            onChange={() => onToggle("showBlocks")}
          />
          <Toggle
            id="showForceSweep"
            label={t("pulley-friction.controls.toggle.force_sweep")}
            checked={visibility.showForceSweep}
            onChange={() => onToggle("showForceSweep")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("pulley-friction.controls.btn.reset")}
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
            ? t("pulley-friction.controls.btn.resume")
            : t("pulley-friction.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
