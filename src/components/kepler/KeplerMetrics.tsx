'use client'

import { memo, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { KeplerMetrics as KeplerMetricsData } from '@/types/simulator'

const PHASE_KEYS = [
  'kepler.phase.circular',
  'kepler.phase.transfer1',
  'kepler.phase.transfer2',
  'kepler.phase.escape',
] as const

function MetricCard({ label, value, unit, highlight }: {
  label: string
  value: string
  unit:  string
  highlight?: boolean
}) {
  return (
    <div className={`rounded px-2 py-1.5 ${highlight
      ? 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800'
      : 'bg-gray-50 dark:bg-gray-800'
    }`}>
      <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{label}</div>
      <div className={`font-mono text-sm font-semibold ${highlight
        ? 'text-blue-700 dark:text-blue-300'
        : 'text-gray-900 dark:text-gray-100'
      }`}>
        {value} <span className="text-[10px] font-normal">{unit}</span>
      </div>
    </div>
  )
}

interface Props { metrics: KeplerMetricsData }

export const KeplerMetrics = memo(function KeplerMetrics({ metrics }: Props) {
  const { t } = useLanguage()
  const [showDerived, setShowDerived] = useState(false)

  const phaseKey = PHASE_KEYS[Math.min(metrics.phase, 3)] as typeof PHASE_KEYS[number]

  return (
    <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-2">
      <h2 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        {t('kepler.metrics.heading')}
      </h2>

      <MetricCard
        label={t('kepler.metrics.phase')}
        value={t(phaseKey)}
        unit=""
      />
      <MetricCard
        label={t('kepler.metrics.altitude')}
        value={metrics.altitudeKm.toFixed(0)}
        unit="km"
      />
      <MetricCard
        label={t('kepler.metrics.speed')}
        value={metrics.speedKms.toFixed(3)}
        unit="km/s"
      />
      <MetricCard
        label={t('kepler.metrics.v_final')}
        value={metrics.vFinalKms.toFixed(3)}
        unit="km/s"
        highlight
      />

      <button
        onClick={() => setShowDerived(s => !s)}
        aria-expanded={showDerived}
        aria-controls="kepler-derived-metrics"
        className="text-left text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mt-1"
      >
        {t('kepler.metrics.derived')} {showDerived ? '▲' : '▼'}
      </button>

      {showDerived && (
        <div id="kepler-derived-metrics" className="flex flex-col gap-1.5">
          <MetricCard
            label={t('kepler.metrics.orbit1_T')}
            value={metrics.orbit1THr.toFixed(1)}
            unit="h"
          />
          <MetricCard
            label={t('kepler.metrics.orbit2_T')}
            value={metrics.orbit2THr.toFixed(1)}
            unit="h"
          />
          <MetricCard
            label={t('kepler.metrics.h1')}
            value={metrics.h1Kms.toFixed(0)}
            unit="km²/s"
          />
          <MetricCard
            label={t('kepler.metrics.h2')}
            value={metrics.h2Kms.toFixed(0)}
            unit="km²/s"
          />
        </div>
      )}
    </section>
  )
})
