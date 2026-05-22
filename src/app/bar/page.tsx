'use client'

import { useMemo, useState } from 'react'
import { useBarSimulator } from '@/hooks/useBarSimulator'
import { computeBarState, computeEjectionTime } from '@/lib/barKinematics'
import { BarCanvas } from '@/components/bar/BarCanvas'
import { BarMetrics } from '@/components/bar/BarMetrics'
import { BarControls } from '@/components/bar/BarControls'
import { BarLegend } from '@/components/bar/BarLegend'
import { BarEquations } from '@/components/bar/BarEquations'
import { SimulatorNav } from '@/components/SimulatorNav'
import { LanguageToggle } from '@/components/LanguageToggle'
import { GitHubLink } from '@/components/GitHubLink'
import { ProjectCredits } from '@/components/ProjectCredits'
import { LanguageProvider } from '@/contexts/LanguageContext'
import type { BarKinematicState } from '@/types/simulator'

export default function BarPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    reset,
    paused,
    togglePause,
    tRef,
    traceRef,
    ghostAnglesRef,
  } = useBarSimulator()

  const [metrics, setMetrics] = useState<BarKinematicState>(() => computeBarState(0, params))

  const ejectionTime = useMemo(() => computeEjectionTime(params), [params])

  return (
    <LanguageProvider>
      <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 p-4 max-w-7xl mx-auto min-h-screen items-start">
        <div className="flex flex-col gap-3">
          <BarCanvas
            params={params}
            visibility={visibility}
            tRef={tRef}
            traceRef={traceRef}
            ghostAnglesRef={ghostAnglesRef}
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
          <BarMetrics state={metrics} params={params} ejectionTime={ejectionTime} />
          <BarControls
            params={params}
            visibility={visibility}
            ejectionTime={ejectionTime}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            paused={paused}
            onTogglePause={togglePause}
          />
          <BarLegend />
          <BarEquations />
          <ProjectCredits />
        </aside>
      </main>
    </LanguageProvider>
  )
}
