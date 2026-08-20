'use client'

import { useState, useEffect } from 'react'
import { Clock3, Languages, Save } from 'lucide-react'
import Footer from '../../../components/Footer'
import { settingsService } from '../../../services/settingsService'

const languages = ['English (US)', 'English (UK)', 'Hindi', 'French', 'Spanish', 'German']
const sessionTimeouts = ['15 Minutes', '30 Minutes', '1 Hour', '2 Hours', 'Never']

export default function SettingsPage() {
  const [language, setLanguage] = useState('English (US)')
  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes')
  const [unsaved, setUnsaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    const fetchSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await settingsService.getSettings()
        if (!ignore) {
          setLanguage(data.language ?? 'English (US)')
          setSessionTimeout(data.sessionTimeout ?? '30 Minutes')
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load settings')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchSettings()
    return () => { ignore = true }
  }, [])

  const saveSettings = async () => {
    try {
      setSaving(true)
      setError(null)
      await settingsService.updateSettings({ language, sessionTimeout })
      setUnsaved(false)
    } catch (err) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="settings-page">
        <div className="box-heading settings-heading">
          <div className="box-title">
            <h3 className="mb-5">Settings</h3>
            <p className="font-sm color-text-paragraph-2 mb-0">Manage the platform language and admin session duration.</p>
          </div>
          <div className="box-breadcrumb">
            <div className="breadcrumbs" style={{ border: 'none', backgroundColor: 'revert' }}>
              <ul>
                <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
                <li><span>Settings</span></li>
              </ul>
            </div>
          </div>
        </div>

        <section className="settings-panel">
          <div className="settings-panel-header">
            <div>
              <h4>Platform preferences</h4>
              <p>Set the default experience for your administrators.</p>
            </div>
            {unsaved && <span className="unsaved-status">Unsaved changes</span>}
          </div>

          <div className="settings-options">
            <article className="setting-card">
              <span className="setting-icon"><Languages size={22} /></span>
              <div className="setting-copy">
                <h5>Default Language</h5>
                <p>The language used by default throughout the admin portal.</p>
              </div>
              <label className="sr-only" htmlFor="default-language">Default Language</label>
              <select
                id="default-language"
                className="form-control"
                value={language}
                disabled={loading || saving}
                onChange={(event) => { setLanguage(event.target.value); setUnsaved(true) }}
              >
                {languages.map((item) => <option key={item}>{item}</option>)}
              </select>
            </article>

            <article className="setting-card">
              <span className="setting-icon"><Clock3 size={22} /></span>
              <div className="setting-copy">
                <h5>Session Timeout</h5>
                <p>Choose how long an inactive admin session remains signed in.</p>
              </div>
              <label className="sr-only" htmlFor="session-timeout">Session Timeout</label>
              <select
                id="session-timeout"
                className="form-control"
                value={sessionTimeout}
                disabled={loading || saving}
                onChange={(event) => { setSessionTimeout(event.target.value); setUnsaved(true) }}
              >
                {sessionTimeouts.map((item) => <option key={item}>{item}</option>)}
              </select>
            </article>
          </div>

          <div className="settings-actions">
            <p>
              {error
                ? error
                : unsaved
                  ? 'Review and save your changes.'
                  : 'Your settings are up to date.'}
            </p>
            <button
              className="btn btn-primary hover-up"
              type="button"
              onClick={saveSettings}
              disabled={!unsaved || saving || loading}
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </section>

        <style jsx>{`
          .settings-page { min-height: calc(100dvh - 184px); display: flex; flex-direction: column; }
          .settings-heading { margin-bottom: 24px; }
          .settings-panel { max-width: 980px; overflow: hidden; border: 1px solid #e3eaf4; border-radius: 14px; background: #fff; box-shadow: 0 8px 24px rgba(34, 59, 115, .05); }
          .settings-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px 26px; border-bottom: 1px solid #edf1f6; }
          .settings-panel-header h4 { margin: 0 0 5px; color: #172b60; font-size: 18px; font-weight: 800; }
          .settings-panel-header p, .settings-actions p { margin: 0; color: #71809f; font-size: 12px; }
          .unsaved-status { padding: 6px 10px; border-radius: 20px; background: #fff3da; color: #b87600; font-size: 11px; font-weight: 700; white-space: nowrap; }
          .settings-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; padding: 25px 26px; }
          .setting-card { display: grid; grid-template-columns: 44px 1fr; gap: 12px; padding: 20px; border: 1px solid #e2e9f3; border-radius: 11px; background: #fff; }
          .setting-icon { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 10px; background: #fff3dc; color: #f09a00; }
          .setting-copy h5 { margin: 2px 0 5px; color: #172b60; font-size: 14px; font-weight: 800; }
          .setting-copy p { margin: 0 0 17px; color: #71809f; font-size: 12px; line-height: 1.5; }
          .setting-card select { grid-column: 1 / -1; height: 42px; color: #40577e; font-size: 13px; }
          .settings-actions { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 17px 26px; border-top: 1px solid #edf1f6; background: #fafbfd; }
          .settings-actions button { display: inline-flex; align-items: center; gap: 7px; padding: 10px 17px; font-size: 12px; font-weight: 700; }
          .settings-actions button:disabled { cursor: not-allowed; opacity: .55; }
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
          .settings-page :global(.footer) { margin-top: auto; }
          @media (max-width: 767px) { .settings-page { min-height: auto; } .settings-options { grid-template-columns: 1fr; padding: 18px; } .settings-panel-header, .settings-actions { padding: 18px; } .settings-panel-header, .settings-actions { align-items: flex-start; flex-direction: column; } .settings-actions button { width: 100%; justify-content: center; } }
        `}</style>

        <Footer />
      </div>
    </>
  )
}