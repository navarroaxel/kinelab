'use client'
import { memo } from 'react'
import { SimulatorNav } from '@/components/SimulatorNav'
import { LanguageToggle } from '@/components/LanguageToggle'
import { GitHubLink } from '@/components/GitHubLink'
import { ThemeToggle } from '@/components/ThemeToggle'

export const SimulatorHeader = memo(function SimulatorHeader() {
  return (
    <>
      <div className="flex justify-end gap-2">
        <LanguageToggle />
        <GitHubLink />
        <ThemeToggle />
      </div>
      <div className="flex justify-end gap-2">
        <SimulatorNav />
      </div>
    </>
  )
})
