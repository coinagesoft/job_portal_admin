'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../../../services/authService'

// ── Decorative background corners (same set used on the recruiter login) ──
function BackgroundArt() {
  return (
    <>
      <img
        src="/assets/imgs/page/login-register/img-1.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', top: 24, left: 28, width: 'min(140px, 24vw)',
          opacity: 0.55, pointerEvents: 'none', userSelect: 'none',
          filter: 'grayscale(1) brightness(0.45) contrast(1.12)',
        }}
      />
      <img
        src="/assets/imgs/page/login-register/img-4.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', top: 26, right: 36, width: 'min(130px, 23vw)',
          opacity: 0.5, pointerEvents: 'none', userSelect: 'none',
          filter: 'grayscale(1) brightness(0.45) contrast(1.12)',
        }}
      />
      <img
        src="/assets/imgs/page/login-register/img-6.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 20, left: 34, width: 'min(105px, 18vw)',
          opacity: 0.45, pointerEvents: 'none', userSelect: 'none',
          filter: 'grayscale(1) brightness(0.45) contrast(1.12)',
        }}
      />
      <img
        src="/assets/imgs/page/login-register/img-5.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', right: 18, bottom: -6, width: 'min(150px, 26vw)',
          opacity: 0.5, pointerEvents: 'none', userSelect: 'none',
          filter: 'grayscale(1) brightness(0.45) contrast(1.12)',
        }}
      />
    </>
  )
}

