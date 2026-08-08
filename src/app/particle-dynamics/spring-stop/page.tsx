"use client";

import { useSpringStopSimulator } from "@/hooks/useSpringStopSimulator";
import { SpringStopCanvas } from "@/components/spring-stop/SpringStopCanvas";
import { SpringStopMetrics } from "@/components/spring-stop/SpringStopMetrics";
import { SpringStopControls } from "@/components/spring-stop/SpringStopControls";
import { SpringStopLegend } from "@/components/spring-stop/SpringStopLegend";
import { SpringStopEquations } from "@/components/spring-stop/SpringStopEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function SpringStopPage() {
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
  } = useSpringStopSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <SpringStopCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <SpringStopEquations />
      </div>

      <aside className="flex flex-col gap-3">
        <SpringStopMetrics state={metrics} />
        <SpringStopControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <SpringStopLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
