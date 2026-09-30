import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

export function AppLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true)

  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      <Navbar onToggleSidebar={() => setSidebarVisible((visible) => !visible)} />
      <div className="d-flex flex-grow-1">
        {sidebarVisible && <Sidebar />}
        <main className="flex-grow-1 p-3 p-md-4 bg-body-tertiary">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
