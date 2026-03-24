// src/components/auth/Login.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { API_ENDPOINTS } from '../../constants/api'
import '../../styles/Login.css'

export default function Login() {
  const [mobile,   setMobile]   = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(
        API_ENDPOINTS.AUTHENTICATE,
        { mobileNumber: mobile, password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      const userData = res.data
      login(userData)
      if      (userData.role === 'Admin') navigate('/admin/dashboard')
      else if (userData.role === 'User')  navigate('/user/dashboard')
      else setError('Unknown role received.')
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lp-root">

      {/* ── Left: horse image panel ───────────────── */}
      <div className="lp-left">

        {/* Dark overlay so text stays readable */}
        <div className="lp-overlay" />

        {/* Bottom gradient for text readability */}
        <div className="lp-gradient" />

        {/* Content sitting on top of image */}
        <div className="lp-left-content">
          <div className="lp-brand">
            {/* Horse icon SVG */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26 4c-1 0-2 .5-2.5 1L22 6.5l-2-1c-.8-.4-1.7-.5-2.5-.3L15 6l-1.5-.5C12.5 5 11 5.5 10 6.5L8 9l-2 1-2 4 1 1 2-1 1 2-1 3 2 1 1-2 3 5 1 4h2l.5-4 2-3 2 2 1 5h2l.5-5-1-4 1.5-3c.5-1 .5-2.2 0-3.2L23 8l1.5-1.5c.5-.5.8-1.2.8-1.9C25.3 4.3 25.6 4 26 4z" fill="#C9A84C"/>
              <path d="M10 9.5C9 10.5 8.5 12 9 13.5l1 3" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="13.5" cy="7.5" r="1" fill="#1a1a2e"/>
            </svg>
            <span className="lp-brand-name">TrackPulse</span>
          </div>

          <h1 className="lp-headline">
            Race smarter.<br />Bet sharper.
          </h1>
          <p className="lp-tagline">
            Live odds, real-time updates and full race management — all in one platform.
          </p>

          {/* Stats */}
          <div className="lp-stats">
            <div className="lp-stat">
              <span className="lp-stat-value">12K+</span>
              <span className="lp-stat-label">Active Bettors</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat-value">300+</span>
              <span className="lp-stat-label">Races Monthly</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat-value">99.9%</span>
              <span className="lp-stat-label">Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: login form ─────────────────────── */}
      <div className="lp-right">
        <div className="lp-form-wrap">

          {/* Mobile brand */}
          <div className="lp-mobile-brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M26 4c-1 0-2 .5-2.5 1L22 6.5l-2-1c-.8-.4-1.7-.5-2.5-.3L15 6l-1.5-.5C12.5 5 11 5.5 10 6.5L8 9l-2 1-2 4 1 1 2-1 1 2-1 3 2 1 1-2 3 5 1 4h2l.5-4 2-3 2 2 1 5h2l.5-5-1-4 1.5-3c.5-1 .5-2.2 0-3.2L23 8l1.5-1.5c.5-.5.8-1.2.8-1.9C25.3 4.3 25.6 4 26 4z" fill="#17c653"/>
            </svg>
            <span className="lp-brand-name" style={{ color: '#071437' }}>TrackPulse</span>
          </div>

          <h2 className="lp-form-title">Welcome back</h2>
          <p className="lp-form-sub">Sign in to your account to continue</p>

          {error && (
            <div className="lp-error">
              <i className="bi bi-exclamation-circle-fill" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="lp-form">

            <div className="lp-field">
              <label className="lp-label">Mobile Number</label>
              <div className="lp-input-wrap">
                <i className="bi bi-phone lp-input-icon" />
                <input
                  className="lp-input"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="lp-field">
              <div className="lp-label-row">
                <label className="lp-label">Password</label>
                <a href="/forgot-password" className="lp-forgot">Forgot password?</a>
              </div>
              <div className="lp-input-wrap">
                <i className="bi bi-lock lp-input-icon" />
                <input
                  className="lp-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lp-eye-btn"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  <i className={`bi bi-eye${showPass ? '-slash' : ''}`} />
                </button>
              </div>
            </div>

            <button className="lp-btn" type="submit" disabled={loading}>
              {loading
                ? <><span className="lp-spinner" /> Signing in...</>
                : <>Sign In <i className="bi bi-arrow-right ms-1" /></>
              }
            </button>

          </form>

          <p className="lp-register">
            Don't have an account? <a href="/signup">Create one</a>
          </p>

          <div className="lp-secure">
            <i className="bi bi-shield-check" />
            Secured with 256-bit encryption
          </div>

        </div>
      </div>

    </div>
  )
}