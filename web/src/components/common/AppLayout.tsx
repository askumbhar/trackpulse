// src/components/common/AppLayout.tsx
import { useState, type ReactNode } from 'react'
import Header  from './Header'
import Sidebar from './Sidebar'
import Footer  from './Footer'
import '../../styles/AppLayout.css'

interface Props {
  children?: ReactNode
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function AppLayout({ children, title, breadcrumbs = [] }: Props) {
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const sidebarWidth = sidebarCollapsed ? 70 : 265

  return (
    <div className="app-layout">

      {/* Header — sticky top:0, z-index:1045
          Spans the full viewport width and sits ON TOP of
          the sidebar's logo row, creating one seamless top band. */}
      <Header onSidebarToggle={() => setMobileSidebarOpen(v => !v)} />

      <div className="app-body">

        {/* Sidebar — fixed top:0, z-index:1040
            Logo row is 65px tall = same as header height.
            Header's higher z-index covers the sidebar's top edge
            on the right so both appear as one top nav bar.        */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(v => !v)}
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main content — offset by sidebar width */}
        <div className="app-main" style={{ marginLeft: sidebarWidth }}>

          {/* Toolbar only shown when title prop is provided */}
          {title && (
            <div className="app-toolbar">
              <h1 className="page-heading">{title}</h1>
              {breadcrumbs.length > 0 && (
                <ol className="breadcrumb">
                  {breadcrumbs.map((crumb, i) => (
                    <li
                      key={i}
                      className={`breadcrumb-item ${i === breadcrumbs.length - 1 ? 'active' : ''}`}
                    >
                      {crumb.href
                        ? <a href={crumb.href}>{crumb.label}</a>
                        : crumb.label}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <div className="app-content">
            {children}
          </div>

          <Footer />
        </div>

      </div>
    </div>
  )
}