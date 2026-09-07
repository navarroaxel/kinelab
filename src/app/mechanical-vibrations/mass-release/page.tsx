"use client";

import { Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMassReleaseSimulator } from "@/hooks/useMassReleaseSimulator";
import { computeDerived } from "@/lib/massReleaseKinematics";
import { MassReleaseCanvas } from "@/components/mass-release/MassReleaseCanvas";
import { MassReleaseMetrics } from "@/components/mass-release/MassReleaseMetrics";
import { MassReleaseControls } from "@/components/mass-release/MassReleaseControls";
import { MassReleaseLegend } from "@/components/mass-release/MassReleaseLegend";
import { MassReleaseEquations } from "@/components/mass-release/MassReleaseEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

function MassReleasePageContent() {
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
  } = useMassReleaseSimulator();

  const derived = computeDerived(params);
  const titleKey =
    params.damping > 0 ? "vib.exercises.vib7.title" : "vib.exercises.vib6.title";

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t(titleKey)}
          </h1>
        </header>
        <MassReleaseCanvas
          params={params}
          tRef={tRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <MassReleaseEquations params={params} derived={derived} />
      </div>

      <aside className="flex flex-col gap-3">
        <MassReleaseMetrics state={metrics} />
        <MassReleaseControls
          params={params}
          onSetParam={setParam}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <MassReleaseLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}

export default function MassReleasePage() {
  return (
    <Suspense fallback={null}>
      <MassReleasePageContent />
    </Suspense>
  );
}
