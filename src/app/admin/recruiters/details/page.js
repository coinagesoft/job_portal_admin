'use client'
import { useState } from 'react'
import Footer from '../../../../components/Footer'
import { Brain, AlertTriangle, User, Clock , Calendar, Briefcase, Wallet } from "lucide-react";
export default function EmployerDetailsPage() {
    const [previewDoc, setPreviewDoc] = useState(null)
    return (
        <>
{/* ── PAGE HEADING: employer name + status + action buttons ── */}
 <div className="box-heading d-flex align-items-center justify-content-between mb-3">
  {/* LEFT */}
  <div className="box-title d-flex align-items-center" style={{ gap: '12px' }}>    
    <div style={{
      width: '42px',
      height: '42px',
      borderRadius: '8px',
      background: '#ffa300',
      color: '#fff',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: '14px',
    }}>
      SL
    </div>

    <div className='mt-1'>
      <div className="d-flex align-items-center gap-2 mb-1">
        <h5 className="mb-0">Stellar Logistics Pvt. Ltd.</h5>
        <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '11px', padding: '4px 8px', borderRadius: '12px' }}>
          View Only
        </span>
      </div>

      <div className="d-flex align-items-center mt-1" style={{ gap: '10px' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 10px',
          borderRadius: '20px',
          background: '#fff3e0',
          color: '#e65100',
        }}>
          Pending Review
        </span>

        <span className="font-xs color-text-paragraph-2">
          ID: REC-902831
        </span>
      </div>
<div
  className="d-flex align-items-center mt-2"
  style={{ gap: '14px', flexWrap: 'wrap' }}
>

  {/* Removed AI/Risk/Assigned badges from top header */}

  {/* <span className="font-xs color-text-paragraph-2 d-flex align-items-center gap-1">
    <Clock size={14} strokeWidth={2} />
    42 mins in queue
  </span> */}

</div>
    </div>

  </div>

{/* RIGHT */}
<div className="box-breadcrumb">
  <div className="breadcrumbs" style={{border:"none" ,  backgroundColor:"revert"}}>
    <ul>
      <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
      <li><a href="/admin/recruiters">Recruiters</a></li>
      <li><span>Details - Alexander Wright</span></li>
    </ul>
  </div>
</div>

</div>
            {/* ── MAIN LAYOUT ── */}
            <div className="row">

                {/* ════ LEFT COLUMN ════ */}
                <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">
<div className="section-box">
  <div className="panel-white">

    <div className="panel-head">
      <h6 className="mb-0">Recruiter Information</h6>
      
    </div>

    <div className="panel-body">
      <div className="row">

        <div className="col-6 mb-15">
          <p className="font-xs color-text-paragraph-2">NAME</p>
          <p className="font-sm mb-0" style={{ fontWeight: 600 }}>Sarah Jenkins</p>
        </div>

        <div className="col-6 mb-15">
          <p className="font-xs color-text-paragraph-2">ROLE</p>
          <p className="font-sm mb-0" style={{ fontWeight: 600 }}>HR Director</p>
        </div>

        <div className="col-6 mb-15">
          <p className="font-xs color-text-paragraph-2">EMAIL</p>
          <p className="font-sm mb-0" style={{ fontWeight: 600 }}>sarah@stellar.com</p>
        </div>

        <div className="col-6 mb-15">
          <p className="font-xs color-text-paragraph-2">STATUS</p>
          <span style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '20px',
            background: '#e8f5e9',
            color: '#2e7d32'
          }}>
            Active
          </span>
        </div>

      </div>
    </div>

  </div>
