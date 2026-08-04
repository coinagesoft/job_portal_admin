'use client'
import { useState } from 'react'
import Footer from '../../../../components/Footer'
import {
  Clock,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  LogIn
} from "lucide-react";
/* ─────────────────────────────────────────
   Inline-editable field component
   Shows value + pencil icon in preview mode.
   Clicking pencil switches that field to an input.
   Clicking ✓ saves, clicking ✗ cancels.
───────────────────────────────────────── */
function InlineField({ label, icon, value, name, type = 'text', onSave, readonly = false }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => { onSave(name, draft); setEditing(false) }
  const handleCancel = () => { setDraft(value); setEditing(false) }

  return (
    <div>
      <p className="font-xs color-text-paragraph-2 mb-5"
        style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px' }}>
        {icon && <i className={`${icon} mr-5`}></i>}{label}
      </p>

      {editing ? (
        <div className="d-flex align-items-center" style={{ gap: '6px' }}>
          <input
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="form-control font-sm"
            style={{ flex: 1, height: '36px', padding: '0 10px' }}
            autoFocus
          />
          {/* ✓ Save */}
          <button onClick={handleSave}
            className="btn btn-default hover-up"
            style={{ padding: '6px 10px', lineHeight: 1, minWidth: 'unset' }}
            title="Save">
            <i className="fi-rr-check" style={{ fontSize: '12px' }}></i>
          </button>
          {/* ✗ Cancel */}
          <button onClick={handleCancel}
            className="btn btn-grey-small hover-up"
            style={{ padding: '6px 10px', lineHeight: 1, minWidth: 'unset' }}
            title="Cancel">
            <i className="fi-rr-cross" style={{ fontSize: '12px' }}></i>
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center" style={{ gap: '8px' }}>
          <p className="font-sm mb-0" style={{ fontWeight: 600, color: '#122359', flex: 1 }}>
            {value || <span className="color-text-mutted">—</span>}
          </p>
          {!readonly && (
            <button onClick={() => { setDraft(value); setEditing(true) }}
              className="btn btn-grey-small hover-up"
              style={{ padding: '3px 7px', lineHeight: 1, minWidth: 'unset', opacity: 0.6 }}
              title={`Edit ${label}`}>
              <i className="fi-rr-edit" style={{ fontSize: '11px' }}></i>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   Inline-editable name (larger text)
───────────────────────────────────────── */
function InlineHeading({ value, name, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => { onSave(name, draft); setEditing(false) }
  const handleCancel = () => { setDraft(value); setEditing(false) }

  return (
    <div className="d-flex align-items-center" style={{ gap: '8px' }}>
      {editing ? (
        <>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="form-control"
            style={{ fontSize: '20px', fontWeight: 700, height: '40px', padding: '0 12px', maxWidth: '280px' }}
            autoFocus
          />
          <button onClick={handleSave} className="btn btn-default hover-up"
            style={{ padding: '6px 10px', lineHeight: 1, minWidth: 'unset' }} title="Save">
            <i className="fi-rr-check" style={{ fontSize: '12px' }}></i>
          </button>
          <button onClick={handleCancel} className="btn btn-grey-small hover-up"
            style={{ padding: '6px 10px', lineHeight: 1, minWidth: 'unset' }} title="Cancel">
            <i className="fi-rr-cross" style={{ fontSize: '12px' }}></i>
          </button>
        </>
      ) : (
        <>
          <h4 className="mb-0">{value}</h4>
          <button onClick={() => { setDraft(value); setEditing(true) }}
            className="btn btn-grey-small hover-up"
            style={{ padding: '3px 7px', lineHeight: 1, minWidth: 'unset', opacity: 0.6 }}
            title="Edit name">
            <i className="fi-rr-edit" style={{ fontSize: '11px' }}></i>
          </button>
        </>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   Inline-editable sub-line (role • company)
───────────────────────────────────────── */
function InlineSubline({ role, company, onSave }) {
  const [editingRole, setEditingRole] = useState(false)
  const [editingCompany, setEditingCompany] = useState(false)
  const [draftRole, setDraftRole] = useState(role)
  const [draftCompany, setDraftCompany] = useState(company)

  return (
    <div className="d-flex align-items-center" style={{ gap: '8px', flexWrap: 'wrap' }}>

      {/* Role */}
      {editingRole ? (
        <div className="d-flex align-items-center" style={{ gap: '4px' }}>
          <input value={draftRole} onChange={(e) => setDraftRole(e.target.value)}
            className="form-control font-xs" style={{ width: '140px', height: '30px', padding: '0 8px' }} autoFocus />
          <button onClick={() => { onSave('role', draftRole); setEditingRole(false) }}
            className="btn btn-default hover-up" style={{ padding: '4px 7px', lineHeight: 1, minWidth: 'unset' }}>
            <i className="fi-rr-check" style={{ fontSize: '10px' }}></i>
          </button>
          <button onClick={() => { setDraftRole(role); setEditingRole(false) }}
            className="btn btn-grey-small hover-up" style={{ padding: '4px 7px', lineHeight: 1, minWidth: 'unset' }}>
            <i className="fi-rr-cross" style={{ fontSize: '10px' }}></i>
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center" style={{ gap: '4px' }}>
          <span className="font-sm color-text-paragraph-2">{role}</span>
          <button onClick={() => { setDraftRole(role); setEditingRole(true) }}
            className="btn btn-grey-small hover-up" style={{ padding: '2px 5px', lineHeight: 1, minWidth: 'unset', opacity: 0.5 }}>
            <i className="fi-rr-edit" style={{ fontSize: '10px' }}></i>
          </button>
        </div>
      )}

      <span className="color-text-mutted font-xs">&bull;</span>

      {/* Company */}
      {editingCompany ? (
        <div className="d-flex align-items-center" style={{ gap: '4px' }}>
          <input value={draftCompany} onChange={(e) => setDraftCompany(e.target.value)}
            className="form-control font-xs" style={{ width: '130px', height: '30px', padding: '0 8px' }} autoFocus />
          <button onClick={() => { onSave('company', draftCompany); setEditingCompany(false) }}
            className="btn btn-default hover-up" style={{ padding: '4px 7px', lineHeight: 1, minWidth: 'unset' }}>
            <i className="fi-rr-check" style={{ fontSize: '10px' }}></i>
          </button>
          <button onClick={() => { setDraftCompany(company); setEditingCompany(false) }}
            className="btn btn-grey-small hover-up" style={{ padding: '4px 7px', lineHeight: 1, minWidth: 'unset' }}>
            <i className="fi-rr-cross" style={{ fontSize: '10px' }}></i>
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center" style={{ gap: '4px' }}>
          <span className="font-sm color-text-paragraph-2">{company}</span>
          <button onClick={() => { setDraftCompany(company); setEditingCompany(true) }}
            className="btn btn-grey-small hover-up" style={{ padding: '2px 5px', lineHeight: 1, minWidth: 'unset', opacity: 0.5 }}>
            <i className="fi-rr-edit" style={{ fontSize: '10px' }}></i>
          </button>
        </div>
      )}

    </div>
  )
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
const initial = {
  name: 'Vikram Sahay',
  role: 'Lead Product Designer',
  company: 'NexusGlobal',
  status: 'Pending Review',
  userId: 'USR-88219',
  email: 'vikram.sahay@nexus.c',
  phone: '+91 98210 55421',
  location: 'Bangalore, India',
  joined: '24 Oct, 2023',
}

const ocrFields = [
  { field: 'Full Name', userProvided: 'Vikram Sahay', aiExtracted: 'VIKRAM SAHAY', status: 'Match' },
  { field: 'Date of Birth', userProvided: '12/05/1992', aiExtracted: '12-MAY-1992', status: 'Match' },
  { field: 'Document ID', userProvided: 'ABCDE1234F', aiExtracted: 'ABCDE1234F', status: 'Match' },
  { field: 'Expiry Date', userProvided: '20/12/2032', aiExtracted: '20-DEC-2032', status: 'Match' },
]

const auditHistory = [
  { icon: 'fi-rr-check-circle', label: 'Registration Completed', time: '2 hours ago', by: 'System' },
  { icon: 'fi-rr-id-badge', label: 'Identity Doc Uploaded', time: '1 hour ago', by: 'System' },
  { icon: 'fi-rr-shield-check', label: 'AI Scan Completed', time: '58 mins ago', by: 'SkillBot AI' },
  { icon: 'fi-rr-eye', label: 'Viewed by Admin', time: '5 mins ago', by: 'Sarah J. (Admin)' },
]

export default function UserVerificationPage() {
  const [form, setForm] = useState(initial)
  const [decisionNote, setDecisionNote] = useState('')

  /* Universal field saver — used by all InlineField / InlineHeading / InlineSubline */
  const handleSave = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  return (
    <>

      {/* ── PAGE HEADING ── */}
      <div className="box-heading justify-content-between mb-3">
        
        <div className="box-title d-flex ">
          
          <h3 className="mb-0">User Verification</h3>
           
        </div>

        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{border:"none" ,  backgroundColor:"revert"}}>
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><a href="/admin/verifications">Verifications</a></li>
              <li><span>Edit - Alexander Wright</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="row">

        {/* ════ LEFT COLUMN ════ */}
        <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">

          {/* ── User Profile Card ── */}
          <div className="section-box mt-4">
            <div className="panel-white p-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>

              {/* ───────── TOP STRIP ───────── */}
              

              {/* ───────── MAIN BODY ───────── */}
              <div className="panel-body p-4" style={{ marginTop: '0px' }}>

                {/* Avatar + Info */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

                  {/* LEFT SIDE */}
                  <div className="d-flex align-items-center" style={{ gap: '20px', flexWrap: 'wrap' }}>

                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                      <div className="card-grid-2-image-rd online" style={{ maxWidth: '80px', padding: 0 }}>
                        <figure>
                          <img
                            src="/assets/imgs/page/candidates/user1.png"
                            alt={form.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '4px solid #fff'
                            }}
                          />
                        </figure>
                      </div>

                      {/* Edit icon */}
                      <button title="Change photo"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#ffa300',
                          border: '2px solid #fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}>
                        <i className="fi-rr-camera" style={{ fontSize: '10px', color: '#fff' }}></i>
                      </button>
                    </div>

                    {/* Info */}
                    <div style={{ minWidth: 0 }} className='mt-5 pt-5'>
                      <InlineHeading value={form.name} name="name" onSave={handleSave} />

                      <div className="d-flex align-items-center flex-wrap mt-1" style={{ gap: '8px' }}>
                        <InlineSubline role={form.role} company={form.company} onSave={handleSave} />

                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 12px',
                          borderRadius: '20px',
                          background: '#f1f5f9',
                          color: '#334155'
                        }}>
                          Pending Review
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Divider */}
                <hr style={{ borderColor: '#ffc151', margin: '20px 0' }} />

                {/* Contact Info */}
                <div className="row">

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-15">
                    <InlineField
                      label="Email"
                      icon="fi-rr-envelope"
                      value={form.email}
                      name="email"
                      onSave={handleSave}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-15">
                    <InlineField
                      label="Phone"
                      icon="fi-rr-phone"
                      value={form.phone}
                      name="phone"
                      onSave={handleSave}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-15">
                    <InlineField
                      label="Location"
                      icon="fi-rr-marker"
                      value={form.location}
                      name="location"
                      onSave={handleSave}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-15">
                    <InlineField
                      label="Joined"
                      icon="fi-rr-calendar"
                      value={form.joined}
                      name="joined"
                      onSave={handleSave}
                      readonly
                    />
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* ── KYC Documents ── */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h6 className="mb-0">KYC Documents</h6>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    Government Issued National Identity Card (Passport / PAN)
                  </p>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                  borderRadius: '20px', background: '#ffc151', color: '#ffa300',
                }}>OCR Processed</span>
              </div>

              <div className="panel-body">

                {/* Document images — each with re-upload button */}
                <div className="row mb-25">
                  {[
                    { label: 'Front Side', src: 'https://pvcprint.shop/wp-content/uploads/2025/04/aadhar-card-front.png' },
                    { label: 'Back Side', src: 'https://pbs.twimg.com/media/CvwpwnjVMAEoFoi.jpg' },
                  ].map((doc) => (
                    <div key={doc.label} className="col-md-6 col-sm-12 mb-15">
                      <div className="d-flex align-items-center justify-content-between mb-10">
                        <p className="font-xs color-text-paragraph-2 mb-0"
                          style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px', fontWeight: 600 }}>
                          {doc.label}
                        </p>
                        {/* Re-upload trigger */}
                        <button className="btn btn-grey-small hover-up font-xs"
                          style={{ padding: '3px 8px', opacity: 0.7 }}>
                          <i className="fi-rr-upload mr-5" style={{ fontSize: '10px' }}></i>Re-upload
                        </button>
                      </div>
                      <div style={{
                        border: '1px solid #ffc151', borderRadius: '8px',
                        overflow: 'hidden', background: '#F8FAFF',
                        height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <img src={doc.src} alt={doc.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* OCR data table — each User Provided cell is editable */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                    <thead>
                      <tr>
                        {['Data Field', 'User Provided', 'AI Extracted (OCR)', 'Status'].map((h) => (
                          <th key={h} className="font-xs color-text-paragraph-2"
                            style={{ padding: '10px 14px', borderBottom: '1px solid #ffc151', textAlign: 'left', fontWeight: 600 }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ocrFields.map((row) => (
                        <tr key={row.field} className="hover-up">
                          <td style={{ padding: '10px 14px', borderBottom: '1px solid #f5f5f5' }}>
                            <span className="font-sm" style={{ fontWeight: 600, color: '#122359' }}>{row.field}</span>
                          </td>
                          {/* User Provided — inline editable */}
                          <td style={{ padding: '6px 14px', borderBottom: '1px solid #f5f5f5', minWidth: '140px' }}>
                            <OcrCell value={row.userProvided} />
                          </td>
                          <td style={{ padding: '10px 14px', borderBottom: '1px solid #f5f5f5' }}>
                            <span className="font-sm color-text-paragraph-2">{row.aiExtracted}</span>
                          </td>
                          <td style={{ padding: '10px 14px', borderBottom: '1px solid #f5f5f5' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                              borderRadius: '20px', background: '#e8f5e9', color: '#2e7d32',
                            }}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>

          {/* ── Live Selfie Verification ── */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h6 className="mb-0">Live Selfie Verification</h6>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    Biometric comparison against document photo
                  </p>
                </div>
              </div>
              <div className="panel-body">
                <div className="row align-items-center">

                  {/* Document photo */}
                  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 text-center mb-15">
                    <div style={{
                      position: 'relative', width: '100px', margin: '0 auto 8px',
                    }}>
                      <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        overflow: 'hidden', border: '3px solid #ffc151',
                      }}>
                        <img src="/assets/imgs/page/candidates/user1.png" alt="Document Photo"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <button title="Re-upload document photo" style={{
                        position: 'absolute', bottom: 2, right: 2,
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: '#66789C', border: '2px solid #fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className="fi-rr-upload" style={{ fontSize: '9px', color: '#fff' }}></i>
                      </button>
                    </div>
                    <p className="font-xs color-text-paragraph-2 mb-0"
                      style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px' }}>
                      Document Photo
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="col-xl-1 col-lg-1 col-md-1 text-center mb-15">
                    <i className="fi-rr-arrow-right font-lg color-brand-2"></i>
                  </div>

                  {/* Live capture */}
                  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 text-center mb-15">
                    <div style={{ position: 'relative', width: '100px', margin: '0 auto 8px' }}>
                      <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        overflow: 'hidden', border: '3px solid #ffa300',
                      }}>
                        <img src="/assets/imgs/page/candidates/user2.png" alt="Live Capture"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{
                        position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
                        fontSize: '9px', fontWeight: 700, padding: '2px 8px',
                        borderRadius: '20px', background: '#ffa300', color: '#fff', whiteSpace: 'nowrap',
                      }}>LIVE CAPTURE</span>
                    </div>
                    <p className="font-xs color-text-paragraph-2 mb-0 mt-10"
                      style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px' }}>
                      Live Capture
                    </p>
                  </div>

                  {/* Score + checks */}
                  <div className="col-xl-5 col-lg-5 col-md-3 col-sm-12 mb-15">
                    <div className="d-flex align-items-center justify-content-between mb-10">
                      <span className="font-sm color-text-paragraph-2">Face Match Score</span>
                      <strong style={{ color: '#2e7d32', fontSize: '16px' }}>98.2%</strong>
                    </div>
                    <div className="box-progress-bar mb-15">
                      <div className="progress">
                        <div className="progress-bar" role="progressbar"
                          style={{ width: '98%', borderRadius: '5px', background: '#ffa300' }}>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-column" style={{ gap: '6px' }}>
                      <span className="font-xs" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2e7d32' }}>
                        <i className="fi-rr-check-circle"></i>Liveness Detected
                      </span>
                      <span className="font-xs" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2e7d32' }}>
                        <i className="fi-rr-check-circle"></i>No Spoofing Detected
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
        {/* end left col */}

        {/* ════ RIGHT SIDEBAR ════ */}
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-4">

          {/* AI Confidence Score */}
          <div className="section-box">
            <div className="panel-white">
                  {/* Queue meta */}
        <div className="d-flex align-items-center" style={{ gap: '10px', flexShrink: 0 }}>
          <div style={{ border: '1px solid #ffa300', borderRadius: '8px', padding: '8px 16px', textAlign: 'center', background: '#fff' }}>
            <p className="font-xs color-text-paragraph-2 mb-2"
              style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '9px' }}>Queue Priority</p>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', background: '#fdecea', color: '#c62828' }}>High</span>
          </div>
          <div style={{ border: '1px solid #ffa300', borderRadius: '8px', padding: '8px 16px', textAlign: 'center', background: '#fff' }}>
            <p className="font-xs color-text-paragraph-2 mb-2"
              style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '9px' }}>Time in Queue</p>
            <h6 className="mb-0">42 mins</h6>
          </div>
        </div>
              <div className="panel-head" style={{ alignItems: 'center' }}>
                <h6 className="mb-0" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.6px', color: '#66789C' }}>
                  AI Confidence Score
                </h6>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: '#e8f5e9', color: '#2e7d32' }}>
                  High Trust
                </span>
              </div>
              <div className="panel-body text-center">
                <div style={{ margin: '0 auto 10px', width: '110px' }}>
                  <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#122359', marginBottom: 0 }}>94%</h2>
                  <div style={{ height: '6px', background: '#ffc151', borderRadius: '5px', overflow: 'hidden', marginTop: '8px' }}>
                    <div style={{ width: '94%', height: '100%', background: '#ffa300', borderRadius: '5px' }}></div>
                  </div>
                </div>
                <div className="row mt-20">
                  <div className="col-12">
                    <div style={{ background: '#F8FAFF', border: '1px solid #ffc151', borderRadius: '8px', padding: '10px' }}>
                      <p className="font-xs color-text-paragraph-2 mb-5"
                        style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.4px' }}>Risk Level</p>
                      <p className="font-sm mb-0" style={{ fontWeight: 700, color: '#2e7d32' }}>Very Low</p>
                    </div>
                  </div>
                  {/* <div className="col-6">
                    <div style={{ background: '#F8FAFF', border: '1px solid #ffc151', borderRadius: '8px', padding: '10px' }}>
                      <p className="font-xs color-text-paragraph-2 mb-5"
                        style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.4px' }}>Anomaly</p>
                      <p className="font-sm mb-0" style={{ fontWeight: 700, color: '#122359' }}>None detected</p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Decision */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h6 className="mb-0">Admin Decision</h6>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    Finalize verification status for this user
                  </p>
                </div>
              </div>
              <div className="panel-body">
              
                <p className="font-xs color-text-paragraph-2 mb-5" style={{ fontWeight: 600 }}>
                  Decision Notes (Internal)
                </p>
                <div className="form-group mb-15">
                  <textarea
                    className="form-control font-sm"
                    placeholder="Explain your decision (required for rejection)..."
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    style={{ minHeight: '90px', resize: 'vertical', borderRadius: '8px' }}
                  />
                </div>
                   <a className="btn btn-default hover-up font-sm mb-10"
                  href="#" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                  Send
                </a>
                <div className="d-flex align-items-center mb-15" style={{ gap: '8px' }}>

                  
                  <a className="btn hover-up font-sm" href="#" style={{
                    flex: 1, textAlign: 'center',
                    background: '#fff', border: '1px solid #f87171',
                    color: '#dc2626', borderRadius: '8px', padding: '10px 12px', lineHeight: '22px',
                  }}>
                  Cancel
                  </a>
                  
                </div>
                <p className="font-xs color-text-paragraph-2 mb-0 text-center">
                  <i className="fi-rr-clock mr-5"></i>This action will notify the user via email instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Audit History */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: 'center' }}>
                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                  <i className="fi-rr-time-past font-sm color-brand-2 ms-4 d-none"></i>
                  <h6 className="mb-0">Audit History</h6>
                </div>
              </div>
              <div className="panel-body">
                {auditHistory.map((item, i) => (
                  
                    <div style={{ flex: 1 }} className='my-2'>
                      <p className="font-sm mb-0" style={{ fontWeight: 600, color: '#122359', lineHeight: 1.3 }}>
                        {item.label}
                      </p>
                      <span className="font-xs color-text-paragraph-2">
                        {item.time} &bull; {item.by}
                      </span>
                    </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        {/* end right sidebar */}

      </div>

      {/* ── BOTTOM QUEUE BAR ── */}
      <div className="section-box">
       
          <div className="section-box">
        <div className="panel-white" style={{ padding: '16px 20px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div className="d-flex align-items-center" style={{ gap: '20px', flexWrap: 'wrap' }}>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-default hover-up" style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', height: '44px', borderRadius: '10px' }}>Approve</button>
              <button className="btn btn-default hover-up" style={{ background: '#fdecea', color: '#c62828', border: '1px solid #ef9a9a', height: '44px', borderRadius: '10px' }}>Reject</button>
              <button className="btn btn-default hover-up" style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80', height: '44px', borderRadius: '10px' }}>Flag</button>
              <a href="/recruiters" className="btn d-flex align-items-center justify-content-center" style={{ height: '44px', padding: '0 18px', borderRadius: '10px' }}>Discard Changes</a>
              <a href="#" className="btn btn-primary d-flex align-items-center justify-content-center" style={{ height: '44px', padding: '0 18px', borderRadius: '10px' }}>Save Changes</a>
            </div>
          </div>
        </div>
      </div>
      </div>

      <Footer />
    </>
  )
}

/* ─────────────────────────────────────────
   Inline-editable OCR table cell
───────────────────────────────────────── */
function OcrCell({ value: initialValue }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [draft, setDraft] = useState(initialValue)

  const save = () => { setValue(draft); setEditing(false) }
  const cancel = () => { setDraft(value); setEditing(false) }

  return editing ? (
    <div className="d-flex align-items-center" style={{ gap: '4px' }}>
      <input value={draft} onChange={(e) => setDraft(e.target.value)}
        className="form-control font-sm"
        style={{ flex: 1, height: '32px', padding: '0 8px' }} autoFocus />
      <button onClick={save} className="btn btn-default hover-up"
        style={{ padding: '5px 8px', lineHeight: 1, minWidth: 'unset' }}>
        <i className="fi-rr-check" style={{ fontSize: '11px' }}></i>
      </button>
      <button onClick={cancel} className="btn btn-grey-small hover-up"
        style={{ padding: '5px 8px', lineHeight: 1, minWidth: 'unset' }}>
        <i className="fi-rr-cross" style={{ fontSize: '11px' }}></i>
      </button>
    </div>
  ) : (
    <div className="d-flex align-items-center" style={{ gap: '6px' }}>
      <span className="font-sm color-text-paragraph-2">{value}</span>
      <button onClick={() => { setDraft(value); setEditing(true) }}
        className="btn btn-grey-small hover-up"
        style={{ padding: '3px 6px', lineHeight: 1, minWidth: 'unset', opacity: 0.55 }}>
        <i className="fi-rr-edit" style={{ fontSize: '10px' }}></i>
      </button>
    </div>
  )
}