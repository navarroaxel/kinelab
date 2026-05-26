'use client'

import { usePinSlotSimulator } from '@/hooks/usePinSlotSimulator'
import { PinSlotCanvas } from '@/components/pin-slot/PinSlotCanvas'
import { PinSlotMetrics } from '@/components/pin-slot/PinSlotMetrics'
import { PinSlotControls } from '@/components/pin-slot/PinSlotControls'
import { PinSlotLegend } from '@/components/pin-slot/PinSlotLegend'
import { PinSlotEquations } from '@/components/pin-slot/PinSlotEquations'
import { SimulatorNav } from '@/components/SimulatorNav'
import { LanguageToggle } from '@/components/LanguageToggle'
import { GitHubLink } from '@/components/GitHubLink'
import { ProjectCredits } from '@/components/ProjectCredits'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function PinSlotPage() {
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
    phiRef,
  } = usePinSlotSimulator()

  return (
    <LanguageProvider>
      <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 p-4 max-w-7xl mx-auto min-h-screen items-start">
        <div className="flex flex-col gap-3">
          <PinSlotCanvas
            params={params}
            visibility={visibility}
            phiRef={phiRef}
            onMetrics={setMetrics}
            paused={paused}
          />
        </div>

        <aside className="flex flex-col gap-3">
          <div className="flex justify-end gap-2">
            <SimulatorNav />
            <LanguageToggle />
            <GitHubLink />
          </div>
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
          <PinSlotEquations />
          <ProjectCredits />
        </aside>
      </main>
    </LanguageProvider>
  )
}
