'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { KeplerParams, KeplerVisibility, KeplerMetrics } from '@/types/simulator'
import {
  computeMission,
  DEFAULT_DV_A,
  DEFAULT_DV_B,
  DEFAULT_DV_C,
  R_MARS,
} from '@/lib/keplerKinematics'

const INITIAL_PARAMS: KeplerParams = {
  dvA:       DEFAULT_DV_A,
  dvB:       DEFAULT_DV_B,
  dvC:       DEFAULT_DV_C,
  animSpeed: 5_000,
}

const INITIAL_VISIBILITY: KeplerVisibility = {
  showVelocity:  true,
  showOrbits:    true,
  showAreaSweep: true,
  showTrace:     true,
}

function makeInitialMetrics(params: KeplerParams): KeplerMetrics {
  const m = computeMission(params.dvA, params.dvB, params.dvC)
  return {
    phase:      0,
    altitudeKm: m.orbit0.a - R_MARS,
    speedKms:   m.vCirc,
    vFinalKms:  m.vFinal,
    orbit1THr:  m.orbit1.T / 3600,
    orbit2THr:  m.orbit2.T / 3600,
    h1Kms:      m.orbit1.h,
    h2Kms:      m.orbit2.h,
  }
}

export function useKeplerSimulator() {
  const [params,     setParams]     = useState<KeplerParams>(INITIAL_PARAMS)
  const [visibility, setVisibility] = useState<KeplerVisibility>(INITIAL_VISIBILITY)
  const [paused,     setPaused]     = useState(false)
  const [resetCount, setResetCount] = useState(0)
  const [metrics,    setMetrics]    = useState<KeplerMetrics>(() => makeInitialMetrics(INITIAL_PARAMS))

  // High-frequency state in refs — never trigger re-renders
  const nuRef      = useRef(0)
  const phaseRef   = useRef(0)
  const missionRef = useRef(computeMission(INITIAL_PARAMS.dvA, INITIAL_PARAMS.dvB, INITIAL_PARAMS.dvC))

  // Recompute mission and restart when manoeuvre params change
  useEffect(() => {
    missionRef.current = computeMission(params.dvA, params.dvB, params.dvC)
    nuRef.current    = 0
    phaseRef.current = 0
    setResetCount(n => n + 1)
  }, [params.dvA, params.dvB, params.dvC])

  const setParam = useCallback(
    <K extends keyof KeplerParams>(key: K, value: KeplerParams[K]) => {
      setParams(prev => ({ ...prev, [key]: value }))
    },
    [],
  )

  const toggleVisibility = useCallback((key: keyof KeplerVisibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const reset = useCallback(() => {
    nuRef.current    = 0
    phaseRef.current = 0
    setResetCount(n => n + 1)
  }, [])

  const togglePause = useCallback(() => setPaused(p => !p), [])

  return {
    params, setParam,
    visibility, toggleVisibility,
    paused, togglePause,
    resetCount, reset,
    metrics, setMetrics,
    nuRef, phaseRef, missionRef,
  }
}
