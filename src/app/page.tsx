'use client'

import { useState } from 'react'
import { useSimulator } from '@/hooks/useSimulator'
import { computeKinematics } from '@/lib/kinematics'
import { COLORS } from '@/lib/drawing'
import { SimulatorCanvas } from '@/components/SimulatorCanvas'
import { PolarMetrics } from '@/components/PolarMetrics'
import { ControlsPanel } from '@/components/ControlsPanel'
import { VectorLegend } from '@/components/VectorLegend'
import { EquationsPanel } from '@/components/EquationsPanel'
import { GitHubLink } from '@/components/GitHubLink'
import { LanguageToggle } from '@/components/LanguageToggle'
import { StripChart, type StripChartSeries } from '@/components/StripChart'
import { LanguageProvider } from '@/contexts/LanguageContext'
import type { KinematicState } from '@/types/simulator'

const INITIAL_PARAMS = { poleX: 0, poleY: 0, angularVelocity: 60, angularAcceleration: 0, circleRadius: 100 } as const

const VELOCITY_SERIES: readonly StripChartSeries[] = [
  { key: 'rDot',      color: COLORS.radialVelocity,     label: 'ṙ' },
  { key: 'rThetaDot', color: COLORS.transverseVelocity, label: 'rθ̇' },
]
const ACCEL_SERIES: readonly StripChartSeries[] = [
  { key: 'at', color: COLORS.acceleration, label: 'aₜ' },
]

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
    tRef,
    samplesRef,
    tickListenersRef,
    subscribeTick,
    paused,
    togglePause,
  } = useSimulator()

  const [metrics, setMetrics] = useState<KinematicState>(() =>
    computeKinematics(0, INITIAL_PARAMS.angularVelocity, INITIAL_PARAMS)
  )

  return (
    <LanguageProvider>
      <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 p-4 max-w-7xl mx-auto min-h-screen items-start">
        <div className="flex flex-col gap-3">
          <SimulatorCanvas
            params={params}
            visibility={visibility}
            phiRef={phiRef}
            omegaRef={omegaRef}
            traceRef={traceRef}
            tRef={tRef}
            samplesRef={samplesRef}
            tickListenersRef={tickListenersRef}
            onMetrics={setMetrics}
            paused={paused}
          />
          <StripChart
            titleKey="chart.velocity.title"
            yUnit="u/s"
            minScale={20}
            series={VELOCITY_SERIES}
            samplesRef={samplesRef}
            tRef={tRef}
            subscribeTick={subscribeTick}
          />
          <StripChart
            titleKey="chart.accel.title"
            yUnit="u/s²"
            minScale={2}
            series={ACCEL_SERIES}
            samplesRef={samplesRef}
            tRef={tRef}
            subscribeTick={subscribeTick}
          />
        </div>

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
