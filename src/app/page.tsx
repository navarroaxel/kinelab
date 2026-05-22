'use client'

import { useState } from 'react'
import { useSimulator } from '@/hooks/useSimulator'
import { computeKinematics } from '@/lib/kinematics'
import { SimulatorCanvas } from '@/components/SimulatorCanvas'
import { PolarMetrics } from '@/components/PolarMetrics'
import { ControlsPanel } from '@/components/ControlsPanel'
import { VectorLegend } from '@/components/VectorLegend'
import { EquationsPanel } from '@/components/EquationsPanel'
import { GitHubLink } from '@/components/GitHubLink'
import { LanguageToggle } from '@/components/LanguageToggle'
import { LanguageProvider } from '@/contexts/LanguageContext'
import type { KinematicState } from '@/types/simulator'

const INITIAL_PARAMS = { poleX: 0, poleY: 0, angularVelocity: 60, angularAcceleration: 0, circleRadius: 100 } as const

export default function Home() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    resetPole,
    resetAlpha,
    phiRef,
    omegaRef,
    traceRef,
    paused,
    togglePause,
  } = useSimulator()

  const [metrics, setMetrics] = useState<KinematicState>(() =>
    computeKinematics(0, INITIAL_PARAMS.angularVelocity, INITIAL_PARAMS)
  )

  return (
    <LanguageProvider>
      <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 p-4 max-w-7xl mx-auto min-h-screen items-start">
        <SimulatorCanvas
          params={params}
          visibility={visibility}
          phiRef={phiRef}
          omegaRef={omegaRef}
          traceRef={traceRef}
          onMetrics={setMetrics}
          paused={paused}
        />

        <aside className="flex flex-col gap-3">
          <div className="flex justify-end gap-2">
            <LanguageToggle />
            <GitHubLink />
          </div>
          <PolarMetrics state={metrics} />
          <ControlsPanel
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onResetPole={resetPole}
            onResetAlpha={resetAlpha}
            paused={paused}
            onTogglePause={togglePause}
          />
          <VectorLegend />
          <EquationsPanel visibility={visibility} />
        </aside>
      </main>
    </LanguageProvider>
  )
}
