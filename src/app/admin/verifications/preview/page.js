'use client';
import { useState, useEffect, use } from 'react';
import Footer from '../../../../components/Footer';
import { recruiterService } from '../../../../services/recruiterService';
import {
  FileText,
  CheckCircle,
  Send,
  ChevronDown,
  X,
  Eye,
  ShieldCheck,
  ShieldX,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

/* ─── Helper for URL formatting ─── */
const getDocUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const base = 'https://jobportal.coinage.in';
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
};

const STATUS_STYLE = {
  'Verified': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Pending Review': { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  'Action Required': { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
  'Rejected': { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
  'Resubmission': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
};

/* ─── Verify Confirm Modal ─── */
function VerifyModal({ doc, onClose, onConfirm }) {
  if (!doc) return null;
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
          display: 'flex', alignItems: 'center', justifycontent: 'space-between',
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
            <ShieldCheck size={18} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '12px', color: '#14532d', fontWeight: 600, margin: '0 0 4px' }}>
                Confirm Verification
              </p>
              <p style={{ fontSize: '11px', color: '#166534', margin: 0, lineHeight: 1.4 }}>
                This marks the document as verified. The recruiter will see this status in their dashboard.
              </p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'end', gap: '10px',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', background: '#f1f5f9', border: 'none',
            borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={() => { onConfirm(doc.documentId); onClose(); }} style={{
            padding: '8px 18px', background: '#16a34a', border: 'none',
            borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer',
          }}>Verify Document</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reject Modal ─── */
