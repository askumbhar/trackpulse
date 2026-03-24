// src/components/auth/ForgotPassword.tsx
import { useState } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../../constants/api'
import '../../styles/Login.css'

const HorseIcon = ({ size = 28, color = '#c9a84c' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M26 4c-1 0-2 .5-2.5 1L22 6.5l-2-1c-.8-.4-1.7-.5-2.5-.3L15 6l-1.5-.5C12.5 5 11 5.5 10 6.5L8 9l-2 1-2 4 1 1 2-1 1 2-1 3 2 1 1-2 3 5 1 4h2l.5-4 2-3 2 2 1 5h2l.5-5-1-4 1.5-3c.5-1 .5-2.2 0-3.2L23 8l1.5-1.5c.5-.5.8-1.2.8-1.9C25.3 4.3 25.6 4 26 4z" fill={color}/>
    <circle cx="13.5" cy="7.5" r="1" fill="#1a1a2e"/>
  </svg>
)

type Step = 'request' | 'sent'

export default function ForgotPassword() {
  const [mobile,  setMobile]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [step,    setStep]    = useState<Step>('request')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, { mobileNumber: mobile })
      setStep('sent')
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.')
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
            Reset your<br />password.
          </h1>
          <p className="lp-tagline">
            Enter your registered mobile number and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      {/* ── Right: form ───────────────────────────── */}
      <div className="lp-right">
        <div className="lp-form-wrap">

          {/* Mobile brand */}
          <div className="lp-mobile-brand">
            <HorseIcon size={24} color="#17c653" />
            <span className="lp-brand-name" style={{ color: '#071437' }}>TrackPulse</span>
          </div>

          {step === 'request' ? (
            <>
              <h2 className="lp-form-title">Forgot password?</h2>
              <p className="lp-form-sub">We'll send a reset link to your mobile number</p>

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
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={e => { setMobile(e.target.value); setError('') }}
                      autoComplete="tel"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <button className="lp-btn" type="submit" disabled={loading}>
                  {loading
                    ? <><span className="lp-spinner" /> Sending...</>
                    : <>Send Reset Link <i className="bi bi-send ms-1" /></>
                  }
                </button>
              </form>
            </>
          ) : (
            /* ── Sent confirmation ────────────────── */
            <div className="lp-sent-wrap">
              <div className="lp-sent-icon">
                <i className="bi bi-check-circle-fill" />
              </div>
              <h2 className="lp-form-title" style={{ textAlign: 'center' }}>Link sent!</h2>
              <p className="lp-form-sub" style={{ textAlign: 'center', marginBottom: 28 }}>
                We've sent a password reset link to <strong style={{ color: '#071437' }}>+91 {mobile}</strong>.
                Check your SMS and follow the instructions.
              </p>
              <button
                className="lp-btn"
                onClick={() => { setStep('request'); setMobile('') }}
              >
                <i className="bi bi-arrow-left me-1" /> Try a different number
              </button>
            </div>
          )}

          <p className="lp-register" style={{ marginTop: 24 }}>
            Remember your password? <a href="/login">Sign in</a>
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