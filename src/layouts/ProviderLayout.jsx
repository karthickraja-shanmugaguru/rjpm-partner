import React from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { Sidebar } from '../components/layout/Sidebar'
import { ProviderMobileNav } from '../components/layout/ProviderMobileNav'

export const ProviderLayout = () => {
  return (
    <div className="app">
      <TopBar />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
      <ProviderMobileNav />
    </div>
  )
}
