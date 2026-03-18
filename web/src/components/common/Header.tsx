// src/components/common/Header.tsx
import { useState } from 'react'
import { Container, Nav, Dropdown, Form, InputGroup, Button } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Header.css'

const notifications = [
  { title: 'New user registered',  desc: '2 min ago',   icon: 'bi-person-plus-fill',          bg: '#e9f3ff', color: '#1b84ff' },
  { title: 'Server load at 80%',   desc: '1 hour ago',  icon: 'bi-exclamation-triangle-fill', bg: '#fff8ea', color: '#f6b100' },
  { title: 'Campaign approved',    desc: '3 hours ago', icon: 'bi-check-circle-fill',         bg: '#e9fff3', color: '#17c653' },
  { title: 'New order received',   desc: 'Yesterday',   icon: 'bi-bag-fill',                  bg: '#ffe9ef', color: '#f8285a' },
]

interface Props {
  onSidebarToggle: () => void
}

export default function Header({ onSidebarToggle }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="app-header">
      <Container fluid className="h-100 d-flex align-items-center justify-content-between px-4">

        {/* Left: Mobile toggle + Logo */}
        <div className="d-flex align-items-center gap-3">
          <button className="header-icon-btn d-lg-none" onClick={onSidebarToggle}>
            <i className="bi bi-list fs-5" />
          </button>
          <a href="/" className="text-decoration-none d-lg-none">
            <span style={{ fontWeight: 800, fontSize: 16, color: '#1b84ff' }}>TrackPulse</span>
          </a>
        </div>

        {/* Center: App name (desktop) */}
        <div className="d-none d-lg-flex align-items-center">
          <span style={{ fontWeight: 700, fontSize: 15, color: '#071437' }}>TrackPulse</span>
        </div>

        {/* Right: search + notifications + user */}
        <div className="d-flex align-items-center gap-2">

          {/* Search */}
          {searchOpen ? (
            <InputGroup size="sm" style={{ width: 220 }}>
              <Form.Control placeholder="Search..." autoFocus
                style={{ borderRadius: '8px 0 0 8px', fontSize: 13, border: '1px solid #f1f1f4' }} />
              <Button variant="light" onClick={() => setSearchOpen(false)}
                style={{ borderRadius: '0 8px 8px 0', border: '1px solid #f1f1f4', borderLeft: 'none' }}>
                <i className="bi bi-x" />
              </Button>
            </InputGroup>
          ) : (
            <button className="header-icon-btn" onClick={() => setSearchOpen(true)}>
              <i className="bi bi-search" style={{ fontSize: 14 }} />
            </button>
          )}

          {/* Notifications */}
          <Dropdown align="end">
            <Dropdown.Toggle as="button" className="header-icon-btn" style={{ border: 'none' }}>
              <i className="bi bi-bell" style={{ fontSize: 15 }} />
              <span className="notif-badge">{notifications.length}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: 360, padding: '12px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <span style={{ fontWeight: 700, fontSize: 14, color: '#071437' }}>Notifications</span>
                <span className="badge rounded-pill" style={{ background: '#ffe9ef', color: '#f8285a', fontWeight: 600, fontSize: 11 }}>
                  {notifications.length} New
                </span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="notif-item">
                  <div className="notif-icon" style={{ background: n.bg }}>
                    <i className={`bi ${n.icon}`} style={{ color: n.color }} />
                  </div>
                  <div className="flex-grow-1">
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#071437' }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#99a1b7' }}>{n.desc}</div>
                  </div>
                </div>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* User dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle as="button" className="user-avatar" style={{ border: 'none' }}>
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: 240 }}>
              <div className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid #f1f1f4' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#071437' }}>{user?.name ?? user?.username}</div>
                <div style={{ fontSize: 12, color: '#99a1b7' }}>{user?.email}</div>
                <span className="badge mt-1" style={{ background: '#e9fff3', color: '#17c653', fontWeight: 600, fontSize: 11 }}>
                  ● {user?.role}
                </span>
              </div>
              <Dropdown.Item href="/profile">
                <i className="bi bi-person me-2 text-primary" />My Profile
              </Dropdown.Item>
              <Dropdown.Item href="/settings">
                <i className="bi bi-gear me-2 text-primary" />Account Settings
              </Dropdown.Item>
              <div style={{ borderTop: '1px solid #f1f1f4', margin: '6px 0' }} />
              <Dropdown.Item onClick={logout} style={{ color: '#f8285a' }}>
                <i className="bi bi-box-arrow-right me-2" />Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>
      </Container>
    </div>
  )
}
