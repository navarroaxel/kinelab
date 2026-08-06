"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { vMaxOf, kOf, timeToHalfVMax } from "@/lib/dragDescentKinematics";
import type {
  DragDescentParams,
  DragDescentVisibility,
} from "@/types/simulator";

interface Props {
  params: DragDescentParams;
  visibility: DragDescentVisibility;
  onSetParam: <K extends keyof DragDescentParams>(
    key: K,
    value: DragDescentParams[K],
  ) => void;
  onToggle: (key: keyof DragDescentVisibility) => void;
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

export function DragDescentControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();
  const vMax = vMaxOf(params);
  const k = kOf(params);
  const tHalf = timeToHalfVMax(params);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("drag-descent.controls.section.parameters")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("drag-descent.controls.slider.a")}
            id="A"
            min={0.02}
            max={0.4}
            step={0.001}
            value={params.A}
            unit="m/s²"
            onChange={(v) => onSetParam("A", v)}
          />
          <Slider
            label={t("drag-descent.controls.slider.b")}
            id="B"
            min={0.0001}
            max={0.005}
            step={0.0001}
            value={params.B}
            unit="1/m"
            onChange={(v) => onSetParam("B", v)}
          />
          <Slider
            label={t("drag-descent.controls.slider.tmax")}
            id="tMax"
            min={60}
            max={600}
            step={10}
            value={params.tMax}
            unit="s"
            onChange={(v) => onSetParam("tMax", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("drag-descent.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showVelocityArrow"
            label={t("drag-descent.controls.toggle.velocity")}
            checked={visibility.showVelocityArrow}
            onChange={() => onToggle("showVelocityArrow")}
          />
          <Toggle
            id="showDragArrow"
            label={t("drag-descent.controls.toggle.drag")}
            checked={visibility.showDragArrow}
            onChange={() => onToggle("showDragArrow")}
          />
          <Toggle
            id="showTrace"
            label={t("drag-descent.controls.toggle.trace")}
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
          {t("drag-descent.controls.btn.reset")}
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
            ? t("drag-descent.controls.btn.resume")
            : t("drag-descent.controls.btn.pause")}
        </button>
      </div>

      <section className="flex flex-col gap-1.5 border-t border-gray-100 pt-3 text-[10px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="flex justify-between gap-2">
          <span>{t("drag-descent.controls.info.vmax")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {vMax.toFixed(2)} m/s
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t("drag-descent.controls.info.k")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {k.toFixed(6)} s⁻¹
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t("drag-descent.controls.info.thalf")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {tHalf.toFixed(2)} s
          </span>
        </div>
      </section>
    </div>
  );
}
