'use client'
import { useState } from 'react'
import Footer from '../../../components/Footer'
import {
  Monitor,
  AlertTriangle,
  ShieldCheck,
  Download
} from "lucide-react";
const logsData = [
  {
    ts: '2023-11-24\n14:22:01',
    actor: 'sarah.admin@skillbridge.io',
    actor_id: 'ADM-001',
    action: 'USER_SUSPENDED',
    action_tag: 'USER_ACTION',
    severity: 'critical',
    session_id: 'SES-77821',
    entity: 'John Doe',
    target_id: 'USR-1293',
    ip: '192.168.1.45',
    change_reason: 'Repeated violations',
    old_value: 'Active',
    new_value: 'Suspended',
    hash: 'a8f5f167f44f4964e6c998dee827110c',
    actionColor: '#c62828',
    actionBg: '#fdecea'
  },
  { ts: '2023-11-24\n13:05:12', actor: 'system.automator', action: 'BATCH_PAYMENT_INIT', actionColor: '#122359', actionBg: '#f0f0f0',    session_id: 'SES-77821', entity: 'Payroll #402', ip: '10.0.0.8' },
  { ts: '2023-11-24\n11:45:55', actor: 'mike.finance@skillbridge.io', action: 'DATA_EXPORT_DPDP', actionColor: '#ffa300', actionBg: '#ffc151',    session_id: 'SES-77821', entity: 'Q3 Revenue Report', ip: '172.16.254.1' },
  { ts: '2023-11-24\n09:12:30', actor: 'admin.super', action: 'CONFIG_CHANGE', actionColor: '#2e7d32', actionBg: '#e8f5e9',    session_id: 'SES-77821', entity: 'Global Registration Fee', ip: '192.168.5.112' },
  { ts: '2023-11-24\n08:30:00', actor: 'sarah.admin@skillbridge.io', action: 'LOGIN_SUCCESS', actionColor: '#555', actionBg: '#f5f5f5',    session_id: 'SES-77821', entity: 'Admin Session', ip: '192.168.1.45' },
]

const inspections = [
  {
    id: 'LOG-8291-A', title: 'User Suspension Investigation',
    level: 'Critical', actor: 'sarah.admin@skillbridge.io',
    levelColor: '#c62828', levelBg: '#fdecea',
    detail: 'Admin sarah.admin@skillbridge.io suspended user John Doe (ID: 1293) citing repeated policy violations. Suspension logged at 14:22:01. IP: 192.168.1.45. No prior warnings issued. Action flagged for compliance review.',
  },
  {
    id: 'LOG-8294-D', title: 'System Configuration Update',
    level: 'Info', actor: 'admin.super',
    levelColor: '#ffa300', levelBg: '#ffc151',
    detail: 'admin.super modified the Global Registration Fee configuration. Change recorded at 09:12:30. All changes are immutable and hashed. IP: 192.168.5.112.',
  },
]

const dpdpRules = [
  { rule: 'Notice of Purpose', status: 'Compliant', statusColor: '#2e7d32', statusBg: '#e8f5e9', desc: 'Admin must state why data is accessed.' },
  { rule: 'Data Minimization', status: 'Compliant', statusColor: '#2e7d32', statusBg: '#e8f5e9', desc: 'Only required fields were exported in the last 24h.' },
  { rule: 'Right to Erasure', status: 'Action Required', statusColor: '#e65100', statusBg: '#fff3e0', desc: 'Pending user deletion requests are processed.' },
  { rule: 'Auditability', status: 'Compliant', statusColor: '#2e7d32', statusBg: '#e8f5e9', desc: 'System logs are hashed and non-repudiable.' },
]

