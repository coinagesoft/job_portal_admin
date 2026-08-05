'use client'
import { useMemo, useState } from 'react'
import Footer from '../../../components/Footer'
import {
  Monitor,
  AlertTriangle,
  ShieldCheck,
  Download,
  Search,
  ChevronDown,
  Copy,
  Check,
  X,
  Calendar,
  Flag,
  FlagOff
} from "lucide-react"

// SNAKE_CASE action code → readable label, e.g. USER_SUSPENDED → "User Suspended"
function formatAction(action) {
  return action
    .toLowerCase()
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ── Severity → color mapping (single source of truth, used everywhere) ──
const SEVERITY_STYLES = {
  critical: { color: '#c62828', bg: '#fdecea', label: 'Critical' },
  warning: { color: '#e65100', bg: '#fff3e0', label: 'Warning' },
  info: { color: '#2e7d32', bg: '#e8f5e9', label: 'Info' },
}

const ACTION_STYLES = {
  USER_SUSPENDED: { color: '#c62828', bg: '#fdecea' },
  BATCH_PAYMENT_INIT: { color: '#122359', bg: '#f0f0f0' },
  DATA_EXPORT_DPDP: { color: '#b36b00', bg: '#fff3e0' },
  CONFIG_CHANGE: { color: '#2e7d32', bg: '#e8f5e9' },
  LOGIN_SUCCESS: { color: '#555', bg: '#f5f5f5' },
}

// ── Mock data — every row now carries the full field set so the detail
//    drawer is consistent regardless of which row is expanded ──
const logsData = [
  {
    ts: '2023-11-24\n14:22:01',
    actor: 'sarah.admin@skillbridge.io',
    actor_id: 'ADM-001',
    action: 'USER_SUSPENDED',
    severity: 'critical',
    session_id: 'SES-77821',
    entity: 'John Doe',
    target_id: 'USR-1293',
    ip: '192.168.1.45',
    change_reason: 'Repeated violations',
    old_value: 'Active',
    new_value: 'Suspended',
    hash: 'a8f5f167f44f4964e6c998dee827110c',
  },
  {
    ts: '2023-11-24\n13:05:12',
    actor: 'system.automator',
    actor_id: 'SYS-000',
    action: 'BATCH_PAYMENT_INIT',
    severity: 'info',
    session_id: 'SES-77821',
    entity: 'Payroll #402',
    target_id: 'PAY-402',
    ip: '10.0.0.8',
    change_reason: 'Scheduled payroll run',
    old_value: 'Pending',
    new_value: 'Processing',
    hash: 'e3b0c44298fc1c149afbf4c8996fb924',
  },
  {
    ts: '2023-11-24\n11:45:55',
    actor: 'mike.finance@skillbridge.io',
    actor_id: 'ADM-014',
    action: 'DATA_EXPORT_DPDP',
    severity: 'warning',
    session_id: 'SES-77821',
    entity: 'Q3 Revenue Report',
    target_id: 'RPT-Q3-2023',
    ip: '172.16.254.1',
    change_reason: 'Quarterly compliance export',
    old_value: '—',
    new_value: 'Exported',
    hash: '9f86d081884c7d659a2feaa0c55ad015',
  },
  {
    ts: '2023-11-24\n09:12:30',
    actor: 'admin.super',
    actor_id: 'ADM-000',
    action: 'CONFIG_CHANGE',
    severity: 'warning',
    session_id: 'SES-77821',
    entity: 'Global Registration Fee',
    target_id: 'CFG-REG-FEE',
    ip: '192.168.5.112',
    change_reason: 'Pricing update approved by finance',
    old_value: '₹499',
    new_value: '₹599',
    hash: '2c624232cdd221771294dfbb310aca00',
  },
  {
    ts: '2023-11-24\n08:30:00',
    actor: 'sarah.admin@skillbridge.io',
    actor_id: 'ADM-001',
    action: 'LOGIN_SUCCESS',
    severity: 'info',
    session_id: 'SES-77821',
    entity: 'Admin Session',
    target_id: 'SES-77821',
    ip: '192.168.1.45',
    change_reason: '—',
    old_value: '—',
    new_value: '—',
    hash: 'd4735e3a265e16eee03f59718b9b5d03',
  },
]

// Logs pre-flagged for review on load (in a real app this comes from the backend)
const initialFlags = {
  'a8f5f167f44f4964e6c998dee827110c': { status: 'open', note: 'Repeated violations — confirm no prior warnings were missed.' },
  '2c624232cdd221771294dfbb310aca00': { status: 'open', note: 'Fee change — verify finance sign-off is on file.' },
}

const dpdpRules = [
  { rule: 'Notice of Purpose', status: 'Compliant', statusColor: '#2e7d32', statusBg: '#e8f5e9', desc: 'Admin must state why data is accessed.' },
  { rule: 'Data Minimization', status: 'Compliant', statusColor: '#2e7d32', statusBg: '#e8f5e9', desc: 'Only required fields were exported in the last 24h.' },
  { rule: 'Right to Erasure', status: 'Action Required', statusColor: '#e65100', statusBg: '#fff3e0', desc: 'Pending user deletion requests are processed.' },
  { rule: 'Auditability', status: 'Compliant', statusColor: '#2e7d32', statusBg: '#e8f5e9', desc: 'System logs are hashed and non-repudiable.' },
]

// Small badge helper — keeps table markup readable
function Badge({ color, bg, children, pill = true }) {
  return (
    <span style={{
      fontSize: '10px',
      fontWeight: 700,
      padding: pill ? '3px 10px' : '4px 10px',
      borderRadius: pill ? '20px' : '4px',
      color,
      background: bg,
      whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {children}
    </span>
  )
}

function CopyHash({ hash }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        navigator.clipboard?.writeText(hash)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      className="font-xs"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        border: '1px solid #eee', background: '#fafafa', borderRadius: '4px',
        padding: '4px 8px', cursor: 'pointer', color: '#555',
        fontFamily: 'monospace', fontSize: '11px',
      }}
      title="Copy full hash"
    >
      {hash.slice(0, 10)}…
      {copied ? <Check size={12} color="#2e7d32" /> : <Copy size={12} />}
    </button>
  )
}

