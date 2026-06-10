"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  QuickReturnParams,
  QuickReturnVisibility,
} from "@/types/simulator";

interface Props {
  params: QuickReturnParams;
  visibility: QuickReturnVisibility;
  onSetParam: <K extends keyof QuickReturnParams>(
    key: K,
    value: QuickReturnParams[K],
  ) => void;
  onToggle: (key: keyof QuickReturnVisibility) => void;
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

export function QuickReturnControls({
  params,
  visibility,
  onSetParam,
  onToggle,
  onReset,
  paused,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();
  const constraintOk = params.L2 > params.r;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      {/* Geometry */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("quick-return.controls.section.geometry")}
        </h3>
        <div className="flex flex-col gap-3">
          <Slider
            label={t("quick-return.controls.slider.r")}
            id="qr-r"
            min={20}
            max={100}
            step={5}
            value={params.r}
            unit="u"
            onChange={(v) => onSetParam("r", v)}
          />
          <Slider
            label={t("quick-return.controls.slider.L2")}
            id="qr-L2"
            min={30}
            max={180}
            step={5}
            value={params.L2}
            unit="u"
            onChange={(v) => onSetParam("L2", v)}
          />
          <Slider
            label={t("quick-return.controls.slider.L1")}
            id="qr-L1"
            min={80}
            max={320}
            step={5}
            value={params.L1}
            unit="u"
            onChange={(v) => onSetParam("L1", v)}
          />
        </div>
        {!constraintOk && (
          <p className="mt-1.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
            {t("quick-return.controls.constraint.warn")}
          </p>
        )}
        {constraintOk && (
          <p className="mt-1.5 text-[10px] text-green-600 dark:text-green-400">
            {t("quick-return.controls.constraint.ok")}
          </p>
        )}
      </section>

      {/* Dynamics */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("quick-return.controls.section.dynamics")}
        </h3>
        <Slider
          label={t("quick-return.controls.slider.omega")}
          id="qr-omega"
          min={0.2}
          max={5}
          step={0.1}
          value={params.omega}
          unit="rad/s"
          onChange={(v) => onSetParam("omega", v)}
        />
      </section>

      {/* Visibility */}
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("quick-return.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="qr-velocity"
            label={t("quick-return.controls.toggle.velocity")}
            checked={visibility.showVelocity}
            onChange={() => onToggle("showVelocity")}
          />
          <Toggle
            id="qr-acceleration"
            label={t("quick-return.controls.toggle.acceleration")}
            checked={visibility.showAcceleration}
            onChange={() => onToggle("showAcceleration")}
          />
          <Toggle
            id="qr-trace"
            label={t("quick-return.controls.toggle.trace")}
            checked={visibility.showTrace}
            onChange={() => onToggle("showTrace")}
          />
          <Toggle
            id="qr-guides"
            label={t("quick-return.controls.toggle.guides")}
            checked={visibility.showGuides}
            onChange={() => onToggle("showGuides")}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("quick-return.controls.btn.reset")}
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
            ? t("quick-return.controls.btn.resume")
            : t("quick-return.controls.btn.pause")}
        </button>
      </div>

      {/* Quick formulas */}
      <section className="flex flex-col gap-1.5 border-t border-gray-100 pt-3 text-[10px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="flex justify-between gap-2">
          <span>{t("quick-return.controls.info.xB")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            r·sin φ
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t("quick-return.controls.info.xP")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            L₁·x_B / y_B
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t("quick-return.controls.info.constraint")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            L₂ &gt; r
          </span>
        </div>
      </section>
    </div>
  );
}
