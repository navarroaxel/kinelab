"use client";

import { Suspense } from "react";
import { usePinSlotSimulator } from "@/hooks/usePinSlotSimulator";
import { PinSlotCanvas } from "@/components/pin-slot/PinSlotCanvas";
import { PinSlotMetrics } from "@/components/pin-slot/PinSlotMetrics";
import { PinSlotControls } from "@/components/pin-slot/PinSlotControls";
import { PinSlotLegend } from "@/components/pin-slot/PinSlotLegend";
import { PinSlotEquations } from "@/components/pin-slot/PinSlotEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

function PinSlotPageContent() {
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
    phiRef,
  } = usePinSlotSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <PinSlotCanvas
          params={params}
          visibility={visibility}
          phiRef={phiRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <PinSlotEquations params={params} />
      </div>

      <aside className="flex flex-col gap-3">
        <PinSlotMetrics state={metrics} />
        <PinSlotControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <PinSlotLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}

export default function PinSlotPage() {
  return (
    <Suspense fallback={null}>
      <PinSlotPageContent />
    </Suspense>
  );
}
