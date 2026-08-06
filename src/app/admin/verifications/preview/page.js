'use client'
import { useState } from 'react'
import Footer from '../../../../components/Footer'
import { FileText, CheckCircle, Send, ChevronDown, X, Eye, ShieldCheck, ShieldX, RefreshCw } from 'lucide-react'

/* ─── Initial document data ─── */
const INITIAL_DOCS = [
  {
    id: 'gst', title: 'GST Registration Certificate', category: 'Tax & Compliance',
    status: 'Pending Review', uploadedOn: '15 Oct 2023', validTill: '31 Mar 2026',
    docId: 'GSTIN: 27AACS1234L1Z5',
    img: 'https://templates.invoicehome.com/gst-invoice-template-us-neat-750px.png',
  },
  {
    id: 'pan', title: 'Corporate PAN Card', category: 'Tax & Compliance',
    status: 'Pending Review', uploadedOn: '15 Oct 2023', validTill: 'Permanent',
    docId: 'PAN: AACS1234L',
    img: 'https://www.bankbazaar.com/tax/wp-content/uploads/sites/4/2015/09/pan-card-copy.jpg',
  },
  {
    id: 'brc', title: 'Business Registration Certificate', category: 'Company Documents',
    status: 'Pending Review', uploadedOn: '16 Oct 2023', validTill: 'Permanent',
    docId: 'CIN: U74900MH2019PTC...',
    img: 'https://imgv2-2-f.scribdassets.com/img/document/768783389/original/959dd3323c/1?v=1',
  },
  {
    id: 'poe', title: 'POE License', category: 'Recruitment License',
    status: 'Pending Review', uploadedOn: '17 Oct 2023', validTill: '14 Oct 2025',
    docId: 'POE-MUM-3391',
    img: 'https://i.pinimg.com/736x/bc/de/87/bcde87c193ed3acbd43d0e73f1e02ed8.jpg',
  },
  {
    id: 'rpsl', title: 'RPSL Certification', category: 'Recruitment License',
    status: 'Action Required', uploadedOn: '17 Oct 2023', validTill: '15 Jan 2023',
    docId: 'RPSL-MUM-442',
    img: 'https://vigilss.com/wp-content/uploads/2023/07/RPSL-LIC-1-768x723.png',
    note: 'Document expired. Please re-upload a valid RPSL certificate.',
  },
  {
    id: 'moa', title: 'Memorandum of Association', category: 'Company Documents',
    status: 'Pending Review', uploadedOn: '18 Oct 2023', validTill: '-',
    docId: 'MOA-SL-2019',
    img: 'https://templates.invoicehome.com/gst-invoice-template-us-neat-750px.png',
  },
]

const REQUEST_OPTIONS = [
  'Incorporation Certificate', 'Bank Cancelled Cheque', 'Address Proof / Utility Bill',
  'Director Aadhaar / PAN (KYC)', 'Labour License', 'Trade License',
  'ISO Certification', 'Letter of Authorization', 'Audited Financial Statements', 'Custom / Other Document',
]

