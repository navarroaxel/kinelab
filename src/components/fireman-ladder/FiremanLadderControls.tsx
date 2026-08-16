"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type {
  FiremanLadderParams,
  FiremanLadderVisibility,
} from "@/types/simulator";
import { S_MAX, S_MIN, THETA2_MAX_DEG } from "@/lib/firemanLadderKinematics";

interface Props {
  params: FiremanLadderParams;
  visibility: FiremanLadderVisibility;
  onSetParam: <K extends keyof FiremanLadderParams>(
    key: K,
    value: FiremanLadderParams[K],
  ) => void;
  onToggle: (key: keyof FiremanLadderVisibility) => void;
  onReset: () => void;
  onSnapToStatement: () => void;
  onResetCamera: () => void;
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
  label: React.ReactNode;
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

export function FiremanLadderControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  onSnapToStatement,
  onResetCamera,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fl.controls.section.rotation")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("fl.controls.slider.omega1")}
            id="omega1"
            min={0}
            max={2}
            step={0.05}
            value={params.omega1}
            unit="rad/s"
            onChange={(v) => onSetParam("omega1", v)}
          />
          <Slider
            label={t("fl.controls.slider.omega2")}
            id="omega2"
            min={0}
            max={1.5}
            step={0.05}
            value={params.omega2}
            unit="rad/s"
            onChange={(v) => onSetParam("omega2", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fl.controls.section.extension")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("fl.controls.slider.s_dot")}
            id="sDot"
            min={0}
            max={4}
            step={0.1}
            value={params.sDot}
            unit="m/s"
            onChange={(v) => onSetParam("sDot", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fl.controls.section.instant")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("fl.controls.slider.s0")}
            id="s0"
            min={S_MIN}
            max={S_MAX}
            step={0.5}
            value={params.s0}
            unit="m"
            onChange={(v) => onSetParam("s0", v)}
          />
          <Slider
            label={t("fl.controls.slider.theta20")}
            id="theta20Deg"
            min={0}
            max={THETA2_MAX_DEG}
            step={1}
            value={params.theta20Deg}
            unit="°"
            onChange={(v) => onSetParam("theta20Deg", v)}
          />
          <button
            onClick={onSnapToStatement}
            className="rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {t("fl.controls.btn.statement")}
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fl.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showVelocity"
            label={t("fl.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="showVelocityParts"
            label={withSubscripts(t("fl.controls.toggle.velocity_parts"))}
            checked={visibility.showVelocityParts}
            onChange={() => onToggle("showVelocityParts")}
          />
          <Toggle
            id="showAccel"
            label={t("fl.controls.toggle.accel")}
            checked={visibility.showAccel}
            onChange={() => onToggle("showAccel")}
          />
          <Toggle
            id="showAccelParts"
            label={t("fl.controls.toggle.accel_parts")}
            checked={visibility.showAccelParts}
            onChange={() => onToggle("showAccelParts")}
          />
          <Toggle
            id="showTrace"
            label={t("fl.controls.toggle.trace")}
            checked={visibility.showTrace}
            onChange={() => onToggle("showTrace")}
          />
          <Toggle
            id="showAxes"
            label={t("fl.controls.toggle.axes")}
            checked={visibility.showAxes}
            onChange={() => onToggle("showAxes")}
          />
          <Toggle
            id="showGrid"
            label={t("fl.controls.toggle.grid")}
            checked={visibility.showGrid}
            onChange={() => onToggle("showGrid")}
          />
          <Toggle
            id="showTruck"
            label={t("fl.controls.toggle.truck")}
            checked={visibility.showTruck}
            onChange={() => onToggle("showTruck")}
          />
        </div>
        <button
          onClick={onResetCamera}
          className="mt-3 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("fl.controls.btn.reset_camera")}
        </button>
        <p className="mt-2 text-[10px] leading-tight text-gray-400">
          {t("fl.controls.hint.drag")}
        </p>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("fl.controls.btn.reset")}
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
            ? t("fl.controls.btn.resume")
            : t("fl.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
