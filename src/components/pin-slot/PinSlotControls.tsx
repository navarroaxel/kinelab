"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { PinSlotParams, PinSlotVisibility } from "@/types/simulator";

interface Props {
  params: PinSlotParams;
  visibility: PinSlotVisibility;
  onSetParam: <K extends keyof PinSlotParams>(
    key: K,
    value: PinSlotParams[K],
  ) => void;
  onToggle: (key: keyof PinSlotVisibility) => void;
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

export function PinSlotControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();
  const thetaMax = ((Math.asin(params.r / params.d) * 180) / Math.PI).toFixed(
    1,
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      {/* Geometry */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("pin-slot.controls.section.geometry")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("pin-slot.controls.slider.r")}
            id="ps-r"
            min={5}
            max={40}
            step={0.5}
            value={params.r}
            unit="u"
            onChange={(v) => onSetParam("r", v)}
          />
          <Slider
            label={t("pin-slot.controls.slider.d")}
            id="ps-d"
            min={10}
            max={80}
            step={1}
            value={params.d}
            unit="u"
            onChange={(v) => onSetParam("d", v)}
          />
          <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
            {params.d > params.r
              ? t("pin-slot.controls.constraint.ok")
              : t("pin-slot.controls.constraint.warn")}
          </p>
        </div>
      </section>

      {/* Dynamics */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("pin-slot.controls.section.dynamics")}
        </h3>
        <Slider
          label={t("pin-slot.controls.slider.v0")}
          id="ps-v0"
          min={1}
          max={50}
          step={0.5}
          value={params.v0}
          unit="u/s"
          onChange={(v) => onSetParam("v0", v)}
        />
        <p className="mt-1.5 font-mono text-[10px] text-gray-500 dark:text-gray-400">
          Ω = V₀/r = {(params.v0 / params.r).toFixed(3)} rad/s
        </p>
        <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
          θ_max = ±{thetaMax}°
        </p>
      </section>

      {/* Visibility */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("pin-slot.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="ps-showV0"
            label={t("pin-slot.controls.toggle.v0")}
            checked={visibility.showV0}
            onChange={() => onToggle("showV0")}
          />
          <Toggle
            id="ps-showVr"
            label={t("pin-slot.controls.toggle.vr")}
            checked={visibility.showVr}
            onChange={() => onToggle("showVr")}
          />
          <Toggle
            id="ps-showVPerp"
            label={t("pin-slot.controls.toggle.vperp")}
            checked={visibility.showVPerp}
            onChange={() => onToggle("showVPerp")}
          />
          <Toggle
            id="ps-showAngles"
            label={t("pin-slot.controls.toggle.angles")}
            checked={visibility.showAngles}
            onChange={() => onToggle("showAngles")}
          />
          <Toggle
            id="ps-showRho"
            label={t("pin-slot.controls.toggle.rho")}
            checked={visibility.showRho}
            onChange={() => onToggle("showRho")}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("pin-slot.controls.btn.reset")}
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
            ? t("pin-slot.controls.btn.resume")
            : t("pin-slot.controls.btn.pause")}
        </button>
      </div>

      {/* Quick formulas */}
      <section className="flex flex-col gap-1.5 border-t border-gray-100 pt-3 text-[10px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="flex justify-between gap-2">
          <span>{t("pin-slot.controls.info.omega")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            Ω = V₀ / r
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t("pin-slot.controls.info.omega_bar")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            ω = θ̇ = V₀(r + d·cosΦ)/ρ²
          </span>
        </div>
      </section>
    </div>
  );
}