const STATUS_STYLE = {
  'Verified': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Pending Review': { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  'Action Required': { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
  'Rejected': { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
  'Resubmission': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
}

/* ─── Verify Confirm Modal ─── */
function VerifyModal({ doc, onClose, onConfirm }) {
  if (!doc) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(10,20,50,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '16px', maxWidth: '440px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase',
              letterSpacing: '0.5px', fontWeight: 600, margin: 0
            }}>Verify Document</p>
            <h6 style={{ margin: 0, color: '#122359', fontWeight: 700 }}>{doc.title}</h6>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#f1f5f9', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={16} color="#475569" />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '18px 22px' }}>
          <div style={{
            padding: '12px 14px', borderRadius: '10px',
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
          }}>
            <ShieldCheck size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '12px', color: '#166534', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
              This will mark <strong>{doc.title}</strong> as verified. The recruiter's profile
              will reflect this document as approved. Are you sure you want to continue?
            </p>
          </div>
        </div>
        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid #f1f5f9',
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer',
          }}>Cancel</button>
          <button
            onClick={() => { onConfirm(doc.id); onClose() }}
            style={{
              padding: '10px 20px', background: '#16a34a', color: '#fff',
              border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          ><ShieldCheck size={14} /> Confirm Verification</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Resubmission Request Modal ─── */
function ResubmitModal({ doc, onClose, onConfirm }) {
  const [message, setMessage] = useState('')
  if (!doc) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(10,20,50,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '16px', maxWidth: '480px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase',
              letterSpacing: '0.5px', fontWeight: 600, margin: 0
            }}>Request Resubmission</p>
            <h6 style={{ margin: 0, color: '#122359', fontWeight: 700 }}>{doc.title}</h6>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#f1f5f9', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={16} color="#475569" />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '18px 22px' }}>
          <div style={{
            padding: '12px 14px', borderRadius: '10px',
            background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '16px',
          }}>
            <p style={{ fontSize: '12px', color: '#1d4ed8', margin: 0, fontWeight: 500 }}>
              The recruiter will be notified and asked to re-upload this document.
            </p>
          </div>
          <label style={{
            fontSize: '11px', fontWeight: 700, color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px',
          }}>
            Message to Recruiter <span style={{ color: '#1d4ed8' }}>*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="E.g. Please re-upload a clearer scan / the correct document version..."
            style={{
              width: '100%', minHeight: '100px', resize: 'vertical',
              borderRadius: '10px', border: '1.5px solid #e2e8f0',
              padding: '10px 12px', fontSize: '13px', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid #f1f5f9',
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer',
          }}>Cancel</button>
          <button
            onClick={() => { if (message.trim()) { onConfirm(doc.id, message); onClose() } }}
            disabled={!message.trim()}
            style={{
              padding: '10px 20px',
              background: message.trim() ? '#1d4ed8' : '#e2e8f0',
              color: message.trim() ? '#fff' : '#94a3b8',
              border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
              cursor: message.trim() ? 'pointer' : 'not-allowed',
            }}
          >Confirm Request</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Reject Reason Modal ─── */
function RejectModal({ doc, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  if (!doc) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(10,20,50,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '16px', maxWidth: '480px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase',
              letterSpacing: '0.5px', fontWeight: 600, margin: 0
            }}>Reject Document</p>
            <h6 style={{ margin: 0, color: '#122359', fontWeight: 700 }}>{doc.title}</h6>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#f1f5f9', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={16} color="#475569" />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '18px 22px' }}>
          <div style={{
            padding: '12px 14px', borderRadius: '10px',
            background: '#fff1f2', border: '1px solid #fecdd3', marginBottom: '16px',
          }}>
            <p style={{ fontSize: '12px', color: '#be123c', margin: 0, fontWeight: 500 }}>
              The recruiter will be notified and asked to re-upload a corrected document.
            </p>
          </div>
          <label style={{
            fontSize: '11px', fontWeight: 700, color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px',
          }}>
            Rejection Reason <span style={{ color: '#be123c' }}>*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g. Document is expired / unclear / incorrect format. Please re-upload a valid copy..."
            style={{
              width: '100%', minHeight: '100px', resize: 'vertical',
              borderRadius: '10px', border: '1.5px solid #e2e8f0',
              padding: '10px 12px', fontSize: '13px', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid #f1f5f9',
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer',
          }}>Cancel</button>
          <button
            onClick={() => { if (reason.trim()) { onConfirm(doc.id, reason); onClose() } }}
            disabled={!reason.trim()}
            style={{
              padding: '10px 20px',
              background: reason.trim() ? '#be123c' : '#e2e8f0',
              color: reason.trim() ? '#fff' : '#94a3b8',
              border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
              cursor: reason.trim() ? 'pointer' : 'not-allowed',
            }}
          >Confirm Rejection</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Document Preview Modal ─── */
function PreviewModal({ doc, onClose, onVerifyOpen, onRejectOpen, onResubmitOpen }) {
  if (!doc) return null
  const s = STATUS_STYLE[doc.status] || STATUS_STYLE['Pending Review']
  const isVerified = doc.status === 'Verified'
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,20,50,0.72)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '16px', maxWidth: '720px', width: '100%',
        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0',
        }}>
          <div>
            <p style={{
              fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase',
              letterSpacing: '0.5px', fontWeight: 600, margin: 0
            }}>{doc.category}</p>
            <h6 style={{ margin: 0, color: '#122359', fontWeight: 700 }}>{doc.title}</h6>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '4px 12px',
              borderRadius: '20px', background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            }}>{doc.status}</span>
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
          <img src={doc.img} alt={doc.title}
            style={{ width: '100%', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
        </div>
        {/* Footer with action buttons */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid #e2e8f0',
          display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              <strong style={{ color: '#334155' }}>Doc ID:</strong> {doc.docId}
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              <strong style={{ color: '#334155' }}>Valid Till:</strong> {doc.validTill}
            </span>
          </div>
          {!isVerified ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => { onResubmitOpen(doc); onClose() }} style={{
                padding: '9px 14px', background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                color: '#1d4ed8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <RefreshCw size={12} /> Request Resubmission
              </button>
              <button onClick={() => { onRejectOpen(doc); onClose() }} style={{
                padding: '9px 14px', background: '#fff1f2', border: '1px solid #fecdd3',
                borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                color: '#be123c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <ShieldX size={12} /> Reject
              </button>
              <button onClick={() => { onVerifyOpen(doc); onClose() }} style={{
                padding: '9px 16px', background: '#16a34a', border: 'none',
                borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <ShieldCheck size={12} /> Verify Document
              </button>
            </div>
          ) : (
            <span style={{
              fontSize: '12px', fontWeight: 700, color: '#16a34a',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              <ShieldCheck size={14} /> Verified by Admin
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Document Card ─── */
function DocCard({ doc, onPreview, onVerifyOpen, onRejectOpen, onResubmitOpen }) {
  const s = STATUS_STYLE[doc.status] || STATUS_STYLE['Pending Review']
  const isVerified = doc.status === 'Verified'
  return (
    <div style={{
      background: '#fff', border: `1.5px solid ${s.border}`, borderRadius: '14px',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: isVerified ? '0 2px 12px rgba(22,163,74,0.1)' : '0 2px 10px rgba(0,0,0,0.05)',
    }}>
      {/* Thumbnail */}
      <div style={{ height: '148px', background: '#f1f5f9', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
        onClick={() => onPreview(doc)}>
        <img src={doc.img} alt={doc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* Status badge */}
        <span style={{
          position: 'absolute', top: '10px', right: '10px',
          fontSize: '10px', fontWeight: 700, padding: '3px 9px',
          borderRadius: '20px', background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        }}>{doc.status}</span>
        {/* Verified overlay */}
        {isVerified && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(22,163,74,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '50%', background: '#16a34a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(22,163,74,0.4)',
            }}>
              <ShieldCheck size={26} color="#fff" />
            </div>
          </div>
        )}
        {/* Preview overlay (non-verified) */}
        {!isVerified && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(18,35,89,0.32)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9,
            }}>
              <Eye size={16} color="#122359" />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <p style={{
          fontSize: '10px', color: '#94a3b8', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0
        }}>{doc.category}</p>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#122359', margin: 0, lineHeight: 1.3 }}>{doc.title}</p>
        <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{doc.docId}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
            <strong style={{ color: '#475569' }}>Uploaded:</strong> {doc.uploadedOn}
          </span>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
            <strong style={{ color: '#475569' }}>Valid:</strong> {doc.validTill}
          </span>
        </div>
        {doc.rejectReason && (
          <div style={{ marginTop: '6px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', padding: '6px 10px' }}>
            <p style={{ fontSize: '10px', color: '#be123c', margin: 0, lineHeight: 1.4 }}>
              <strong>Rejected:</strong> {doc.rejectReason}
            </p>
          </div>
        )}
        {doc.status === 'Resubmission' && doc.resubmitNote && (
          <div style={{ marginTop: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '6px 10px' }}>
            <p style={{ fontSize: '10px', color: '#1d4ed8', margin: 0, lineHeight: 1.4 }}>
              <strong>Resubmission requested:</strong> {doc.resubmitNote}
            </p>
          </div>
        )}
        {doc.note && !doc.rejectReason && (
          <div style={{ marginTop: '6px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '6px 10px' }}>
            <p style={{ fontSize: '10px', color: '#b45309', margin: 0, lineHeight: 1.4 }}>{doc.note}</p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {!isVerified ? (
            <>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => onRejectOpen(doc)} style={{
                  flex: 1, padding: '7px 0', background: '#fff1f2', border: '1px solid #fecdd3',
                  borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#be123c', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                }}>
                  <ShieldX size={12} /> Reject
                </button>
                <button onClick={() => onVerifyOpen(doc)} style={{
                  flex: 1, padding: '7px 0', background: '#16a34a', border: 'none',
                  borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                }}>
                  <ShieldCheck size={12} /> Verify
                </button>
              </div>
              <button onClick={() => onResubmitOpen(doc)} style={{
                width: '100%', padding: '6px 0', background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#1d4ed8', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}>
                <RefreshCw size={11} /> Request Resubmission
              </button>
            </>
          ) : (
            <div style={{
              padding: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '8px', textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
            }}>
              <ShieldCheck size={13} color="#16a34a" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>Verified by Admin</span>
            </div>
          )}
          {/* <button onClick={() => onPreview(doc)} style={{
            width: '100%', padding: '6px 0', background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
            <Eye size={12} /> Preview Document
          </button> */}
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function RecruiterDocumentsPage() {
  const [docs, setDocs] = useState(INITIAL_DOCS)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [verifyTarget, setVerifyTarget] = useState(null)
  const [resubmitTarget, setResubmitTarget] = useState(null)
  const [requestedDocs, setRequestedDocs] = useState([])
  const [selectedDocType, setSelectedDocType] = useState('')
  const [requestNote, setRequestNote] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const handleVerify = (id) => {
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, status: 'Verified', rejectReason: null } : d))
    showToast('Document verified successfully', 'success')
  }

  const handleReject = (id, reason) => {
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, status: 'Action Required', rejectReason: reason } : d))
    showToast('Document rejected — recruiter notified', 'error')
  }

  const handleResubmit = (id, message) => {
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, status: 'Resubmission', rejectReason: null, resubmitNote: message } : d))
    showToast('Resubmission request sent to recruiter', 'info')
  }

  const handleSendRequest = () => {
    if (!selectedDocType) return
    setRequestedDocs((prev) => [{
      id: Date.now(), docType: selectedDocType, note: requestNote,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }, ...prev])
    showToast(`Request sent: ${selectedDocType}`, 'info')
    setSelectedDocType('')
    setRequestNote('')
  }

  const verified = docs.filter((d) => d.status === 'Verified').length
  const pending = docs.filter((d) => d.status === 'Pending Review').length
  const actionReq = docs.filter((d) => d.status === 'Action Required' || d.status === 'Resubmission').length
  const allVerified = verified === docs.length
  const pct = Math.round((verified / docs.length) * 100)

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 99999,
          padding: '12px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '13px',
          background: toast.type === 'success' ? '#16a34a' : toast.type === 'error' ? '#be123c' : '#1d4ed8',
          color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideIn 0.2s ease',
        }}>
          {toast.type === 'success' && <ShieldCheck size={16} />}
          {toast.type === 'error' && <ShieldX size={16} />}
          {toast.type === 'info' && <Send size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      <VerifyModal doc={verifyTarget} onClose={() => setVerifyTarget(null)} onConfirm={handleVerify} />
      <RejectModal doc={rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={handleReject} />
      <ResubmitModal doc={resubmitTarget} onClose={() => setResubmitTarget(null)} onConfirm={handleResubmit} />
      <PreviewModal
        doc={previewDoc} onClose={() => setPreviewDoc(null)}
        onVerifyOpen={(d) => { setPreviewDoc(null); setVerifyTarget(d) }}
        onRejectOpen={(d) => { setPreviewDoc(null); setRejectTarget(d) }}
        onResubmitOpen={(d) => { setPreviewDoc(null); setResubmitTarget(d) }}
      />

      {/* PAGE HEADING */}
      <div className="box-heading justify-content-between mb-3">
        <div className="box-title d-flex align-items-center" style={{ gap: '10px' }}>
          <h3 className="mb-0">Recruiter Documents</h3>
          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
            background: allVerified ? '#f0fdf4' : '#fffbeb',
            color: allVerified ? '#16a34a' : '#b45309',
            border: `1px solid ${allVerified ? '#bbf7d0' : '#fde68a'}`,
          }}>
            {allVerified ? '✓ All Verified' : 'Pending Review'}
          </span>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: 'none', backgroundColor: 'revert' }}>
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><a href="/admin/recruiters">Recruiters</a></li>
              <li><span>Documents — Stellar Logistics Pvt. Ltd.</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* COMPANY + STATS STRIP */}
      <div className="section-box mb-4">
        <div className="panel-white" style={{ padding: '16px 20px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '10px', background: '#ffa300',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '16px', flexShrink: 0,
              }}>SL</div>
              <div>
                <h6 className="mb-0" style={{ color: '#122359' }}>Stellar Logistics Pvt. Ltd.</h6>
                <p className="font-xs color-text-paragraph-2 mb-0">
                  GSTIN: 27AACS1234L1Z5 &nbsp;·&nbsp; Registered: Oct 2023 &nbsp;·&nbsp; Mumbai, India
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center" style={{ gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: 'Verified', val: verified, bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
                { label: 'Pending', val: pending, bg: '#fffbeb', border: '#fde68a', color: '#b45309' },
                { label: 'Action Req.', val: actionReq, bg: '#fff1f2', border: '#fecdd3', color: '#be123c' },
                { label: 'Total', val: docs.length, bg: '#f0f4ff', border: '#c7d2fe', color: '#3730a3' },
              ].map(({ label, val, bg, border, color }) => (
                <div key={label} style={{
                  padding: '8px 14px', borderRadius: '10px', background: bg,
                  border: `1px solid ${border}`, textAlign: 'center', transition: 'all 0.3s',
                }}>
                  <p style={{
                    fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase',
                    fontWeight: 600, letterSpacing: '0.5px', margin: '0 0 2px'
                  }}>{label}</p>
                  <span style={{ fontSize: '20px', fontWeight: 800, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="row">

        {/* LEFT — Document Cards */}
        <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: 'center' }}>
                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                  <FileText size={16} color="#ffa300" />
                  <h6 className="mb-0">Uploaded Documents</h6>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, padding: '2px 9px',
                    borderRadius: '20px', background: '#f1f5f9', color: '#475569',
                  }}>{docs.length} files</span>
                </div>
                <p className="font-xs color-text-paragraph-2 mb-0">
                  Preview each document and take action — Verify ✓, Reject ✗, or Request Resubmission ↺
                </p>
              </div>
              <div className="panel-body">
                <div className="row">
                  {docs.map((doc) => (
                    <div key={doc.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-20">
                      <DocCard
                        doc={doc} onPreview={setPreviewDoc}
                        onVerifyOpen={setVerifyTarget} onRejectOpen={setRejectTarget} onResubmitOpen={setResubmitTarget}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sent Requests */}
          {requestedDocs.length > 0 && (
            <div className="section-box">
              <div className="panel-white">
                <div className="panel-head" style={{ alignItems: 'center' }}>
                  <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                    <Send size={15} color="#1d4ed8" />
                    <h6 className="mb-0">Document Requests Sent</h6>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 9px',
                      borderRadius: '20px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe',
                    }}>{requestedDocs.length} pending</span>
                  </div>
                </div>
                <div className="panel-body">
                  {requestedDocs.map((req) => (
                    <div key={req.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '14px',
                      padding: '14px', marginBottom: '10px',
                      background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px',
                    }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '8px', background: '#dbeafe',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Send size={15} color="#1d4ed8" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '4px' }}>
                          <p className="font-sm mb-0" style={{ fontWeight: 700, color: '#122359' }}>{req.docType}</p>
                          <span style={{
                            fontSize: '10px', fontWeight: 700, padding: '2px 9px',
                            borderRadius: '20px', background: '#fff', color: '#1d4ed8', border: '1px solid #bfdbfe',
                          }}>Requested · {req.sentAt}</span>
                        </div>
                        {req.note && (
                          <p className="font-xs color-text-paragraph-2 mb-0 mt-5">Note: {req.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">

          {/* Admin Verification Summary */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                  <ShieldCheck size={15} color="#ffa300" />
                  <h6 className="mb-0">Admin Verification</h6>
                </div>
              </div>
              <div className="panel-body">
                <div style={{
                  padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
                  border: `1px solid ${allVerified ? '#bbf7d0' : '#e2e8f0'}`,
                }}>
                  <p style={{ fontSize: '38px', fontWeight: 800, color: '#122359', margin: 0, lineHeight: 1 }}>
                    {verified}<span style={{ fontSize: '20px', color: '#94a3b8' }}>/{docs.length}</span>
                  </p>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0 10px', fontWeight: 600 }}>
                    Documents Verified
                  </p>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: allVerified ? '#16a34a' : '#ffa300',
                      borderRadius: '5px', transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <p style={{
                    fontSize: '12px', fontWeight: 700, margin: '6px 0 0',
                    color: allVerified ? '#16a34a' : '#b45309'
                  }}>
                    {pct}% Complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Additional Document */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                    <Send size={15} color="#ffa300" />
                    <h6 className="mb-0">Request Additional Document</h6>
                  </div>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    Ask the recruiter to upload a missing document
                  </p>
                </div>
              </div>
              <div className="panel-body">
                <div className="form-group mb-15">
                  <label style={{
                    fontSize: '9px', fontWeight: 700, color: '#475569',
                    textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px'
                  }}>
                    Document Type
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 42px 0 14px',

                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#334155',
                        lineHeight: '44px',

                        background: '#fff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',

                        outline: 'none',
                        boxShadow: 'none',

                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',

                        boxSizing: 'border-box',
                        cursor: 'pointer',

                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ffa300';
                        e.target.style.boxShadow = '0 0 0 3px rgba(255,163,0,.12)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select document to request</option>

                      {REQUEST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      color="#94a3b8"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '14px',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
                <div className="form-group mb-15">
                  <label style={{
                    fontSize: '9px', fontWeight: 700, color: '#475569',
                    textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px'
                  }}>
                    Message <span style={{ color: '#94a3b8', textTransform: 'none', fontSize: '11px' }}>(optional)</span>
                  </label>
                  <textarea className="form-control font-sm"
                    placeholder="Explain why this document is needed..."
                    value={requestNote} onChange={(e) => setRequestNote(e.target.value)}
                    style={{ minHeight: '80px', resize: 'vertical', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
                </div>
                <button onClick={handleSendRequest} disabled={!selectedDocType} style={{
                  width: '100%', padding: '11px 0',
                  background: selectedDocType ? '#122359' : '#e2e8f0',
                  color: selectedDocType ? '#fff' : '#94a3b8',
                  border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                  cursor: selectedDocType ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                }}>
                  <Send size={14} /> Send Document Request
                </button>
                {requestedDocs.length > 0 && (
                  <p className="font-xs color-text-paragraph-2 mt-10 mb-0 text-center">
                    <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{requestedDocs.length}</span> request{requestedDocs.length > 1 ? 's' : ''} sent
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                  <CheckCircle size={15} color="#ffa300" />
                  <h6 className="mb-0">Document Checklist</h6>
                </div>
              </div>
              <div className="panel-body">
                {docs.map((doc) => {
                  const s = STATUS_STYLE[doc.status] || STATUS_STYLE['Pending Review']
                  return (
                    <div key={doc.id} className="d-flex align-items-center justify-content-between mb-10">
                      <span className="font-sm" style={{ color: '#334155', fontWeight: 500 }}>{doc.title}</span>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                        borderRadius: '20px', background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                        whiteSpace: 'nowrap', marginLeft: '8px', flexShrink: 0,
                      }}>{doc.status}</span>
                    </div>
                  )
                })}
                <hr style={{ borderColor: '#f1f5f9', margin: '12px 0' }} />
                <div className="d-flex align-items-center justify-content-between mb-5">
                  <span className="font-xs color-text-paragraph-2">Verification Progress</span>
                  <strong className="font-xs" style={{ color: '#122359' }}>{pct}%</strong>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: allVerified ? '#16a34a' : '#ffa300',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="section-box">
          <div className="panel-white" style={{ padding: '16px 20px' }}>
            <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p className="font-sm mb-0" style={{ fontWeight: 600, color: '#122359' }}>
                  Review Actions — Stellar Logistics Pvt. Ltd.
                </p>
                <p className="font-xs color-text-paragraph-2 mb-0">
                  {verified} of {docs.length} documents verified
                  {allVerified && <span style={{ color: '#16a34a', fontWeight: 700, marginLeft: '8px' }}>✓ Verification Complete</span>}
                </p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <a href="/admin/recruiters" className="btn hover-up font-sm" style={{
                  height: '44px', padding: '0 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  color: '#475569', borderRadius: '10px', fontWeight: 600,
                }}>
                  Back to Recruiters
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <Footer />
    </>
  )
}