"use client";

import { useFourBarSimulator } from "@/hooks/useFourBarSimulator";
import { FourBarCanvas } from "@/components/four-bar/FourBarCanvas";
import { FourBarMetrics } from "@/components/four-bar/FourBarMetrics";
import { FourBarControls } from "@/components/four-bar/FourBarControls";
import { FourBarLegend } from "@/components/four-bar/FourBarLegend";
import { FourBarEquations } from "@/components/four-bar/FourBarEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function FourBarPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    snapToStatement,
    resetCount,
    phaseRef,
  } = useFourBarSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <FourBarCanvas
          params={params}
          visibility={visibility}
          phaseRef={phaseRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <FourBarEquations state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <FourBarMetrics state={metrics} />
        <FourBarControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          onSnapToStatement={snapToStatement}
          paused={paused}
          onTogglePause={togglePause}
        />
        <FourBarLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
