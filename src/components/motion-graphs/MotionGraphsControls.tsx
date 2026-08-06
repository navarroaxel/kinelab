"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type {
  MotionGraphsParams,
  MotionGraphsVisibility,
} from "@/types/simulator";
import type { TranslationKey } from "@/lib/i18n";

interface Props {
  params: MotionGraphsParams;
  visibility: MotionGraphsVisibility;
  scrubT: number;
  tEnd: number;
  onSetScrub: (t: number) => void;
  onSetPreset: (id: string) => void;
  onToggleSnap: () => void;
  onToggle: (key: keyof MotionGraphsVisibility) => void;
  onAddSegment: () => void;
  onRemoveSegment: () => void;
  onReset: () => void;
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

const PRESET_IDS = ["case1", "case2", "case3", "case4"] as const;

export function MotionGraphsControls({
  params,
  visibility,
  scrubT,
  tEnd,
  onSetScrub,
  onSetPreset,
  onToggleSnap,
  onToggle,
  onAddSegment,
  onRemoveSegment,
  onReset,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("motion-graphs.controls.section.presets")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_IDS.map((id) => (
            <button
              key={id}
              onClick={() => onSetPreset(id)}
              className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t(`motion-graphs.controls.preset.${id}` as TranslationKey)}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("motion-graphs.controls.section.editing")}
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={onAddSegment}
              className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t("motion-graphs.controls.btn.add_segment")}
            </button>
            <button
              onClick={onRemoveSegment}
              className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t("motion-graphs.controls.btn.remove_segment")}
            </button>
          </div>
          <Toggle
            id="snapToGrid"
            label={t("motion-graphs.controls.toggle.snap")}
            checked={params.snapToGrid}
            onChange={onToggleSnap}
          />
          <p className="text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">
            {t("motion-graphs.controls.hint.drag")}
          </p>
        </div>
      </section>

      <section>
        <label
          htmlFor="scrubT"
          className="flex justify-between text-xs text-gray-600 dark:text-gray-400"
        >
          <span>{t("motion-graphs.controls.slider.scrub")}</span>
          <span className="font-mono text-gray-400">{scrubT.toFixed(1)} s</span>
        </label>
        <input
          type="range"
          id="scrubT"
          min={0}
          max={tEnd}
          step={0.1}
          value={scrubT}
          onChange={(e) => onSetScrub(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </section>

      <section>
        <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("motion-graphs.controls.section.visibility")}
        </h3>
        <div className="flex flex-col gap-2">
          <Toggle
            id="showAcceleration"
            label={t("motion-graphs.controls.toggle.acceleration")}
            checked={visibility.showAcceleration}
            onChange={() => onToggle("showAcceleration")}
          />
          <Toggle
            id="showPosition"
            label={t("motion-graphs.controls.toggle.position")}
            checked={visibility.showPosition}
            onChange={() => onToggle("showPosition")}
          />
          <Toggle
            id="showMarkers"
            label={t("motion-graphs.controls.toggle.markers")}
            checked={visibility.showMarkers}
            onChange={() => onToggle("showMarkers")}
          />
        </div>
      </section>

      <button
        onClick={onReset}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {t("motion-graphs.controls.btn.reset")}
      </button>
    </div>
  );
}
