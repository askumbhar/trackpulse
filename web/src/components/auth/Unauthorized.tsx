// src/components/auth/Unauthorized.tsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Login.css'

const HorseIcon = ({ size = 28, color = '#c9a84c' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M26 4c-1 0-2 .5-2.5 1L22 6.5l-2-1c-.8-.4-1.7-.5-2.5-.3L15 6l-1.5-.5C12.5 5 11 5.5 10 6.5L8 9l-2 1-2 4 1 1 2-1 1 2-1 3 2 1 1-2 3 5 1 4h2l.5-4 2-3 2 2 1 5h2l.5-5-1-4 1.5-3c.5-1 .5-2.2 0-3.2L23 8l1.5-1.5c.5-.5.8-1.2.8-1.9C25.3 4.3 25.6 4 26 4z" fill={color}/>
    <circle cx="13.5" cy="7.5" r="1" fill="#1a1a2e"/>
  </svg>
)

export default function Unauthorized() {
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const homeHref = user
    ? user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard'
    : '/login'

  const homeLabel = user ? 'Go to Dashboard' : 'Back to Login'

  return (
    <div className="lp-root">

      {/* ── Left: horse image ─────────────────────── */}
      <div className="lp-left">
        <div className="lp-overlay" />
        <div className="lp-gradient" />
        <div className="lp-left-content">
          <div className="lp-brand">
            <HorseIcon size={28} color="#c9a84c" />
            <span className="lp-brand-name">TrackPulse</span>
          </div>
          <h1 className="lp-headline">
            Access<br />Restricted.
          </h1>
          <p className="lp-tagline">
            You don't have permission to view this page. Please contact an administrator if you believe this is a mistake.
          </p>
        </div>
      </div>

      {/* ── Right: error message ──────────────────── */}
      <div className="lp-right">
        <div className="lp-form-wrap">

          {/* Mobile brand */}
          <div className="lp-mobile-brand">
            <HorseIcon size={24} color="#17c653" />
            <span className="lp-brand-name" style={{ color: '#071437' }}>TrackPulse</span>
          </div>

          {/* Error icon */}
          <div className="lp-unauth-icon">
            <i className="bi bi-shield-x" />
          </div>

          <h2 className="lp-form-title" style={{ textAlign: 'center' }}>
            403 — Unauthorized
          </h2>
          <p className="lp-form-sub" style={{ textAlign: 'center', marginBottom: 32 }}>
            You don't have permission to access this page.
            {user && (
              <> Your role is <strong style={{ color: '#071437' }}>{user.role}</strong>.</>
            )}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="lp-btn" onClick={() => navigate(homeHref)}>
              <i className="bi bi-house me-2" />
              {homeLabel}
            </button>

            <button
              onClick={() => navigate(-1)}
              style={{
                width: '100%', background: 'transparent',
                border: '1px solid #f1f1f4', borderRadius: 8,
                color: '#99a1b7', fontFamily: 'Barlow, sans-serif',
                fontSize: '0.9rem', fontWeight: 600, padding: 12,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#17c653'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#17c653'
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#f1f1f4'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#99a1b7'
              }}
            >
              <i className="bi bi-arrow-left me-2" />
              Go Back
            </button>
          </div>

          {/* Support note */}
          <div className="lp-secure" style={{ marginTop: 28 }}>
            <i className="bi bi-headset" style={{ color: '#99a1b7' }} />
            <span>Need help? Contact support</span>
          </div>

        </div>
      </div>

    </div>
  )
}