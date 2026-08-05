'use client'
import { useState } from 'react'
import Footer from '../../../components/Footer'

export default function SettingsPage() {

  // ── Registration & Access state ──
  const [enableRegistrations, setEnableRegistrations] = useState(true)
  const [registrationVerification, setRegistrationVerification] = useState(true)
  const [platformFee, setPlatformFee] = useState('49.99')

  // ── Regional & Compliance state ──
  const [currency, setCurrency]     = useState('USD - United States Dollar ($)')
  const [language, setLanguage]     = useState('English (US)')
  const [geoFencing, setGeoFencing] = useState(true)

  // ── System Security state ──
  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes')
  const [enforceMFA, setEnforceMFA]         = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // ── Admin Password Reset state ──
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [forceRelogin, setForceRelogin]       = useState(true)
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

  // ── Unsaved changes indicator ──
  const [unsaved, setUnsaved] = useState(true)

  // helper: mark unsaved on any change
  const changed = () => setUnsaved(true)

  // ── shared tokens (kept from the existing theme — navy / amber) ──
  const navy   = '#122359'
  const amber  = '#ffa300'
  const gold   = '#ffc151'
  const border = '#E7E9F0'

  // ── Toggle switch ──
  const Toggle = ({ value, onChange }) => (
    <div
      onClick={() => { onChange(!value); changed() }}
      style={{
        width: '42px', height: '24px', borderRadius: '12px', flexShrink: 0,
        background: value ? amber : '#D7DAE3',
        position: 'relative', cursor: 'pointer', transition: 'background .2s',
      }}
    >
      <div style={{
        position: 'absolute', top: '3px',
        left: value ? '21px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#fff', transition: 'left .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.25)',
      }} />
    </div>
  )

  // ── Unified toggle row — one consistent visual state pattern for every toggle ──
  const ToggleRow = ({ title, desc, value, onChange, last }) => (
    <div className="hover-up" style={{
      border: `1px solid ${value ? gold : border}`,
      background: value ? '#FFF9EE' : '#fff',
      borderRadius: '10px', padding: '14px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '12px', marginBottom: last ? 0 : '10px',
    }}>
      <div>
        <p className="font-sm mb-3" style={{ fontWeight: 600, color: navy }}>{title}</p>
        <p className="font-xs color-text-paragraph-2 mb-0">{desc}</p>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )

  // ── Panel header with a consistent icon badge ──
  const PanelHeader = ({ icon, title, desc }) => (
    <div className="panel-head">
      <div className="d-flex align-items-center" style={{ gap: '12px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
          background: '#FFF4E0', color: amber,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div>
          <h5 className="mb-0">{title}</h5>
          <p className="font-xs color-text-paragraph-2 mb-0">{desc}</p>
        </div>
      </div>
    </div>
  )

  const fieldLabelStyle = { textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }

  // ── small inline icon set (currentColor, no external deps) ──
  const IconAccess = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
  const IconGlobe = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
  const IconShield = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
  const IconCheck = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
  const IconSave = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  )
  const IconKey = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3-3.5 3.5zm-.5 1.5l1.5 1.5" />
    </svg>
  )

  return (
    <>
      {/* ── PAGE HEADING ── */}
      <div className="box-heading d-flex">
        <div className="box-title mb-5">
          <h3 className="mb-5 mt-5">Platform Configuration</h3>
          <p className="font-sm color-text-paragraph-2 mb-5">
            Manage global business rules, pricing strategies, and system-wide security settings.
          </p>
        </div>

        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: 'none', backgroundColor: 'revert' }}>
            <ul>
              <li><a className="icon-home" href="/dashboard">Admin</a></li>
              <li><span>Settings</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN LAYOUT ── */}
      <div className="row align-items-start mb-20">

        {/* ════ COLUMN 1: Registration & Access + Admin Password Reset ════ */}
        <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-12 d-flex flex-column">

          <div className="section-box">
            <div className="panel-white">
              <PanelHeader
                icon={IconAccess}
                title="Registration & Access"
                desc="Control who can join the platform and how."
              />

              <div className="panel-body">

                <ToggleRow
                  title="Enable New Registrations"
                  desc="Allow new candidates and employers to create accounts."
                  value={enableRegistrations}
                  onChange={setEnableRegistrations}
                />

                <ToggleRow
                  title="Registration Verification"
                  desc="Mandate manual approval for all new employer accounts."
                  value={registrationVerification}
                  onChange={setRegistrationVerification}
                  last
                />

                {/* Platform Entry Fee */}
                <div className="form-group mt-20 mb-5">
                  <label className="font-xs color-text-paragraph-2 mb-5" style={fieldLabelStyle}>
                    Platform Entry Fee
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: '14px', top: '50%',
                      transform: 'translateY(-50%)', color: '#888', fontWeight: 600,
                    }}>$</span>
                    <input
                      className="form-control"
                      type="number"
                      value={platformFee}
                      onChange={e => { setPlatformFee(e.target.value); changed() }}
                      style={{ paddingLeft: '28px' }}
                    />
                  </div>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0" style={{ fontStyle: 'italic' }}>
                    One-time registration fee for premium employers.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Admin Password Reset */}
          <div className="section-box">
            <div className="panel-white">
              <PanelHeader
                icon={IconKey}
                title="Admin Password Reset"
                desc="Set a new password for the Super Admin account."
              />

              <div className="panel-body">

                <div className="form-group mb-20">
                  <label className="font-xs color-text-paragraph-2 mb-5" style={fieldLabelStyle}>
                    New Password
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); changed() }}
                  />
                </div>

                <div className="form-group mb-5">
                  <label className="font-xs color-text-paragraph-2 mb-5" style={fieldLabelStyle}>
                    Confirm New Password
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); changed() }}
                    style={passwordsMismatch ? { borderColor: '#e53935' } : undefined}
                  />
                  {passwordsMismatch ? (
                    <p className="font-xs mt-5 mb-0" style={{ color: '#e53935' }}>Passwords don&apos;t match.</p>
                  ) : (
                    <p className="font-xs color-text-paragraph-2 mt-5 mb-0" style={{ fontStyle: 'italic' }}>
                      Minimum 8 characters, at least one number and one symbol.
                    </p>
                  )}
                </div>

                <ToggleRow
                  title="Sign Out Everywhere"
                  desc="Force re-login on all devices after this password reset."
                  value={forceRelogin}
                  onChange={setForceRelogin}
                  last
                />

                <button
                  className="btn btn-primary hover-up mt-20"
                  disabled={!newPassword || passwordsMismatch}
                  onClick={() => { setNewPassword(''); setConfirmPassword(''); changed() }}
                  style={{
                    width: '100%', padding: '10px 24px', fontSize: '13px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    opacity: (!newPassword || passwordsMismatch) ? 0.5 : 1,
                    cursor: (!newPassword || passwordsMismatch) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {IconKey} Reset Password
                </button>

              </div>
            </div>
          </div>

        </div>

        {/* ════ COLUMN 2: Regional & Compliance + System Security ════ */}
        <div className="col-xxl-7 col-xl-7 col-lg-6 col-md-12 d-flex flex-column">

          {/* Regional & Compliance */}
          <div className="section-box">
            <div className="panel-white">
              <PanelHeader
                icon={IconGlobe}
                title="Regional & Compliance"
                desc="Localization and market restrictions."
              />

              <div className="panel-body">

                <div className="row">
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group mb-20">
                      <label className="font-xs color-text-paragraph-2 mb-5" style={fieldLabelStyle}>
                        Base Currency
                      </label>
                      <select className="form-control select2"
                        value={currency} onChange={e => { setCurrency(e.target.value); changed() }}>
                        <option>USD - United States Dollar ($)</option>
                        <option>EUR - Euro (€)</option>
                        <option>GBP - British Pound (£)</option>
                        <option>INR - Indian Rupee (₹)</option>
                        <option>AUD - Australian Dollar (A$)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group mb-20">
                      <label className="font-xs color-text-paragraph-2 mb-5" style={fieldLabelStyle}>
                        Default Language
                      </label>
                      <select className="form-control select2"
                        value={language} onChange={e => { setLanguage(e.target.value); changed() }}>
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Hindi</option>
                        <option>French</option>
                        <option>Spanish</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{
                  border: `1px solid ${geoFencing ? gold : border}`,
                  background: geoFencing ? '#FFF9EE' : '#fff',
                  borderRadius: '10px', padding: '14px 16px', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                }} className="hover-up">
                  <div>
                    <p className="font-sm mb-3" style={{ fontWeight: 600, color: navy }}>Geo-Fencing</p>
                    <p className="font-xs color-text-paragraph-2 mb-0">Restrict platform access by region.</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {geoFencing && (
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                        borderRadius: '20px', background: amber, color: '#fff',
                      }}>Active</span>
                    )}
                    <Toggle value={geoFencing} onChange={setGeoFencing} />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* System Security */}
          <div className="section-box">
            <div className="panel-white">
              <PanelHeader
                icon={IconShield}
                title="System Security"
                desc="Admin authentication and session rules."
              />

              <div className="panel-body">

                <div className="form-group mb-20">
                  <label className="font-xs color-text-paragraph-2 mb-5" style={fieldLabelStyle}>
                    Session Timeout Value
                  </label>
                  <select className="form-control select2"
                    value={sessionTimeout} onChange={e => { setSessionTimeout(e.target.value); changed() }}>
                    <option>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>2 Hours</option>
                    <option>Never</option>
                  </select>
                </div>

                <ToggleRow
                  title="Enforce Admin MFA"
                  desc="Requires 2FA for all panel access."
                  value={enforceMFA}
                  onChange={setEnforceMFA}
                />

                <ToggleRow
                  title="Maintenance Mode"
                  desc="Redirect public users to maintenance page."
                  value={maintenanceMode}
                  onChange={setMaintenanceMode}
                  last
                />

              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── BOTTOM ACTION BAR ── */}
      <div className="section-box">
        <div className="panel-white" style={{ padding: '16px 20px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '12px' }}>

            {/* Left: validation status + last saved */}
            <div className="d-flex align-items-center" style={{ gap: '16px', flexWrap: 'wrap' }}>
              <span className="font-xs" style={{
                color: '#2e7d32', fontWeight: 600, display: 'flex',
                alignItems: 'center', gap: '6px',
              }}>
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#2e7d32', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{IconCheck}</span>
                All settings validated
              </span>
              <span style={{ color: '#ddd' }}>|</span>
              <span className="font-xs color-text-paragraph-2">
                Last saved on Oct 25, 2023 &bull; 09:44 AM
              </span>
            </div>

            {/* Right: Cancel & Save buttons */}
            <div className="d-flex" style={{ gap: '10px', flexShrink: 0 }}>
              <button
                className="btn btn-secondary hover-up"
                onClick={() => setUnsaved(false)}
                style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Cancel &amp; Reset
              </button>
              <button
                className="btn btn-primary hover-up"
                onClick={() => setUnsaved(false)}
                style={{ padding: '10px 24px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {IconSave} Save Configuration Changes
              </button>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}