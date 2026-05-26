'use client'

import { useQuickReturnSimulator } from '@/hooks/useQuickReturnSimulator'
import { QuickReturnCanvas } from '@/components/quick-return/QuickReturnCanvas'
import { QuickReturnMetrics } from '@/components/quick-return/QuickReturnMetrics'
import { QuickReturnControls } from '@/components/quick-return/QuickReturnControls'
import { QuickReturnLegend } from '@/components/quick-return/QuickReturnLegend'
import { QuickReturnEquations } from '@/components/quick-return/QuickReturnEquations'
import { SimulatorHeader } from '@/components/SimulatorHeader'
import { ProjectCredits } from '@/components/ProjectCredits'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function QuickReturnPage() {
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
  } = useQuickReturnSimulator()

  return (
    <LanguageProvider>
      <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 p-4 max-w-7xl mx-auto min-h-screen items-start">
        <div className="flex flex-col gap-3">
          <QuickReturnCanvas
            params={params}
            visibility={visibility}
            phiRef={phiRef}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
        </div>

        <aside className="flex flex-col gap-3">
          <SimulatorHeader />
          <QuickReturnMetrics state={metrics} params={params} />
          <QuickReturnControls
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            paused={paused}
            onTogglePause={togglePause}
          />
          <QuickReturnLegend />
          <QuickReturnEquations />
          <ProjectCredits />
        </aside>
      </main>
    </LanguageProvider>
  )
}