function RejectModal({ doc, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  if (!doc) return null;
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
          display: 'flex', alignItems: 'center', justifycontent: 'space-between',
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
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#122359', display: 'block', marginBottom: '8px' }}>
            Reason for Rejection
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. GST registration certificate copy is blurry and unreadable."
            style={{
              width: '100%', height: '100px', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #cbd5e1', fontSize: '12px', resize: 'none', color: '#122359'
            }}
          />
        </div>
        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'end', gap: '10px',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', background: '#f1f5f9', border: 'none',
            borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={() => { onConfirm(doc.documentId, reason); onClose(); }} style={{
            padding: '8px 18px', background: '#be123c', border: 'none',
            borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer',
          }}>Confirm Rejection</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Resubmit Modal ─── */
function ResubmitModal({ doc, onClose, onConfirm }) {
  const [note, setNote] = useState('');
  if (!doc) return null;
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
          display: 'flex', alignItems: 'center', justifycontent: 'space-between',
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
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#122359', display: 'block', marginBottom: '8px' }}>
            Instructions for Recruiter
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Please re-upload the latest certificate for current assessment."
            style={{
              width: '100%', height: '100px', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #cbd5e1', fontSize: '12px', resize: 'none', color: '#122359'
            }}
          />
        </div>
        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'end', gap: '10px',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', background: '#f1f5f9', border: 'none',
            borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={() => { onConfirm(doc.documentId, note); onClose(); }} style={{
            padding: '8px 18px', background: '#1d4ed8', border: 'none',
            borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer',
          }}>Request Resubmit</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Preview Modal with PDF and Image support ─── */
function PreviewModal({ doc, onClose, onVerifyOpen, onRejectOpen, onResubmitOpen }) {
  if (!doc) return null;
  const s = STATUS_STYLE[doc.status] || STATUS_STYLE['Pending Review'];
  const isVerified = doc.status === 'Verified';
  const resolvedUrl = getDocUrl(doc.img);
  const isPdf = doc.img && doc.img.toLowerCase().endsWith('.pdf');

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
        {/* Content Viewer (dynamic PDF/Image) */}
        <div style={{ background: '#f8fafc', padding: '20px', maxHeight: '55vh', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
          {doc.img ? (
            isPdf ? (
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
            )
          ) : (
            <div style={{ padding: '40px', color: '#122359', fontWeight: 600 }}>
              No Preview Available
            </div>
          )}
        </div>
        {/* Footer with action buttons */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid #e2e8f0',
          display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              <strong style={{ color: '#334155' }}>Required Type:</strong> {doc.docId}
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              <strong style={{ color: '#334155' }}>Uploaded:</strong> {doc.uploadedOn}
            </span>
          </div>
          {!isVerified ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => { onResubmitOpen(doc); onClose(); }} style={{
                padding: '9px 14px', background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                color: '#1d4ed8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <RefreshCw size={12} /> Request Resubmission
              </button>
              <button onClick={() => { onRejectOpen(doc); onClose(); }} style={{
                padding: '9px 14px', background: '#fff1f2', border: '1px solid #fecdd3',
                borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                color: '#be123c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <ShieldX size={12} /> Reject
              </button>
              <button onClick={() => { onVerifyOpen(doc); onClose(); }} style={{
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
  );
}

/* ─── Document Card Component ─── */
function DocCard({ doc, onPreview, onVerifyOpen, onRejectOpen, onResubmitOpen, onRequestDocument }) {
  if (doc.isMissing) {
    return (
      <div style={{
        background: '#f8fafc', border: `1.5px dashed #cbd5e1`, borderRadius: '14px',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
        minHeight: '290px', boxShadow: 'none'
      }}>
        {/* Empty preview area */}
        <div style={{
          height: '148px', background: '#e2e8f0', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px'
        }}>
          <AlertCircle size={32} color="#94a3b8" />
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '3px 9px',
            borderRadius: '20px', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3'
          }}>Missing / Required</span>
        </div>
        
        {/* Body */}
        <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{
            fontSize: '10px', color: '#94a3b8', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0
          }}>{doc.category}</p>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#122359', margin: 0, lineHeight: 1.3 }}>{doc.title}</p>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Not Uploaded by Recruiter</p>
          
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button onClick={() => onRequestDocument(doc.title)} style={{
              width: '100%', padding: '8px 0', background: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#1d4ed8', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            }}>
              <Send size={12} /> Request Document
            </button>
          </div>
        </div>
      </div>
    );
  }

  const s = STATUS_STYLE[doc.status] || STATUS_STYLE['Pending Review'];
  const isVerified = doc.status === 'Verified';
  const resolvedUrl = getDocUrl(doc.img);
  const isPdf = doc.img && doc.img.toLowerCase().endsWith('.pdf');

  return (
    <div style={{
      background: '#fff', border: `1.5px solid ${s.border}`, borderRadius: '14px',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: isVerified ? '0 2px 12px rgba(22,163,74,0.1)' : '0 2px 10px rgba(0,0,0,0.05)',
    }}>
      {/* Thumbnail */}
      <div style={{ height: '148px', background: '#f1f5f9', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
        onClick={() => onPreview(doc)}>
        {doc.img ? (
          isPdf ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', gap: '8px', flexDirection: 'column' }}>
              <FileText size={40} color="#e11d48" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>PDF Certificate</span>
            </div>
          ) : (
            <img src={resolvedUrl} alt={doc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
            <FileText size={32} color="#94a3b8" />
          </div>
        )}
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
                width: '100%', padding: '7px 0', background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#1d4ed8', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}>
                <RefreshCw size={12} /> Request Resubmission
              </button>
            </>
          ) : (
            <div style={{
              width: '100%', padding: '8px 0', background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#16a34a',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            }}>
              <ShieldCheck size={12} /> Verified by Admin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function RecruiterDocumentsPage({ searchParams }) {
  const resolvedSearchParams = use(searchParams);
  const recruiterId = resolvedSearchParams?.id;

  const [recruiterData, setRecruiterData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [docs, setDocs] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [resubmitTarget, setResubmitTarget] = useState(null);
  const [requestedDocs, setRequestedDocs] = useState([]);
  const [optionalDocs, setOptionalDocs] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [customDocName, setCustomDocName] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const processDocuments = (checklistData, docsData) => {
    const statusMap = {
      NotUploaded: 'Not Uploaded',
      Pending: 'Pending Review',
      Verified: 'Verified',
      Approved: 'Verified',
      Rejected: 'Action Required',
    };

    if (checklistData && checklistData.length > 0) {
      const merged = checklistData.map((chkDoc) => {
        const uploadedDoc = docsData.find(
          (d) => 
            (d.documentId && d.documentId !== "00000000-0000-0000-0000-000000000000" && d.documentId === chkDoc.documentId) ||
            (d.documentTypeId && d.documentTypeId === chkDoc.documentTypeId)
        );
        
        const docUrl = uploadedDoc?.fileUrl || uploadedDoc?.url || uploadedDoc?.documentUrl || chkDoc.url || chkDoc.fileUrl || null;
        const status = uploadedDoc?.status || chkDoc.status || 'NotUploaded';
        const docId = (uploadedDoc?.documentId && uploadedDoc.documentId !== "00000000-0000-0000-0000-000000000000") ? uploadedDoc.documentId : chkDoc.documentId;
        
        return {
          id: docId && docId !== "00000000-0000-0000-0000-000000000000" ? docId : chkDoc.documentTypeId,
          documentId: docId,
          documentTypeId: chkDoc.documentTypeId,
          title: chkDoc.documentName,
          category: chkDoc.category || 'Company Documents',
          status: statusMap[status] || status || 'Not Uploaded',
          isMissing: status === 'NotUploaded',
          uploadedOn: (uploadedDoc?.uploadedAt || chkDoc.uploadedAt) && (uploadedDoc?.uploadedAt || chkDoc.uploadedAt) !== '0001-01-01T00:00:00' ? new Date(uploadedDoc?.uploadedAt || chkDoc.uploadedAt).toLocaleDateString() : 'N/A',
          validTill: (uploadedDoc?.verifiedAt || chkDoc.verifiedAt) && (uploadedDoc?.verifiedAt || chkDoc.verifiedAt) !== '0001-01-01T00:00:00' ? new Date(uploadedDoc?.verifiedAt || chkDoc.verifiedAt).toLocaleDateString() : 'Permanent',
          docId: chkDoc.isMandatory ? 'Mandatory' : 'Optional',
          img: docUrl,
        };
      });
      setDocs(merged);
    } else {
      // Fallback: use docsData directly
      const mapped = docsData.map((doc) => {
        const status = doc.status || 'Pending';
        const uiStatus = statusMap[status] || status || 'Pending Review';
        return {
          id: doc.documentId || doc.id || doc.documentTypeId,
          documentId: doc.documentId || doc.id,
          documentTypeId: doc.documentTypeId,
          title: doc.documentName || doc.title || 'Document',
          category: doc.category || 'Company Documents',
          status: uiStatus,
          isMissing: uiStatus === 'Not Uploaded',
          uploadedOn: doc.uploadedAt && doc.uploadedAt !== '0001-01-01T00:00:00' ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A',
          validTill: doc.verifiedAt && doc.verifiedAt !== '0001-01-01T00:00:00' ? new Date(doc.verifiedAt).toLocaleDateString() : 'Permanent',
          docId: doc.isMandatory ? 'Mandatory' : 'Optional',
          img: doc.fileUrl || doc.url || doc.documentUrl || null,
        };
      });
      setDocs(mapped);
    }
  };

  const fetchData = (recId) => {
    setLoading(true);
    // 1. Fetch Recruiter Profile
    recruiterService.getRecruiterById(recId)
      .then((res) => {
        if (res && res.success && res.data) {
          setRecruiterData(res.data);
        } else if (res && res.data) {
          setRecruiterData(res.data);
        } else {
          setRecruiterData(res);
        }
      })
      .catch(console.error);

    // 2. Fetch Checklist and merge with uploaded documents
    recruiterService.getRecruiterDocumentChecklist(recId)
      .then((checklistRes) => {
        const checklistData = checklistRes?.data?.documents || checklistRes?.documents || [];
        
        recruiterService.getRecruiterDocuments(recId)
          .then((docsRes) => {
            const docsData = docsRes?.data?.documents || docsRes?.documents || [];
            processDocuments(checklistData, docsData);
            setLoading(false);
          })
          .catch((docsErr) => {
            console.error("Failed to fetch uploaded documents:", docsErr);
            processDocuments(checklistData, []);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.warn("Failed checklist fetch, falling back to uploaded documents:", err);
        recruiterService.getRecruiterDocuments(recId)
          .then((docsRes) => {
            const docsData = docsRes?.data?.documents || docsRes?.documents || [];
            processDocuments([], docsData);
            setLoading(false);
          })
          .catch((docsErr) => {
            console.error("Failed to fetch documents completely:", docsErr);
            setLoading(false);
          });
      });
  };

  useEffect(() => {
    let targetId = recruiterId;
    if (!targetId && typeof window !== 'undefined') {
      const searchStr = window.location.search;
      if (searchStr && searchStr.startsWith('?')) {
        const urlParams = new URLSearchParams(searchStr);
        targetId = urlParams.get('id');
      }
    }
    if (targetId) {
      fetchData(targetId);
      
      // Load optional doc names
      recruiterService.getAllOptionalNames()
        .then((res) => {
          const data = res?.data || res || [];
          setOptionalDocs(data);
        })
        .catch(console.error);
    } else {
      setLoading(false);
    }
  }, [recruiterId]);

  const handleVerify = (docId) => {
    recruiterService.updateDocumentStatus(docId, 'Approved', 'Approved by verification admin')
      .then(() => {
        showToast('Document verified successfully', 'success');
        fetchData(recruiterId || recruiterData?.id);
      })
      .catch((err) => {
        showToast(err.message || 'Failed to verify document', 'error');
      });
  };

  const handleReject = (docId, reason) => {
    recruiterService.updateDocumentStatus(docId, 'Rejected', reason)
      .then(() => {
        showToast('Document rejected — recruiter notified', 'error');
        fetchData(recruiterId || recruiterData?.id);
      })
      .catch((err) => {
        showToast(err.message || 'Failed to reject document', 'error');
      });
  };

  const handleResubmit = (docId, message) => {
    recruiterService.updateDocumentStatus(docId, 'Rejected', message)
      .then(() => {
        showToast('Resubmission request sent to recruiter', 'info');
        fetchData(recruiterId || recruiterData?.id);
      })
      .catch((err) => {
        showToast(err.message || 'Failed to send resubmit request', 'error');
      });
  };

  const handleSendRequest = () => {
    if (!selectedDocType) return;
    let docTypeToSend = selectedDocType;
    let docTypeId = '';
    
    const matchedOpt = optionalDocs.find(o => o.documentName === selectedDocType);
    if (matchedOpt) {
      docTypeId = matchedOpt.documentTypeId;
    }
    
    if (selectedDocType === 'Custom / Other Document') {
      if (!customDocName.trim()) return;
      docTypeToSend = customDocName.trim();
    }
    
    const recId = recruiterId || recruiterData?.id;
    if (!recId) return;

    recruiterService.requestDocument(recId, docTypeId, docTypeToSend, requestNote)
      .then(() => {
        setRequestedDocs((prev) => [{
          id: Date.now(), docType: docTypeToSend, note: requestNote,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }, ...prev]);
        
        showToast(`Request sent: ${docTypeToSend}`, 'info');
        setSelectedDocType('');
        setCustomDocName('');
        setRequestNote('');
        fetchData(recId);
      })
      .catch((err) => {
        showToast(err.message || 'Failed to send request', 'error');
      });
  };

  const handleRequestMissingDoc = (docTitle) => {
    const recId = recruiterId || recruiterData?.id;
    if (!recId) return;

    const matched = optionalDocs.find(o => o.documentName === docTitle);
    const docTypeId = matched ? matched.documentTypeId : '';

    recruiterService.requestDocument(recId, docTypeId, docTitle, "Mandatory company document missing. Please upload.")
      .then(() => {
        setRequestedDocs((prev) => [{
          id: Date.now(), docType: docTitle, note: "Mandatory company document missing. Please upload.",
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }, ...prev]);
        showToast(`Request sent: ${docTitle}`, 'info');
        fetchData(recId);
      })
      .catch((err) => {
        showToast(err.message || 'Failed to send request', 'error');
      });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #ffa300',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h5 style={{ color: '#122359', fontWeight: 600 }}>Loading Documents...</h5>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!recruiterData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '15px' }}>
        <h5 style={{ color: '#122359', fontWeight: 600 }}>Recruiter Data Not Found</h5>
        <button className="btn btn-warning text-white" onClick={() => router.push('/admin/recruiters')}>Back to Recruiters</button>
      </div>
    );
  }

  const verified = docs.filter((d) => d.status === 'Verified').length;
  const pending = docs.filter((d) => d.status === 'Pending Review').length;
  const actionReq = docs.filter((d) => d.status === 'Action Required' || d.status === 'Resubmission' || d.isMissing).length;
  const allVerified = verified === docs.length && docs.length > 0;
  const pct = docs.length > 0 ? Math.round((verified / docs.length) * 100) : 0;

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
              <li><span>Documents — {recruiterData.company || "Details"}</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* COMPANY + STATS STRIP */}
      <div className="section-box mb-4">
        <div className="panel-white" style={{ padding: '16px 20px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              {recruiterData.logo ? (
                <img
                  src={recruiterData.logo}
                  alt={recruiterData.company}
                  style={{
                    width: '46px', height: '46px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0
                  }}
                />
              ) : (
                <div style={{
                  width: '46px', height: '46px', borderRadius: '10px', background: '#ffa300',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '16px', flexShrink: 0,
                }}>
                  {recruiterData.company ? recruiterData.company.substring(0, 2).toUpperCase() : "CO"}
                </div>
              )}
              <div>
                <h6 className="mb-0" style={{ color: '#122359' }}>{recruiterData.company}</h6>
                <p className="font-xs color-text-paragraph-2 mb-0">
                  {recruiterData.gstin && `GSTIN: ${recruiterData.gstin} · `}Registered: {recruiterData.registered ? new Date(recruiterData.registered).toLocaleDateString() : "N/A"} · {recruiterData.city || recruiterData.country || "India"}
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
                  {docs.length === 0 ? (
                    <div className="col-12 text-center py-4 color-text-paragraph-2">
                      No compliance documents requirements configured.
                    </div>
                  ) : (
                    docs.map((doc) => (
                      <div key={doc.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-20">
                        <DocCard
                          doc={doc} onPreview={setPreviewDoc}
                          onVerifyOpen={setVerifyTarget} onRejectOpen={setRejectTarget} onResubmitOpen={setResubmitTarget}
                          onRequestDocument={handleRequestMissingDoc}
                        />
                      </div>
                    ))
                  )}
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
                    <RefreshCw size={15} color="#ffa300" />
                    <h6 className="mb-0">Request Additional Documents</h6>
                  </div>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    Ask the recruiter to upload further verification certificates.
                  </p>
                </div>
              </div>
              <div className="panel-body">
                <div className="form-group mb-15">
                  <label className="form-label font-xs" style={{ fontWeight: 700, color: '#122359', marginBottom: '6px', display: 'block' }}>
                    Document Type
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      style={{
                        width: '100%', height: '40px', padding: '0 14px', borderRadius: '8px',
                        border: '1px solid #cbd5e1', fontSize: '12px', background: '#fff', color: '#122359'
                      }}
                    >
                      <option value="" disabled>Select Document Type</option>
                      {optionalDocs.map((o) => (
                        <option key={o.documentTypeId} value={o.documentName}>
                          {o.documentName}
                        </option>
                      ))}
                      <option value="Custom / Other Document">Custom / Other Document</option>
                    </select>
                  </div>
                </div>

                {selectedDocType === 'Custom / Other Document' && (
                  <div className="form-group mb-15">
                    <label className="form-label font-xs" style={{ fontWeight: 700, color: '#122359', marginBottom: '6px', display: 'block' }}>
                      Document Name
                    </label>
                    <input
                      type="text"
                      value={customDocName}
                      onChange={(e) => setCustomDocName(e.target.value)}
                      placeholder="e.g. ISO 9001 Certificate"
                      style={{
                        width: '100%', height: '40px', padding: '0 14px', borderRadius: '8px',
                        border: '1px solid #cbd5e1', fontSize: '12px', color: '#122359'
                      }}
                    />
                  </div>
                )}

                <div className="form-group mb-15">
                  <label className="form-label font-xs" style={{ fontWeight: 700, color: '#122359', marginBottom: '6px', display: 'block' }}>
                    Request Notes (Optional)
                  </label>
                  <textarea
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    placeholder="Provide specific details or instructions..."
                    style={{
                      width: '100%', height: '80px', padding: '10px 12px', borderRadius: '8px',
                      border: '1px solid #cbd5e1', fontSize: '12px', resize: 'none', color: '#122359'
                    }}
                  />
                </div>

                <button onClick={handleSendRequest} style={{
                  width: '100%', padding: '10px 0', background: '#ffa300', border: 'none',
                  borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <Send size={12} /> Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}