</div>
                    {/* Company Information */}
                    <div className="section-box">
                        <div className="panel-white">

                            {/* ── TOP ACTION BAR (NEW) ── */}

                            <div className="panel-head d-flex justify-content-between" style={{ alignItems: 'center' }}>
                                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                                    <h6 className="mb-0">Company Information</h6>
                                </div>

                            
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    {[
                                        { label: 'LEGAL NAME', value: 'Stellar Logistics Private Limited' },
                                        { label: 'TRADE NAME', value: 'Stellar Express' },
                                        { label: 'GSTIN', value: '27AACS1234L1Z5' },
                                        { label: 'PAN', value: 'AACS1234L' },
                                        { label: 'BUSINESS TYPE', value: 'Logistics & Warehousing' },
                                        { label: 'STATE / JURISDICTION', value: 'Maharashtra (27)' },
                                        { label: 'EMAIL', value: 'compliance@stellarlogistics.com' },
                                        { label: 'REG. DATE', value: '12th March 2018' },
                                        { label: 'CONTACT PERSON', value: 'Rajesh Kumar (Compliance Head)' },
                                    ].map((item) => (
                                        <div key={item.label} className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-20 ">
                                            <p className="font-xs color-text-paragraph-2 mb-5"
                                                style={{ textTransform: 'uppercase', letterSpacing: '0.4px', fontSize: '10px' }}>
                                                {item.label}
                                            </p>
                                            <p className="font-sm mb-0" style={{ fontWeight: 600, color: '#122359' }}>
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section-box">
  <div className="panel-white">
    <div className="panel-head">
      <h6 className="mb-0">Risk Analysis</h6>
    </div>

    <div className="panel-body">
      <div className="row gx-3 gy-3">
        {[
          { title: 'Document Validity', value: '1 Expired', description: 'One uploaded document has expired', color: '#dc2626' },
          { title: 'AI Confidence', value: '86%', description: 'Overall verification confidence', color: '#ea580c' },
          { title: 'Duplicate Company', value: 'No Match', description: 'No duplicate entity found', color: '#15803d' },
          { title: 'Sanctions Check', value: 'Clear', description: 'No sanctions detected', color: '#047857' },
        ].map(item => (
          <div key={item.title} className="col-sm-6">
            <div className="card-grid-2" style={{ padding: '16px', borderRadius: '14px', border: '1px solid #e5e7eb' }}>
              <div className="d-flex align-items-start justify-content-between mb-12">
                <div>
                  <p className="font-xs color-text-paragraph-2 mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {item.title}
                  </p>
                  <p className="font-sm mb-0" style={{ fontWeight: 700, color: '#111827' }}>{item.value}</p>
                </div>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color, marginTop: '4px' }}></span>
              </div>
              <p className="font-xs color-text-paragraph-2 mb-0">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

                    {/* Compliance Documents */}
                    <div className="section-box">
                        <div className="panel-white">
                            <div className="panel-head" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                <div>
                                    <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                                        <i className="fi-rr-document font-sm color-brand-2"></i>
                                        <h6 className="mb-0">Compliance Documents</h6>
                                    </div>
                                    <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                                        5 documents uploaded for verification
                                    </p>
                                </div>
                                <a className="font-sm color-brand-2 hover-up" href="#">
                                    <i className="fi-rr-download mr-5"></i>Download All (.zip)
                                </a>
                            </div>

                            <div className="panel-body">
                                <div className="row">
                                    {[
                                        {
                                            title: 'GST Certificate', sub: 'GST Document',
                                            status: 'Verified', statusColor: '#2e7d32', statusBg: '#e8f5e9',
                                            img: "https://www.legalwiz.in/wp-content/uploads/image-570.png",
                                            expired: false, aiMatch: null, meta: null,
                                        },
                                        {
                                            title: 'PAN Card - Corporate', sub: 'PAN Document',
                                            status: 'Verified', statusColor: '#2e7d32', statusBg: '#e8f5e9',
                                            img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGCen-C1d098jk5azlItLqxCsPwRy5ET0KczRjB1I7B6TvbqgyJn5GxG6cuywT3D3yPnnydre4oqifOE03SFYEqmS9kN6azD-TawLZWwLPe9mOiGJqLh0adYt11LqlUNvv_HQOhmVDAJE/s1600/IMG-20180320-WA0001.jpg',
                                            expired: false, aiMatch: null, meta: null,
                                        },
                                        {
                                            title: 'POE License Copy', sub: 'POE Document',
                                            status: 'Verified', statusColor: '#2e7d32', statusBg: '#e8f5e9',
                                            img: 'https://pbs.twimg.com/media/GYeyu9hW0AE5iyz?format=jpg&name=900x900',
                                            expired: false,
                                            aiMatch: { label: '98% Match', color: '#2e7d32', bg: '#e8f5e9' },
                                            meta: { licenseNo: 'POE-9928/2023', validTill: '2025-12-31' },
                                        },
                                        {
                                            title: 'RPSL Certification', sub: 'RPSL Document',
                                            status: 'Pending', statusColor: '#e65100', statusBg: '#fff3e0',
                                            img: 'https://vigilss.com/wp-content/uploads/2023/07/RPSL-LIC-1-768x723.png',
                                            aiMatch: { label: '64% Match', color: '#e65100', bg: '#fff3e0' },
                                            meta: { licenseNo: 'RPSL-MUM-442', validTill: '2023-01-15' },
                                        },
                                        {
                                            title: 'Business Reg Certificate', sub: 'BR Document',
                                            status: 'Verified', statusColor: '#2e7d32', statusBg: '#e8f5e9',
                                            img: 'https://imgv2-2-f.scribdassets.com/img/document/768783389/original/959dd3323c/1?v=1',
                                            expired: false, aiMatch: null, meta: null,
                                        },
                                    ].map((doc) => (
                                        <div key={doc.title} className="col-xl-5 col-lg-5 col-md-6 col-sm-6 mb-20">
                                            <div className="card-grid-2" style={{ marginBottom: 0 }}>
                                                {/* Expired badge */}
                                                {doc.expired && (
                                                    <div style={{
                                                        position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                                                        background: '#dc2626', color: '#fff',
                                                        fontSize: '10px', fontWeight: 700,
                                                        padding: '2px 8px', borderRadius: '4px',
                                                    }}>EXPIRED</div>
                                                )}
                                                {/* Thumbnail */}
                                                <div style={{ height: '165px', overflow: 'hidden', background: '#dde4f0' }}>
                                                   <img
  src={doc.img}
  alt={doc.title}
  onClick={() => setPreviewDoc(doc)}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: 'pointer'   // 🔥 important
  }}
/>
                                                </div>
                                                {/* Card body */}
                                                <div className="card-block-info" style={{ padding: '12px' }}>
                                                    <div className="d-flex align-items-start justify-content-between mb-5">
                                                        <p className="font-sm mb-0" style={{ fontWeight: 600, color: '#122359', lineHeight: 1.3 }}>
                                                            {doc.title}
                                                        </p>
                                                        <span style={{
                                                            fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                                                            borderRadius: '20px', background: doc.statusBg, color: doc.statusColor,
                                                            whiteSpace: 'nowrap', marginLeft: '6px', flexShrink: 0,
                                                        }}>{doc.status}</span>
                                                    </div>
                                                    <p className="font-xs color-text-paragraph-2 mb-0">{doc.sub}</p>

                                                    {doc.aiMatch && (
                                                        <div className="d-flex align-items-center mt-10" style={{ gap: '6px' }}>
                                                            <span className="font-xs color-text-paragraph-2"
                                                                style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.4px' }}>
                                                                AI EXTRACTION
                                                            </span>
                                                            <span style={{
                                                                fontSize: '10px', fontWeight: 700, padding: '1px 7px',
                                                                borderRadius: '20px', background: doc.aiMatch.bg, color: doc.aiMatch.color,
                                                            }}>{doc.aiMatch.label}</span>
                                                        </div>
                                                    )}

                                                    {doc.meta && (
                                                        <div className="employers-info mt-10">
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <p className="font-xs color-text-paragraph-2 mb-0"
                                                                        style={{ fontSize: '9px', textTransform: 'uppercase' }}>License No.</p>
                                                                    <p className="font-xs mb-0" style={{ fontWeight: 600, color: '#122359' }}>
                                                                        {doc.meta.licenseNo}
                                                                    </p>
                                                                </div>
                                                                <div className="col-6">
                                                                    <p className="font-xs color-text-paragraph-2 mb-0"
                                                                        style={{ fontSize: '9px', textTransform: 'uppercase' }}>Valid Till</p>
                                                                    <p className="font-xs mb-0" style={{ fontWeight: 600, color: '#122359' }}>
                                                                        {doc.meta.validTill}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Trust & Verification Badges */}
                    <div className="section-box">
                        <div className="panel-white">
                            <div className="panel-head" style={{ alignItems: 'center' }}>
                                <div>
                                    <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                                        <i className="fi-rr-shield-check font-sm color-brand-2"></i>
                                        <h6 className="mb-0">Trust &amp; Verification Badges</h6>
                                    </div>
                                    <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                                        Verified trust attributes and compliance badges for this recruiter.
                                    </p>
                                </div>
                            </div>
                            <div className="panel-body">
                                <div className="row gx-2 gy-2">
                                    {[
                                        { label: 'GST Verified', active: true, color: '#115e59', bg: '#d1fae5', border: '#10b981' },
                                        { label: 'PAN Verified', active: true, color: '#c2410c', bg: '#ffedd5', border: '#fb923c' },
                                        { label: 'Blue-Tick Verified', active: true, color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd' },
                                        { label: 'POE Licensed', active: false, color: '#334155', bg: '#f8fafc', border: '#cbd5e1' },
                                        { label: 'RPSL Certified', active: false, color: '#334155', bg: '#f8fafc', border: '#cbd5e1' },
                                    ].map((badge) => (
                                        <div key={badge.label} className="col-auto">
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '8px 16px', borderRadius: '999px',
                                                background: badge.bg, color: badge.color,
                                                fontSize: '12px', fontWeight: 700,
                                                border: `1px solid ${badge.border}`,
                                                minWidth: 'fit-content',
                                            }}>
                                                {badge.active && <i className="fi-rr-check" style={{ fontSize: '12px' }}></i>}
                                                {badge.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* end left col */}

                {/* ════ RIGHT SIDEBAR ════ */}
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
<div className="section-box">
  <div className="panel-white">
    <div className="panel-head">
      <h6 className="mb-0">Verification Summary</h6>
    </div>

    <div className="panel-body">

      <div className="d-flex justify-content-between mb-10">
        <span className="font-sm color-text-paragraph-2">Payment Status</span>
        <strong style={{ color: '#2e7d32' }}>Completed</strong>
      </div>

      <div className="d-flex justify-content-between mb-10">
        <span className="font-sm color-text-paragraph-2">Risk Score</span>
        <strong style={{ color: '#e65100' }}>Medium</strong>
      </div>

      <div className="d-flex justify-content-between mb-10">
        <span className="font-sm color-text-paragraph-2">Previous Rejections</span>
        <strong>1</strong>
      </div>

    </div>
  </div>
</div>
                   {/* Quick Insights */}
<div className="section-box">
  <div className="panel-white">
    <div className="panel-head">
      <h6 className="mb-0" style={{
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '0.6px',
        color: '#66789C',
      }}>
        Quick Insights
      </h6>
    </div>

    <div className="panel-body">

      {/* Registered */}
      <div className="card-style-1 hover-up mb-15">
        <div className="card-image">
          <Calendar size={24} strokeWidth={2.2} />
        </div>
        <div className="card-info">
          <p className="font-xs color-text-paragraph-2 mb-0"
            style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px' }}>
            Registered On
          </p>
          <div className="card-title mt-2">
            <h5 className="mb-0">Oct 2023</h5>
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div className="card-style-1 hover-up mb-15">
        <div className="card-image">
          <Briefcase size={24} strokeWidth={2.2} />
        </div>
        <div className="card-info">
          <p className="font-xs color-text-paragraph-2 mb-0"
            style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px' }}>
            Total Open Jobs
          </p>
          <div className="card-title mt-2">
            <h5 className="mb-0">
              42 <span className="font-xs status up">+5 this month</span>
            </h5>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="card-style-1 hover-up">
        <div className="card-image">
          <Wallet size={24} strokeWidth={2.2} />
        </div>
        <div className="card-info">
          <p className="font-xs color-text-paragraph-2 mb-0"
            style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px' }}>
            Current Credits
          </p>
          <div className="card-title mt-2">
            <h5 className="mb-0">12,500</h5>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

                    {/* Account Health */}
                    <div className="section-box">
                        <div className="panel-white">
                            <div className="panel-head">
                                <h6 className="mb-0" style={{
                                    textTransform: 'uppercase', fontSize: '11px',
                                    letterSpacing: '0.6px', color: '#66789C',
                                }}>Account Health</h6>
                            </div>
                            <div className="panel-body">
                                <div className="d-flex align-items-center justify-content-between mb-10">
                                    <span className="font-sm color-text-paragraph-2">Profile Completion</span>
                                    <strong className="font-sm color-brand-1">85%</strong>
                                </div>
                                <div className="box-progress-bar mb-10">
                                    <div className="progress">
                                        <div className="progress-bar bg-brand-2"
                                            role="progressbar"
                                            style={{ width: '85%', borderRadius: '5px', background: '#ffa300' }}>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-xs color-text-paragraph-2 mt-10 mb-0">
                                    "RPSL documentation needs re-upload as the previous file has reached its expiry date."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Primary Contact */}
                    <div className="section-box">
                        <div className="panel-white">
                            <div className="panel-head">
                                <h6 className="mb-0" style={{
                                    textTransform: 'uppercase', fontSize: '11px',
                                    letterSpacing: '0.6px', color: '#66789C',
                                }}>Primary Contact</h6>
                            </div>
                            <div className="panel-body text-center">
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    background: '#ffa300', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '18px', margin: '0 auto 10px',
                                }}>SJ</div>
                                <h6 className="mb-0">Sarah Jenkins</h6>
                                <p className="font-xs color-text-paragraph-2 mt-5 mb-20">HR Director</p>
                                <a className="btn btn-grey-big hover-up font-sm mb-10" href="#"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <i className="fi-rr-envelope"></i>Message HR
                                </a>
                                <a className="font-sm color-brand-2 hover-up" href="#">View All Team Members</a>
                            </div>
                        </div>
                    </div>

                </div>
                {/* end right sidebar */}

            </div>
{previewDoc && (
  <div
    onClick={() => setPreviewDoc(null)}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: '#fff',
        borderRadius: '10px',
        padding: '10px',
        maxWidth: '90%',
        maxHeight: '90%'
      }}
    >
      <img
        src={previewDoc.img}
        alt={previewDoc.title}
        style={{
          maxWidth: '100%',
          maxHeight: '80vh',
          borderRadius: '6px'
        }}
      />

      {/* TITLE */}
      <p style={{
        marginTop: '10px',
        fontWeight: 600,
        color: '#122359'
      }}>
        {previewDoc.title}
      </p>
    </div>
  </div>
)}
            <Footer />
        </>
    )
}