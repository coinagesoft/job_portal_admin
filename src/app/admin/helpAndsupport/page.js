'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Clock3, MessageSquareText, Search, Send, X } from 'lucide-react'

const initialTickets = {
  candidates: [
    {
      id: 'SUP-4201', name: 'John Carter', img: 'avata1', issue: 'Resume upload failed', category: 'Profile', status: 'Pending', date: '14 Apr 2026',
      description: 'I am unable to upload my updated resume. The upload stops before it completes, even after trying a smaller PDF.',
      messages: [
        { author: 'John Carter', role: 'Candidate', text: 'I am facing this issue since yesterday. Please help me upload my resume.', time: '14 Apr 2026, 10:15 AM', mine: false },
        { author: 'Admin', role: 'Support team', text: 'Thanks for reporting this. We are checking the upload service and will update you shortly.', time: '14 Apr 2026, 11:02 AM', mine: true },
      ],
    },
    {
      id: 'SUP-4202', name: 'Aisha Khan', img: 'avata2', issue: 'Payment issue', category: 'Billing', status: 'Resolved', date: '12 Apr 2026',
      description: 'The payment for my premium application package shows as completed, but the credits have not been added.',
      messages: [
        { author: 'Aisha Khan', role: 'Candidate', text: 'My payment went through, but I cannot see the credits in my account.', time: '12 Apr 2026, 09:30 AM', mine: false },
        { author: 'Admin', role: 'Support team', text: 'Your payment has been verified and the credits are now available in your wallet.', time: '12 Apr 2026, 12:05 PM', mine: true },
      ],
    },
  ],
  recruiters: [
    {
      id: 'SUP-5101', name: 'TechFlow Pvt Ltd', img: 'avata3', issue: 'Job posting error', category: 'Technical', status: 'Pending', date: '15 Apr 2026',
      description: 'We receive an error when publishing our Software Engineer vacancy after completing all required job details.',
      messages: [
        { author: 'TechFlow Pvt Ltd', role: 'Recruiter', text: 'Our job post is not going live. It shows an error after we click publish.', time: '15 Apr 2026, 09:40 AM', mine: false },
      ],
    },
    {
      id: 'SUP-5102', name: 'NextHire Ltd', img: 'avata4', issue: 'Invoice mismatch', category: 'Billing', status: 'In Progress', date: '13 Apr 2026',
      description: 'The invoice amount does not match the total displayed while purchasing our recruiter credit bundle.',
      messages: [
        { author: 'NextHire Ltd', role: 'Recruiter', text: 'Please check our invoice. The total shown before payment is different from the invoice total.', time: '13 Apr 2026, 02:20 PM', mine: false },
        { author: 'Admin', role: 'Support team', text: 'We have shared this with our billing team and are reviewing the invoice details.', time: '13 Apr 2026, 03:10 PM', mine: true },
      ],
    },
  ],
}

