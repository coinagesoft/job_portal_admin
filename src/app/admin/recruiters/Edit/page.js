'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '../../../../components/Footer'
import {
  Brain,
  AlertTriangle,
  User,
  Clock,
  Hash,
  Circle,
  Edit3,
  FileText,
  Info
} from "lucide-react";
// ── Document Review Modal ────────────────────────────────────────────────────
function DocumentReviewModal({ doc, onClose, onApprove, onReject }) {
  const [zoom, setZoom] = useState(100)
  const [decision, setDecision] = useState('') // 'approve' | 'reject'
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('document') // 'document' | 'extracted'

  if (!doc) return null

  const statusColor = doc.status === 'Verified'
    ? { color: '#2e7d32', bg: '#e8f5e9', border: '#a5d6a7' }
    : doc.status === 'Pending'
    ? { color: '#e65100', bg: '#fff3e0', border: '#ffcc80' }
    : { color: '#c62828', bg: '#fdecea', border: '#ef9a9a' }

  const handleSubmit = async () => {
    if (!decision) return alert('Please select Approve or Reject')
    if (decision === 'reject' && !note.trim()) return alert('Please provide a rejection reason')
    setSubmitting(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 800))
    if (decision === 'approve') onApprove(doc)
    else onReject(doc, note)
    setSubmitting(false)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(10,12,20,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '980px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
      }}>

        {/* ── Modal Header ── */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fafafa',
          borderRadius: '16px 16px 0 0',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#1a2744', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px', flexShrink: 0,
            }}></div>
            <div>
              <h5 style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#1a2744' }}>
                {doc.name}
              </h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                  borderRadius: '4px', color: statusColor.color,
                  background: statusColor.bg, border: `1px solid ${statusColor.border}`,
                }}>
                  {doc.status === 'Verified' ? '✓' : doc.status === 'Pending' ? '○' : '✕'} {doc.status}
                </span>
                <span style={{ fontSize: '11px', color: '#888' }}>Issued: {doc.issued}</span>
                <span style={{ fontSize: '11px', color: doc.status === 'Expired' ? '#c62828' : '#888' }}>
                  Expiry: {doc.expiry}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: '#ffa300',
                  background: '#ffc151', padding: '2px 7px', borderRadius: '4px'
                }}>
                  AI: {doc.aiScore}%
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f0f0f0', border: 'none', borderRadius: '8px',
              width: '32px', height: '32px', cursor: 'pointer',
              fontSize: '16px', color: '#444', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: 'flex', borderBottom: '1px solid #f0f0f0',
          padding: '0 24px', background: '#fafafa', flexShrink: 0,
        }}>
          {[
            { key: 'document', label: '🖼 Document View' },
            { key: 'extracted', label: ' AI Extracted Data' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '12px 18px', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              color: activeTab === tab.key ? '#1a2744' : '#888',
              borderBottom: activeTab === tab.key ? '2px solid #1a2744' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* LEFT: Document viewer / AI data */}
          <div style={{ flex: 1, overflow: 'auto', borderRight: '1px solid #f0f0f0' }}>

            {activeTab === 'document' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Toolbar */}
                <div style={{
                  padding: '10px 16px', background: '#f7f7f7',
                  borderBottom: '1px solid #eee',
                  display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                }}>
                  <button onClick={() => setZoom(z => Math.max(50, z - 20))} style={toolBtnStyle}>−</button>
                  <span style={{ fontSize: '12px', color: '#666', minWidth: '45px', textAlign: 'center' }}>{zoom}%</span>
                  <button onClick={() => setZoom(z => Math.min(200, z + 20))} style={toolBtnStyle}>+</button>
                  <button onClick={() => setZoom(100)} style={{ ...toolBtnStyle, marginLeft: '4px' }}>Reset</button>
                  <div style={{ flex: 1 }} />
                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '12px', color: '#ffa300', fontWeight: 600,
                      textDecoration: 'none', padding: '5px 12px',
                      background: '#ffc151', borderRadius: '6px',
                      border: '1px solid #bbdefb',
                    }}
                  >
                    ↗ Open Original
                  </a>
                  <a
                    href={doc.fileUrl || '#'}
                    download
                    style={{
                      fontSize: '12px', color: '#2e7d32', fontWeight: 600,
                      textDecoration: 'none', padding: '5px 12px',
                      background: '#e8f5e9', borderRadius: '6px',
                      border: '1px solid #a5d6a7',
                    }}
                  >
                    ⬇ Download
                  </a>
                </div>

                {/* Document preview area */}
                <div style={{
                  flex: 1, overflow: 'auto', padding: '24px',
                  display: 'flex', justifyContent: 'center', background: '#e8eaed',
                }}>
                  <div style={{
                    width: `${zoom}%`, maxWidth: '700px',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                    overflow: 'scroll',
                    transition: 'width 0.2s',
                  }}>
                    {doc.fileUrl ? (
                      doc.fileType === 'pdf' ? (
                        <iframe
                          src={`${doc.fileUrl}#toolbar=0`}
                          style={{ width: '100%', height: '600px', border: 'none' }}
                          title={doc.name}
                        />
                      ) : (
                        <img
                          src={doc.fileUrl}
                          alt={doc.name}
                          style={{ width: '100%', display: 'block' }}
                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                        />
                      )
                    ) : null}

                    {/* Placeholder when no real file */}
                    <div style={{
                      display: doc.fileUrl ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '420px',
                      background: '#f9f9f9',
                      color: '#bbb',
                      gap: '12px',
                    }}>
                      <div style={{ fontSize: '64px' }}>📄</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#999' }}>{doc.name}</div>
                      <div style={{ fontSize: '12px', color: '#bbb' }}>Document preview</div>
                      {/* Simulated document body */}
                      <div style={{
                        width: '80%', textAlign: 'left',
                        border: '1px solid #eee', borderRadius: '8px',
                        padding: '16px', background: '#fff', marginTop: '8px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a2744' }}>
                              GOVERNMENT OF INDIA
                            </div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Ministry of Commerce & Industry</div>
                          </div>
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: '#ffc151', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '22px',
                          }}>🏛</div>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2744', marginBottom: '8px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {doc.name}
                        </div>
                        <div style={{ height: '1px', background: '#eee', margin: '10px 0' }} />
                        {[
                          ['Entity Name', 'Global Marine Solutions Pvt Ltd'],
                          ['Registration No.', doc.regNo || 'B-0721/MUM/1000+5/0'],
                          ['Issued Date', doc.issued],
                          ['Valid Until', doc.expiry],
                          ['Issuing Authority', doc.authority || 'Protector of Emigrants, Mumbai'],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', marginBottom: '6px', fontSize: '11px' }}>
                            <span style={{ color: '#888', width: '130px', flexShrink: 0 }}>{k}:</span>
                            <span style={{ color: '#1a2744', fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                        <div style={{ height: '1px', background: '#eee', margin: '10px 0' }} />
                        <div style={{ textAlign: 'right', fontSize: '10px', color: '#bbb' }}>
                          [Authorised Signatory]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'extracted' && (
              <div style={{ padding: '24px' }}>
                <div style={{
                  background: '#ffc151', border: '1px solid #bbdefb',
                  borderRadius: '8px', padding: '10px 14px', marginBottom: '20px',
                  fontSize: '12px', color: '#ffa300', fontWeight: 500,
                }}>
                  🤖 Fields below were extracted by AWS Textract. Amber = low confidence. Correct if needed before approving.
                </div>

                {doc.extractedFields.map((field, i) => (
                  <div key={i} style={{
                    marginBottom: '16px',
                    padding: '14px',
                    border: `1px solid ${field.confidence < 75 ? '#ffcc80' : '#eee'}`,
                    borderRadius: '8px',
                    background: field.confidence < 75 ? '#fffbf5' : '#fff',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                      <label style={{
                        fontSize: '11px', fontWeight: 700, color: '#666',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>
                        {field.label}
                        {field.confidence < 75 && (
                          <span style={{ marginLeft: '6px', color: '#e65100' }}>⚠ Low confidence</span>
                        )}
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '60px', height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${field.confidence}%`, height: '100%', borderRadius: '2px',
                            background: field.confidence >= 85 ? '#2e7d32' : field.confidence >= 70 ? '#e65100' : '#c62828',
                          }} />
                        </div>
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          color: field.confidence >= 85 ? '#2e7d32' : field.confidence >= 70 ? '#e65100' : '#c62828',
                        }}>
                          {field.confidence}%
                        </span>
                      </div>
                    </div>
                    <input
                      defaultValue={field.value}
                      style={{
                        width: '100%', padding: '8px 10px', border: '1px solid #e0e0e0',
                        borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                        color: '#1a2744', outline: 'none',
                        background: field.confidence < 75 ? '#fff8f0' : '#fff',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Decision panel */}
          <div style={{ width: '280px', flexShrink: 0, overflow: 'auto', padding: '20px' }}>

            {/* Document meta */}
            <div style={{
              background: '#f7f8fa', borderRadius: '10px', padding: '14px',
              marginBottom: '16px', fontSize: '12px',
            }}>
              <div style={{ fontWeight: 700, color: '#1a2744', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Document Info
              </div>
              {[
                ['Type', doc.docType || 'Compliance'],
                ['Issued', doc.issued],
                ['Expiry', doc.expiry],
                ['File type', doc.fileType?.toUpperCase() || 'PDF'],
                ['AI Score', `${doc.aiScore}%`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#888' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#1a2744' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* AI Validation */}
            <div style={{
              background: '#f7f8fa', borderRadius: '10px', padding: '14px',
              marginBottom: '16px',
            }}>
              <div style={{ fontWeight: 700, color: '#1a2744', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AI Validation
              </div>
              {[
                { label: 'Entity name match', val: 95 },
                { label: 'Date consistency', val: 88 },
                { label: 'Seal / stamp detected', val: 79 },
                { label: 'Forgery signals', val: 0, invert: true },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                    <span style={{ color: '#666' }}>{item.label}</span>
                    <span style={{
                      fontWeight: 700,
                      color: item.invert
                        ? (item.val === 0 ? '#2e7d32' : '#c62828')
                        : (item.val >= 85 ? '#2e7d32' : item.val >= 70 ? '#e65100' : '#c62828')
                    }}>
                      {item.invert ? (item.val === 0 ? 'None' : `${item.val}%`) : `${item.val}%`}
                    </span>
                  </div>
                  {!item.invert && (
                    <div style={{ height: '3px', background: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${item.val}%`, height: '100%',
                        background: item.val >= 85 ? '#2e7d32' : item.val >= 70 ? '#e65100' : '#c62828',
                        borderRadius: '2px',
                      }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Decision */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, color: '#1a2744', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Admin Decision
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  onClick={() => setDecision('approve')}
                  style={{
                    flex: 1, padding: '9px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 600, border: '2px solid',
                    borderColor: decision === 'approve' ? '#2e7d32' : '#ddd',
                    background: decision === 'approve' ? '#e8f5e9' : '#fff',
                    color: decision === 'approve' ? '#2e7d32' : '#666',
                    transition: 'all 0.15s',
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => setDecision('reject')}
                  style={{
                    flex: 1, padding: '9px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 600, border: '2px solid',
                    borderColor: decision === 'reject' ? '#c62828' : '#ddd',
                    background: decision === 'reject' ? '#fdecea' : '#fff',
                    color: decision === 'reject' ? '#c62828' : '#666',
                    transition: 'all 0.15s',
                  }}
                >
                  ✕ Reject
                </button>
              </div>

              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={decision === 'reject' ? 'Rejection reason (required)...' : 'Optional note for audit log...'}
                style={{
                  width: '100%', padding: '9px 10px', border: '1px solid',
                  borderColor: decision === 'reject' && !note ? '#ef9a9a' : '#e0e0e0',
                  borderRadius: '8px', fontSize: '12px', resize: 'vertical',
                  minHeight: '72px', outline: 'none', fontFamily: 'inherit',
                  color: '#1a2744',
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !decision}
              style={{
                width: '100%', padding: '11px', borderRadius: '10px',
                border: 'none', cursor: decision ? 'pointer' : 'not-allowed',
                fontSize: '13px', fontWeight: 700,
                background: !decision ? '#e0e0e0'
                  : decision === 'approve' ? '#2e7d32' : '#c62828',
                color: !decision ? '#999' : '#fff',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {submitting ? (
                <>
                  <span style={{
                    width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Submitting…
                </>
              ) : (
                `Submit Decision`
              )}
            </button>

            <p style={{ fontSize: '10px', color: '#aaa', textAlign: 'center', marginTop: '8px' }}>
              This action will be logged in the immutable audit trail.
            </p>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const toolBtnStyle = {
  background: '#fff', border: '1px solid #ddd', borderRadius: '6px',
  width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#444',
}

// ── Static document data (replace fileUrl with real S3 URLs from your API) ──
const DOCUMENTS = [
  {
    id: 'gst',
    name: 'GST Registration Certificate',
    issued: 'Jan 11, 2023',
    status: 'Verified',
    expiry: 'Dec 31, 2028',
    aiScore: 95,
    docType: 'Tax Registration',
    fileType: 'pdf',
    
    fileUrl: null, // Replace with: '/api/employer-documents/gst/file'
    regNo: '27AABCG1234F1Z5',
    authority: 'GST Council, Government of India',
    extractedFields: [
      { label: 'Entity Name', value: 'Global Marine Solutions Pvt Ltd', confidence: 98 },
      { label: 'GSTIN', value: '27AABCG1234F1Z5', confidence: 95 },
      { label: 'PAN', value: 'AABCG1234F', confidence: 94 },
      { label: 'State', value: 'Maharashtra', confidence: 97 },
      { label: 'Registration Date', value: '11-01-2023', confidence: 91 },
      { label: 'Valid Until', value: '31-12-2028', confidence: 90 },
    ],
  },
  {
    id: 'inc',
    name: 'Incorporation Certificate',
    issued: 'May 14, 2018',
    status: 'Verified',
    expiry: 'No Expiry',
    aiScore: 92,
    docType: 'Registration',
    fileType: 'pdf',
    fileUrl: null,
    regNo: 'U74999MH2018PTC309412',
    authority: 'Registrar of Companies, MCA',
    extractedFields: [
      { label: 'Company Name', value: 'Global Marine Solutions Pvt Ltd', confidence: 99 },
      { label: 'CIN', value: 'U74999MH2018PTC309412', confidence: 97 },
      { label: 'Incorporation Date', value: '14-05-2018', confidence: 96 },
      { label: 'Company Type', value: 'Private Limited', confidence: 95 },
      { label: 'Registered State', value: 'Maharashtra', confidence: 98 },
    ],
  },
  {
    id: 'poe',
    name: 'POE License (Form A)',
    issued: 'Jun 18, 2019',
    status: 'Pending',
    expiry: 'Jun 15, 2024',
    aiScore: 80,
    docType: 'License',
    fileType: 'pdf',
    fileUrl: null,
    regNo: 'B-0721/MUM/1000+5/0',
    authority: 'Protector of Emigrants, Mumbai',
    extractedFields: [
      { label: 'License No.', value: 'B-0721/MUM/1000+5/0', confidence: 80 },
      { label: 'Entity Name', value: 'Global Marine Solutions Pvt Ltd', confidence: 95 },
      { label: 'Validity Date', value: '15-06-2024', confidence: 84 },
      { label: 'Issuing Authority', value: 'Protector of Emigrants, Mumbai', confidence: 99 },
      { label: 'Category', value: 'Recruiting Agent', confidence: 68 },
    ],
  },
  {
    id: 'rpsl',
    name: 'RPSL Maritime License',
    issued: 'Nov 21, 2018',
    status: 'Expired',
    expiry: 'Nov 20, 2023',
    aiScore: 88,
    docType: 'License',
    fileType: 'pdf',
    fileUrl: null,
    regNo: 'RPSL-MUM-2018-0441',
    authority: 'Directorate General of Shipping',
    extractedFields: [
      { label: 'RPSL Number', value: 'RPSL-MUM-2018-0441', confidence: 92 },
      { label: 'Company Name', value: 'Global Marine Solutions Pvt Ltd', confidence: 96 },
      { label: 'Issue Date', value: '21-11-2018', confidence: 91 },
      { label: 'Expiry Date', value: '20-11-2023', confidence: 88 },
      { label: 'Issuing Authority', value: 'Directorate General of Shipping', confidence: 94 },
      { label: 'License Category', value: 'Manning Agent', confidence: 72 },
    ],
  },
]

// ── Main Page ────────────────────────────────────────────────────────────────
export default function RecruiterEditPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/recruiters/details')
  }, [router])

  const [reviewDoc, setReviewDoc] = useState(null)
  const [docStatuses, setDocStatuses] = useState({})

  const getStatus = (doc) => docStatuses[doc.id]?.status || doc.status

  const handleApprove = (doc) => {
    setDocStatuses(prev => ({ ...prev, [doc.id]: { status: 'Verified' } }))
  }
  const handleReject = (doc, note) => {
    setDocStatuses(prev => ({ ...prev, [doc.id]: { status: 'Rejected', note } }))
  }

  const statusStyle = (status) => ({
    Verified:  { color: '#2e7d32', bg: '#e8f5e9', border: '#a5d6a7' },
    Pending:   { color: '#e65100', bg: '#fff3e0', border: '#ffcc80' },
    Expired:   { color: '#c62828', bg: '#fdecea', border: '#ef9a9a' },
    Rejected:  { color: '#6a1a1a', bg: '#fdecea', border: '#ef9a9a' },
  }[status] || { color: '#888', bg: '#f5f5f5', border: '#ddd' })

  return (
    <>
      {reviewDoc && (
        <DocumentReviewModal
          doc={reviewDoc}
          onClose={() => setReviewDoc(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* PAGE HEADING */}
      <div className="box-heading mb-5">
        <div className="box-title">
          <div className="d-flex align-items-center" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <h3 className="mb-0">Global Marine Solutions Pvt Ltd</h3>
            <span className="btn btn-grey-small" style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', fontSize: '12px', fontWeight: 600 }}>
              ● Active &amp; Verified
            </span>
          </div>
<div
  className="d-flex align-items-center mt-5 mb-3 w-100"
  style={{ gap: '16px', flexWrap: 'nowrap' }}
>

  <span className="font-xs color-text-paragraph-2 d-flex align-items-center gap-1">
    <Brain size={14} /> AI Confidence: <strong>86%</strong>
  </span>

  <span className="font-xs color-text-paragraph-2 d-flex align-items-center gap-1">
    <AlertTriangle size={14} /> Risk:
    <strong style={{ color: '#e65100' }}>Medium</strong>
  </span>

  <span className="font-xs color-text-paragraph-2 d-flex align-items-center gap-1">
    <User size={14} /> Assigned: <strong>Sarah</strong>
  </span>

 

</div>

<div className="d-flex align-items-center mt-5" style={{ gap: '16px', flexWrap: 'wrap' }}>

  <span className="font-xs color-text-paragraph-2 d-flex align-items-center gap-1">
    <Hash size={14} /> REC-2024-9842
  </span>

  <span className="font-xs color-text-paragraph-2">
    <Circle size={6} fill="#ccc" />
  </span>

  <span className="font-xs color-text-paragraph-2 d-flex align-items-center gap-1">
    <Edit3 size={14} /> Last edited by <strong>admin_alex</strong> 45m ago
  </span>

</div>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{border:"none" ,  backgroundColor:"revert"}}>
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><a href="/admin/recruiters">Recruiters</a></li>
              <li><span>Edit-Global Marine Solutions</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="row mt-5">

        {/* ── LEFT COLUMN ── */}
        <div className="col-xxl-8 col-xl-12 col-lg-12 col-md-12 mt-5">

          {/* Corporate Identity — unchanged */}
          {/* <div className="section-box mt-5">
            <div className="panel-white">
              <div className="panel-head d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Corporate Identity</h5>
                  <p className="font-xs color-text-paragraph-2 mb-0">Legal business registration and identification parameters.</p>
                </div>
                <img src="/assets/imgs/brands/brand-1.png" alt="company"
                  style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #eee' }} />
              </div>
              <div className="box-padding">
                <div className="form-group mb-20">
                  <label className="font-xs color-text-paragraph-2 mb-5" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Legal Business Name *</label>
                  <input className="form-control" type="text" defaultValue="Global Marine Solutions Pvt Ltd" />
                </div>
                <div className="row">
                  <div className="col-md-6"><div className="form-group mb-20">
                    <label className="font-xs color-text-paragraph-2 mb-5" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Trading Name (Brand)</label>
                    <input className="form-control" type="text" defaultValue="GMS Shipping & Logistics" />
                  </div></div>
                  <div className="col-md-6"><div className="form-group mb-20">
                    <label className="font-xs color-text-paragraph-2 mb-5" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Industry Vertical</label>
                    <input className="form-control" type="text" defaultValue="Maritime & Logistics" />
                  </div></div>
                </div>
                <div className="row">
                  <div className="col-md-6"><div className="form-group mb-20">
                    <label className="font-xs color-text-paragraph-2 mb-5" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Registration Number (CIN)</label>
                    <input className="form-control" type="text" defaultValue="U74999MH2018PTC309412" />
                  </div></div>
                  <div className="col-md-6"><div className="form-group mb-20">
                    <label className="font-xs color-text-paragraph-2 mb-5" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Registration Date</label>
                    <input className="form-control" type="text" defaultValue="2018-05-14" />
                  </div></div>
                </div>
                <div className="row">
                  <div className="col-md-6"><div className="form-group mb-20">
                    <label className="font-xs color-text-paragraph-2 mb-5" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>PAN Number</label>
                    <input className="form-control" type="password" defaultValue="XXXXXX234F" />
                  </div></div>
                  <div className="col-md-6"><div className="form-group mb-20">
                    <label className="font-xs color-text-paragraph-2 mb-5" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>GSTIN / VAT ID</label>
                    <input className="form-control" type="password" defaultValue="XXXXXXG1234F1Z5" />
                  </div></div>
                </div>
              </div>
            </div>
          </div> */}

          {/* ── SECTION 4: Compliance & Documents ── with clickable Review ── */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <div className="d-flex align-items-center mb-3" style={{ gap: '10px' }}>
                  <h5>Compliance &amp; Documents</h5>
                </div>
                <a className="btn btn-default icon-edit hover-up mt-3" href="#" style={{ fontSize: '12px' }}>Upload New</a>
              </div>
              <div className="box-padding">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      {['Document Type', 'Status', 'Expiry', 'AI Score', 'Actions'].map(h => (
                        <th key={h} className="font-xs color-text-paragraph-2"
                          style={{ padding: '8px 8px', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DOCUMENTS.map((doc) => {
                      const currentStatus = getStatus(doc)
                      const sc = statusStyle(currentStatus)
                      return (
                        <tr key={doc.id} className="hover-up" style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '14px 8px' }}>
                            <p className="font-sm mb-0" style={{ fontWeight: 600 }}>📄 {doc.name}</p>
                            <span className="font-xs color-text-paragraph-2">Issued: {doc.issued}</span>
                          </td>
                          <td style={{ padding: '14px 8px' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '4px',
                              color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, whiteSpace: 'nowrap',
                            }}>
                              {currentStatus === 'Verified' ? '✓' : currentStatus === 'Pending' ? '○' : '✕'} {currentStatus}
                            </span>
                          </td>
                          <td style={{ padding: '14px 8px' }}>
                            <span className="font-xs color-text-paragraph-2"
                              style={{ color: currentStatus === 'Expired' ? '#c62828' : undefined }}>
                              {doc.expiry}
                            </span>
                          </td>
                          <td style={{ padding: '14px 8px' }}>
                            <span style={{ fontWeight: 600, color: '#ffa300' }}>{doc.aiScore}%</span>
                          </td>
                          <td style={{ padding: '14px 8px' }}>
                            {/* ✅ THE KEY CHANGE: onClick opens the modal */}
                            <button
                              className="btn btn-grey-small"
                              onClick={() => setReviewDoc(doc)}
                              style={{
                                cursor: 'pointer', border: 'none',
                                background: '#ffc151', color: '#ffa300',
                                fontWeight: 600, fontSize: '12px',
                                padding: '5px 12px', borderRadius: '6px',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => e.target.style.background = '#bbdefb'}
                              onMouseLeave={e => e.target.style.background = '#ffc151'}
                            >
                              🔍 Review
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="mt-15">
                  <a className="font-sm color-brand-1" href="#">Manage All 12 Documents →</a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Required Company Documents Checklist ── */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: "center" }}>
                <div>
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "8px" }}
                  >
                    <Info size={18} className="color-brand-2" />
                    <h6 className="mb-0">Required Company Documents</h6>
                  </div>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    Mandatory and conditional verification documents required for Global Marine Solutions Pvt Ltd's business profile.
                  </p>
                </div>
              </div>
              <div className="panel-body">
                <div className="table-responsive">
                  <table className="table font-sm" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Document Type</th>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Category</th>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Requirement</th>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Status</th>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Description & Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "GST Certificate (GSTIN)",
                          category: "Tax & Compliance",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Verified",
                          statusColor: "#2e7d32",
                          statusBg: "#e8f5e9",
                          desc: "Required for all Indian business entities. Verifies legal identity, active status, and tax registration details."
                        },
                        {
                          name: "Corporate PAN Card",
                          category: "Tax & Compliance",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Missing / Required",
                          statusColor: "#c62828",
                          statusBg: "#ffebee",
                          desc: "Permanent Account Number registered in company name, validating legal identity and national tax standing."
                        },
                        {
                          name: "Business Registration Certificate",
                          category: "Company Identity",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Verified",
                          statusColor: "#2e7d32",
                          statusBg: "#e8f5e9",
                          desc: "Certificate of Incorporation (COI), Trade License, or Partnership Deed verifying the legal existence of the business."
                        },
                        {
                          name: "Memorandum & Articles of Association (MOA/AOA)",
                          category: "Company Governance",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Missing / Required",
                          statusColor: "#c62828",
                          statusBg: "#ffebee",
                          desc: "Bylaws, shareholding registry, and corporate structure documentation. Needed for Private/Public Limited company audits."
                        },
                        {
                          name: "Proof of Establishment (POE)",
                          category: "Office Verification",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Missing / Required",
                          statusColor: "#c62828",
                          statusBg: "#ffebee",
                          desc: "Utility bill, rent agreement, or property registry matching the registered operating address of the company."
                        },
                        {
                          name: "RPSL License Copy",
                          category: "Recruitment License",
                          importance: "Conditional",
                          impColor: "#2563eb",
                          impBg: "#eff6ff",
                          status: "Expired",
                          statusColor: "#c62828",
                          statusBg: "#ffebee",
                          desc: "Required only for maritime recruitment placing seafarers. Must map to a valid DG Shipping license number."
                        },
                        {
                          name: "POE License Copy",
                          category: "Recruitment License",
                          importance: "Conditional",
                          impColor: "#2563eb",
                          impBg: "#eff6ff",
                          status: "Pending Review",
                          statusColor: "#e65100",
                          statusBg: "#fff3e0",
                          desc: "Required for overseas placement agencies under the Ministry of External Affairs / Protector of Emigrants."
                        }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover-up" style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "14px 10px", fontWeight: "600", color: "#1e293b" }}>
                            <div className="d-flex align-items-center" style={{ gap: "6px" }}>
                              <FileText size={14} className="color-text-paragraph-2" />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 10px", color: "#475569" }}>
                            {item.category}
                          </td>
                          <td style={{ padding: "14px 10px" }}>
                            <span style={{
                              display: "inline-block",
                              fontSize: "10px",
                              fontWeight: "700",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: item.impBg,
                              color: item.impColor,
                              letterSpacing: "0.2px",
                              textTransform: "uppercase"
                            }}>
                              {item.importance}
                            </span>
                          </td>
                          <td style={{ padding: "14px 10px" }}>
                            <span style={{
                              display: "inline-block",
                              fontSize: "10px",
                              fontWeight: "700",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: item.statusBg,
                              color: item.statusColor,
                              letterSpacing: "0.2px",
                              textTransform: "uppercase"
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 10px", fontSize: "12px", color: "#64748b", lineHeight: "1.4", maxWidth: "320px" }}>
                            {item.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Review & Audit Commitment */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <h5 className="mb-0">Review &amp; Audit Commitment</h5>
                <p className="font-xs color-text-paragraph-2 mb-0">A mandatory audit comment is required to persist any modifications.</p>
              </div>
              <div className="box-padding">
                <div className="form-group mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                    Mandatory Change Comment *
                  </label>
                  <textarea className="form-control" rows={4}
                    placeholder="Describe the reason for these edits..." />
                </div>
                <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 600 }}>● GDPR Consent: Active (v2.4)</span>
                  <span className="font-xs color-text-paragraph-2" style={{ marginLeft: '8px' }}>Consent Timestamp: 14 Oct 2023, 11:22 AM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

     
      </div>

      {/* STICKY FOOTER */}
      <div className="section-box">
        <div className="panel-white" style={{ padding: '16px 20px' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div className="d-flex align-items-center" style={{ gap: '20px', flexWrap: 'wrap' }}>
              <span className="font-xs" style={{ color: '#2e7d32', fontWeight: 600 }}>● CONSENT VALID</span>
              <span className="font-xs color-text-paragraph-2">○ 0 Prior Rejections</span>
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

      <Footer />
    </>
  )
}