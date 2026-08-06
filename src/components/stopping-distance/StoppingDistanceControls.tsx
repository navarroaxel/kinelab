"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type {
  StoppingDistanceParams,
  StoppingDistanceVisibility,
} from "@/types/simulator";

interface Props {
  params: StoppingDistanceParams;
  visibility: StoppingDistanceVisibility;
  onSetSpeed: (index: 0 | 1 | 2, value: number) => void;
  onSetParam: <K extends keyof Omit<StoppingDistanceParams, "speedsKmh">>(
    key: K,
    value: StoppingDistanceParams[K],
  ) => void;
  onToggle: (key: keyof StoppingDistanceVisibility) => void;
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

const SURFACE_PRESETS = { dry: 0.8, wet: 0.5, ice: 0.2 } as const;

export function StoppingDistanceControls({
  params,
  visibility,
  onSetSpeed,
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
          {t("stopping-distance.controls.section.speeds")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("stopping-distance.controls.slider.speed1")}
            id="speed1"
            min={10}
            max={150}
            step={5}
            value={params.speedsKmh[0]}
            unit="km/h"
            onChange={(v) => onSetSpeed(0, v)}
          />
          <Slider
            label={t("stopping-distance.controls.slider.speed2")}
            id="speed2"
            min={10}
            max={150}
            step={5}
            value={params.speedsKmh[1]}
            unit="km/h"
            onChange={(v) => onSetSpeed(1, v)}
          />
          <Slider
            label={t("stopping-distance.controls.slider.speed3")}
            id="speed3"
            min={10}
            max={150}
            step={5}
            value={params.speedsKmh[2]}
            unit="km/h"
            onChange={(v) => onSetSpeed(2, v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("stopping-distance.controls.section.braking")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={withSubscripts(
              t("stopping-distance.controls.slider.reaction_time"),
            )}
            id="reactionTime"
            min={0}
            max={2.5}
            step={0.1}
            value={params.reactionTime}
            unit="s"
            onChange={(v) => onSetParam("reactionTime", v)}
          />
          <Slider
            label={t("stopping-distance.controls.slider.decel_factor")}
            id="decelFactor"
            min={0.2}
            max={1.0}
            step={0.05}
            value={params.decelFactor}
            onChange={(v) => onSetParam("decelFactor", v)}
          />
          <div className="flex gap-2">
            {(
              Object.keys(SURFACE_PRESETS) as (keyof typeof SURFACE_PRESETS)[]
            ).map((id) => (
              <button
                key={id}
                onClick={() => onSetParam("decelFactor", SURFACE_PRESETS[id])}
                className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t(`stopping-distance.controls.preset.${id}`)}
              </button>
            ))}
          </div>
          <Slider
            label={t("stopping-distance.controls.slider.obstacle_distance")}
            id="obstacleDistance"
            min={5}
            max={150}
            step={1}
            value={params.obstacleDistance}
            unit="m"
            onChange={(v) => onSetParam("obstacleDistance", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("stopping-distance.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showObstacleMarker"
            label={t("stopping-distance.controls.toggle.obstacle_marker")}
            checked={visibility.showObstacleMarker}
            onChange={() => onToggle("showObstacleMarker")}
          />
          <Toggle
            id="showTrace"
            label={t("stopping-distance.controls.toggle.trace")}
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
          {t("stopping-distance.controls.btn.reset")}
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
            ? t("stopping-distance.controls.btn.resume")
            : t("stopping-distance.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
