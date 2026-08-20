'use client'

import { useState, useEffect, use } from "react"
import Footer from "../../../../components/Footer"
import Link from "next/link"
import {
  Eye, X, MapPin, HardHat, Briefcase, CreditCard,
  CheckCircle2, Calendar, Mail, Phone, FileText,
  ShieldAlert, UserPlus, ShieldCheck, Ban
} from "lucide-react"
import { candidateService } from "../../../../services/candidateService"
import { createPortal } from "react-dom"

/* ─── Document Preview Modal (theme-matched) ─── */
function DocumentPreviewModal({ doc, onClose }) {
  if (!doc) return null

  const getDocUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const base = "https://jobportal.coinage.in";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  const resolvedUrl = getDocUrl(doc.url);
  const isPdf = doc.url && doc.url.toLowerCase().endsWith('.pdf');

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

        {/* Content Preview */}
        <div style={{ background: '#f8fafc', padding: '20px', maxHeight: '55vh', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
          {isPdf ? (
            <iframe
              src={resolvedUrl}
              style={{ width: '100%', height: '50vh', border: '1px solid #e2e8f0', borderRadius: '10px' }}
            />
          ) : (
            <img
              src={resolvedUrl}
              alt={doc.title}
              style={{ width: '100%', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
          )}
        </div>

        {/* Footer meta & Actions */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              <strong style={{ color: '#334155' }}>Uploaded:</strong> {doc.uploadedOn}
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              <strong style={{ color: '#334155' }}>Doc ID:</strong> {doc.docId}
            </span>
          </div>
          <div>
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#ffa300',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 10px rgba(255,163,0,0.2)'
              }}
            >
              Open / Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CandidateDetailsPage({ searchParams }) {
  const resolvedSearchParams = use(searchParams)
  const id = resolvedSearchParams?.id

  const [candidateData, setCandidateData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)
  const [accountStatus, setAccountStatus] = useState("Active")
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  const [mounted, setMounted] = useState(false)

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchCandidateDetails = (candidateId) => {
    setLoading(true)
    candidateService.getCandidateById(candidateId)
      .then((res) => {
        const data = res?.data || res
        setCandidateData(data)
        setAccountStatus(data?.accountStatus || data?.status || "Active")
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch candidate details:", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    let targetId = id
    if (!targetId && typeof window !== 'undefined') {
      const searchStr = window.location.search
      if (searchStr && searchStr.startsWith('?')) {
        const parts = searchStr.substring(1).split('&')
        if (parts[0] && !parts[0].includes('=')) {
          targetId = parts[0]
        } else {
          const params = new URLSearchParams(searchStr)
          targetId = params.get('id')
        }
      }
    }

    if (targetId && targetId !== 'undefined') {
      fetchCandidateDetails(targetId)
    } else {
      setLoading(false)
    }
  }, [id])

  const handleToggleStatus = () => {
    const newStatus = accountStatus === 'Suspended' ? 'Active' : 'Suspended'
    const reason = newStatus === 'Active' ? 'Activated by admin' : 'Suspended by admin'
    
    let targetId = id
    if ((!targetId || targetId === 'undefined') && candidateData) {
      targetId = candidateData.candidateId || candidateData.id
    }
    
    if (!targetId) return

    const candidateName = candidateData ? (candidateData.name || candidateData.fullName) : "Candidate";
 
    candidateService.updateAccountStatus(targetId, newStatus, reason)
      .then(() => {
        setAccountStatus(newStatus)
        fetchCandidateDetails(targetId)
        showToast(
          `Candidate "${candidateName}" has been successfully ${
            newStatus === 'Active' ? 'activated' : 'suspended'
          }!`,
          "success"
        );
      })
      .catch((err) => {
        showToast(err.message || `Failed to update account status to ${newStatus}`, "error")
      })
  }

  const getCandidateAvatar = (data) => {
    if (data && data.img) {
      if (data.img.startsWith("http://") || data.img.startsWith("https://")) {
        return data.img;
      }
      return `/assets/imgs/page/candidates/${data.img}`;
    }
    return "/assets/imgs/page/candidates/candidate-profile.png";
  };

  const defaultDocuments = [
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

  const documents = (candidateData?.documents && candidateData.documents.length > 0)
    ? candidateData.documents
    : defaultDocuments

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '15px' }}>
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 style={{ color: '#122359', fontWeight: 600 }}>Loading Candidate Profile...</h5>
      </div>
    )
  }

  if (!candidateData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '15px' }}>
        <h4 style={{ color: '#122359', fontWeight: 600 }}>Candidate Profile Not Found</h4>
        <Link href="/admin/candidates" className="btn hover-up" style={{ background: '#ffa300', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ffa300', fontWeight: 700 }}>
          Back to Candidates
        </Link>
      </div>
    )
  }

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
              <li><span>{candidateData.name || "Candidate"}</span></li>
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
                  src={getCandidateAvatar(candidateData)}
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
                    style={{ width: `${candidateData.completenessPct ?? candidateData.completeness ?? 0}%`, background: "#ffa300" }}
                  ></div>
                </div>

                <p className="font-xs mt-5">{candidateData.completenessPct ?? candidateData.completeness ?? 0}%</p>

                <h4 className="mt-20 mb-10">{candidateData.name || "N/A"}</h4>

                <p className="font-sm color-text-paragraph-2 mb-5 d-flex align-items-center justify-content-center gap-2">
                  <Mail size={13} color="#66789C" /> {candidateData.email || "No Email"}
                </p>

                <p className="font-sm color-text-paragraph-2 mb-5 d-flex align-items-center justify-content-center gap-2">
                  <Phone size={13} color="#66789C" /> {candidateData.phone || candidateData.mobile || "N/A"}
                </p>

                <p className="font-sm color-text-paragraph-2 d-flex align-items-center justify-content-center gap-2">
                  <Calendar size={13} color="#66789C" /> Registered {candidateData.registeredOn || candidateData.joined || "N/A"}
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
                    <h6>{candidateData.tradeCategory || candidateData.trade || "N/A"}</h6>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <MapPin size={12} color="#ffa300" /> LOCATION
                    </p>
                    <h6>{candidateData.location || "N/A"}</h6>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <Briefcase size={12} color="#ffa300" /> EXPERIENCE
                    </p>
                    <h6>{candidateData.experience || "N/A"}</h6>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <CreditCard size={12} color="#ffa300" /> PAYMENT STATUS
                    </p>
                    <h6 className={(candidateData.paymentStatus || "Paid") === 'Paid' ? 'color-success' : 'color-danger'}>
                      {candidateData.paymentStatus || "Paid"}
                    </h6>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="panel-white mb-20">
                  <div className="box-padding">
                    <p className="font-xs color-text-paragraph-2 mb-5 d-flex align-items-center gap-1">
                      <CheckCircle2 size={12} color="#ffa300" /> AVAILABILITY
                    </p>
                    <h6 style={{ color: (candidateData.availableForWork ?? true) ? '#16a34a' : '#94a3b8' }}>
                      {(candidateData.availableForWork ?? true) ? 'Available for Work' : 'Not Available'}
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
                      {(() => {
                        const txns = candidateData.billing || candidateData.transactions;
                        if (txns && txns.length > 0) {
                          return txns.map((txn, idx) => (
                            <tr key={txn.id || txn.txnId || idx}>
                              <td>
                                <span style={{ fontWeight: 600, color: '#122359' }}>{txn.id || txn.txnId || `TXN-${idx}`}</span>
                              </td>
                              <td>
                                <span className="font-sm color-text-paragraph-2">{txn.date || txn.uploadedOn || '—'}</span>
                              </td>
                              <td>
                                <span style={{ fontWeight: 700, color: '#122359' }}>{txn.amount || '—'}</span>
                              </td>
                              <td>
                                <span style={{
                                  fontSize: '11px', fontWeight: 700, padding: '4px 12px',
                                  borderRadius: '20px', background: txn.status === 'Success' || txn.status === 'Paid' ? '#e8f5e9' : '#fdecea',
                                  color: txn.status === 'Success' || txn.status === 'Paid' ? '#2e7d32' : '#c62828',
                                  border: txn.status === 'Success' || txn.status === 'Paid' ? '1px solid #a5d6a7' : '1px solid #ef9a9a',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {txn.status || 'Success'}
                                </span>
                              </td>
                            </tr>
                          ))
                        }
                        return (
                          <tr>
                            <td>
                              <span style={{ fontWeight: 600, color: '#122359' }}>#TXN-99210-AW</span>
                            </td>
                            <td>
                              <span className="font-sm color-text-paragraph-2">{candidateData.registeredOn || candidateData.joined || "Oct 12, 2023"}</span>
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
                        )
                      })()}
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
                      {documents.map((doc, idx) => (
                        <tr key={doc.docId || doc.id || idx}>
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
                      onClick={handleToggleStatus}
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
                      onClick={handleToggleStatus}
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

      {mounted && toast.show && createPortal(
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999999,
            background: "#fff",
            color: "#122359",
            borderLeft: toast.type === "success" ? "4px solid #2e7d32" : "4px solid #c62828",
            padding: "14px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(18, 35, 89, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 500,
            fontSize: "13px",
            borderTop: "1px solid #f1f5f9",
            borderRight: "1px solid #f1f5f9",
            borderBottom: "1px solid #f1f5f9",
            animation: "slideIn 0.3s ease-out"
          }}
        >
          <span style={{ 
            color: toast.type === "success" ? "#2e7d32" : "#c62828",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: toast.type === "success" ? "#e8f5e9" : "#fdecea"
          }}>
            {toast.type === "success" ? "✓" : "✗"}
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "8px",
              padding: 0,
              fontSize: "12px"
            }}
            onMouseEnter={(e) => e.target.style.color = "#122359"}
            onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
          >
            ✕
          </button>
        </div>,
        document.body
      )}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <Footer />
      <DocumentPreviewModal doc={preview} onClose={() => setPreview(null)} />
    </>
  )
}