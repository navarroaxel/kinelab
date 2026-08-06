"use client";

import { useParabolicTrackSimulator } from "@/hooks/useParabolicTrackSimulator";
import { ParabolicTrackCanvas } from "@/components/parabolic-track/ParabolicTrackCanvas";
import { ParabolicTrackMetrics } from "@/components/parabolic-track/ParabolicTrackMetrics";
import { ParabolicTrackControls } from "@/components/parabolic-track/ParabolicTrackControls";
import { ParabolicTrackLegend } from "@/components/parabolic-track/ParabolicTrackLegend";
import { ParabolicTrackEquations } from "@/components/parabolic-track/ParabolicTrackEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function ParabolicTrackPage() {
  const { params, setParam, visibility, toggleVisibility, state, reset } =
    useParabolicTrackSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <ParabolicTrackCanvas
          params={params}
          state={state}
          visibility={visibility}
        />
        <ParabolicTrackEquations state={state} />
      </div>

      <aside className="flex flex-col gap-3">
        <ParabolicTrackMetrics state={state} />
        <ParabolicTrackControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
        />
        <ParabolicTrackLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
