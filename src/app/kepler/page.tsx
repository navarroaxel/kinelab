'use client'

import { useKeplerSimulator } from '@/hooks/useKeplerSimulator'
import { KeplerCanvas }    from '@/components/kepler/KeplerCanvas'
import { KeplerMetrics }   from '@/components/kepler/KeplerMetrics'
import { KeplerControls }  from '@/components/kepler/KeplerControls'
import { KeplerLegend }    from '@/components/kepler/KeplerLegend'
import { KeplerEquations } from '@/components/kepler/KeplerEquations'
import { SimulatorHeader } from '@/components/SimulatorHeader'
import { ProjectCredits }  from '@/components/ProjectCredits'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function KeplerPage() {
  const {
    params, setParam,
    visibility, toggleVisibility,
    paused, togglePause,
    resetCount, reset,
    metrics, setMetrics,
    nuRef, phaseRef, missionRef,
  } = useKeplerSimulator()

  return (
    <LanguageProvider>
      <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 p-4 max-w-7xl mx-auto min-h-screen items-start">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <KeplerCanvas
            params={params}
            visibility={visibility}
            nuRef={nuRef}
            phaseRef={phaseRef}
            missionRef={missionRef}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
          <KeplerEquations />
        </div>

        <aside className="flex flex-col gap-3">
          <KeplerMetrics metrics={metrics} />
          <KeplerControls
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            paused={paused}
            onTogglePause={togglePause}
          />
          <KeplerLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  )
}
