'use client'
import { useState, useEffect, useMemo, Fragment } from 'react'
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
import { auditLogService } from '../../../services/auditLogService'

// Actor type → color + label mapping
const ACTOR_TYPE_STYLES = {
  admin: { color: '#122359', bg: '#e8eaf6', label: 'Admin' },
  sub_admin: { color: '#5e35b1', bg: '#ede7f6', label: 'Sub-Admin' },
  recruiter: { color: '#00695c', bg: '#e0f2f1', label: 'Recruiter' },
  candidate: { color: '#ad1457', bg: '#fce4ec', label: 'Candidate' },
  system: { color: '#555', bg: '#f5f5f5', label: 'System' },
}

// Severity → color mapping
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

// Normalizer for actor type style lookup
const getActorTypeStyle = (type) => {
  if (!type) return ACTOR_TYPE_STYLES.system;
  const cleanType = type.toLowerCase().replace('-', '_');
  return ACTOR_TYPE_STYLES[cleanType] || { color: '#5e35b1', bg: '#ede7f6', label: type };
};

// Normalizer for severity style lookup
const getSeverityStyle = (severity) => {
  if (!severity) return SEVERITY_STYLES.info;
  const cleanSeverity = severity.toLowerCase();
  return SEVERITY_STYLES[cleanSeverity] || SEVERITY_STYLES.info;
};

// Format timestamp
const formatTimestamp = (ts) => {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    return `${date}\n${time}`;
  } catch (e) {
    return ts;
  }
};

// Clean description by removing API paths and HTTP methods (e.g. "via PUT /api/admin/settings" or "/api/...")
const formatDescription = (desc) => {
  if (!desc) return '—';
  // Matches " via [HTTP_METHOD] /api/..." or " via /api/..." or similar, case-insensitive
  let cleaned = desc.replace(/\s*via\s+(?:GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)?\s*\/api\/[a-zA-Z0-9_\-\/]+/gi, '');
  // Matches standalone "/api/..."
  cleaned = cleaned.replace(/\/api\/[a-zA-Z0-9_\-\/]+/gi, '');
  return cleaned.trim() || '—';
};

