'use client'

import { Plane } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">
            Flight Radar <span className="text-xs text-muted-foreground">Better</span>
          </span>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
