'use client'

import { useState } from 'react'
import { useRingSimulator } from '@/hooks/useRingSimulator'
import { computeRingState, speedToThetaDot } from '@/lib/ringKinematics'
import { RingCanvas } from '@/components/ring/RingCanvas'
import { RingMetrics } from '@/components/ring/RingMetrics'
import { RingControls } from '@/components/ring/RingControls'
import { RingEnergyBar } from '@/components/ring/RingEnergyBar'
import { RingEnergyChart } from '@/components/ring/RingEnergyChart'
import { RingLegend } from '@/components/ring/RingLegend'
import { RingEquations } from '@/components/ring/RingEquations'
import { SimulatorHeader } from '@/components/SimulatorHeader'
import { ProjectCredits } from '@/components/ProjectCredits'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { computeVMin } from '@/lib/ringKinematics'
import type { RingKinematicState, RingParams } from '@/types/simulator'

const INITIAL_R = 100
const INITIAL_G = 200
const INITIAL_PARAMS: RingParams = {
  radius: INITIAL_R,
  gravity: INITIAL_G,
  initialSpeed: computeVMin(INITIAL_G, INITIAL_R),
}

export default function RingPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    reset,
    paused,
    togglePause,
    thetaRef,
    thetaDotRef,
    traceRef,
    tRef,
    samplesRef,
    tickListenersRef,
    subscribeTick,
  } = useRingSimulator()

  const [metrics, setMetrics] = useState<RingKinematicState>(() =>
    computeRingState(0, speedToThetaDot(INITIAL_PARAMS.initialSpeed, INITIAL_PARAMS.radius), INITIAL_PARAMS),
  )

  return (
    <LanguageProvider>
      <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 p-4 max-w-7xl mx-auto min-h-screen items-start">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <RingCanvas
            params={params}
            visibility={visibility}
            thetaRef={thetaRef}
            thetaDotRef={thetaDotRef}
            traceRef={traceRef}
            tRef={tRef}
            samplesRef={samplesRef}
            tickListenersRef={tickListenersRef}
            onMetrics={setMetrics}
            paused={paused}
          />
          <RingEnergyChart
            params={params}
            samplesRef={samplesRef}
            tRef={tRef}
            subscribeTick={subscribeTick}
          />
        </div>

        <aside className="flex flex-col gap-3">
          <RingMetrics state={metrics} params={params} />
          <RingControls
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            paused={paused}
            onTogglePause={togglePause}
          />
          {visibility.showEnergyBar && <RingEnergyBar state={metrics} params={params} />}
          <RingLegend />
          <RingEquations />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  )
}