export default function AuditLogsPage() {
  const [actorFilter, setActorFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [openInspection, setOpenInspection] = useState(null)
  const [page, setPage] = useState(1)
  const [openRow, setOpenRow] = useState(null)
  const [severityFilter, setSeverityFilter] = useState('')
  const filtered = logsData.filter(l =>
    l.actor.toLowerCase().includes(actorFilter.toLowerCase()) &&
    l.action.toLowerCase().includes(actionFilter.toLowerCase()) &&
    (severityFilter === '' || l.severity === severityFilter)
  )

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
      <div className="d-flex align-items-center mb-5 justify-content-end" style={{ gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>
        {/* <a className="btn btn-secondary hover-up" href="#"
          style={{ padding: '9px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          Export CSV
        </a>
        <a className="btn btn-primary hover-up" href="#"
          style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
          Export for DPDP
        </a> */}

      </div>
      {/* ✅ FIXED: FULL WIDTH WIDGETS */}
      <div className="section-box mt-2">
        <div className="row">

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">
                <Monitor size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <h3>14,202</h3>
                <p>Total Logs (24h)</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">
                <AlertTriangle size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <h3>24</h3>
                <p>Critical Actions</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">
                <ShieldCheck size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <h3>98.2%</h3>
                <p>DPDP Status</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">
                <Download size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <h3>2h ago</h3>
                <p>Last Export</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="row">

        {/* ════ LEFT COLUMN — stat cards + table + inspections ════ */}
        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12">

          {/* ── 4 STAT CARDS — inside left col only ── */}


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
                  flexWrap: 'nowrap',   // 🔥 IMPORTANT
                  overflowX: 'auto'     // 🔥 prevents breaking
                }}
              >

                {/* Actor */}
                <div style={{ position: 'relative', minWidth: '150px' }}>
                  <span style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#aaa',
                    fontSize: '12px'
                  }}>
                    
                  </span>
                  <input
                    className="form-control font-xs"
                    placeholder="Actor"
                    value={actorFilter}
                    onChange={(e) => setActorFilter(e.target.value)}
                    style={{ paddingLeft: '26px', height: '42px' }}
                  />
                </div>

                {/* Action */}
                <div style={{ position: 'relative', minWidth: '160px' }}>
                  <span style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#aaa',
                    fontSize: '12px'
                  }}>
                    
                  </span>
                  <input
                    className="form-control font-xs"
                    placeholder="Action"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    style={{ paddingLeft: '26px', height: '42px' }}
                  />
                </div>

                {/* Date */}
                {/* Date */}
                <div style={{ minWidth: '190px', maxWidth: '190px' }}>
                  <input
                    type="date"
                    className="form-control font-xs"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{
                      height: '42px',
                      fontSize: '11px',   // 🔥 smaller text
                      padding: '4px 6px'
                    }}
                  />
                </div>

                {/* Severity */}
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

                {/* Reset Button */}
                <button
                  className="btn btn-secondary py-3"
                  onClick={() => {
                    setActorFilter('')
                    setActionFilter('')
                    setDateFilter('')
                    setSeverityFilter('')
                  }}
                 
                >
                  Clear Filters
                </button>

              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '580px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>

                      {[
                        { label: 'Timestamp', align: 'left' },
                        { label: 'Admin', align: 'left' },
                        { label: 'Action', align: 'left' },
                        { label: 'Target Entity', align: 'left' },
                        { label: 'IP Address', align: 'left' },
                        { label: 'Severity', align: 'left' },
                        { label: 'Session', align: 'left' }
                      ].map(h => (
                        <th key={h.label} className="font-xs color-text-paragraph-2"
                          style={{
                            padding: '12px 10px', textAlign: h.align,
                            fontWeight: 600, textTransform: 'uppercase',
                            letterSpacing: '0.4px', fontSize: '10px', whiteSpace: 'nowrap',
                          }}>{h.label}</th>
                      ))}
                    </tr>

                  </thead>
                  <tbody>
                    {filtered.map((row, i) => (
                      <>
                        <tr key={i} className="hover-up" style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '14px 10px', verticalAlign: 'top', whiteSpace: 'pre', lineHeight: 1.6 }}>
                            <span className="font-xs" style={{ color: '#122359', fontWeight: 500 }}>{row.ts}</span>
                          </td>
                          <td style={{ padding: '14px 10px', verticalAlign: 'top' }}>
                            <span className="font-xs" style={{ fontWeight: 600, color: '#122359', wordBreak: 'break-all' }}>{row.actor}</span>
                          </td>
                          {/* Action */}
                          <td style={{ padding: '14px 10px' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '4px',
                              color: row.actionColor,
                              background: row.actionBg,
                            }}>
                              {row.action}
                            </span>
                          </td>

                          {/* Target */}
                          <td style={{ padding: '14px 10px' }}>
                            {row.entity}
                          </td>

                          {/* IP */}
                          <td style={{ padding: '14px 10px' }}>
                            {row.ip}
                          </td>

                          {/* Severity */}
                          <td style={{ padding: '14px 10px' }}>
                            <span style={{
                              fontSize: '10px',
                              padding: '3px 8px',
                              borderRadius: '20px',
                              background:
                                row.severity === 'critical' ? '#fdecea' :
                                  row.severity === 'warning' ? '#fff3e0' : '#e8f5e9',
                              color:
                                row.severity === 'critical' ? '#c62828' :
                                  row.severity === 'warning' ? '#e65100' : '#2e7d32'
                            }}>
                              {row.severity || 'info'}
                            </span>
                          </td>

                          {/* Session */}
                          <td style={{ padding: '14px 10px' }}>
                            {row.session_id || '-'}
                          </td>



                        </tr>

                      </>
                    ))}


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
              Showing 1–6 of <strong>3,248</strong> candidates
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

          {/* ── RECENT DETAIL INSPECTIONS ── */}


        </div>
        {/* end left column */}

        {/* ════ RIGHT SIDEBAR ════ */}

        {/* end right sidebar */}

      </div>

      <div className='row'>

        {/* LEFT COLUMN */}
        <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">

          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                  <span style={{ fontSize: '16px', color: '#ffa300' }}>&#9658;</span>
                  <h5 className="mb-0">Recent Detail Inspections</h5>
                </div>
              </div>

              <div className="panel-body" style={{ padding: '0' }}>
                {inspections.map((item, i) => (
                  <div key={item.id}>
                    <div
                      className="hover-up"
                      onClick={() => setOpenInspection(openInspection === i ? null : i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '16px 20px',
                        borderBottom: openInspection === i ? 'none' : (i < inspections.length - 1 ? '1px solid #f5f5f5' : 'none'),
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px',
                        whiteSpace: 'nowrap',
                        color: item.levelColor, background: item.levelBg,
                        border: `1px solid ${item.levelColor}40`,
                      }}>{item.level}</span>

                      <div style={{ flex: 1 }}>
                        <span className="font-sm" style={{ fontWeight: 600, color: '#122359' }}>
                          {item.title}: {item.id}
                        </span>
                        <span className="font-xs color-text-paragraph-2" style={{ marginLeft: '8px' }}>
                          Actor: {item.actor}
                        </span>
                      </div>

                      <span style={{
                        fontSize: '16px', color: '#888',
                        transform: openInspection === i ? 'rotate(180deg)' : 'none',
                      }}>&#8964;</span>
                    </div>

                    {/* {openInspection === i && (
                <div style={{
                  padding: '16px 20px 20px',
                  background: '#F8FAFF',
                  borderLeft: `3px solid ${item.levelColor}`,
                }}>
                  <p className="font-sm color-text-paragraph-2">{item.detail}</p>
                </div>
              )} */}
                  </div>
                ))}
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
                        <span style={{
                          fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                          borderRadius: '20px', whiteSpace: 'nowrap',
                          color: item.statusColor, background: item.statusBg,
                        }}>{item.status}</span>
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