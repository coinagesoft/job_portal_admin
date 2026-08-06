'use client'

import { useState } from "react"
import Footer from "../../../../components/Footer"
import Link from "next/link"
import {
  Eye, X, MapPin, HardHat, Briefcase, CreditCard,
  CheckCircle2, Calendar, Mail, Phone, FileText,
  ShieldAlert, UserPlus, ShieldCheck, Ban
} from "lucide-react"

/* ─── Document Preview Modal (theme-matched) ─── */
function DocumentPreviewModal({ doc, onClose }) {
  if (!doc) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,20,50,0.72)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '16px', maxWidth: '720px', width: '100%',
          overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0',
        }}>
          <div>
            <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase',
              letterSpacing: '0.5px', fontWeight: 600, margin: 0 }}>{doc.subtitle}</p>
            <h6 style={{ margin: 0, color: '#122359', fontWeight: 700 }}>{doc.title}</h6>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={onClose} style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#f1f5f9', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={16} color="#475569" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div style={{ background: '#f8fafc', padding: '20px', maxHeight: '55vh', overflow: 'auto' }}>
          <img
            src={doc.url}
            alt={doc.title}
            style={{ width: '100%', borderRadius: '10px', border: '1px solid #e2e8f0' }}
          />
        </div>

        {/* Footer meta */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid #e2e8f0',
          display: 'flex', gap: '14px', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            <strong style={{ color: '#334155' }}>Uploaded:</strong> {doc.uploadedOn}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            <strong style={{ color: '#334155' }}>Doc ID:</strong> {doc.docId}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CandidateDetailsPage() {
  const [preview, setPreview] = useState(null)
  const [accountStatus, setAccountStatus] = useState("Active")

  const candidate = {
    tradeCategory: "Electrician",
    experience: "5 Years",
    location: "Mumbai, Maharashtra",
    availableForWork: true,
  }

  const documents = [
    {
      id: 1,
      title: 'Aadhaar Card',
      subtitle: 'Identity Document',
      uploadedOn: 'Oct 12, 2023',
      docId: 'AADHAAR-XXXX-1120',
      url: 'https://pvcprint.shop/wp-content/uploads/2025/04/aadhar-card-front.png'
    },
    {
      id: 2,
      title: 'ITI Certificate',
      subtitle: 'Education Certificate',
      uploadedOn: 'Oct 12, 2023',
      docId: 'ITI-CERT-4471',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTjV_NKW48YeqkUxUYHNN3mhKX-YybptO9Tg&s'
    },
    {
      id: 3,
      title: 'Resume',
      subtitle: 'Candidate Resume PDF',
      uploadedOn: 'Oct 18, 2023',
      docId: 'RESUME-AW-0092',
      url: 'https://via.placeholder.com/900x1200?text=Resume+Preview'
    },
    {
      id: 4,
      title: 'Police Clearance',
      subtitle: 'Background Check Document',
      uploadedOn: 'Oct 20, 2023',
      docId: 'PCC-2023-8834',
      url: 'https://via.placeholder.com/900x1200?text=Police+Clearance+Preview'
    }
  ]

  return (
    <>
      <div className="box-heading"> 
        <div className="box-title">
          <div className="d-flex align-items-center gap-2 mb-5">
            <h3 className="mb-0">Candidate Profile</h3>
            <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '11px', padding: '5px 10px', borderRadius: '12px' }}>
              View Only
            </span>
          </div>
          <p className="font-sm color-text-paragraph-2">
            Review candidate details, documents, billing records and verification status.
          </p>
        </div>

        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{border:"none" ,  backgroundColor:"revert"}}>
            <ul>
              <li><Link className="icon-home" href="/admin/dashboard">Admin</Link></li>
              <li><Link href="/admin/candidates">Candidates</Link></li>
              <li><span>Alexander Wright</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section-box mt-20">
        <div className="row">

          {/* LEFT PROFILE */}
          <div className="col-xl-4 col-lg-5">
            <div className="panel-white mb-20">
              <div className="box-padding text-center">

                <img
                  src="/assets/imgs/page/candidates/user1.png"
                  alt="candidate"
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />

                <div className="mt-15">
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 14px',
                      borderRadius: '20px',
                      display: 'inline-block',
                      background: accountStatus === 'Active' ? '#e8f5e9' : accountStatus === 'Suspended' ? '#fdecea' : '#fff3e0',
                      color: accountStatus === 'Active' ? '#2e7d32' : accountStatus === 'Suspended' ? '#c62828' : '#e65100',
                      border: accountStatus === 'Active' ? '1px solid #a5d6a7' : accountStatus === 'Suspended' ? '1px solid #ef9a9a' : '1px solid #ffcc80'
                    }}
                  >
                    {accountStatus === 'Suspended' ? 'Account Suspended' : 'Active Account'}
                  </span>
                </div>

                <p className="font-xs color-text-paragraph-2 mt-10 mb-5">
                  COMPLETENESS
                </p>

                <div className="progress mt-5" style={{ height: "8px", background: "#fdf1e0" }}>
                  <div
                    className="progress-bar"
                    style={{ width: "85%", background: "#ffa300" }}
                  ></div>
                </div>

                <p className="font-xs mt-5">85%</p>

                <h4 className="mt-20 mb-10">Alexander Wright</h4>

                <p className="font-sm color-text-paragraph-2 mb-5 d-flex align-items-center justify-content-center gap-2">
                  <Mail size={13} color="#66789C" /> a.wright@techflow.io
                </p>

                <p className="font-sm color-text-paragraph-2 mb-5 d-flex align-items-center justify-content-center gap-2">
                  <Phone size={13} color="#66789C" /> +91 98765 43210
                </p>

                <p className="font-sm color-text-paragraph-2 d-flex align-items-center justify-content-center gap-2">
                  <Calendar size={13} color="#66789C" /> Registered Oct 12, 2023
                </p>

              </div>
            </div>

            {/* Quick Stats */}
            <div className="row">
              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <HardHat size={12} color="#ffa300" /> TRADE CATEGORY
                    </p>
                    <h6>{candidate.tradeCategory}</h6>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <MapPin size={12} color="#ffa300" /> LOCATION
                    </p>
                    <h6>{candidate.location}</h6>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <Briefcase size={12} color="#ffa300" /> EXPERIENCE
                    </p>
                    <h6>{candidate.experience}</h6>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <CreditCard size={12} color="#ffa300" /> PAYMENT STATUS
                    </p>
                    <h6 className="color-success">Paid ₹100</h6>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <CheckCircle2 size={12} color="#ffa300" /> AVAILABILITY
                    </p>
                    <h6 style={{ color: candidate.availableForWork ? '#16a34a' : '#94a3b8' }}>
                      {candidate.availableForWork ? 'Available for Work' : 'Not Available'}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT CONTENT */}
          <div className="col-xl-8 col-lg-7">

            {/* Billing */}
            <div className="panel-white mb-20">
              <div className="box-padding">
                <div className="d-flex align-items-center gap-2 mb-20">
                  <CreditCard size={16} color="#ffa300" />
                  <h5 className="mb-0">Billing & Payments</h5>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>
                          <span style={{ fontWeight: 600, color: '#122359' }}>#TXN-99210-AW</span>
                        </td>
                        <td>
                          <span className="font-sm color-text-paragraph-2">Oct 12, 2023</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#122359' }}>₹100.00</span>
                        </td>
                        <td>
                          <span style={{
                            fontSize: '11px', fontWeight: 700, padding: '4px 12px',
                            borderRadius: '20px', background: '#e8f5e9', color: '#2e7d32',
                            border: '1px solid #a5d6a7', whiteSpace: 'nowrap',
                          }}>
                            Success
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* Documents */}
            <div className="panel-white mb-20">
              <div className="box-padding">
                <div className="d-flex align-items-start justify-content-between mb-20">
                  <div>
                    <h5 className="mb-5">Documents</h5>
                    <p className="font-sm color-text-paragraph-2 mb-0">
                      View uploaded candidate documents and preview them in a modal.
                    </p>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Document</th>
                        <th>Type</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <FileText size={15} color="#94a3b8" />
                              <strong>{doc.title}</strong>
                            </div>
                          </td>
                          <td>{doc.subtitle}</td>
                          <td className="text-end">
                            <button
                              onClick={() => setPreview(doc)}
                              title="Preview"
                              style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: '#fff3da', border: '1px solid #ffe0a6',
                                cursor: 'pointer', display: 'inline-flex',
                                alignItems: 'center', justifyContent: 'center',
                              }}
                            >
                              <Eye size={15} color="#a56600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Audit Log */}
            {/* <div className="panel-white mb-20">
              <div className="box-padding">
                <h5 className="mb-20">Audit Log</h5>

                <div style={{ position: 'relative' }}>
                  {[
                    {
                      icon: ShieldCheck,
                      iconColor: '#00695c',
                      iconBg: '#e0f2f1',
                      title: 'KYC Documents Uploaded',
                      meta: 'Oct 24, 14:32 · by System',
                    },
                    {
                      icon: ShieldAlert,
                      iconColor: '#b36b00',
                      iconBg: '#fff3e0',
                      title: 'Profile Flagged for Priority Review',
                      meta: 'Oct 23, 11:20 · by admin_sarah',
                    },
                    {
                      icon: UserPlus,
                      iconColor: '#122359',
                      iconBg: '#e8eaf6',
                      title: 'Account Registered',
                      meta: 'Oct 12, 09:15 · by System',
                    },
                  ].map((item, idx, arr) => (
                    <div key={item.title} className="d-flex" style={{ gap: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: '34px', height: '34px', borderRadius: '50%',
                          background: item.iconBg, display: 'flex',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <item.icon size={16} color={item.iconColor} />
                        </div>
                        {idx !== arr.length - 1 && (
                          <div style={{ width: '2px', flex: 1, background: '#e2e8f0', margin: '4px 0' }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: idx !== arr.length - 1 ? '20px' : 0 }}>
                        <p className="font-sm mb-0" style={{ fontWeight: 700, color: '#122359' }}>
                          {item.title}
                        </p>
                        <span className="font-xs color-text-paragraph-2">{item.meta}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <a href="#" className="font-sm mt-15 d-inline-block" style={{ color: '#ffa300', fontWeight: 600 }}>
                  View Full History
                </a>
              </div>
            </div> */}

            {/* Account Status Action */}
            <div className="panel-white">
              <div className="box-padding">
                <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: '14px' }}>
                  <div>
                    <p className="font-sm mb-5" style={{ fontWeight: 700, color: '#122359' }}>
                      Account Status
                    </p>
                    <p className="font-xs color-text-paragraph-2 mb-0">
                      {accountStatus === 'Suspended'
                        ? 'This account is currently suspended and cannot access the platform.'
                        : 'Suspending will immediately revoke this candidate\u2019s platform access.'}
                    </p>
                  </div>

                  {accountStatus === 'Suspended' ? (
                    <button
                      className="btn hover-up"
                      onClick={() => setAccountStatus('Active')}
                      style={{
                        background: '#f0fdf4',
                        color: '#16a34a',
                        border: '1px solid #bbf7d0',
                        borderRadius: '10px',
                        height: '42px',
                        padding: '0 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        flexShrink: 0,
                      }}
                    >
                      <ShieldCheck size={15} />
                      Activate Account
                    </button>
                  ) : (
                    <button
                      className="btn hover-up"
                      onClick={() => setAccountStatus('Suspended')}
                      style={{
                        background: '#ffa300',
                        color: '#fff',
                        border: '1px solid #ffa300',
                        borderRadius: '10px',
                        height: '42px',
                        padding: '0 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        flexShrink: 0,
                        boxShadow: '0 8px 16px rgba(255,163,0,0.25)',
                      }}
                    >
                      <Ban size={15} />
                      Suspend Account
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
      <DocumentPreviewModal doc={preview} onClose={() => setPreview(null)} />
    </>
  )
}