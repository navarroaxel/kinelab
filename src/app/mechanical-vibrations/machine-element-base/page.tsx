"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useMachineElementBaseSimulator } from "@/hooks/useMachineElementBaseSimulator";
import { computeDerived } from "@/lib/machineElementBaseKinematics";
import { MachineElementBaseCanvas } from "@/components/machine-element-base/MachineElementBaseCanvas";
import { MachineElementBaseMetrics } from "@/components/machine-element-base/MachineElementBaseMetrics";
import { MachineElementBaseControls } from "@/components/machine-element-base/MachineElementBaseControls";
import { MachineElementBaseLegend } from "@/components/machine-element-base/MachineElementBaseLegend";
import { MachineElementBaseEquations } from "@/components/machine-element-base/MachineElementBaseEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function MachineElementBasePage() {
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
  } = useMachineElementBaseSimulator();

  const derived = computeDerived(params);

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("vib.exercises.vib4.title")}
          </h1>
        </header>
        <MachineElementBaseCanvas
          params={params}
          tRef={tRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <MachineElementBaseEquations params={params} derived={derived} />
      </div>

      <aside className="flex flex-col gap-3">
        <MachineElementBaseMetrics state={metrics} />
        <MachineElementBaseControls
          params={params}
          onSetParam={setParam}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <MachineElementBaseLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