export default function AuditLogsPage() {
  const [actorFilter, setActorFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [openInspection, setOpenInspection] = useState(null)
  const [openRow, setOpenRow] = useState(null)
  const [exportMsg, setExportMsg] = useState('')
  const [flags, setFlags] = useState(initialFlags)

  function toggleFlag(hash) {
    setFlags(prev => {
      const next = { ...prev }
      if (next[hash]) {
        delete next[hash]
      } else {
        next[hash] = { status: 'open', note: '' }
      }
      return next
    })
  }

  function toggleResolved(hash) {
    setFlags(prev => ({
      ...prev,
      [hash]: { ...prev[hash], status: prev[hash].status === 'open' ? 'resolved' : 'open' }
    }))
  }

  const flaggedLogs = useMemo(() => {
    return logsData
      .filter(l => flags[l.hash])
      .map(l => ({ ...l, flagStatus: flags[l.hash].status, flagNote: flags[l.hash].note }))
      .sort((a, b) => (a.flagStatus === b.flagStatus ? 0 : a.flagStatus === 'open' ? -1 : 1))
  }, [flags])

  const filtered = useMemo(() => logsData.filter(l => {
    const matchesActor = l.actor.toLowerCase().includes(actorFilter.toLowerCase())
    const matchesAction = l.action.toLowerCase().includes(actionFilter.toLowerCase())
    const matchesSeverity = severityFilter === '' || l.severity === severityFilter
    const matchesDate = dateFilter === '' || l.ts.startsWith(dateFilter)
    return matchesActor && matchesAction && matchesSeverity && matchesDate
  }), [actorFilter, actionFilter, severityFilter, dateFilter])

  const criticalCount = logsData.filter(l => l.severity === 'critical').length
  const hasActiveFilters = actorFilter || actionFilter || dateFilter || severityFilter

  function handleExport(kind) {
    setExportMsg(kind === 'csv' ? 'CSV export started…' : 'Preparing DPDP-compliant export…')
    setTimeout(() => setExportMsg(''), 2500)
  }

  return (
    <>
      {/* ── PAGE HEADING ── */}
      <div className="box-heading mb-5">
        <div className="box-title">
          <div className="d-flex align-items-center" style={{ gap: '12px' }}>
            <div>
              <h3 className="mb-5">Audit &amp; Compliance</h3>
              <p className="font-sm color-text-paragraph-2 mb-0">
                Monitor immutable action logs and ensure DPDP regulatory compliance.
              </p>
            </div>
          </div>
        </div>

        <div className="box-breadcrumb">
          <div className="breadcrumbs">
            <ul>
              <li><a className="icon-home" href="/dashboard">Admin</a></li>
              <li><span>Audit Logs</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── EXPORT TOOLBAR ── */}
      <div className="d-flex align-items-center mb-5 justify-content-end" style={{ gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>
        {exportMsg && (
          <span className="font-xs" style={{ color: '#2e7d32', fontWeight: 600 }}>{exportMsg}</span>
        )}
        <button
          onClick={() => handleExport('csv')}
          className="btn btn-secondary hover-up"
          style={{ padding: '9px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', border: 'none', cursor: 'pointer' }}>
          <Download size={14} /> Export CSV
        </button>
        <button
          onClick={() => handleExport('dpdp')}
          className="btn btn-primary hover-up"
          style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', border: 'none', cursor: 'pointer' }}>
          <ShieldCheck size={14} /> Export for DPDP
        </button>
      </div>

      {/* ── STAT WIDGETS ── */}
      <div className="section-box mt-2">
        <div className="row">
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
            <div className="card-style-1 hover-up">
              <div className="card-image"><Monitor size={28} strokeWidth={2.2} /></div>
              <div className="card-info">
                <h3>14,202</h3>
                <p>Total Logs (24h)</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
            <div className="card-style-1 hover-up">
              <div className="card-image"><AlertTriangle size={28} strokeWidth={2.2} /></div>
              <div className="card-info">
                <h3>24</h3>
                <p>Critical Actions</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
            <div className="card-style-1 hover-up">
              <div className="card-image"><ShieldCheck size={28} strokeWidth={2.2} /></div>
              <div className="card-info">
                <h3>98.2%</h3>
                <p>DPDP Status</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
            <div className="card-style-1 hover-up">
              <div className="card-image"><Download size={28} strokeWidth={2.2} /></div>
              <div className="card-info">
                <h3>2h ago</h3>
                <p>Last Export</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12">

          {/* ── AUDIT LOG TABLE ── */}
          <div className="section-box">
            <div className="panel-white">

              {/* Filter bar */}
              <div
                className="d-flex align-items-center justify-content-between"
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #eee',
                  gap: '8px',
                  flexWrap: 'nowrap',
                  overflowX: 'auto'
                }}
              >
                <div style={{ position: 'relative', minWidth: '160px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input
                    className="form-control font-xs"
                    placeholder="Actor"
                    value={actorFilter}
                    onChange={(e) => setActorFilter(e.target.value)}
                    style={{ paddingLeft: '30px', height: '42px' }}
                  />
                </div>

                <div style={{ position: 'relative', minWidth: '170px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input
                    className="form-control font-xs"
                    placeholder="Action"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    style={{ paddingLeft: '30px', height: '42px' }}
                  />
                </div>

                <div style={{ position: 'relative', minWidth: '170px', maxWidth: '170px' }}>
                  <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                  <input
                    type="date"
                    className="form-control font-xs date-filter-input"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{ height: '42px', fontSize: '12px', padding: '4px 10px 4px 30px' }}
                  />
                </div>

                <div style={{ minWidth: '150px' }}>
                  <select
                    className="form-control font-xs"
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    style={{ height: '42px' }}
                  >
                    <option value="">Severity</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>

                <button
                  className="btn btn-secondary py-3"
                  onClick={() => {
                    setActorFilter('')
                    setActionFilter('')
                    setDateFilter('')
                    setSeverityFilter('')
                  }}
                  disabled={!hasActiveFilters}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    opacity: hasActiveFilters ? 1 : 0.5,
                    cursor: hasActiveFilters ? 'pointer' : 'default',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <X size={14} /> Clear Filters
                </button>
              </div>
              <style jsx>{`
                .date-filter-input::-webkit-calendar-picker-indicator {
                  filter: invert(0.5);
                  cursor: pointer;
                }
              `}</style>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      {[
                        'Timestamp', 'Admin', 'Action', 'Target Entity',
                        'IP Address', 'Severity', 'Session', ''
                      ].map((label, idx) => (
                        <th key={idx} className="font-xs color-text-paragraph-2"
                          style={{
                            padding: '12px 10px', textAlign: 'left',
                            fontWeight: 600, textTransform: 'uppercase',
                            letterSpacing: '0.4px', fontSize: '10px', whiteSpace: 'nowrap',
                          }}>{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, i) => {
                      const sev = SEVERITY_STYLES[row.severity] || SEVERITY_STYLES.info
                      const act = ACTION_STYLES[row.action] || { color: '#122359', bg: '#f0f0f0' }
                      const isOpen = openRow === i
                      return (
                        <>
                          <tr
                            key={i}
                            className="hover-up"
                            onClick={() => setOpenRow(isOpen ? null : i)}
                            style={{ borderBottom: isOpen ? 'none' : '1px solid #f5f5f5', cursor: 'pointer' }}
                          >
                            <td style={{ padding: '14px 10px', verticalAlign: 'top', whiteSpace: 'pre', lineHeight: 1.6 }}>
                              <span className="font-xs" style={{ color: '#122359', fontWeight: 500 }}>{row.ts}</span>
                            </td>
                            <td style={{ padding: '14px 10px', verticalAlign: 'top' }}>
                              <span className="font-xs" style={{ fontWeight: 600, color: '#122359', wordBreak: 'break-all' }}>{row.actor}</span>
                            </td>
                            <td style={{ padding: '14px 10px' }}>
                              <Badge color={act.color} bg={act.bg} pill={false}>{formatAction(row.action)}</Badge>
                            </td>
                            <td style={{ padding: '14px 10px' }}>{row.entity}</td>
                            <td style={{ padding: '14px 10px' }}>{row.ip}</td>
                            <td style={{ padding: '14px 10px' }}>
                              <Badge color={sev.color} bg={sev.bg}>{sev.label}</Badge>
                            </td>
                            <td style={{ padding: '14px 10px' }}>{row.session_id || '-'}</td>
                            <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                              <ChevronDown
                                size={16}
                                color="#888"
                                style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                              />
                            </td>
                          </tr>

                          {isOpen && (
                            <tr key={`${i}-detail`} style={{ borderBottom: '1px solid #f5f5f5' }}>
                              <td colSpan={8} style={{ padding: '0' }}>
                                <div style={{
                                  background: '#F8FAFF',
                                  borderLeft: `3px solid ${sev.color}`,
                                  padding: '16px 24px',
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                  gap: '14px',
                                }}>
                                  <div>
                                    <p className="font-xs color-text-paragraph-2 mb-5">Actor ID</p>
                                    <span className="font-sm" style={{ fontWeight: 600 }}>{row.actor_id}</span>
                                  </div>
                                  <div>
                                    <p className="font-xs color-text-paragraph-2 mb-5">Target ID</p>
                                    <span className="font-sm" style={{ fontWeight: 600 }}>{row.target_id}</span>
                                  </div>
                                  <div>
                                    <p className="font-xs color-text-paragraph-2 mb-5">Reason</p>
                                    <span className="font-sm">{row.change_reason}</span>
                                  </div>
                                  <div>
                                    <p className="font-xs color-text-paragraph-2 mb-5">Change</p>
                                    <span className="font-sm">{row.old_value} <span style={{ color: '#aaa' }}>→</span> {row.new_value}</span>
                                  </div>
                                  <div>
                                    <p className="font-xs color-text-paragraph-2 mb-5">Record Hash</p>
                                    <CopyHash hash={row.hash} />
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleFlag(row.hash) }}
                                      className="font-xs"
                                      style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        border: `1px solid ${flags[row.hash] ? '#c62828' : '#ddd'}`,
                                        background: flags[row.hash] ? '#fdecea' : '#fff',
                                        color: flags[row.hash] ? '#c62828' : '#555',
                                        borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontWeight: 600,
                                      }}
                                    >
                                      {flags[row.hash]
                                        ? <><FlagOff size={13} /> Unflag</>
                                        : <><Flag size={13} /> Flag for Review</>}
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}

                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: '30px', textAlign: 'center' }}>
                          <span className="font-sm color-text-paragraph-2">No logs match your filters.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="paginations mt-25">
                <div className="row align-items-center g-2">
                  <div className="col-lg-6">
                    <p className="font-sm color-text-paragraph-2 mb-0">
                      Showing 1–{filtered.length} of <strong>{logsData.length}</strong> logs
                    </p>
                  </div>
                  <div className="col-lg-6 text-lg-end">
                    <ul className="pager justify-content-lg-end">
                      <li><a className="pager-prev"></a></li>
                      <li><a className="pager-number active">1</a></li>
                      <li><a className="pager-next"></a></li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        {/* LEFT COLUMN */}
        <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                    <Flag size={16} color="#c62828" />
                    <h5 className="mb-0">Flagged for Review</h5>
                  </div>
                  {flaggedLogs.length > 0 && (
                    <span className="font-xs color-text-paragraph-2">
                      {flaggedLogs.filter(l => l.flagStatus === 'open').length} open · {flaggedLogs.filter(l => l.flagStatus === 'resolved').length} resolved
                    </span>
                  )}
                </div>
                <p className="font-xs color-text-paragraph-2 mb-0 mt-5">
                  A short worklist of logs someone marked for follow-up — separate from the full table above, so you don't have to search through every log to find what still needs a decision.
                </p>
              </div>

              <div className="panel-body" style={{ padding: '0' }}>
                {flaggedLogs.length === 0 && (
                  <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                    <span className="font-sm color-text-paragraph-2">
                      Nothing flagged yet. Expand a row in the table above and click "Flag for Review" to track it here.
                    </span>
                  </div>
                )}

                {flaggedLogs.map((item, i) => {
                  const lvl = SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.info
                  const isOpen = openInspection === item.hash
                  const isResolved = item.flagStatus === 'resolved'
                  return (
                    <div key={item.hash}>
                      <div
                        className="hover-up"
                        onClick={() => setOpenInspection(isOpen ? null : item.hash)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '16px 20px',
                          borderBottom: isOpen ? 'none' : (i < flaggedLogs.length - 1 ? '1px solid #f5f5f5' : 'none'),
                          cursor: 'pointer',
                          opacity: isResolved ? 0.6 : 1,
                        }}
                      >
                        <Badge color={lvl.color} bg={lvl.bg}>{lvl.label}</Badge>

                        <div style={{ flex: 1 }}>
                          <span className="font-sm" style={{ fontWeight: 600, color: '#122359', textDecoration: isResolved ? 'line-through' : 'none' }}>
                            {formatAction(item.action)}: {item.entity}
                          </span>
                          <span className="font-xs color-text-paragraph-2" style={{ marginLeft: '8px' }}>
                            Actor: {item.actor}
                          </span>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); toggleResolved(item.hash) }}
                          className="font-xs"
                          style={{
                            border: `1px solid ${isResolved ? '#2e7d32' : '#ddd'}`,
                            background: isResolved ? '#e8f5e9' : '#fff',
                            color: isResolved ? '#2e7d32' : '#555',
                            borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '11px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {isResolved ? 'Resolved' : 'Mark Resolved'}
                        </button>

                        <ChevronDown
                          size={16}
                          color="#888"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                        />
                      </div>

                      {isOpen && (
                        <div style={{
                          padding: '16px 20px 20px',
                          background: '#F8FAFF',
                          borderLeft: `3px solid ${lvl.color}`,
                          borderBottom: i < flaggedLogs.length - 1 ? '1px solid #f5f5f5' : 'none',
                        }}>
                          <p className="font-sm color-text-paragraph-2 mb-5">{item.flagNote || 'No note added.'}</p>
                          <p className="font-xs color-text-paragraph-2 mb-0">
                            {item.ts.replace('\n', ' ')} · IP {item.ip} · Session {item.session_id}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
          <div className="section-box">
            <div className="container">
              <div className="panel-white">
                <div className="panel-head">
                  <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>&#128196;</span>
                    <h5 className="mb-0">DPDP Guidelines</h5>
                  </div>
                </div>
                <div className="panel-body">
                  <p className="font-xs color-text-paragraph-2 mb-15">Regulatory adherence summary</p>
                  {dpdpRules.map((item) => (
                    <div key={item.rule} className="hover-up mb-15"
                      style={{ paddingBottom: '15px', borderBottom: '1px solid #f5f5f5' }}>
                      <div className="d-flex align-items-center justify-content-between mb-5">
                        <span className="font-sm" style={{ fontWeight: 600, color: '#122359' }}>{item.rule}</span>
                        <Badge color={item.statusColor} bg={item.statusBg}>{item.status}</Badge>
                      </div>
                      <p className="font-xs color-text-paragraph-2 mb-0">{item.desc}</p>
                    </div>
                  ))}
                  <div className="mt-10">
                    <a className="btn btn-grey-small hover-up" href="#"
                      style={{ width: '100%', textAlign: 'center', display: 'block', padding: '10px', fontSize: '13px' }}>
                      View Compliance Report
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}