"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type {
  CableBlocksParams,
  CableBlocksVisibility,
} from "@/types/simulator";

interface Props {
  params: CableBlocksParams;
  visibility: CableBlocksVisibility;
  onSetParam: <K extends keyof CableBlocksParams>(
    key: K,
    value: CableBlocksParams[K],
  ) => void;
  onToggle: (key: keyof CableBlocksVisibility) => void;
  onReset: () => void;
  paused: boolean;
  onTogglePause: () => void;
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

export function CableBlocksControls({
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
          {t("cable-blocks.controls.section.parameters")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={withSubscripts(t("cable-blocks.controls.slider.ad"))}
            id="aD"
            min={1}
            max={15}
            step={0.5}
            value={params.aD}
            unit="m/s²"
            onChange={(v) => onSetParam("aD", v)}
          />
          <Slider
            label={t("cable-blocks.controls.slider.ccoeff")}
            id="cCoeff"
            min={0.5}
            max={10}
            step={0.5}
            value={params.cCoeff}
            onChange={(v) => onSetParam("cCoeff", v)}
          />
          <Slider
            label={t("cable-blocks.controls.slider.d0")}
            id="d0"
            min={1}
            max={10}
            step={0.5}
            value={params.d0}
            unit="m"
            onChange={(v) => onSetParam("d0", v)}
          />
          <Slider
            label={t("cable-blocks.controls.slider.runsa")}
            id="runsA"
            min={1}
            max={4}
            step={1}
            value={params.runsA}
            onChange={(v) => onSetParam("runsA", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("cable-blocks.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showVelocity"
            label={t("cable-blocks.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="showTrace"
            label={t("cable-blocks.controls.toggle.trace")}
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
          {t("cable-blocks.controls.btn.reset")}
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
            ? t("cable-blocks.controls.btn.resume")
            : t("cable-blocks.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
