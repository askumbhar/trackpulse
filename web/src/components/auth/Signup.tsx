// src/components/auth/Signup.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../styles/Login.css'

const API_URL = 'https://localhost:7156/api/users/register'

const HorseIcon = ({ size = 28, color = '#c9a84c' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M26 4c-1 0-2 .5-2.5 1L22 6.5l-2-1c-.8-.4-1.7-.5-2.5-.3L15 6l-1.5-.5C12.5 5 11 5.5 10 6.5L8 9l-2 1-2 4 1 1 2-1 1 2-1 3 2 1 1-2 3 5 1 4h2l.5-4 2-3 2 2 1 5h2l.5-5-1-4 1.5-3c.5-1 .5-2.2 0-3.2L23 8l1.5-1.5c.5-.5.8-1.2.8-1.9C25.3 4.3 25.6 4 26 4z" fill={color}/>
    <circle cx="13.5" cy="7.5" r="1" fill="#1a1a2e"/>
  </svg>
)

export default function Signup() {
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', password: '', confirm: '',
  })
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setError('')
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim())                          errs.name    = 'Full name is required.'
    if (!/^\d{10}$/.test(form.mobile))              errs.mobile  = 'Enter a valid 10-digit mobile number.'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (form.password.length < 6)                   errs.password = 'Password must be at least 6 characters.'
    if (form.password !== form.confirm)             errs.confirm  = 'Passwords do not match.'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setLoading(true)
    try {
      await axios.post(API_URL, {
        fullName:     form.name,
        mobileNumber: form.mobile,
        email:        form.email,
        password:     form.password,
      })
      navigate('/login?registered=1')
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            Join the race.<br />Start winning.
          </h1>
          <p className="lp-tagline">
            Create your account in seconds and get instant access to live races, real-time odds and your personal wallet.
          </p>
          <div className="lp-stats">
            <div className="lp-stat">
              <span className="lp-stat-value">Free</span>
              <span className="lp-stat-label">To Register</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat-value">Instant</span>
              <span className="lp-stat-label">Account Access</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat-value">24 / 7</span>
              <span className="lp-stat-label">Live Races</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: signup form ────────────────────── */}
      <div className="lp-right">
        <div className="lp-form-wrap">

          {/* Mobile brand */}
          <div className="lp-mobile-brand">
            <HorseIcon size={24} color="#17c653" />
            <span className="lp-brand-name" style={{ color: '#071437' }}>TrackPulse</span>
          </div>

          <h2 className="lp-form-title">Create account</h2>
          <p className="lp-form-sub">Fill in your details to get started</p>

          {error && (
            <div className="lp-error">
              <i className="bi bi-exclamation-circle-fill" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="lp-form">

            {/* Full name */}
            <div className="lp-field">
              <label className="lp-label">Full Name</label>
              <div className="lp-input-wrap">
                <i className="bi bi-person lp-input-icon" />
                <input
                  className={`lp-input ${fieldErrors.name ? 'lp-input-error' : ''}`}
                  type="text" name="name"
                  placeholder="Enter your full name"
                  value={form.name} onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {fieldErrors.name && <span className="lp-field-error">{fieldErrors.name}</span>}
            </div>

            {/* Mobile */}
            <div className="lp-field">
              <label className="lp-label">Mobile Number</label>
              <div className="lp-input-wrap">
                <i className="bi bi-phone lp-input-icon" />
                <input
                  className={`lp-input ${fieldErrors.mobile ? 'lp-input-error' : ''}`}
                  type="tel" name="mobile"
                  placeholder="10-digit mobile number"
                  value={form.mobile} onChange={handleChange}
                  autoComplete="tel" maxLength={10}
                />
              </div>
              {fieldErrors.mobile && <span className="lp-field-error">{fieldErrors.mobile}</span>}
            </div>

            {/* Email (optional) */}
            <div className="lp-field">
              <label className="lp-label">
                Email <span style={{ color: '#c8cdd8', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <div className="lp-input-wrap">
                <i className="bi bi-envelope lp-input-icon" />
                <input
                  className={`lp-input ${fieldErrors.email ? 'lp-input-error' : ''}`}
                  type="email" name="email"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && <span className="lp-field-error">{fieldErrors.email}</span>}
            </div>

            {/* Password */}
            <div className="lp-field">
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <i className="bi bi-lock lp-input-icon" />
                <input
                  className={`lp-input ${fieldErrors.password ? 'lp-input-error' : ''}`}
                  type={showPass ? 'text' : 'password'} name="password"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="lp-eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                  <i className={`bi bi-eye${showPass ? '-slash' : ''}`} />
                </button>
              </div>
              {fieldErrors.password && <span className="lp-field-error">{fieldErrors.password}</span>}
            </div>

            {/* Confirm password */}
            <div className="lp-field">
              <label className="lp-label">Confirm Password</label>
              <div className="lp-input-wrap">
                <i className="bi bi-lock-fill lp-input-icon" />
                <input
                  className={`lp-input ${fieldErrors.confirm ? 'lp-input-error' : ''}`}
                  type={showConfirm ? 'text' : 'password'} name="confirm"
                  placeholder="Re-enter password"
                  value={form.confirm} onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="lp-eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  <i className={`bi bi-eye${showConfirm ? '-slash' : ''}`} />
                </button>
              </div>
              {fieldErrors.confirm && <span className="lp-field-error">{fieldErrors.confirm}</span>}
            </div>

            <button className="lp-btn" type="submit" disabled={loading}>
              {loading
                ? <><span className="lp-spinner" /> Creating account...</>
                : <>Create Account <i className="bi bi-arrow-right ms-1" /></>
              }
            </button>

          </form>

          <p className="lp-register">
            Already have an account? <a href="/login">Sign in</a>
          </p>

          <div className="lp-secure">
            <i className="bi bi-shield-check" />
            Your data is encrypted and never shared
          </div>

        </div>
      </div>

    </div>
  )
}