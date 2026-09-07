"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRotatingUnbalanceSimulator } from "@/hooks/useRotatingUnbalanceSimulator";
import { computeDerived } from "@/lib/rotatingUnbalanceKinematics";
import { RotatingUnbalanceCanvas } from "@/components/rotating-unbalance/RotatingUnbalanceCanvas";
import { RotatingUnbalanceMetrics } from "@/components/rotating-unbalance/RotatingUnbalanceMetrics";
import { RotatingUnbalanceControls } from "@/components/rotating-unbalance/RotatingUnbalanceControls";
import { RotatingUnbalanceLegend } from "@/components/rotating-unbalance/RotatingUnbalanceLegend";
import { RotatingUnbalanceEquations } from "@/components/rotating-unbalance/RotatingUnbalanceEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function RotatingUnbalancePage() {
  const { t } = useLanguage();
  const {
    params,
    setParam,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
    metrics,
    setMetrics,
  } = useRotatingUnbalanceSimulator();

  const derived = computeDerived(params);

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("vib.exercises.vib1.title")}
          </h1>
        </header>
        <RotatingUnbalanceCanvas
          params={params}
          tRef={tRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <RotatingUnbalanceEquations params={params} derived={derived} />
      </div>

      <aside className="flex flex-col gap-3">
        <RotatingUnbalanceMetrics state={metrics} />
        <RotatingUnbalanceControls
          params={params}
          onSetParam={setParam}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <RotatingUnbalanceLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
