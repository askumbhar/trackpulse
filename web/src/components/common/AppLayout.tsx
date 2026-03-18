// src/components/admin/AdminDashboard.tsx
import { useState, type ReactNode } from 'react'
import Header  from '../common/Header'
import Sidebar from '../common/Sidebar'
import Footer  from '../common/Footer'
import '../../styles/AppLayout.css'   // ← layoutStyles moved here

interface Props {
  children?: ReactNode
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function AppLayout({ children, title = '', breadcrumbs = [] }: Props) {
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const sidebarWidth = sidebarCollapsed ? 70 : 265

  return (
    <div className="app-layout">

      <Header onSidebarToggle={() => setMobileSidebarOpen(v => !v)} />

      <div className="app-body">

        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(v => !v)}  // ← prop name fixed (was onToggleCollapse)
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="app-main" style={{ marginLeft: sidebarWidth }}>

          {/* Toolbar / page title */}
          <div className="app-toolbar">
            <h1 className="page-heading">{title}</h1>
            {breadcrumbs.length > 0 && (
              <ol className="breadcrumb">
                {breadcrumbs.map((crumb, i) => (
                  <li key={i} className={`breadcrumb-item ${i === breadcrumbs.length - 1 ? 'active' : ''}`}>
                    {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : crumb.label}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Page content */}
          <div className="app-content">
            {children}
          </div>

          <Footer />
        </div>

      </div>
    </div>
  )
}
