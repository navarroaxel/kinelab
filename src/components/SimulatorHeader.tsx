'use client'
import { memo } from 'react'
import { SimulatorNav } from '@/components/SimulatorNav'
import { LanguageToggle } from '@/components/LanguageToggle'
import { GitHubLink } from '@/components/GitHubLink'
import { ThemeToggle } from '@/components/ThemeToggle'

export const SimulatorHeader = memo(function SimulatorHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex justify-end gap-2 shrink-0 md:order-last">
        <LanguageToggle />
        <GitHubLink />
        <ThemeToggle />
      </div>
      <SimulatorNav />
    </div>
  )
})