const statusStyle = {
  Pending: { color: '#c76b00', background: '#fff3df' },
  'In Progress': { color: '#996000', background: '#fff0c8' },
  Resolved: { color: '#21844c', background: '#e6f7ed' },
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState(initialTickets)
  const [activeTab, setActiveTab] = useState('candidates')
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [reply, setReply] = useState('')

  const data = tickets[activeTab]
  const selectedTicket = useMemo(() => data.find((ticket) => ticket.id === selectedTicketId) || null, [data, selectedTicketId])
  const filteredData = data.filter((ticket) => (
    (ticket.name.toLowerCase().includes(search.toLowerCase()) || ticket.issue.toLowerCase().includes(search.toLowerCase()) || ticket.id.toLowerCase().includes(search.toLowerCase())) &&
    (!status || ticket.status === status) && (!category || ticket.category === category)
  ))

  const updateTicket = (id, patch) => {
    setTickets((current) => ({ ...current, [activeTab]: current[activeTab].map((ticket) => ticket.id === id ? { ...ticket, ...patch } : ticket) }))
  }

  const sendReply = () => {
    const text = reply.trim()
    if (!text || !selectedTicket) return
    const message = { author: 'Admin', role: 'Support team', text, time: 'Just now', mine: true }
    updateTicket(selectedTicket.id, { messages: [...selectedTicket.messages, message], status: selectedTicket.status === 'Pending' ? 'In Progress' : selectedTicket.status })
    setReply('')
  }

  const changeStatus = (nextStatus) => selectedTicket && updateTicket(selectedTicket.id, { status: nextStatus })

  return (
    <>
      <div className="box-heading mb-3">
        <div className="box-title">
          <h3 className="mb-5">Help &amp; Support</h3>
          <p className="font-sm color-text-paragraph-2">Review support tickets raised by candidates and recruiters, reply to messages, and resolve issues efficiently.</p>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs mb-15" style={{ border: 'none', backgroundColor: 'revert' }}><ul><li><a className="icon-home" href="/admin/dashboard">Admin</a></li><li><span>Help &amp; Support</span></li></ul></div>
        </div>
      </div>

      <div className="section-box">
        <div className="panel-white support-panel">
          <div className="support-toolbar">
            <div className="support-tabs" role="tablist" aria-label="Ticket user type">
              {['candidates', 'recruiters'].map((tab) => (
                <button type="button" key={tab} className={`support-tab ${activeTab === tab ? 'is-active' : ''}`} onClick={() => { setActiveTab(tab); setSelectedTicketId(null) }}>
                  {tab[0].toUpperCase() + tab.slice(1)} <span>{tickets[tab].length}</span>
                </button>
              ))}
            </div>
            <div className="support-filters">
              <label className="support-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ticket..." aria-label="Search tickets" /></label>
              <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="">Status</option><option>Pending</option><option>In Progress</option><option>Resolved</option></select>
              <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option value="">Category</option><option>Billing</option><option>Technical</option><option>Profile</option></select>
              <button type="button" className="btn btn-grey-small filter-clear" onClick={() => { setSearch(''); setStatus(''); setCategory('') }}>Clear Filters</button>
            </div>
          </div>

          <div className="box-padding support-table-wrap">
            <table className="support-table">
              <thead><tr><th>User</th><th>Subject / Issue</th><th>Category</th><th>Raised on</th><th>Status</th><th className="action-column">Actions</th></tr></thead>
              <tbody>
                {filteredData.map((ticket) => <tr key={ticket.id}>
                  <td><div className="ticket-user"><img src={`/assets/imgs/page/dashboard/${ticket.img}.png`} alt="" /><div><h6>{ticket.name}</h6><span>{ticket.id}</span></div></div></td>
                  <td><strong>{ticket.issue}</strong><span className="ticket-description">{ticket.description}</span></td>
                  <td><span className="font-sm color-text-paragraph-2">{ticket.category}</span></td><td><span className="font-sm">{ticket.date}</span></td>
                  <td><span className="ticket-status" style={statusStyle[ticket.status]}>{ticket.status}</span></td>
                  <td className="text-end"><button type="button" className="btn btn-default support-review" onClick={() => { setSelectedTicketId(ticket.id); setReply('') }}>Review <span aria-hidden="true">→</span></button></td>
                </tr>)}
              </tbody>
            </table>
            {!filteredData.length && <div className="support-empty"><MessageSquareText size={26} /><p>No support tickets match these filters.</p></div>}
          </div>
        </div>
      </div>

      {selectedTicket && <>
        <button type="button" aria-label="Close ticket details" className="support-overlay" onClick={() => setSelectedTicketId(null)} />
        <aside className="support-drawer" aria-label="Ticket details">
          <div className="support-drawer-head"><div><span className="drawer-eyebrow">{activeTab === 'candidates' ? 'Candidate ticket' : 'Recruiter ticket'}</span><h4>{selectedTicket.id}</h4></div><button type="button" className="drawer-close" onClick={() => setSelectedTicketId(null)} aria-label="Close"><X size={20} /></button></div>
          <div className="ticket-summary"><div className="ticket-user"><img src={`/assets/imgs/page/dashboard/${selectedTicket.img}.png`} alt="" /><div><h6>{selectedTicket.name}</h6><span>{activeTab === 'candidates' ? 'Candidate' : 'Recruiter'} · {selectedTicket.category}</span></div></div><span className="ticket-status" style={statusStyle[selectedTicket.status]}>{selectedTicket.status}</span></div>
          <section className="drawer-section"><span className="drawer-label">Subject</span><h5>{selectedTicket.issue}</h5><span className="drawer-label mt-3">Description</span><p>{selectedTicket.description}</p><div className="ticket-meta"><span><Clock3 size={14} /> Raised {selectedTicket.date}</span><span>{selectedTicket.messages.length} message{selectedTicket.messages.length !== 1 ? 's' : ''}</span></div></section>
          <section className="drawer-section conversation-section"><div className="conversation-title"><h5>Conversation</h5><span>Visible to {activeTab === 'candidates' ? 'candidate' : 'recruiter'}</span></div><div className="messages">{selectedTicket.messages.map((message, index) => <article className={`message ${message.mine ? 'is-admin' : ''}`} key={`${message.time}-${index}`}><div className="message-author">{message.mine ? 'Admin' : message.author}<span>{message.role}</span></div><p>{message.text}</p><time>{message.time}</time></article>)}</div></section>
          {selectedTicket.status !== 'Resolved' ? <div className="reply-area"><label htmlFor="admin-reply">Reply to {selectedTicket.name}</label><div><textarea id="admin-reply" value={reply} onChange={(event) => setReply(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') sendReply() }} placeholder="Write a helpful reply..." rows="3" /><button type="button" className="btn btn-default reply-send" onClick={sendReply} disabled={!reply.trim()}><Send size={16} /> Send Reply</button></div><small>Press Ctrl/Cmd + Enter to send</small></div> : <div className="resolved-note"><CheckCircle2 size={18} /> This ticket is marked as resolved. Reopen it if more help is needed.</div>}
          <div className="drawer-actions">{selectedTicket.status !== 'In Progress' && selectedTicket.status !== 'Resolved' && <button type="button" className="btn btn-grey-small progress-action" onClick={() => changeStatus('In Progress')}><Clock3 size={16} /> Mark In Progress</button>}{selectedTicket.status !== 'Resolved' ? <button type="button" className="btn btn-default resolve-action" onClick={() => changeStatus('Resolved')}><CheckCircle2 size={16} /> Mark Resolved</button> : <button type="button" className="btn btn-grey-small progress-action" onClick={() => changeStatus('In Progress')}><Clock3 size={16} /> Reopen Ticket</button>}</div>
        </aside>
      </>}

      <style jsx>{`
        .support-panel { padding: 20px 28px 12px; border-radius: 16px; } .support-toolbar { display: flex; justify-content: space-between; gap: 18px; align-items: end; border-bottom: 1px solid #edf0f6; } .support-tabs { display: flex; gap: 8px; } .support-tab { padding: 13px 12px 14px; background: none; border: 0; border-bottom: 2px solid transparent; color: #697a9f; font-weight: 600; cursor: pointer; } .support-tab.is-active { color: #f59b00; border-color: #ffa300; } .support-tab span { margin-left: 6px; padding: 1px 7px; border-radius: 10px; font-size: 11px; background: #f1f3f6; } .support-tab.is-active span { color: #b06d00; background: #fff0cf; } .support-filters { display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 12px; } .support-filters input, .support-filters select { height: 42px; min-width: 128px; padding: 0 12px; border: 1px solid #dce2ef; border-radius: 5px; color: #657596; background: #fff; outline: none; } .support-search { display: flex; align-items: center; gap: 8px; height: 42px; padding: 0 11px; border: 1px solid #dce2ef; border-radius: 5px; color: #8c9ab4; } .support-search input { min-width: 145px; height: auto; padding: 0; border: 0; } .support-filters select:focus, .support-search:focus-within { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255,163,0,.1); } .support-filters .btn { height: 42px; padding: 0 16px; } .support-table { width: 100%; min-width: 880px; border-collapse: collapse; } .support-table th { padding: 14px 8px; color: #122359; font-size: 13px; font-weight: 700; text-align: left; border-bottom: 1px solid #e9edf4; } .support-table td { padding: 16px 8px; border-bottom: 1px solid #f0f2f6; vertical-align: middle; color: #122359; } .ticket-user { display: flex; align-items: center; gap: 10px; min-width: 180px; } .ticket-user img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; } .ticket-user h6 { margin: 0; color: #122359; font-size: 14px; } .ticket-user span, .ticket-description { display: block; margin-top: 3px; color: #6f80a3; font-size: 12px; } .ticket-description { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .ticket-status { display: inline-block; padding: 4px 11px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; } .support-review { padding: 7px 14px; font-size: 12px; white-space: nowrap; } .support-empty { display: grid; place-items: center; gap: 8px; padding: 44px; color: #7282a1; } .support-empty p { margin: 0; } .support-overlay { position: fixed; inset: 0; z-index: 1000; border: 0; background: rgba(18,35,89,.28); cursor: default; } .support-drawer { position: fixed; z-index: 1001; top: 0; right: 0; width: min(500px, 100vw); height: 100dvh; overflow-y: auto; background: #fff; box-shadow: -12px 0 40px rgba(18,35,89,.18); } .support-drawer-head { display: flex; justify-content: space-between; padding: 24px 26px 20px; border-bottom: 1px solid #edf0f5; } .drawer-eyebrow, .drawer-label { display: block; color: #8190ac; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; } .support-drawer h4 { margin: 4px 0 0; color: #122359; } .drawer-close { display: grid; width: 34px; height: 34px; place-items: center; border: 0; border-radius: 8px; color: #5e6e8d; background: #f3f5f9; cursor: pointer; } .ticket-summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 26px; background: #fbfcff; } .drawer-section { padding: 21px 26px; border-bottom: 1px solid #edf0f5; } .drawer-section h5 { margin: 5px 0 0; color: #122359; font-size: 16px; } .drawer-section p { margin: 6px 0 0; color: #657596; font-size: 14px; line-height: 1.55; } .mt-3 { margin-top: 18px; } .ticket-meta { display: flex; justify-content: space-between; gap: 8px; margin-top: 15px; color: #7181a0; font-size: 12px; } .ticket-meta span:first-child { display: flex; align-items: center; gap: 5px; } .conversation-section { padding-bottom: 14px; } .conversation-title { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; } .conversation-title h5 { margin: 0; } .conversation-title span { color: #8190ac; font-size: 11px; } .messages { display: grid; gap: 10px; } .message { max-width: 88%; padding: 12px 14px; border: 1px solid #e4e9f2; border-radius: 10px 10px 10px 2px; background: #f7f9fd; } .message.is-admin { justify-self: end; border-color: #ffe0a6; border-radius: 10px 10px 2px 10px; background: #fff8ea; } .message-author { color: #122359; font-size: 13px; font-weight: 700; } .message-author span { margin-left: 7px; color: #8290a9; font-size: 11px; font-weight: 500; } .message p { margin: 5px 0; color: #455675; font-size: 13px; line-height: 1.45; } .message time { color: #8290a9; font-size: 11px; } .reply-area { padding: 20px 26px 12px; } .reply-area label { color: #122359; font-size: 13px; font-weight: 700; } .reply-area > div { display: flex; gap: 8px; margin-top: 8px; } .reply-area textarea { flex: 1; padding: 10px; resize: vertical; border: 1px solid #dce2ef; border-radius: 7px; font: inherit; font-size: 13px; outline: none; } .reply-area textarea:focus { border-color: #ffa300; } .reply-send { align-self: end; display: flex; align-items: center; gap: 5px; padding: 10px 12px; white-space: nowrap; } .reply-send:disabled { cursor: not-allowed; opacity: .5; } .reply-area small { color: #8895ad; font-size: 11px; } .drawer-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 26px 24px; } .drawer-actions .btn { display: inline-flex; align-items: center; gap: 6px; } .resolved-note { display: flex; align-items: center; gap: 8px; margin: 20px 26px 10px; padding: 12px; border-radius: 8px; background: #e9f8ef; color: #277d4b; font-size: 13px; } @media (max-width: 850px) { .support-panel { padding: 16px; } .support-toolbar { align-items: stretch; flex-direction: column; } .support-filters { padding-bottom: 8px; } .support-filters input, .support-search { flex: 1; } } @media (max-width: 520px) { .support-drawer { width: 100vw; } .ticket-summary, .ticket-meta { align-items: flex-start; flex-direction: column; } .reply-area > div { flex-direction: column; } .reply-send { align-self: stretch; justify-content: center; } }
      `}</style>
      <style jsx>{`
        /* Compact, theme-aligned filter bar */
        .support-toolbar { align-items: center; min-height: 74px; }
        .support-tabs { align-self: stretch; align-items: end; flex: 0 0 auto; }
        .support-filters { width: auto !important; flex: 0 0 auto; flex-wrap: nowrap; align-items: center; justify-content: flex-end; padding: 0 0 10px; }
        .support-filters .support-search { width: 196px !important; min-width: 196px; flex: 0 0 196px; border-radius: 8px; background: #fbfcff; }
        .support-filters .support-search input { width: 100% !important; min-width: 0; background: transparent; }
        .support-filters select { width: 132px !important; min-width: 132px; flex: 0 0 132px; border-radius: 8px; background: #fbfcff; font-size: 13px; cursor: pointer; }
        .support-filters .filter-clear { height: 42px; min-width: 104px; border: 1px solid #f7b342; border-radius: 8px; background: #fff; color: #9a6200; font-size: 12px; font-weight: 700; box-shadow: none; }
        .support-filters .filter-clear:hover { background: #fff6e6; border-color: #ffa300; color: #122359; }

        /* Ticket conversation actions use the same orange/blue button language as the admin theme */
        .reply-area { margin: 0 18px 12px; padding: 16px; border: 1px solid #ffe0a6; border-radius: 12px; background: #fffaf1; }
        .reply-area > div { display: block; }
        .reply-area textarea { width: 100%; min-height: 92px; border-radius: 8px; background: #fff; }
        .reply-send { width: 100%; justify-content: center; margin-top: 10px; min-height: 42px; border-radius: 8px; background: #ffa300; border-color: #ffa300; color: #fff; font-weight: 700; box-shadow: 0 8px 16px rgba(255,163,0,.2); }
        .reply-send:hover:not(:disabled) { background: #122359; border-color: #122359; }
        .drawer-actions { justify-content: space-between; padding: 10px 26px 25px; }
        .drawer-actions .btn { min-height: 42px; border-radius: 8px; font-size: 13px; font-weight: 700; padding: 0 15px; }
        .drawer-actions .progress-action { border: 1px solid #f5b13a; background: #fff8eb; color: #a46600; }
        .drawer-actions .progress-action:hover { border-color: #ffa300; background: #fff0d2; color: #122359; }
        .drawer-actions .resolve-action { background: #ffa300; border-color: #ffa300; color: #fff; box-shadow: 0 8px 16px rgba(255,163,0,.18); }
        .drawer-actions .resolve-action:hover { background: #122359; border-color: #122359; }
        .support-table .action-column { padding-right: 8px; text-align: right; }
        .drawer-actions .progress-action, .drawer-actions .resolve-action { width: 160px; justify-content: center; }
        @media (max-width: 1120px) { .support-toolbar { align-items: stretch; flex-direction: column; } .support-tabs { min-height: 55px; } .support-filters { justify-content: flex-start; } }
        @media (max-width: 620px) { .support-filters { flex-wrap: wrap; } .support-filters .support-search { width: 100% !important; flex-basis: 100%; } .support-filters select { flex: 1 1 calc(50% - 4px); } }
      `}</style>
    </>
  )
}
