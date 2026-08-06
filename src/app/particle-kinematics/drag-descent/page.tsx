"use client";

import { useDragDescentSimulator } from "@/hooks/useDragDescentSimulator";
import { DragDescentCanvas } from "@/components/drag-descent/DragDescentCanvas";
import { DragDescentMetrics } from "@/components/drag-descent/DragDescentMetrics";
import { DragDescentControls } from "@/components/drag-descent/DragDescentControls";
import { DragDescentLegend } from "@/components/drag-descent/DragDescentLegend";
import { DragDescentEquations } from "@/components/drag-descent/DragDescentEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function DragDescentPage() {
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
    resetCount,
    tRef,
  } = useDragDescentSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <DragDescentCanvas
          params={params}
          visibility={visibility}
          tRef={tRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <DragDescentEquations params={params} />
      </div>

      <aside className="flex flex-col gap-3">
        <DragDescentMetrics state={metrics} />
        <DragDescentControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <DragDescentLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
