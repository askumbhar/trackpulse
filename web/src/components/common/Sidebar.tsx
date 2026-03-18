// src/components/common/Sidebar.tsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Sidebar.css'

// ── Horse SVG icon ────────────────────────────────
// Inline so it works without any asset imports
const HorseIcon = ({ size = 22, color = '#c9a84c' }: { size?: number; color?: string }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    {/* Body */}
    <ellipse cx="30" cy="38" rx="14" ry="10" fill={color} opacity="0.9"/>
    {/* Neck */}
    <path d="M34 30 C36 24 38 20 36 14 C34 10 30 9 28 11 C26 13 27 17 28 20 C29 23 30 27 30 30Z" fill={color}/>
    {/* Head */}
    <ellipse cx="33" cy="11" rx="6" ry="5" fill={color}/>
    {/* Snout */}
    <ellipse cx="37" cy="13" rx="3" ry="2" fill={color} opacity="0.8"/>
    {/* Eye */}
    <circle cx="31" cy="9" r="1.2" fill="#1e2139"/>
    {/* Nostril */}
    <ellipse cx="38.5" cy="13.5" rx="1" ry="0.7" fill="#1e2139" opacity="0.6"/>
    {/* Ear */}
    <path d="M28 7 L26 3 L30 6Z" fill={color}/>
    {/* Mane */}
    <path d="M28 11 C25 13 23 17 24 22 C25 25 27 27 28 30" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
    {/* Tail */}
    <path d="M44 36 C48 33 52 35 50 40 C48 44 44 44 44 42" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Front legs */}
    <line x1="24" y1="46" x2="22" y2="58" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="30" y1="47" x2="29" y2="59" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    {/* Back legs */}
    <line x1="36" y1="46" x2="37" y2="58" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="42" y1="44" x2="44" y2="56" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    {/* Hooves */}
    <ellipse cx="22"  cy="59" rx="2.5" ry="1.2" fill={color} opacity="0.8"/>
    <ellipse cx="29"  cy="60" rx="2.5" ry="1.2" fill={color} opacity="0.8"/>
    <ellipse cx="37"  cy="59" rx="2.5" ry="1.2" fill={color} opacity="0.8"/>
    <ellipse cx="44"  cy="57" rx="2.5" ry="1.2" fill={color} opacity="0.8"/>
  </svg>
)

// ── Role-based menu config ────────────────────────
const adminMenu = [
  { label: 'Dashboard',         icon: 'bi-speedometer2', href: '/admin/dashboard'    },
  { label: 'Odds Manager',      icon: 'bi-grid',         href: '/admin/odds'         },
  { label: 'File Uploader',     icon: 'bi-puzzle',       href: '/admin/fileUploader' },
  { label: 'Reports',           icon: 'bi-bar-chart',    href: '/admin/reports'      },
  { label: 'Deposit Approvals', icon: 'bi-cash-stack',   href: '/admin/deposits'     },
  { label: 'User Manager',      icon: 'bi-people',       href: '/admin/users'        },
]

const userMenu = [
  { label: 'Race Selection',  icon: 'bi-flag',         href: '/user/dashboard'      },
  { label: 'Bet Now',         icon: 'bi-lightning',    href: '/user/betting'        },
  { label: 'Betting History', icon: 'bi-clock-history',href: '/user/bettinghistory' },
  { label: 'Deposit Funds',   icon: 'bi-wallet2',      href: '/user/depositfunds'   },
]

interface Props {
  collapsed: boolean
  onCollapse: () => void
  mobileOpen: boolean
  onClose: () => void
}

export default function AppSidebar({ collapsed, onCollapse, mobileOpen, onClose }: Props) {
  const { user, logout } = useAuth()
  const menuItems  = user?.role === 'Admin' ? adminMenu : userMenu
  const currentPath = window.location.pathname

  const cls = ['sidebar', collapsed && 'collapsed', mobileOpen && 'mobile-open']
    .filter(Boolean).join(' ')

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop d-lg-none" onClick={onClose} />}

      <div className={cls}>

        {/* ── Logo row ─────────────────────────── */}
        <div className="sidebar-logo">
          {collapsed ? (
            // Collapsed: show only horse icon centered
            <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center' }}>
              <HorseIcon size={26} color="#c9a84c" />
            </div>
          ) : (
            // Expanded: horse icon + TrackPulse text
            <a href="/" className="sidebar-brand-link">
              <HorseIcon size={26} color="#c9a84c" />
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-name">TrackPulse</span>
                {user && (
                  <span
                    className={`sidebar-brand-role ${user.role === 'Admin' ? 'role-admin' : 'role-user'}`}
                  >
                    {user.role}
                  </span>
                )}
              </div>
            </a>
          )}

          {/* Collapse toggle — desktop only */}
          <button
            className="collapse-btn d-none d-lg-inline"
            onClick={onCollapse}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <i className={`bi bi-chevron-${collapsed ? 'right' : 'left'}`} />
          </button>
        </div>

        {/* ── Nav ──────────────────────────────── */}
        <nav className="sidebar-menu">
          <div className="sidebar-section-label">
            {user?.role === 'Admin' ? 'Admin Menu' : 'Menu'}
          </div>

          {menuItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              className={`menu-btn ${currentPath === item.href ? 'current' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <i className={`bi ${item.icon} menu-icon`} />
              <span className="menu-label">{item.label}</span>
            </a>
          ))}

          <div className="sidebar-section-label mt-2">Account</div>
          <button
            className="menu-btn signout-btn"
            onClick={logout}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <i className="bi bi-box-arrow-right menu-icon" />
            <span className="menu-label">Sign Out</span>
          </button>
        </nav>

        {/* ── User info footer ──────────────────── */}
        {!collapsed && user && (
          <div className="sidebar-user-footer">
            <div
              className={`sidebar-avatar ${user.role === 'Admin' ? 'avatar-admin' : 'avatar-user'}`}
            >
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="sidebar-user-name">
                {user.name ?? user.username}
              </div>
              <div className="sidebar-user-email">
                {user.email}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}