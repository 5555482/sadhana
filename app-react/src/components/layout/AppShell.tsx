import React from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  title?: string
  showBack?: boolean
  right?: React.ReactNode
}

export function AppShell({ title, showBack, right }: AppShellProps) {
  return (
    <div className="min-h-screen bg-base-200">
      <TopBar title={title} showBack={showBack} right={right} />
      <main className="pt-14 pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
