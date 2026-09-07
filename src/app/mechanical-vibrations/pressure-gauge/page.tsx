"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { usePressureGaugeSimulator } from "@/hooks/usePressureGaugeSimulator";
import { computeDerived } from "@/lib/pressureGaugeKinematics";
import { PressureGaugePlot } from "@/components/pressure-gauge/PressureGaugePlot";
import { PressureGaugeMetrics } from "@/components/pressure-gauge/PressureGaugeMetrics";
import { PressureGaugeControls } from "@/components/pressure-gauge/PressureGaugeControls";
import { PressureGaugeLegend } from "@/components/pressure-gauge/PressureGaugeLegend";
import { PressureGaugeEquations } from "@/components/pressure-gauge/PressureGaugeEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function PressureGaugePage() {
  const { t } = useLanguage();
  const { params, setParam, reset } = usePressureGaugeSimulator();

  const derived = computeDerived(params);

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("vib.exercises.vib5.title")}
          </h1>
        </header>
        <PressureGaugePlot params={params} derived={derived} />
        <PressureGaugeEquations />
      </div>

      <aside className="flex flex-col gap-3">
        <PressureGaugeMetrics derived={derived} />
        <PressureGaugeControls
          params={params}
          onSetParam={setParam}
          onReset={reset}
        />
        <PressureGaugeLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
