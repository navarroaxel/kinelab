'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { RingParams, RingSample, RingVisibility } from '@/types/simulator'
import { computeVMin, speedToThetaDot } from '@/lib/ringKinematics'

const DEFAULT_RADIUS = 100
const DEFAULT_GRAVITY = 200

const INITIAL_PARAMS: RingParams = {
  radius: DEFAULT_RADIUS,
  gravity: DEFAULT_GRAVITY,
  // Default to the minimum bottom speed for a complete loop, v_min = √(5gR).
  // Lands the simulation right at the critical regime out of the box.
  initialSpeed: computeVMin(DEFAULT_GRAVITY, DEFAULT_RADIUS),
}

const INITIAL_VISIBILITY: RingVisibility = {
  showWeight: true,
  showNormal: true,
  showVelocity: true,
  showEnergyBar: true,
  showTrace: false,
  showCriticalMark: true,
}

export function useRingSimulator() {
  const [params, setParams] = useState<RingParams>(INITIAL_PARAMS)
  const [visibility, setVisibility] = useState<RingVisibility>(INITIAL_VISIBILITY)
  const [paused, setPaused] = useState(false)

  // RK4 integration state — refs so frames don't trigger re-renders
  const thetaRef    = useRef(0)
  const thetaDotRef = useRef(speedToThetaDot(INITIAL_PARAMS.initialSpeed, INITIAL_PARAMS.radius))
  const traceRef    = useRef<{ x: number; y: number }[]>([])

  // Strip-chart sample buffer: elapsed time + per-frame KE/PE values.
  // Reset alongside the integration state when geometry / gravity / v₀ changes.
  const tRef       = useRef(0)
  const samplesRef = useRef<RingSample[]>([])

  // Shared RAF tick: the animation loop fires every listener each frame so
  // downstream renderers (strip charts) don't each run their own loop.
  const tickListenersRef = useRef<Set<() => void>>(new Set())
  const subscribeTick = useCallback((fn: () => void) => {
    tickListenersRef.current.add(fn)
    return () => { tickListenersRef.current.delete(fn) }
  }, [])

  // Reset the simulation whenever geometry, gravity, or v₀ changes — the
  // current trajectory is no longer physically meaningful under the new params.
  useEffect(() => {
    thetaRef.current    = 0
    thetaDotRef.current = speedToThetaDot(params.initialSpeed, params.radius)
    traceRef.current    = []
    tRef.current        = 0
    samplesRef.current  = []
  }, [params.initialSpeed, params.radius, params.gravity])

  const setParam = useCallback(
    <K extends keyof RingParams>(key: K, value: RingParams[K]) => {
      setParams(prev => ({ ...prev, [key]: value }))
    },
    [],
  )

  const toggleVisibility = useCallback((key: keyof RingVisibility) => {
    setVisibility(prev => {
      const next = !prev[key]
      if (key === 'showTrace' && !next) traceRef.current = []
      return { ...prev, [key]: next }
    })
  }, [])

  const reset = useCallback(() => {
    thetaRef.current    = 0
    thetaDotRef.current = speedToThetaDot(params.initialSpeed, params.radius)
    traceRef.current    = []
    tRef.current        = 0
    samplesRef.current  = []
  }, [params.initialSpeed, params.radius])

  const togglePause = useCallback(() => setPaused(p => !p), [])

  return {
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
  }
}