// ── Card shell + step indicator, restyled to the orange/white system ──
function Card({ children, step }) {
  const [hovered, setHovered] = useState(false)
  return (
    <main
      className="main content-page"
      style={{
        minHeight: '100vh', background: '#ffffff', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '40px 16px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <BackgroundArt />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <div
          className="auth-shadow-card"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: '#ffffff',
            border: hovered ? '1px solid #ff9900' : '1px solid transparent',
            borderRadius: 24,
            padding: '38px 34px', overflow: 'hidden',
            boxShadow: hovered
              ? '0 8px 30px rgba(20,20,43,0.06), 0 20px 45px rgba(255,153,0,0.16)'
              : '0 8px 30px rgba(20,20,43,0.06)',
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <img
              src="/assets/imgs/page/dashboard/jobhub-logo.svg"
              alt="Admin Portal"
              style={{ height: 34, marginBottom: 22 }}
            />

            {/* Step indicator — each number + label pair is one column, so the
                label always sits exactly under its own circle */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 18 }}>
              {[1, 2, 3].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 72 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                      background: step >= s ? '#ff9900' : '#ffe6b3',
                      color: step >= s ? '#fff' : '#b9884d',
                      border: step === s ? '3px solid #ffd699' : '3px solid transparent',
                      transition: 'all .3s',
                    }}>
                      {step > s ? '✓' : s}
                    </div>
                    <span style={{
                      display: 'block', marginTop: 8, fontSize: 11,
                      fontWeight: step === s ? 700 : 500,
                      color: step === s ? '#ff9900' : 'var(--color-text-tertiary, #aaa)',
                      letterSpacing: 0.3, textTransform: 'uppercase', textAlign: 'center',
                    }}>
                      {['Identify', 'Verify OTP', 'Success'][i]}
                    </span>
                  </div>
                  {i < 2 && (
                    <div style={{
                      width: 32, height: 2, marginTop: 14, flexShrink: 0,
                      background: step > s ? '#ff9900' : '#ffe6b3',
                      transition: 'all .3s',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {children}
        </div>
      </div>
    </main>
  )
}

// ── 6-box OTP input, styled like the recruiter login's OtpDigitsInput ──
function OtpBoxes({ otp, otpRefs, onChange, onKeyDown, onPaste }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={el => (otpRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={e => onChange(index, e.target.value)}
          onKeyDown={e => onKeyDown(index, e)}
          onPaste={index === 0 ? onPaste : undefined}
          className="form-control"
          style={{
            width: 46, height: 54, padding: 0, textAlign: 'center',
            fontSize: 20, fontWeight: 700, borderRadius: 10,
            border: `1px solid ${digit ? '#ff9900' : 'var(--color-border-secondary, #e2e2e2)'}`,
            color: 'var(--color-text-primary, #122359)',
            background: '#ffffff', outline: 'none',
            transition: 'border-color .15s, box-shadow .15s',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#ff9900'
            e.target.style.boxShadow = '0 0 0 3px rgba(255,153,0,0.15)'
          }}
          onBlur={e => {
            e.target.style.borderColor = digit ? '#ff9900' : 'var(--color-border-secondary, #e2e2e2)'
            e.target.style.boxShadow = 'none'
          }}
        />
      ))}
    </div>
  )
}

function ErrorBanner({ error }) {
  if (!error) return null
  return (
    <div style={{
      marginBottom: 18, padding: '12px 14px', borderRadius: 10,
      background: '#FCEBEB', border: '1px solid #F7C1C1',
      color: '#A32D2D', fontSize: 14, lineHeight: 1.5,
    }}>
      {error}
    </div>
  )
}

const primaryBtnStyle = {
  width: '100%', height: 54, borderRadius: 10, border: 'none',
  background: '#ff9900', color: '#ffffff', fontWeight: 700, fontSize: 16,
  cursor: 'pointer', transition: 'all 0.25s ease',
}

const outlineBtnStyle = (disabled) => ({
  width: '100%', height: 52, borderRadius: 10, border: '1px solid #ff9900',
  background: disabled ? '#f7f7f7' : '#ffffff',
  color: disabled ? '#b9884d' : '#ff9900',
  fontWeight: 700, fontSize: 15, cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.25s ease',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
})

export default function LoginPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const otpRefs = useRef([])

  useEffect(() => {
    if (step !== 2) return
    setCanResend(false)
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); setCanResend(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [step])

  // ── STEP 1: Send OTP ──
  const handleSendOtp = (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim()) {
      setError('Please enter your email or mobile number.')
      return
    }
    const isEmail = identifier.includes('@')
    const isPhone = /^\+?[0-9]{10,13}$/.test(identifier.replace(/\s/g, ''))
    if (!isEmail && !isPhone) {
      setError('Enter a valid email address or 10-digit mobile number.')
      return
    }

    setLoading(true)
    authService.sendOtp(identifier)
      .then((res) => {
        setLoading(false)
        setOtp(['', '', '', '', '', ''])
        if (res?.resendAfterSeconds) {
          setResendTimer(res.resendAfterSeconds)
        } else {
          setResendTimer(60)
        }
        setStep(2)
        setTimeout(() => otpRefs.current[0]?.focus(), 50)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message || 'Failed to send OTP. Please try again.')
      })
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = ['', '', '', '', '', '']
    pasted.split('').forEach((ch, i) => { if (i < 6) newOtp[i] = ch })
    setOtp(newOtp)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  // ── STEP 2: Verify OTP ──
  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setError('')
    const entered = otp.join('')
    if (entered.length < 6) {
      setError('Please enter all 6 digits.')
      return
    }
    setLoading(true)
    authService.verifyOtp(identifier, entered, true)
      .then(() => {
        setLoading(false)
        setStep(3)
        setTimeout(() => router.push('/admin/dashboard'), 1800)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message || 'Invalid OTP or login failed. Please check and try again.')
      })
  }

  const handleResend = () => {
    if (!canResend) return
    setLoading(true)
    setError('')
    authService.resendOtp(identifier)
      .then((res) => {
        setLoading(false)
        setOtp(['', '', '', '', '', ''])
        setResendTimer(res?.resendAfterSeconds || 60)
        setCanResend(false)
        setTimeout(() => otpRefs.current[0]?.focus(), 50)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message || 'Failed to resend OTP. Please try again.')
      })
  }

  // ════ STEP 1 — Enter Email / Mobile ════
  if (step === 1) {
    return (
      <Card step={1}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <h1 style={{
            fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary, #122359)',
            marginBottom: 10, lineHeight: 1.2,
          }}>
            Admin Login
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-secondary, #666)' }}>
            Enter your registered email to receive an OTP.
          </p>
        </div>

        <form onSubmit={handleSendOtp}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600,
              color: 'var(--color-text-secondary, #555)',
            }}>
              Email  <span style={{ color: '#E24B4A' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <i
                className="fi-rr-envelope"
                aria-hidden="true"
                style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 16, color: 'var(--color-text-tertiary, #999)', pointerEvents: 'none',
                }}
              />
              <input
                className="form-control"
                type="text"
                placeholder="admin@skillbridge.io"
                value={identifier}
                onChange={e => { setIdentifier(e.target.value); setError('') }}
                style={{
                  width: '100%', height: 54, borderRadius: 10,
                  border: '1px solid var(--color-border-secondary, #e2e2e2)',
                  fontSize: 15, padding: '0 16px 0 42px',
                }}
                autoFocus
              />
            </div>
          </div>

          <ErrorBanner error={error} />

          <button type="submit" style={outlineBtnStyle(loading)} disabled={loading}>
            {loading ? 'Sending OTP…' : 'Send OTP →'}
          </button>
        </form>

        <p style={{
          fontSize: 13, color: 'var(--color-text-tertiary, #999)',
          textAlign: 'center', marginTop: 20, marginBottom: 0,
        }}>
          Protected by 2-Factor Authentication
        </p>
      </Card>
    )
  }

  // ════ STEP 2 — Enter OTP ════
  if (step === 2) {
    return (
      <Card step={2}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
         
          <h1 style={{
            fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary, #122359)',
            marginBottom: 8, lineHeight: 1.2,
          }}>
            Verify OTP
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary, #666)', marginBottom: 3 }}>
            We sent a 6-digit code to
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#ff9900', marginBottom: 0 }}>
            {identifier}
          </p>
        </div>

        <form onSubmit={handleVerifyOtp}>
          <OtpBoxes
            otp={otp}
            otpRefs={otpRefs}
            onChange={handleOtpChange}
            onKeyDown={handleOtpKeyDown}
            onPaste={handleOtpPaste}
          />

          <ErrorBanner error={error} />

          <button
            type="submit"
            style={{ ...primaryBtnStyle, marginBottom: 16, opacity: otp.join('').length < 6 ? 0.6 : 1 }}
            disabled={loading || otp.join('').length < 6}
          >
            {loading ? 'Verifying…' : 'Verify & Login'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: 13, fontWeight: 600,
                color: canResend ? '#ff9900' : 'var(--color-text-tertiary, #aaa)',
                cursor: canResend ? 'pointer' : 'default',
              }}
            >
              {canResend ? '↺ Resend OTP' : `Resend in ${resendTimer}s`}
            </button>
            {/* <button
              type="button"
              onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setError('') }}
              style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: 'var(--color-text-tertiary, #888)', cursor: 'pointer' }}
            >
              ← Change Email / Number
            </button> */}
          </div>
        </form>
      </Card>
    )
  }

  // ════ STEP 3 — Success ════
  if (step === 3) {
    return (
      <Card step={3}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#FFF3E0', border: '3px solid #ffd699',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 20px', color: '#ff9900',
          }}>✓</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary, #122359)', marginBottom: 8 }}>
            Login Successful!
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary, #666)', marginBottom: 3 }}>Verified as</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#ff9900', marginBottom: 20 }}>{identifier}</p>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary, #666)', marginBottom: 20 }}>
            Redirecting to dashboard...
          </p>

          <div style={{ height: 5, background: '#ffe6b3', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: '#ff9900', borderRadius: 3,
              animation: 'fillBar 1.8s linear forwards',
            }} />
          </div>

          <style>{`
            @keyframes fillBar { from { width: 0% } to { width: 100% } }
          `}</style>
        </div>
      </Card>
    )
  }

  return null
}