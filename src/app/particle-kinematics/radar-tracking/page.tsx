"use client";

import { useRadarTrackingSimulator } from "@/hooks/useRadarTrackingSimulator";
import { RadarTrackingCanvas } from "@/components/radar-tracking/RadarTrackingCanvas";
import { RadarTrackingMetrics } from "@/components/radar-tracking/RadarTrackingMetrics";
import { RadarTrackingControls } from "@/components/radar-tracking/RadarTrackingControls";
import { RadarTrackingLegend } from "@/components/radar-tracking/RadarTrackingLegend";
import { RadarTrackingEquations } from "@/components/radar-tracking/RadarTrackingEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function RadarTrackingPage() {
  const {
    params,
    setParam,
    setRadarPosition,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
    loopDuration,
  } = useRadarTrackingSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <RadarTrackingCanvas
          params={params}
          visibility={visibility}
          tRef={tRef}
          loopDuration={loopDuration}
          onMetrics={setMetrics}
          onSetRadarPosition={setRadarPosition}
          paused={paused}
          resetCount={resetCount}
        />
        <RadarTrackingEquations params={params} loopDuration={loopDuration} />
      </div>

      <aside className="flex flex-col gap-3">
        <RadarTrackingMetrics state={metrics} />
        <RadarTrackingControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <RadarTrackingLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
