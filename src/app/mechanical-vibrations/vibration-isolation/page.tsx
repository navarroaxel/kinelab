"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useVibrationIsolationSimulator } from "@/hooks/useVibrationIsolationSimulator";
import { computeSolution } from "@/lib/vibrationIsolationKinematics";
import { VibrationIsolationPlot } from "@/components/vibration-isolation/VibrationIsolationPlot";
import { VibrationIsolationMetrics } from "@/components/vibration-isolation/VibrationIsolationMetrics";
import { VibrationIsolationControls } from "@/components/vibration-isolation/VibrationIsolationControls";
import { VibrationIsolationLegend } from "@/components/vibration-isolation/VibrationIsolationLegend";
import { VibrationIsolationEquations } from "@/components/vibration-isolation/VibrationIsolationEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function VibrationIsolationPage() {
  const { t } = useLanguage();
  const { params, setParam, reset } = useVibrationIsolationSimulator();

  const derived = computeSolution(params);

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("vib.exercises.vib3.title")}
          </h1>
        </header>
        <VibrationIsolationPlot params={params} derived={derived} />
        <VibrationIsolationEquations />
      </div>

      <aside className="flex flex-col gap-3">
        <VibrationIsolationMetrics derived={derived} />
        <VibrationIsolationControls
          params={params}
          onSetParam={setParam}
          onReset={reset}
        />
        <VibrationIsolationLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
