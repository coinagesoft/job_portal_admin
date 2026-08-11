'use client'
import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Footer from '../../../components/Footer'
import { Loader2, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { legalPagesService } from '../../../services/legalPagesService'

export default function LegalContentPage() {

  // ── shared theme tokens (same as Platform Configuration page) ──
  const navy   = '#122359'
  const amber  = '#ffa300'
  const gold   = '#ffc151'
  const border = '#E7E9F0'

  const DEFAULT_PRIVACY =
    '<h2>Privacy Policy</h2>' +
    '<p>Write or paste your privacy policy here. Use the toolbar above to add headings, bold or italic emphasis, lists, and section breaks.</p>' +
    '<h3>1. Information We Collect</h3>' +
    '<p>Describe what data is collected and how.</p>' +
    '<h3>2. How We Use Your Information</h3>' +
    '<p>Describe how the data is used.</p>'

  const DEFAULT_TERMS =
    '<h2>Terms &amp; Conditions</h2>' +
    '<p>Write or paste your terms of service here.</p>' +
    '<h3>1. Acceptance of Terms</h3>' +
    '<p>Describe the terms of use.</p>' +
    '<h3>2. User Responsibilities</h3>' +
    '<p>Describe user obligations.</p>'

  const todayISO = () => new Date().toISOString().slice(0, 10)
  const formatDate = (iso) => {
    if (!iso) return '—'
    try {
      const d = new Date(`${iso.split('T')[0]}T00:00:00`)
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch (e) {
      return iso;
    }
  }

  const parseDateForInput = (iso) => {
    if (!iso) return '';
    return iso.slice(0, 10);
  }

  // ── loading, saving, success & error states ──
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)

  // ── which document is being edited ──
  const [activeTab, setActiveTab] = useState('privacy') // 'privacy' | 'terms'
  const activeTabRef = useRef(activeTab)
  useEffect(() => { activeTabRef.current = activeTab }, [activeTab])

  // ── document content + save state, one per document ──
  const [docs, setDocs] = useState({
    privacy: {
      html: DEFAULT_PRIVACY, savedHtml: DEFAULT_PRIVACY,
      effectiveDate: '', savedEffectiveDate: '',
      lastSaved: 'Not yet published', status: 'draft',
      hasUnpublishedChanges: false,
      publishedContent: '', publishedEffectiveDate: '',
    },
    terms: {
      html: DEFAULT_TERMS, savedHtml: DEFAULT_TERMS,
      effectiveDate: '', savedEffectiveDate: '',
      lastSaved: 'Not yet published', status: 'draft',
      hasUnpublishedChanges: false,
      publishedContent: '', publishedEffectiveDate: '',
    },
  })

  const current = docs[activeTab]
  const isDirty = current.html !== current.savedHtml || current.effectiveDate !== current.savedEffectiveDate

  const setEffectiveDate = (value) => {
    setDocs(d => ({ ...d, [activeTab]: { ...d[activeTab], effectiveDate: value } }))
  }

  // ── Tiptap editor instance (single instance, content swapped per tab) ──
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true, // needed for toolbar active-state highlighting
    content: DEFAULT_PRIVACY,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false, // not needed for legal copy; avoids pulling in link UI
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing…' }),
      Underline,
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const key = activeTabRef.current
      setDocs(d => ({ ...d, [key]: { ...d[key], html } }))
    },
    editorProps: {
      attributes: { class: 'legal-editor' },
    },
  })

  // ── fetch policies from backend ──
  const fetchPolicies = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await legalPagesService.getLegalPages();
      const newDocs = { ...docs };
      data.forEach(item => {
        if (item.type === 'privacy' || item.type === 'terms') {
          const content = item.draftContent !== null && item.draftContent !== undefined ? item.draftContent : (item.publishedContent || '');
          const dateVal = parseDateForInput(item.draftEffectiveDate || item.publishedEffectiveDate || todayISO());
          
          newDocs[item.type] = {
            html: content,
            savedHtml: content,
            effectiveDate: dateVal,
            savedEffectiveDate: dateVal,
            lastSaved: item.publishedAt
              ? new Date(item.publishedAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : 'Not yet published',
            status: item.hasUnpublishedChanges ? 'draft' : 'published',
            hasUnpublishedChanges: item.hasUnpublishedChanges,
            publishedContent: item.publishedContent || '',
            publishedEffectiveDate: parseDateForInput(item.publishedEffectiveDate),
          };

          // Sync active editor content if needed
          if (item.type === activeTabRef.current && editor && !editor.isDestroyed) {
            if (editor.getHTML() !== content) {
              editor.commands.setContent(content, { emitUpdate: false });
            }
          }
        }
      });
      setDocs(newDocs);
      setDataLoaded(true);
    } catch (err) {
      console.error('Failed to fetch legal pages:', err);
      setError('Failed to load legal pages from the server.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  // Fetch policies on mount
  useEffect(() => {
    fetchPolicies(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  // ── keep the editor's content in sync when switching tabs ──
  useEffect(() => {
    if (editor && !editor.isDestroyed && dataLoaded) {
      const content = docs[activeTab].html;
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content, { emitUpdate: false })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, editor, dataLoaded])

  const [symbolsOpen, setSymbolsOpen] = useState(false)
  const symbols = ['§', '©', '®', '™', '•', '–', '—', '…', '→', '✓', '“', '”', '‘', '’']
  const insertSymbol = (sym) => {
    editor?.chain().focus().insertContent(sym).run()
    setSymbolsOpen(false)
  }

  // ── preview + confirmation modals ──
  const [previewOpen, setPreviewOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [discardDraftConfirmOpen, setDiscardDraftConfirmOpen] = useState(false)

  const requestPublish = () => setConfirmOpen(true)

  // ── API Mutators ──

  // Save Draft
  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      const dateToSend = current.effectiveDate ? new Date(current.effectiveDate).toISOString() : new Date().toISOString()
      await legalPagesService.updateDraft(activeTab, current.html, dateToSend)
      await fetchPolicies(false) // reload silently
      setSuccessMessage('Draft saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to save draft:', err)
      setError('Failed to save draft. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  // Publish
  const handlePublish = async () => {
    setConfirmOpen(false)
    setSaving(true)
    try {
      const dateToSend = current.effectiveDate ? new Date(current.effectiveDate).toISOString() : new Date().toISOString()
      await legalPagesService.publishDraft(activeTab, current.html, dateToSend)
      await fetchPolicies(false) // reload silently
      setSuccessMessage('Published successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to publish changes:', err)
      setError('Failed to publish changes. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  // Discard Local Changes
  const handleDiscard = () => {
    editor?.commands.setContent(current.savedHtml, { emitUpdate: false })
    setDocs(d => ({
      ...d,
      [activeTab]: { ...d[activeTab], html: d[activeTab].savedHtml, effectiveDate: d[activeTab].savedEffectiveDate },
    }))
  }

  // Discard Server Draft
  const handleDiscardDraftFromServer = async () => {
    setDiscardDraftConfirmOpen(false)
    setSaving(true)
    try {
      await legalPagesService.discardDraft(activeTab)
      await fetchPolicies(true) // reload with full spinner as database values shift back
      setSuccessMessage('Server draft discarded successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to discard draft:', err)
      setError('Failed to discard draft. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  // ── word / character counts for the doc being edited ──
  const plainText = (editor?.getText() || '').trim()
  const wordCount = plainText ? plainText.split(/\s+/).length : 0
  const charCount = plainText.length

  // ── warn before leaving the tab with unsaved changes ──
  const anyDirty = Object.values(docs).some(d => d.html !== d.savedHtml || d.effectiveDate !== d.savedEffectiveDate)
  useEffect(() => {
    const handler = (e) => { if (anyDirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [anyDirty])

  // ── toolbar button ──
  const ToolBtn = ({ active, onClick, title, children }) => (
    <button
      type="button"
      title={title}
      onMouseDown={e => e.preventDefault()} // keep editor selection intact
      onClick={onClick}
      style={{
        width: '32px', height: '32px', borderRadius: '7px', border: 'none',
        background: active ? amber : 'transparent',
        color: active ? '#fff' : navy,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '14px', fontWeight: 700, flexShrink: 0,
        transition: 'background .15s',
      }}
      onMouseOver={e => { if (!active) e.currentTarget.style.background = '#FFF4E0' }}
      onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )

  const Divider = () => (
    <div style={{ width: '1px', alignSelf: 'stretch', background: border, margin: '4px 6px' }} />
  )

  const tabs = [
    { key: 'privacy', label: 'Privacy Policy' },
    { key: 'terms', label: 'Terms & Conditions' },
  ]

  return (
    <>
      {/* ── SUCCESS MESSAGE TOAST ── */}
      {successMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: '#E9F7EF', color: '#2e7d32', border: '1px solid #c3e6cb',
          padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px'
        }}>
          <Check size={18} />
          {successMessage}
        </div>
      )}

      {/* ── GENERAL ERROR BANNER ── */}
      {error && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: '#FDF2F2', color: '#de4343', border: '1px solid #f5c2c2',
          padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px'
        }}>
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* ── PAGE HEADING ── */}
      <div className="box-heading d-flex">
        <div className="box-title mb-5">
          <h3 className="mb-5 mt-5">Legal Pages</h3>
          <p className="font-sm color-text-paragraph-2 mb-5">
            Edit the Privacy Policy and Terms &amp; Conditions shown to candidates and employers.
          </p>
        </div>

        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: 'none', backgroundColor: 'revert' }}>
            <ul>
              <li><a className="icon-home" href="/dashboard">Admin</a></li>
              <li><span>Legal Pages</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── DOCUMENT TABS ── */}
      <div className="d-flex mb-15" style={{ gap: '10px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              border: `1px solid ${activeTab === t.key ? amber : border}`,
              background: activeTab === t.key ? amber : '#fff',
              color: activeTab === t.key ? '#fff' : navy,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {t.label}
            {(docs[t.key].html !== docs[t.key].savedHtml || docs[t.key].effectiveDate !== docs[t.key].savedEffectiveDate) && (
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: activeTab === t.key ? '#fff' : '#e53935',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* ── LOADING SPINNER OR CONTENT ── */}
      {loading ? (
        <div className="section-box">
          <div className="panel-white d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '440px', gap: '16px' }}>
            <Loader2 className="animate-spin" size={40} color={amber} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: navy }}>Loading policies from server...</span>
          </div>
        </div>
      ) : (
        <>
          {/* ── EDITOR PANEL ── */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div className="d-flex align-items-center" style={{ gap: '8px', flexWrap: 'wrap' }}>
                      <h5 className="mb-0">{tabs.find(t => t.key === activeTab).label}</h5>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '20px',
                        background: current.status === 'published' ? '#E9F7EF' : '#FFF4E0',
                        color: current.status === 'published' ? '#2e7d32' : '#b26a00',
                      }}>
                        {current.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      {current.hasUnpublishedChanges && !isDirty && (
                        <button
                          type="button"
                          onClick={() => setDiscardDraftConfirmOpen(true)}
                          style={{
                            fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px',
                            border: '1px solid #e53935', background: 'transparent', color: '#e53935',
                            cursor: 'pointer', transition: 'background .15s',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = '#ffebee'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                          Discard Draft from Server
                        </button>
                      )}
                    </div>
                    <p className="font-xs color-text-paragraph-2 mb-0">
                      {isDirty ? 'Unsaved local changes' : `Last published: ${current.lastSaved}`}
                    </p>
                  </div>

                  <div className="d-flex align-items-center" style={{ gap: '18px', flexWrap: 'wrap' }}>
                    <label className="d-flex align-items-center font-xs" style={{ gap: '8px', color: navy, fontWeight: 600 }}>
                      Effective date
                      <input
                        type="date"
                        value={current.effectiveDate}
                        onChange={e => setEffectiveDate(e.target.value)}
                        style={{
                          height: '32px', borderRadius: '7px', border: `1px solid ${border}`,
                          fontSize: '12px', color: navy, padding: '0 8px', background: '#fff',
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      className="btn btn-secondary hover-up"
                      onClick={() => setPreviewOpen(true)}
                      style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Toolbar ── */}
              <div style={{
                display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2px',
                padding: '10px 20px', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
                background: '#FAFBFD', position: 'relative',
              }}>
                <ToolBtn title="Undo" onClick={() => editor?.chain().focus().undo().run()}>↺</ToolBtn>
                <ToolBtn title="Redo" onClick={() => editor?.chain().focus().redo().run()}>↻</ToolBtn>

                <Divider />

                <select
                  title="Paragraph style"
                  onMouseDown={e => e.stopPropagation()}
                  value={
                    editor?.isActive('heading', { level: 2 }) ? 'h2' :
                    editor?.isActive('heading', { level: 3 }) ? 'h3' :
                    editor?.isActive('heading', { level: 4 }) ? 'h4' :
                    editor?.isActive('blockquote') ? 'blockquote' : 'p'
                  }
                  onChange={e => {
                    const v = e.target.value
                    const chain = editor?.chain().focus()
                    if (v === 'p') chain.setParagraph().run()
                    else if (v === 'blockquote') chain.toggleBlockquote().run()
                    else chain.toggleHeading({ level: Number(v.replace('h', '')) }).run()
                  }}
                  style={{
                    height: '32px', borderRadius: '7px', border: `1px solid ${border}`,
                    fontSize: '12px', color: navy, padding: '0 8px', background: '#fff', cursor: 'pointer',
                  }}
                >
                  <option value="p">Paragraph</option>
                  <option value="h2">Heading 1</option>
                  <option value="h3">Heading 2</option>
                  <option value="h4">Heading 3</option>
                  <option value="blockquote">Quote</option>
                </select>

                <Divider />

                <ToolBtn title="Bold" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}><b>B</b></ToolBtn>
                <ToolBtn title="Italic" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}><i>I</i></ToolBtn>
                <ToolBtn title="Underline" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>U</u></ToolBtn>

                <Divider />

                <ToolBtn title="Align left" active={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>≡</ToolBtn>
                <ToolBtn title="Align center" active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>≣</ToolBtn>
                <ToolBtn title="Align right" active={editor?.isActive({ textAlign: 'right' })} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>≢</ToolBtn>

                <Divider />

                <ToolBtn title="Bullet list" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>•≡</ToolBtn>
                <ToolBtn title="Numbered list" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1≡</ToolBtn>

                <Divider />

                <ToolBtn title="Insert line break" onClick={() => editor?.chain().focus().setHardBreak().run()}>↵</ToolBtn>
                <ToolBtn title="Insert horizontal rule" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>―</ToolBtn>

                <Divider />

                <div style={{ position: 'relative' }}>
                  <ToolBtn title="Insert symbol" onClick={() => setSymbolsOpen(s => !s)}>§</ToolBtn>
                  {symbolsOpen && (
                    <div style={{
                      position: 'absolute', top: '38px', left: 0, zIndex: 10,
                      background: '#fff', border: `1px solid ${border}`, borderRadius: '10px',
                      boxShadow: '0 8px 24px rgba(18,35,89,0.12)', padding: '8px',
                      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', width: '224px',
                    }}>
                      {symbols.map(sym => (
                        <button
                          key={sym}
                          type="button"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => insertSymbol(sym)}
                          style={{
                            width: '28px', height: '28px', border: 'none', borderRadius: '6px',
                            background: 'transparent', color: navy, fontSize: '14px', cursor: 'pointer',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = '#FFF4E0'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Divider />

                <ToolBtn title="Clear formatting" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}>Tx</ToolBtn>
              </div>

              {/* ── Editable content area ── */}
              <div className="panel-body" style={{ padding: 0 }}>
                <EditorContent editor={editor} />
              </div>

              {/* ── word / character count ── */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '16px',
                padding: '8px 20px', borderTop: `1px solid ${border}`,
                fontSize: '11px', color: '#8592aa', fontWeight: 600,
              }}>
                <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
                <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
              </div>
            </div>
          </div>

          {/* ── ACTION BAR ── */}
          <div className="section-box mb-20">
            <div className="panel-white" style={{ padding: '16px 20px' }}>
              <div className="d-flex align-items-center justify-content-between" style={{ flexWrap: 'wrap', gap: '12px' }}>

                <span className="font-xs" style={{
                  color: isDirty ? '#b26a00' : '#2e7d32', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: isDirty ? '#ffa300' : '#2e7d32',
                  }} />
                  {isDirty ? 'You have unsaved local changes' : 'This page is up to date'}
                </span>

                <div className="d-flex animate-fade-in" style={{ gap: '10px', flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary hover-up"
                    onClick={handleDiscard}
                    disabled={!isDirty || saving}
                    style={{
                      padding: '10px 20px', fontSize: '13px',
                      opacity: isDirty && !saving ? 1 : 0.5, cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Discard Changes
                  </button>
                  <button
                    className="btn btn-secondary hover-up"
                    onClick={handleSaveDraft}
                    disabled={!isDirty || saving}
                    style={{
                      padding: '10px 20px', fontSize: '13px', fontWeight: 600,
                      borderColor: border, color: navy,
                      opacity: isDirty && !saving ? 1 : 0.5, cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button
                    className="btn btn-primary hover-up"
                    onClick={requestPublish}
                    disabled={!isDirty || saving}
                    style={{
                      padding: '10px 24px', fontSize: '13px', fontWeight: 600,
                      opacity: isDirty && !saving ? 1 : 0.5, cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {saving ? 'Publishing...' : 'Publish Changes'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* ── PREVIEW MODAL ── */}
      {previewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(18,35,89,0.55)',
            display: 'flex', alignItems: 'flex-start', justifycontent: 'center',
            padding: '40px 20px', overflowY: 'auto',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(760px, 100%)', background: '#fff', borderRadius: '14px',
              boxShadow: '0 24px 70px rgba(0,0,0,0.3)', overflow: 'hidden',
              margin: 'auto'
            }}
          >
            <div className="d-flex align-items-center justify-content-between" style={{
              padding: '16px 24px', borderBottom: `1px solid ${border}`, background: '#FAFBFD',
            }}>
              <div>
                <strong style={{ fontSize: '13px', color: navy }}>Preview — {tabs.find(t => t.key === activeTab).label}</strong>
                <p className="font-xs color-text-paragraph-2 mb-0">How this page will appear to candidates and employers</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                style={{
                  width: '30px', height: '30px', borderRadius: '8px', border: `1px solid ${border}`,
                  background: '#fff', color: navy, fontSize: '16px', lineheight: 1, cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '32px 40px', maxHeight: '65vh', overflowY: 'auto' }}>
              <p className="font-xs" style={{ color: '#8592aa', fontWeight: 600, marginBottom: '18px' }}>
                Effective {formatDate(current.effectiveDate || todayISO())}
              </p>
              <div
                className="legal-preview"
                dangerouslySetInnerHTML={{ __html: current.html }}
              />
            </div>

            <div style={{
              padding: '14px 24px', borderTop: `1px solid ${border}`, background: '#FAFBFD',
              display: 'flex', justifyContent: 'flex-end',
            }}>
              <button
                type="button"
                className="btn btn-secondary hover-up"
                onClick={() => setPreviewOpen(false)}
                style={{ padding: '8px 18px', fontSize: '12px', fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PUBLISH CONFIRMATION MODAL ── */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(18,35,89,0.55)',
            display: 'grid', placeItems: 'center', padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(420px, 100%)', background: '#fff', borderRadius: '14px',
              boxShadow: '0 24px 70px rgba(0,0,0,0.3)', padding: '26px',
            }}
          >
            <h5 className="mb-10">Publish {tabs.find(t => t.key === activeTab).label}?</h5>
            <p className="font-sm color-text-paragraph-2">
              This replaces the version currently shown to candidates and employers, effective{' '}
              <strong style={{ color: navy }}>{formatDate(current.effectiveDate || todayISO())}</strong>. This can't be undone automatically — you'll need to edit and republish to make further changes.
            </p>
            <div className="d-flex justify-content-end" style={{ gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                className="btn btn-secondary hover-up"
                onClick={() => setConfirmOpen(false)}
                style={{ padding: '9px 18px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary hover-up"
                onClick={handlePublish}
                style={{ padding: '9px 20px', fontSize: '13px', fontWeight: 600 }}
              >
                Confirm &amp; Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DISCARD DRAFT CONFIRMATION MODAL ── */}
      {discardDraftConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setDiscardDraftConfirmOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(18,35,89,0.55)',
            display: 'grid', placeItems: 'center', padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(420px, 100%)', background: '#fff', borderRadius: '14px',
              boxShadow: '0 24px 70px rgba(0,0,0,0.3)', padding: '26px',
            }}
          >
            <h5 className="mb-10">Discard Server Draft?</h5>
            <p className="font-sm color-text-paragraph-2">
              This will permanently delete the saved draft for <strong>{tabs.find(t => t.key === activeTab).label}</strong> on the server and revert back to the currently published content. This action cannot be undone.
            </p>
            <div className="d-flex justify-content-end" style={{ gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                className="btn btn-secondary hover-up"
                onClick={() => setDiscardDraftConfirmOpen(false)}
                style={{ padding: '9px 18px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary hover-up"
                onClick={handleDiscardDraftFromServer}
                style={{ padding: '9px 20px', fontSize: '13px', fontWeight: 600, background: '#e53935', borderColor: '#e53935' }}
              >
                Confirm &amp; Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Editor typography rules, scoped to this page ── */}
      <style jsx global>{`
        .legal-editor h2, .legal-preview h2 { font-size: 22px; font-weight: 700; color: ${navy}; margin: 0 0 10px; }
        .legal-editor h3, .legal-preview h3 { font-size: 17px; font-weight: 700; color: ${navy}; margin: 22px 0 8px; }
        .legal-editor h4, .legal-preview h4 { font-size: 15px; font-weight: 700; color: ${navy}; margin: 18px 0 6px; }
        .legal-editor { min-height: 440px; padding: 28px 32px; outline: none; font-size: 14.5px; line-height: 1.75; color: ${navy}; }
        .legal-preview { font-size: 14.5px; line-height: 1.75; color: ${navy}; }
        .legal-editor p, .legal-preview p { margin: 0 0 12px; }
        .legal-editor ul, .legal-editor ol, .legal-preview ul, .legal-preview ol { margin: 0 0 12px; padding-left: 22px; }
        .legal-editor blockquote, .legal-preview blockquote {
          margin: 0 0 12px; padding: 8px 16px; border-left: 3px solid ${gold};
          background: #FFF9EE; color: ${navy}; font-style: italic;
        }
        .legal-editor hr, .legal-preview hr { border: none; border-top: 1px solid ${border}; margin: 20px 0; }
        .legal-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); float: left; color: #9aa0ac; pointer-events: none; height: 0;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Footer />
    </>
  )
}