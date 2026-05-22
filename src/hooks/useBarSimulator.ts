'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { BarParams, BarVisibility } from '@/types/simulator'

const INITIAL_PARAMS: BarParams = {
  omega: 1.5,
  r0: 20,
  rDot0: 0,
  barLength: 130,
  mass: 1,
}

const INITIAL_VISIBILITY: BarVisibility = {
  showRadialAcc: true,
  showCoriolisAcc: true,
  showNormalForce: true,
  showVelocityComponents: true,
  showTrace: false,
  showRotatingFrame: false,
}

export function useBarSimulator() {
  const [params, setParams] = useState<BarParams>(INITIAL_PARAMS)
  const [visibility, setVisibility] = useState<BarVisibility>(INITIAL_VISIBILITY)
  const [paused, setPaused] = useState(false)

  // Elapsed simulation time — advanced by the RAF loop and reset on param change.
  const tRef            = useRef(0)
  const traceRef        = useRef<{ x: number; y: number }[]>([])
  const ghostAnglesRef  = useRef<number[]>([])

  // The closed-form solution depends on (r₀, ṙ₀, ω). Any of those changing
  // makes the current trajectory meaningless, so reset everything together.
  // bar length and visibility don't affect r(t), so they don't reset time.
  useEffect(() => {
    tRef.current = 0
    traceRef.current = []
    ghostAnglesRef.current = []
  }, [params.omega, params.r0, params.rDot0])

  const setParam = useCallback(
    <K extends keyof BarParams>(key: K, value: BarParams[K]) => {
      setParams(prev => ({ ...prev, [key]: value }))
    },
    [],
  )

  const toggleVisibility = useCallback((key: keyof BarVisibility) => {
    setVisibility(prev => {
      const next = !prev[key]
      if (key === 'showTrace' && !next) traceRef.current = []
      if (key === 'showRotatingFrame' && !next) ghostAnglesRef.current = []
      return { ...prev, [key]: next }
    })
  }, [])

  const reset = useCallback(() => {
    tRef.current = 0
    traceRef.current = []
    ghostAnglesRef.current = []
  }, [])

  const togglePause = useCallback(() => setPaused(p => !p), [])

  return {
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
  }
}