// Render Changes dynamically in a key-by-key comparison view
const renderChanges = (oldVal, newVal) => {
  let oldObj = {};
  let newObj = {};

  const parseVal = (v) => {
    if (!v) return {};
    if (typeof v === 'object') return v;
    try {
      return JSON.parse(v);
    } catch (e) {
      return {};
    }
  };

  const formatStringVal = (str) => {
    if (!str) return '—';
    // If it contains commas without spaces, insert spaces so it wraps nicely
    if (str.includes(',') && !str.includes(', ')) {
      return str.split(',').join(', ');
    }
    return str;
  };

  oldObj = parseVal(oldVal);
  newObj = parseVal(newVal);

  const allKeys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));

  if (allKeys.length === 0) {
    return <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: '12px' }}>No parameters changed</span>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px', minWidth: 0, width: '100%' }}>
      {allKeys.map((key) => {
        const oValRaw = oldObj[key] !== undefined && oldObj[key] !== null ? String(oldObj[key]) : '—';
        const nValRaw = newObj[key] !== undefined && newObj[key] !== null ? String(newObj[key]) : '—';
        
        const oVal = formatStringVal(oValRaw);
        const nVal = formatStringVal(nValRaw);
        const isChanged = oValRaw !== nValRaw;

        // If the values are long (e.g. lists of permissions), we stack them vertically for a cleaner, non-overflowing look
        const isLongVal = oVal.length > 40 || nVal.length > 40;

        return (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', minWidth: 0 }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>{key}:</span>
            <div style={{ paddingLeft: '8px', minWidth: 0 }}>
              {isLongVal ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                  <div style={{
                    color: isChanged ? '#dc2626' : '#64748b',
                    textDecoration: isChanged && oVal !== '—' ? 'line-through' : 'none',
                    background: isChanged ? '#fef2f2' : 'transparent',
                    padding: isChanged ? '4px 8px' : '0',
                    borderRadius: '4px',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    fontSize: '11px',
                    border: isChanged ? '1px solid #fee2e2' : 'none'
                  }}>{oVal}</div>
                  
                  {isChanged && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center', color: '#cbd5e1', fontSize: '14px', lineHeight: 1 }}>↓</div>
                      <div style={{
                        color: '#059669',
                        fontWeight: 600,
                        background: '#ecfdf5',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        fontSize: '11px',
                        border: '1px solid #d1fae5'
                      }}>{nVal}</div>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
                  <span style={{
                    color: isChanged ? '#dc2626' : '#64748b',
                    textDecoration: isChanged && oVal !== '—' ? 'line-through' : 'none',
                    background: isChanged ? '#fef2f2' : 'transparent',
                    padding: isChanged ? '1px 6px' : '0',
                    borderRadius: '4px',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}>{oVal}</span>
                  {isChanged && (
                    <>
                      <span style={{ color: '#cbd5e1' }}>→</span>
                      <span style={{
                        color: '#059669',
                        fontWeight: 600,
                        background: '#ecfdf5',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}>{nVal}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

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

  // Full dataset from the API. All filtering + pagination below is done on the
  // client so the toolbar filters work reliably regardless of what query
  // params the backend actually understands.
  const [allLogs, setAllLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const pageSize = 8

  const fetchAuditLogs = () => {
    setLoading(true);
    auditLogService.getAuditLogs({
      page: 1,
      pageSize: 1000, // pull a large batch so client-side filtering has the full picture
    })
      .then((res) => {
        setLoading(false);
        console.log("Audit Logs API Response:", res);
        if (!res) {
          setAllLogs([]);
          return;
        }

        let finalLogs = [];

        if (res.items && Array.isArray(res.items)) {
          finalLogs = res.items;
        } else if (res.data && Array.isArray(res.data)) {
          finalLogs = res.data;
        } else if (res.logs && Array.isArray(res.logs)) {
          finalLogs = res.logs;
        } else if (res.data && res.data.items && Array.isArray(res.data.items)) {
          finalLogs = res.data.items;
        } else if (res.data && res.data.logs && Array.isArray(res.data.logs)) {
          finalLogs = res.data.logs;
        } else if (Array.isArray(res)) {
          finalLogs = res;
        } else if (typeof res === 'object') {
          const arrayKey = Object.keys(res).find(key => Array.isArray(res[key]));
          if (arrayKey) {
            finalLogs = res[arrayKey];
          }
        }

        setAllLogs(finalLogs);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to fetch audit logs:", err);
      });
  };

  // Fetch once on mount. Filters no longer trigger a refetch — they just
  // change what's shown from the data we already have.
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Whenever a filter changes, jump back to page 1 so you don't get stuck
  // looking at an empty page from a previous filter's pagination state.
  useEffect(() => {
    setPage(1);
  }, [actionFilter, actorTypeFilter, severityFilter, dateFilter]);

  const filteredLogs = useMemo(() => {
    const q = actionFilter.trim().toLowerCase();

    return allLogs.filter((row) => {
      if (q) {
        const haystack = [
          row.action,
          row.admin,
          row.sessionId,
          row.targetEntity,
          row.description,
          row.module,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (actorTypeFilter) {
        const rowType = (row.actorType || '').toLowerCase().replace('-', '_');
        if (rowType !== actorTypeFilter.toLowerCase()) return false;
      }

      if (severityFilter) {
        if ((row.severity || '').toLowerCase() !== severityFilter.toLowerCase()) return false;
      }

      if (dateFilter) {
        if (!row.timestamp) return false;
        let rowDate = '';
        try {
          rowDate = new Date(row.timestamp).toISOString().slice(0, 10);
        } catch (e) {
          rowDate = '';
        }
        if (rowDate !== dateFilter) return false;
      }

      return true;
    });
  }, [allLogs, actionFilter, actorTypeFilter, severityFilter, dateFilter]);

  const totalAllLogs = allLogs.length
  const totalCount = filteredLogs.length
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const visibleLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize)
  const hasActiveFilters = !!(actionFilter || dateFilter || severityFilter || actorTypeFilter)

  function handleExport(kind) {
    setExportMsg(kind === 'csv' ? 'CSV export started…' : 'Preparing DPDP-compliant export…')
    setTimeout(() => setExportMsg(''), 2500)
  }

  const getVisiblePageNumbers = () => {
    const pages = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, page - 1);
      const end = Math.min(pageCount - 1, page + 1);
      if (start > 2) {
        pages.push('ellipsis-start');
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < pageCount - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(pageCount);
    }
    return pages;
  };


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
                <h3>{loading ? '...' : totalAllLogs}</h3>
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
                    onChange={(e) => setActionFilter(e.target.value)}
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
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </label>

                  <select
                    className="audit-pill-select"
                    value={actorTypeFilter}
                    onChange={(e) => setActorTypeFilter(e.target.value)}
                  >
                    <option value="">Actor Type: All</option>
                    <option value="admin">Admin</option>
                    <option value="sub_admin">Sub-Admin</option>
                  </select>

                  <select
                    className="audit-pill-select"
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
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
                    {loading ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '30px', textAlign: 'center' }}>
                          <span className="font-sm color-text-paragraph-2">Loading audit logs...</span>
                        </td>
                      </tr>
                    ) : visibleLogs.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '30px', textAlign: 'center' }}>
                          <span className="font-sm color-text-paragraph-2">No logs match your filters.</span>
                        </td>
                      </tr>
                    ) : (
                      visibleLogs.map((row) => {
                        const sev = getSeverityStyle(row.severity)
                        const act = ACTION_STYLES[row.action] || { color: '#122359', bg: '#f0f0f0' }
                        const isOpen = openRow === row.logId
                        const actorTypeStyle = getActorTypeStyle(row.actorType)
                        return (
                          <Fragment key={row.logId}>
                            <tr
                              key={row.logId}
                              className="hover-up"
                              onClick={() => setOpenRow(isOpen ? null : row.logId)}
                              style={{ borderBottom: isOpen ? 'none' : '1px solid #f5f5f5', cursor: 'pointer' }}
                            >
                              <td style={{ padding: '12px 8px', verticalAlign: 'top', whiteSpace: 'pre', lineHeight: 1.6 }}>
                                <span className="font-xs" style={{ color: '#122359', fontWeight: 500 }}>{formatTimestamp(row.timestamp)}</span>
                              </td>
                              <td style={{ padding: '12px 8px', verticalAlign: 'top' }}>
                                <span className="font-xs" style={{ fontWeight: 600, color: '#122359', wordBreak: 'break-all' }}>{row.admin}</span>
                              </td>
                              <td style={{ padding: '12px 8px' }}>
                                <Badge color={actorTypeStyle.color} bg={actorTypeStyle.bg}>
                                  {actorTypeStyle.label}
                                </Badge>
                              </td>
                              <td style={{ padding: '12px 8px' }}>
                                <Badge color={act.color} bg={act.bg} pill={false}>{row.action}</Badge>
                              </td>
                              <td style={{ padding: '12px 8px' }}>{row.targetEntity || '—'}</td>
                              <td style={{ padding: '12px 8px' }}>{row.ipAddress || '—'}</td>
                              <td style={{ padding: '12px 8px' }}>
                                <Badge color={sev.color} bg={sev.bg}>{sev.label}</Badge>
                              </td>
                              <td style={{ padding: '12px 8px' }}>{row.sessionId || '—'}</td>
                              <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                                <ChevronDown
                                  size={16}
                                  color="#888"
                                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                                />
                              </td>
                            </tr>

                            {isOpen && (
                              <tr key={`${row.logId}-detail`} style={{ borderBottom: '1px solid #f5f5f5' }}>
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
                                      <p className="font-xs color-text-paragraph-2 mb-5">Log ID</p>
                                      <span className="font-sm" style={{ fontWeight: 600 }}><CopyHash hash={row.logId} /></span>
                                    </div>
                                    <div>
                                      <p className="font-xs color-text-paragraph-2 mb-5">Module</p>
                                      <span className="font-sm" style={{ fontWeight: 600 }}>{row.module || '—'}</span>
                                    </div>
                                    <div>
                                      <p className="font-xs color-text-paragraph-2 mb-5">Description / Reason</p>
                                      <span className="font-sm">{formatDescription(row.description)}</span>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                      <p className="font-xs color-text-paragraph-2 mb-5">Change Parameters</p>
                                      {renderChanges(row.oldValues, row.newValues)}
                                    </div>
                                    {row.userAgent && (
                                      <div style={{ gridColumn: 'span 2' }}>
                                        <p className="font-xs color-text-paragraph-2 mb-5">User Agent</p>
                                        <span className="font-sm" style={{ fontSize: '11px', color: '#555' }}>{row.userAgent}</span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {totalCount > 0 && (
                <div style={{
                  padding: '15px 20px',
                  borderTop: '1px solid #edf1f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  color: '#7b8aa5',
                  fontSize: '12px',
                  flexWrap: 'wrap'
                }}>
                  <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} logs</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((current) => current - 1)}
                      style={{
                        height: '30px',
                        minWidth: '30px',
                        padding: '0 9px',
                        border: '1px solid #dce4ef',
                        borderRadius: '5px',
                        background: '#fff',
                        color: '#5f7194',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        opacity: page === 1 ? 0.45 : 1
                      }}
                    >
                      Previous
                    </button>
                    {getVisiblePageNumbers().map((item, index) => {
                      if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            style={{
                              padding: '0 8px',
                              alignSelf: 'center',
                              color: '#7b8aa5',
                              fontWeight: 'bold',
                              userSelect: 'none'
                            }}
                          >
                            ...
                          </span>
                        );
                      }
                      const isActive = page === item;
                      return (
                        <button
                          key={item}
                          onClick={() => setPage(item)}
                          style={{
                            height: '30px',
                            minWidth: '30px',
                            padding: '0 9px',
                            border: '1px solid ' + (isActive ? '#ffa300' : '#dce4ef'),
                            borderRadius: '5px',
                            background: isActive ? '#ffa300' : '#fff',
                            color: isActive ? '#fff' : '#5f7194',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                    <button
                      disabled={page === pageCount}
                      onClick={() => setPage((current) => current + 1)}
                      style={{
                        height: '30px',
                        minWidth: '30px',
                        padding: '0 9px',
                        border: '1px solid #dce4ef',
                        borderRadius: '5px',
                        background: '#fff',
                        color: '#5f7194',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: page === pageCount ? 'not-allowed' : 'pointer',
                        opacity: page === pageCount ? 0.45 : 1
                      }}
                    >
                      Next
                    </button>
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