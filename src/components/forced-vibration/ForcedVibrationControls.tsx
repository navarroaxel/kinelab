"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  ForcedVibrationParams,
  ForcedVibrationVisibility,
} from "@/types/simulator";

interface Props {
  params: ForcedVibrationParams;
  visibility: ForcedVibrationVisibility;
  onSetParam: <K extends keyof ForcedVibrationParams>(
    key: K,
    value: ForcedVibrationParams[K],
  ) => void;
  onSetDamping: (damping: number) => void;
  onToggle: (key: keyof ForcedVibrationVisibility) => void;
  onReset: () => void;
  onShowFree: () => void;
  onShowForced: () => void;
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
  decimals = 0,
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

export function ForcedVibrationControls({
  params,
  visibility,
  onSetParam,
  onSetDamping,
  onToggle,
  onReset,
  onShowFree,
  onShowForced,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();

  const caseButton = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
        active
          ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
          : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fv.controls.section.case")}
        </h3>
        <div className="flex gap-2">
          {caseButton(
            t("fv.controls.btn.forced"),
            params.forceEnabled,
            onShowForced,
          )}
          {caseButton(
            t("fv.controls.btn.free"),
            !params.forceEnabled,
            onShowFree,
          )}
        </div>
        <div className="mt-2 flex gap-2">
          {caseButton(
            t("fv.controls.btn.with_damping"),
            params.damping > 0,
            () => onSetDamping(500),
          )}
          {caseButton(
            t("fv.controls.btn.no_damping"),
            params.damping === 0,
            () => onSetDamping(0),
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fv.controls.section.system")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("fv.controls.slider.mass")}
            id="mass"
            min={1}
            max={50}
            step={1}
            value={params.mass}
            unit="kg"
            onChange={(v) => onSetParam("mass", v)}
          />
          <Slider
            label={t("fv.controls.slider.stiffness")}
            id="stiffness"
            min={10}
            max={400}
            step={5}
            value={params.stiffness / 1000}
            unit="kN/m"
            onChange={(v) => onSetParam("stiffness", v * 1000)}
          />
          <Slider
            label={t("fv.controls.slider.damping")}
            id="damping"
            min={0}
            max={4000}
            step={25}
            value={params.damping}
            unit="N·s/m"
            onChange={(v) => onSetParam("damping", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fv.controls.section.force")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("fv.controls.slider.force_amplitude")}
            id="forceAmplitude"
            min={0}
            max={4000}
            step={50}
            value={params.forceAmplitude}
            unit="N"
            onChange={(v) => onSetParam("forceAmplitude", v)}
          />
          <Slider
            label={t("fv.controls.slider.forcing_omega")}
            id="forcingOmega"
            min={0}
            max={300}
            step={1}
            value={params.forcingOmega}
            unit="rad/s"
            onChange={(v) => onSetParam("forcingOmega", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fv.controls.section.view")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("fv.controls.slider.slow_motion")}
            id="slowMotion"
            min={0.01}
            max={0.3}
            step={0.01}
            value={params.slowMotion}
            unit="×"
            decimals={2}
            onChange={(v) => onSetParam("slowMotion", v)}
          />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <Toggle
            id="showAppliedForce"
            label={t("fv.controls.toggle.applied")}
            checked={visibility.showAppliedForce}
            onChange={() => onToggle("showAppliedForce")}
          />
          <Toggle
            id="showSpringForce"
            label={t("fv.controls.toggle.spring")}
            checked={visibility.showSpringForce}
            onChange={() => onToggle("showSpringForce")}
          />
          <Toggle
            id="showDamperForce"
            label={t("fv.controls.toggle.damper")}
            checked={visibility.showDamperForce}
            onChange={() => onToggle("showDamperForce")}
          />
          <Toggle
            id="showEnvelope"
            label={t("fv.controls.toggle.envelope")}
            checked={visibility.showEnvelope}
            onChange={() => onToggle("showEnvelope")}
          />
          <Toggle
            id="showEquilibrium"
            label={t("fv.controls.toggle.equilibrium")}
            checked={visibility.showEquilibrium}
            onChange={() => onToggle("showEquilibrium")}
          />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("fv.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("fv.controls.btn.play") : t("fv.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
