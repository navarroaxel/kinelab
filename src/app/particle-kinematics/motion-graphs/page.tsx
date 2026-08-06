"use client";

import { useMotionGraphsSimulator } from "@/hooks/useMotionGraphsSimulator";
import { MotionGraphsCanvas } from "@/components/motion-graphs/MotionGraphsCanvas";
import { MotionGraphsMetrics } from "@/components/motion-graphs/MotionGraphsMetrics";
import { MotionGraphsControls } from "@/components/motion-graphs/MotionGraphsControls";
import { MotionGraphsLegend } from "@/components/motion-graphs/MotionGraphsLegend";
import { MotionGraphsEquations } from "@/components/motion-graphs/MotionGraphsEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function MotionGraphsPage() {
  const {
    params,
    visibility,
    segments,
    tEnd,
    scrubT,
    setScrubT,
    metrics,
    setPreset,
    toggleSnap,
    toggleVisibility,
    addSegment,
    removeSegment,
    moveVertex,
    reset,
  } = useMotionGraphsSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <MotionGraphsCanvas
          vertices={params.vertices}
          tEnd={tEnd}
          scrubT={scrubT}
          onScrub={setScrubT}
          onMoveVertex={moveVertex}
        />
        <MotionGraphsEquations
          segments={segments}
          tEnd={tEnd}
          visibility={visibility}
        />
      </div>

      <aside className="flex flex-col gap-3">
        <MotionGraphsMetrics state={metrics} />
        <MotionGraphsControls
          params={params}
          visibility={visibility}
          scrubT={scrubT}
          tEnd={tEnd}
          onSetScrub={setScrubT}
          onSetPreset={setPreset}
          onToggleSnap={toggleSnap}
          onToggle={toggleVisibility}
          onAddSegment={addSegment}
          onRemoveSegment={removeSegment}
          onReset={reset}
        />
        <MotionGraphsLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
