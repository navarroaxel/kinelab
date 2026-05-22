'use client'

import { useState } from 'react'
import { useSimulator } from '@/hooks/useSimulator'
import { computeKinematics } from '@/lib/kinematics'
import { SimulatorCanvas } from '@/components/SimulatorCanvas'
import { PolarMetrics } from '@/components/PolarMetrics'
import { ControlsPanel } from '@/components/ControlsPanel'
import { VectorLegend } from '@/components/VectorLegend'
import { EquationsPanel } from '@/components/EquationsPanel'
import type { KinematicState } from '@/types/simulator'

const INITIAL_PARAMS = { poleX: 0, poleY: 0, angularVelocity: 60, circleRadius: 100 } as const

export default function Home() {
  const { params, setParam, visibility, toggleVisibility, resetPole, phiRef, traceRef, paused, togglePause } =
    useSimulator()

  const [metrics, setMetrics] = useState<KinematicState>(() =>
    computeKinematics(0, INITIAL_PARAMS)
  )

  return (
    <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 p-4 max-w-7xl mx-auto min-h-screen items-start">
      <SimulatorCanvas
        params={params}
        visibility={visibility}
        phiRef={phiRef}
        traceRef={traceRef}
        onMetrics={setMetrics}
        paused={paused}
      />

      <aside className="flex flex-col gap-3">
        <PolarMetrics state={metrics} />
        <ControlsPanel
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onResetPole={resetPole}
          paused={paused}
          onTogglePause={togglePause}
        />
        <VectorLegend />
        <EquationsPanel visibility={visibility} />
      </aside>
    </main>
  )
}
