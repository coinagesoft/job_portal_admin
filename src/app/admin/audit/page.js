'use client'
import { useMemo, useState, Fragment } from 'react'
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
} from "lucide-react"

// SNAKE_CASE action code → readable label, e.g. USER_SUSPENDED → "User Suspended"
function formatAction(action) {
  return action
    .toLowerCase()
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ── Actor type → color + label mapping ──
// Maps 1:1 to a backend `actor_type` enum: admin | sub_admin | recruiter | candidate | system
const ACTOR_TYPE_STYLES = {
  admin: { color: '#122359', bg: '#e8eaf6', label: 'Admin' },
  sub_admin: { color: '#5e35b1', bg: '#ede7f6', label: 'Sub-Admin' },
  recruiter: { color: '#00695c', bg: '#e0f2f1', label: 'Recruiter' },
  candidate: { color: '#ad1457', bg: '#fce4ec', label: 'Candidate' },
  system: { color: '#555', bg: '#f5f5f5', label: 'System' },
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
  CANDIDATE_PROFILE_UNLOCKED: { color: '#00695c', bg: '#e0f2f1' },
  CV_DOWNLOADED: { color: '#00695c', bg: '#e0f2f1' },
  CONSENT_REVOKED: { color: '#ad1457', bg: '#fce4ec' },
  APPLICANT_STATUS_CHANGED: { color: '#5e35b1', bg: '#ede7f6' },
}

// ── Mock data — every row now carries the full field set so the detail
//    drawer is consistent regardless of which row is expanded ──
const logsData = [
  {
    ts: '2023-11-24\n14:22:01',
    actor: 'sarah.admin@skillbridge.io',
    actor_id: 'ADM-001',
    actor_type: 'admin',
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
    ts: '2023-11-24\n11:45:55',
    actor: 'mike.finance@skillbridge.io',
    actor_id: 'SUB-014',
    actor_type: 'sub_admin',
    action: 'DATA_EXPORT_DPDP',
    severity: 'warning',
    session_id: 'SES-77821',
    entity: 'Q3 Revenue Report',
    target_id: 'RPT-Q3-2023',
    ip: '172.16.254.1',
    change_reason: 'Quarterly compliance export',
    old_value: 'Not Exported',
    new_value: 'Exported',
    hash: '9f86d081884c7d659a2feaa0c55ad015',
  },
  {
    ts: '2023-11-24\n10:30:02',
    actor: 'priya.subadmin@skillbridge.io',
    actor_id: 'SUB-004',
    actor_type: 'sub_admin',
    action: 'JOB_APPROVED',
    severity: 'info',
    session_id: 'SES-77828',
    entity: 'Senior Software Engineer',
    target_id: 'JOB-5521',
    ip: '192.168.5.140',
    change_reason: 'Job reviewed and approved',
    old_value: 'Pending Approval',
    new_value: 'Approved',
    hash: 'c3d4e5f6a7b8091a2b3c4d5e6f708192',
  },
  {
    ts: '2023-11-24\n09:12:30',
    actor: 'admin.super@skillbridge.io',
    actor_id: 'ADM-000',
    actor_type: 'admin',
    action: 'CONFIG_CHANGE',
    severity: 'warning',
    session_id: 'SES-77821',
    entity: 'Global Registration Fee',
    target_id: 'CFG-REG-FEE',
    ip: '192.168.5.112',
    change_reason: 'Pricing update approved',
    old_value: '₹499',
    new_value: '₹599',
    hash: '2c624232cdd221771294dfbb310aca00',
  },
  {
    ts: '2023-11-24\n08:30:00',
    actor: 'sarah.admin@skillbridge.io',
    actor_id: 'ADM-001',
    actor_type: 'admin',
    action: 'LOGIN_SUCCESS',
    severity: 'info',
    session_id: 'SES-77821',
    entity: 'Admin Dashboard',
    target_id: 'SES-77821',
    ip: '192.168.1.45',
    change_reason: 'Successful login',
    old_value: '—',
    new_value: '—',
    hash: 'd4735e3a265e16eee03f59718b9b5d03',
  },
  {
    ts: '2023-11-23\n18:10:15',
    actor: 'sarah.admin@skillbridge.io',
    actor_id: 'ADM-001',
    actor_type: 'admin',
    action: 'RECRUITER_VERIFIED',
    severity: 'info',
    session_id: 'SES-77792',
    entity: 'ABC Technologies Pvt Ltd',
    target_id: 'EMP-1045',
    ip: '192.168.1.45',
    change_reason: 'Company documents verified',
    old_value: 'Pending',
    new_value: 'Verified',
    hash: '6b51d431df5d7f141cbececcf79edf3a',
  },
  {
    ts: '2023-11-23\n16:42:09',
    actor: 'priya.subadmin@skillbridge.io',
    actor_id: 'SUB-004',
    actor_type: 'sub_admin',
    action: 'CANDIDATE_ACCOUNT_RESTORED',
    severity: 'info',
    session_id: 'SES-77788',
    entity: 'Amit Sharma',
    target_id: 'USR-4512',
    ip: '192.168.5.140',
    change_reason: 'Appeal approved',
    old_value: 'Suspended',
    new_value: 'Active',
    hash: '3fdba35f04dc8c462986c992bcf87554',
  },
  {
    ts: '2023-11-23\n15:20:44',
    actor: 'admin.super@skillbridge.io',
    actor_id: 'ADM-000',
    actor_type: 'admin',
    action: 'SUB_ADMIN_CREATED',
    severity: 'info',
    session_id: 'SES-77780',
    entity: 'Finance Manager',
    target_id: 'SUB-015',
    ip: '192.168.5.112',
    change_reason: 'New finance sub-admin added',
    old_value: '—',
    new_value: 'Active',
    hash: '4e07408562bedb8b60ce05c1decfe3ad',
  },
];

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

// yyyy-mm-dd (native date input value) → "24 Nov 2023"
function formatDisplayDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  const day = String(d.getDate()).padStart(2, '0')
  const month = d.toLocaleString('en-US', { month: 'short' })
  return `${day} ${month} ${d.getFullYear()}`
}
const TODAY_ISO = new Date().toISOString().slice(0, 10)

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
  const [actorTypeFilter, setActorTypeFilter] = useState('')
  const [openRow, setOpenRow] = useState(null)
  const [exportMsg, setExportMsg] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => logsData.filter(l => {
    const matchesActor = l.actor.toLowerCase().includes(actorFilter.toLowerCase())
    const matchesAction = l.action.toLowerCase().includes(actionFilter.toLowerCase())
    const matchesSeverity = severityFilter === '' || l.severity === severityFilter
    const matchesDate = dateFilter === '' || l.ts.startsWith(dateFilter)
    const matchesActorType = actorTypeFilter === '' || l.actor_type === actorTypeFilter
    return matchesActor && matchesAction && matchesSeverity && matchesDate && matchesActorType
  }), [actorFilter, actionFilter, severityFilter, dateFilter, actorTypeFilter])

  const pageSize = 8
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleLogs = filtered.slice((page - 1) * pageSize, page * pageSize)

  const criticalCount = logsData.filter(l => l.severity === 'critical').length
  const hasActiveFilters = actorFilter || actionFilter || dateFilter || severityFilter || actorTypeFilter

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
              <div className="audit-toolbar">
                <label className="audit-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by action, actor or session..."
                    value={actionFilter}
                    onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
                    autoComplete="off"
                  />
                </label>

                <div className="audit-toolbar-filters">
                  <label className="audit-date-field">
                    <span className="audit-date-icon">
                      <Calendar size={14} />
                    </span>

                    <div className="audit-date-body">
                      <span className="audit-date-label">Date</span>

                      <span
                        className={`audit-date-value ${dateFilter ? "" : "is-placeholder"
                          }`}
                      >
                        {dateFilter
                          ? formatDisplayDate(dateFilter)
                          : "Select date"}
                      </span>
                    </div>

                    <input
                      type="date"
                      value={dateFilter}
                      max={TODAY_ISO}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        setPage(1);
                      }}
                      aria-label="Filter by date"
                      className="audit-date-input"
                    />

                    {dateFilter && (
                      <button
                        type="button"
                        className="audit-date-clear"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDateFilter("");
                          setPage(1);
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </label>

                  <select
                    className="audit-pill-select"
                    value={actorTypeFilter}
                    onChange={(e) => { setActorTypeFilter(e.target.value); setPage(1) }}
                  >
                    <option value="">Actor Type: All</option>
                    <option value="admin">Admin</option>
                    <option value="sub_admin">Sub-Admin</option>
                  </select>

                  <select
                    className="audit-pill-select"
                    value={severityFilter}
                    onChange={(e) => { setSeverityFilter(e.target.value); setPage(1) }}
                  >
                    <option value="">Severity: All</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>

                  <button
                    type="button"
                    className="audit-clear-btn"
                    onClick={() => {
                      setActorFilter('')
                      setActionFilter('')
                      setDateFilter('')
                      setSeverityFilter('')
                      setActorTypeFilter('')
                      setPage(1)
                    }}
                    disabled={!hasActiveFilters}
                  >
                    <X size={13} /> Clear Filters
                  </button>
                </div>
              </div>
              <style jsx>{`
                .audit-toolbar {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  flex-wrap: wrap;
                  padding: 16px 20px;
                  border-bottom: 1px solid #eee;
                }
                .audit-search-box {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  height: 42px;
                  padding: 0 14px;

                  background: #fff;
                  border: 1px solid #e3e8f4;
                  border-radius: 9px;
                  overflow: hidden;

                  flex: 1 1 180px;
                  min-width: 120px;
                  max-width: 340px;

                  transition: border-color .15s ease,
                              box-shadow .15s ease,
                              background .15s ease;
                }

                .audit-search-box:focus-within {
                  border-color: #ffcb80;
                  box-shadow: 0 0 0 3px rgba(239,150,0,.1);
                }

                .audit-search-box svg {
                  color: #94a3c4;
                  flex-shrink: 0;
                }

                .audit-search-box input {
                  flex: 1;
                  width: 100%;
                  height: 100%;

                  border: none !important;
                  border-left: 0 !important;
                  border-right: 0 !important;
                  outline: none !important;
                  box-shadow: none !important;

                  background: transparent !important;
                  appearance: none;
                  -webkit-appearance: none;

                  padding: 0;
                  margin: 0;

                  font-size: 13px;
                  font-weight: 500;
                  color: #33415c;
                }

                .audit-search-box input:focus,
                .audit-search-box input:hover,
                .audit-search-box input:active {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                  background: transparent !important;
                }

                .audit-search-box input::placeholder {
                  color: #94a3c4;
                  font-weight: 500;
                }

                .audit-search-box input::-webkit-search-decoration,
                .audit-search-box input::-webkit-search-cancel-button,
                .audit-search-box input::-webkit-search-results-button,
                .audit-search-box input::-webkit-search-results-decoration {
                  -webkit-appearance: none;
                }
                .audit-toolbar-filters {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-left: auto;
                  flex-wrap: wrap;
                  flex-shrink: 0;
                }
                .audit-date-field {
                  position: relative;
                  display: flex;
                  align-items: center;
                  gap: 8px;

                  height: 42px;
                  min-width: 160px;

                  padding: 0 12px;
                  border: 1px solid #e3e8f4;
                  border-radius: 9px;

                  background: #fff;
                  cursor: pointer;

                  transition: border-color .15s ease,
                              box-shadow .15s ease;
                }

                .audit-date-field:hover,
                .audit-date-field:focus-within {
                  border-color: #ffcb80;
                  box-shadow: 0 0 0 3px rgba(239,150,0,.1);
                }

                .audit-date-input {
                  position: absolute;
                  inset: 0;

                  width: 100%;
                  height: 100%;

                  opacity: 0;
                  cursor: pointer;

                  border: 0;
                  outline: 0;
                }

                .audit-date-input::-webkit-calendar-picker-indicator {
                  position: absolute;
                  inset: 0;
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                }
                .audit-date-icon {
                  display: grid;
                  place-items: center;
                  width: 22px;
                  height: 22px;
                  border-radius: 6px;
                  background: #fff1d7;
                  color: #ed9600;
                  flex-shrink: 0;
                  pointer-events: none;
                }
                .audit-date-body {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  gap: 1px;
                  line-height: 1;
                  pointer-events: none;
                  min-width: 66px;
                }
                .audit-date-label {
                  color: #96a2ba;
                  font-size: 9px;
                  font-weight: 800;
                  text-transform: uppercase;
                  letter-spacing: .04em;
                }
                .audit-date-value {
                  color: #33415c;
                  font-size: 12px;
                  font-weight: 700;
                  white-space: nowrap;
                  line-height: 16px;
                }
                .audit-date-value.is-placeholder {
                  color: #9aa5c4;
                  font-weight: 600;
                }
                .audit-date-field input[type="date"] {
                  position: absolute;
                  inset: 0;
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                  border: 0;
                  outline: 0;
                  margin: 0;
                  padding: 0;
                  opacity: 0;
                  cursor: pointer;
                  color-scheme: light;
                }
                .audit-date-clear {
                  display: grid;
                  place-items: center;
                  width: 20px;
                  height: 20px;
                  border: 0;
                  border-radius: 50%;
                  background: #fff;
                  color: #7382a1;
                  cursor: pointer;
                  flex-shrink: 0;
                  z-index: 1;
                }
                .audit-date-clear:hover {
                  background: #ffe9e9;
                  color: #c62828;
                }
                .audit-pill-select {
                  height: 40px;
                  width: 138px;
                  flex: 0 0 138px;
                  padding: 0 10px;
                  border: 1px solid #e3e8f4;
                  border-radius: 9px;
                  background: #f5f7fc;
                  color: #33415c;
                  font-size: 12px;
                  font-weight: 600;
                  outline: none;
                  cursor: pointer;
                  box-sizing: border-box;
                  flex-shrink: 0;
                  transition: border-color .15s ease, background .15s ease;
                }
                .audit-pill-select:hover, .audit-pill-select:focus {
                  border-color: #ffcb80;
                  background: #fff;
                }
                .audit-clear-btn {
                  height: 40px;
                  padding: 0 14px;
                  border: 1.5px solid #f39b00;
                  background: #fff;
                  color: #f39b00;
                  border-radius: 9px;
                  font-size: 12px;
                  font-weight: 700;
                  white-space: nowrap;
                  flex-shrink: 0;
                  cursor: pointer;
                  transition: background .15s ease, color .15s ease;
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                }
                .audit-clear-btn:hover {
                  background: #fff8ec;
                }
                .audit-clear-btn:disabled {
                  opacity: .5;
                  cursor: not-allowed;
                }
                .audit-table-pagination { padding: 15px 20px; border-top: 1px solid #edf1f6; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #7b8aa5; font-size: 12px; }
                .audit-table-pagination > div { display: flex; gap: 5px; }
                .audit-table-pagination button { height: 30px; min-width: 30px; padding: 0 9px; border: 1px solid #dce4ef; border-radius: 5px; background: #fff; color: #5f7194; font-size: 11px; font-weight: 700; }
                .audit-table-pagination button.active { color: #fff; background: #ffa300; border-color: #ffa300; }
                .audit-table-pagination button:disabled { opacity: .45; cursor: not-allowed; }
                @media (max-width: 640px) {
                  .audit-toolbar { padding: 12px 12px; }
                  .audit-search-box { flex: 1 1 100%; max-width: none; }
                  .audit-toolbar-filters { width: 100%; margin-left: 0; }
                  .audit-table-pagination { align-items: flex-start; flex-direction: column; }
                }
              `}</style>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '620px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      {[
                        'Timestamp', 'Admin', 'Actor Type', 'Action', 'Target Entity',
                        'IP Address', 'Severity', 'Session', ''
                      ].map((label, idx) => (
                        <th key={idx} className="font-xs color-text-paragraph-2"
                          style={{
                            padding: '10px 8px', textAlign: 'left',
                            fontWeight: 600, textTransform: 'uppercase',
                            letterSpacing: '0.3px', fontSize: '9px', whiteSpace: 'nowrap',
                          }}>{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLogs.map((row) => {
                      const sev = SEVERITY_STYLES[row.severity] || SEVERITY_STYLES.info
                      const act = ACTION_STYLES[row.action] || { color: '#122359', bg: '#f0f0f0' }
                      const isOpen = openRow === row.hash
                      return (
                        <Fragment key={row.hash}>
                          <tr
                            key={row.hash}
                            className="hover-up"
                            onClick={() => setOpenRow(isOpen ? null : row.hash)}
                            style={{ borderBottom: isOpen ? 'none' : '1px solid #f5f5f5', cursor: 'pointer' }}
                          >
                            <td style={{ padding: '12px 8px', verticalAlign: 'top', whiteSpace: 'pre', lineHeight: 1.6 }}>
                              <span className="font-xs" style={{ color: '#122359', fontWeight: 500 }}>{row.ts}</span>
                            </td>
                            <td style={{ padding: '12px 8px', verticalAlign: 'top' }}>
                              <span className="font-xs" style={{ fontWeight: 600, color: '#122359', wordBreak: 'break-all' }}>{row.actor}</span>
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <Badge color={(ACTOR_TYPE_STYLES[row.actor_type] || ACTOR_TYPE_STYLES.system).color} bg={(ACTOR_TYPE_STYLES[row.actor_type] || ACTOR_TYPE_STYLES.system).bg}>
                                {(ACTOR_TYPE_STYLES[row.actor_type] || ACTOR_TYPE_STYLES.system).label}
                              </Badge>
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <Badge color={act.color} bg={act.bg} pill={false}>{formatAction(row.action)}</Badge>
                            </td>
                            <td style={{ padding: '12px 8px' }}>{row.entity}</td>
                            <td style={{ padding: '12px 8px' }}>{row.ip}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <Badge color={sev.color} bg={sev.bg}>{sev.label}</Badge>
                            </td>
                            <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                              <ChevronDown
                                size={16}
                                color="#888"
                                style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                              />
                            </td>
                          </tr>

                          {isOpen && (
                            <tr key={`${row.hash}-detail`} style={{ borderBottom: '1px solid #f5f5f5' }}>
                              <td colSpan={9} style={{ padding: '0' }}>
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

                                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })}

                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ padding: '30px', textAlign: 'center' }}>
                          <span className="font-sm color-text-paragraph-2">No logs match your filters.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filtered.length > 0 && (
                <div className="audit-table-pagination">
                  <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} logs</span>
                  <div>
                    <button disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                    {Array.from({ length: pageCount }, (_, index) => (
                      <button key={index} className={page === index + 1 ? 'active' : ''} onClick={() => setPage(index + 1)}>{index + 1}</button>
                    ))}
                    <button disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <div className='row'>
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
                      <p className="font-xs color-text-paragraph-2 mb-0">{item.description}</p>
                    </div>
                  ))}
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