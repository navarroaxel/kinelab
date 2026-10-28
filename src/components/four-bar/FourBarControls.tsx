"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { FourBarParams, FourBarVisibility } from "@/types/simulator";

interface Props {
  params: FourBarParams;
  visibility: FourBarVisibility;
  onSetParam: <K extends keyof FourBarParams>(
    key: K,
    value: FourBarParams[K],
  ) => void;
  onToggle: (key: keyof FourBarVisibility) => void;
  onReset: () => void;
  onSnapToStatement: () => void;
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

export function FourBarControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  onSnapToStatement,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();

  const toggles: { key: keyof FourBarVisibility; label: string }[] = [
    { key: "showVelocity", label: t("fb.controls.toggle.velocity") },
    { key: "showAccel", label: t("fb.controls.toggle.accel") },
    { key: "showCenter", label: t("fb.controls.toggle.center") },
    { key: "showTrace", label: t("fb.controls.toggle.trace") },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fb.controls.section.instant")}
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={onSnapToStatement}
            className="rounded-lg border border-blue-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {t("fb.controls.btn.statement")}
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fb.controls.section.mechanism")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("fb.controls.slider.omega_cd")}
            id="omegaCD"
            min={-10}
            max={10}
            step={0.1}
            value={params.omegaCD}
            unit="rad/s"
            onChange={(v) => onSetParam("omegaCD", v)}
          />
          <div className="flex flex-col gap-1">
            <Slider
              label={t("fb.controls.slider.rocker_len")}
              id="rockerLen"
              min={0.8}
              max={2}
              step={0.05}
              value={params.rockerLen}
              unit="m"
              decimals={2}
              onChange={(v) => onSetParam("rockerLen", v)}
            />
            <p className="text-[10px] leading-snug text-gray-400">
              {t("fb.controls.hint.rocker_len")}
            </p>
          </div>
          <Slider
            label={t("fb.controls.slider.crank_len")}
            id="crankLen"
            min={0.3}
            max={0.9}
            step={0.05}
            value={params.crankLen}
            unit="m"
            decimals={2}
            onChange={(v) => onSetParam("crankLen", v)}
          />
          <Slider
            label={t("fb.controls.slider.coupler_len")}
            id="couplerLen"
            min={0.3}
            max={1.2}
            step={0.05}
            value={params.couplerLen}
            unit="m"
            decimals={2}
            onChange={(v) => onSetParam("couplerLen", v)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("fb.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          {toggles.map(({ key, label }) => (
            <Toggle
              key={key}
              id={key}
              label={label}
              checked={visibility[key]}
              onChange={() => onToggle(key)}
            />
          ))}
        </div>
      </section>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("fb.controls.btn.reset")}
        </button>
        <button
          onClick={onTogglePause}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            paused
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {paused ? t("fb.controls.btn.play") : t("fb.controls.btn.pause")}
        </button>
      </div>
    </div>
  );
}
