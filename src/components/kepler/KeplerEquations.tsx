'use client'

import { memo, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

function Section({ title, note, children }: {
  title: string; note?: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-2 mb-1">
        {title}
      </div>
      {children}
      {note && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{note}</p>
      )}
    </div>
  )
}

function Eq({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 text-gray-800 dark:text-gray-200 my-0.5">
      {children}
    </div>
  )
}

export const KeplerEquations = memo(function KeplerEquations() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <section className="rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-3 py-2 flex justify-between items-center"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
          {t('kepler.equations.heading')}
        </span>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 flex flex-col gap-0.5">

          <Section
            title={t('kepler.equations.section.kepler1')}
            note={t('kepler.equations.note.kepler1')}
          >
            <Eq>e = 0       → circle    (r = a = const)</Eq>
            <Eq>0 &lt; e &lt; 1  → ellipse</Eq>
            <Eq>e = 1       → parabola</Eq>
            <Eq>e &gt; 1       → hyperbola</Eq>
            <Eq>r(ν) = p / (1 + e·cos ν),   p = a(1 − e²)</Eq>
          </Section>

          <Section
            title={t('kepler.equations.section.kepler2')}
            note={t('kepler.equations.note.kepler2')}
          >
            <Eq>L = r × mv            (angular momentum)</Eq>
            <Eq>τ = r × F = 0        (central force → τ = 0 → L = const)</Eq>
            <Eq>h = L/m = r × v<sub>⊥</sub> = const  (specific ang. momentum)</Eq>
            <Eq>dA/dt = h / 2        (areal velocity — constant)</Eq>
            <Eq>dν/dt = h / r²       (faster near periapsis)</Eq>
          </Section>

          <Section
            title={t('kepler.equations.section.kepler3')}
            note={t('kepler.equations.note.kepler3')}
          >
            <Eq>T² = (4π² / μ) · a³</Eq>
            <Eq>μ<sub>Mars</sub> ≈ 42 999 km³/s²</Eq>
          </Section>

          <Section
            title={t('kepler.equations.section.vis_viva')}
            note={t('kepler.equations.note.vis_viva')}
          >
            <Eq>v² = μ·(2/r − 1/a)</Eq>
            <Eq>E  = v²/2 − μ/r = −μ/(2a) = const</Eq>
          </Section>

          <Section title={t('kepler.equations.section.circ')}>
            <Eq>v<sub>c</sub> = √(μ/r)   (e = 0, a = r)</Eq>
          </Section>

          <Section
            title={t('kepler.equations.section.mission')}
            note={t('kepler.equations.note.mission')}
          >
            <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 mb-0.5">
              r<sub>A</sub> = 5 600 km, r<sub>B</sub> = 103 400 km, r<sub>C</sub> = 4 400 km
            </div>
            <Eq>v<sub>c</sub> = √(μ/r<sub>A</sub>) ≈ 2.771 km/s</Eq>
            <Eq>v<sub>A</sub>⁺ = v<sub>c</sub> + Δv<sub>A</sub> ≈ 3.817 km/s</Eq>
            <Eq>h₁  = r<sub>A</sub> · v<sub>A</sub>⁺ ≈ 21 375 km²/s</Eq>
            <Eq>v<sub>B1</sub> = h₁ / r<sub>B</sub>  ≈ 0.207 km/s</Eq>
            <Eq>v<sub>B2</sub> = v<sub>B1</sub> − Δv<sub>B</sub> ≈ 0.185 km/s</Eq>
            <Eq>h₂  = r<sub>B</sub> · v<sub>B2</sub> ≈ 19 100 km²/s</Eq>
            <Eq>v<sub>C</sub>  = h₂ / r<sub>C</sub>  ≈ 4.341 km/s</Eq>
            <div className="font-mono text-xs bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded px-2 py-1 text-blue-700 dark:text-blue-300 font-semibold my-0.5">
              v<sub>f</sub> = v<sub>C</sub> + Δv<sub>C</sub> ≈ 5.001 km/s
            </div>
          </Section>
        </div>
      )}
    </section>
  )
})
