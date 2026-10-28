"use client";

import { usePinSlotBarSimulator } from "@/hooks/usePinSlotBarSimulator";
import { PinSlotBarCanvas } from "@/components/pin-slot-bar/PinSlotBarCanvas";
import { PinSlotBarMetrics } from "@/components/pin-slot-bar/PinSlotBarMetrics";
import { PinSlotBarControls } from "@/components/pin-slot-bar/PinSlotBarControls";
import { PinSlotBarLegend } from "@/components/pin-slot-bar/PinSlotBarLegend";
import { PinSlotBarEquations } from "@/components/pin-slot-bar/PinSlotBarEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function PinSlotBarPage() {
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
  } = usePinSlotBarSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <PinSlotBarCanvas
          params={params}
          visibility={visibility}
          phaseRef={phaseRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <PinSlotBarEquations state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <PinSlotBarMetrics state={metrics} />
        <PinSlotBarControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          onSnapToStatement={snapToStatement}
          paused={paused}
          onTogglePause={togglePause}
        />
        <PinSlotBarLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
