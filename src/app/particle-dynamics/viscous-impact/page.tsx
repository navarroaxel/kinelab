"use client";

import { useViscousImpactSimulator } from "@/hooks/useViscousImpactSimulator";
import { ViscousImpactCanvas } from "@/components/viscous-impact/ViscousImpactCanvas";
import { ViscousImpactMetrics } from "@/components/viscous-impact/ViscousImpactMetrics";
import { ViscousImpactControls } from "@/components/viscous-impact/ViscousImpactControls";
import { ViscousImpactLegend } from "@/components/viscous-impact/ViscousImpactLegend";
import { ViscousImpactEquations } from "@/components/viscous-impact/ViscousImpactEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function ViscousImpactPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    paused,
    togglePause,
    reset,
    resetCount,
    phaseRef,
  } = useViscousImpactSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <ViscousImpactCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <ViscousImpactEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <ViscousImpactMetrics state={metrics} />
        <ViscousImpactControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <ViscousImpactLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
