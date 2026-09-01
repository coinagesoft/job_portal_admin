'use client'

import { useEffect, useState, useMemo } from 'react'
import { CheckCircle2, Clock3, MessageSquareText, Search, Send, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { supportTicketService } from '../../../services/supportTicketService'
import Footer from '../../../components/Footer'

const statusStyle = {
  Pending: { color: '#c76b00', background: '#fff3df' },
  'In Progress': { color: '#996000', background: '#fff0c8' },
  Resolved: { color: '#21844c', background: '#e6f7ed' },
}

const getStatusLabel = (status) => {
  if (status === 'Open') return 'Pending';
  if (status === 'InProgress') return 'In Progress';
  return status || 'Pending';
};

const categoryMap = {
  ProfileAndResume: 'Profile & Resume',
  JobApplication: 'Job Application',
  PaymentAndBilling: 'Payment & Billing',
  AccountAccess: 'Account Access',
  TechnicalIssue: 'Technical Issue',
  JobPosting: 'Job Posting',
  CandidateSearch: 'Candidate Search',
  Other: 'Other'
};

const getCategoryLabel = (categoryKey) => {
  return categoryMap[categoryKey] || categoryKey || 'Other';
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

const getAvatarUrl = (avatarUrl, name, index) => {
  if (avatarUrl) return avatarUrl;
  const avatars = ['avata1.png', 'avata2.png', 'avata3.png', 'avata4.png'];
  const filename = avatars[index % 4];
  return `/assets/imgs/page/dashboard/${filename}`;
};

export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState('candidates') // 'candidates' | 'recruiters'
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [reply, setReply] = useState('')

  const [allTickets, setAllTickets] = useState([])
  const [summary, setSummary] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [detailTicket, setDetailTicket] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [sendingReply, setSendingReply] = useState(false)

  // Fetch summary metrics
  const fetchSummary = async () => {
    try {
      const data = await supportTicketService.getSummary();
      setSummary(data);
    } catch (e) {
      console.error('Failed to fetch support summary:', e);
    }
  };

  // Fetch ALL support tickets (enables 100% correct client-side filtering to bypass backend query bugs)
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await supportTicketService.getTickets({
        page: 1,
        pageSize: 1000
      });

      if (data && data.items) {
        setAllTickets(data.items);
      } else {
        setAllTickets([]);
      }
    } catch (e) {
      console.error('Failed to fetch support tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering logic
  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      // 1. Filter by Active Tab
      const type = ticket.raisedByType?.toLowerCase();
      if (activeTab === 'candidates') {
        if (type !== 'candidate') return false;
      } else {
        if (type !== 'recruiter' && type !== 'employer') return false;
      }

      // 2. Filter by Search Query
      if (search) {
        const query = search.toLowerCase();
        const matchesName = ticket.raisedByName?.toLowerCase().includes(query);
        const matchesSubject = ticket.subject?.toLowerCase().includes(query);
        const matchesId = ticket.ticketId?.toLowerCase().includes(query);
        if (!matchesName && !matchesSubject && !matchesId) return false;
      }

      // 3. Filter by Status
      if (status) {
        const uiStatus = getStatusLabel(ticket.status);
        if (uiStatus !== status) return false;
      }

      // 4. Filter by Category
      if (category && ticket.category !== category) return false;

      return true;
    });
  }, [allTickets, activeTab, search, status, category]);

  // Client-side pagination logic
  const paginatedTickets = useMemo(() => {
    const startIndex = (page - 1) * 10;
    return filteredTickets.slice(startIndex, startIndex + 10);
  }, [filteredTickets, page]);

  // Dynamic totalPages based on filtered items count
  const totalPages = useMemo(() => {
    return Math.ceil(filteredTickets.length / 10) || 1;
  }, [filteredTickets]);

  // Fetch ticket details when drawer is opened
  const fetchTicketDetails = async (id) => {
    setLoadingDetail(true);
    try {
      const data = await supportTicketService.getTicketDetails(id);
      setDetailTicket(data);
    } catch (e) {
      console.error('Failed to fetch ticket details:', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSummary();
    fetchTickets();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, status, category, search]);

  // Load ticket details when selectedTicketId changes
  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetails(selectedTicketId);
    } else {
      setDetailTicket(null);
    }
  }, [selectedTicketId]);

  const sendReply = async () => {
    const text = reply.trim();
    if (!text || !selectedTicketId) return;
    setSendingReply(true);
    try {
      await supportTicketService.replyTicket(selectedTicketId, text);
      setReply('');
      // Refresh current ticket conversation and summary/list metrics
      await fetchTicketDetails(selectedTicketId);
      fetchSummary();
      fetchTickets();
    } catch (e) {
      alert(e.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

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
              <button 
                type="button" 
                className={`support-tab ${activeTab === 'candidates' ? 'is-active' : ''}`} 
                onClick={() => { setActiveTab('candidates'); setSelectedTicketId(null) }}
              >
                Candidates <span>{summary?.candidateTotal || 0}</span>
              </button>
              <button 
                type="button" 
                className={`support-tab ${activeTab === 'recruiters' ? 'is-active' : ''}`} 
                onClick={() => { setActiveTab('recruiters'); setSelectedTicketId(null) }}
              >
                Recruiters <span>{summary?.recruiterTotal || 0}</span>
              </button>
            </div>
            <div className="support-filters">
              <label className="support-search">
                <Search size={16} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ticket..." aria-label="Search tickets" />
              </label>
              <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
                <option value="">Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
                <option value="">Category</option>
                {activeTab === 'candidates' ? (
                  <>
                    <option value="ProfileAndResume">Profile &amp; Resume</option>
                    <option value="JobApplication">Job Application</option>
                  </>
                ) : (
                  <>
                    <option value="JobPosting">Job Posting</option>
                    <option value="CandidateSearch">Candidate Search</option>
                  </>
                )}
                <option value="PaymentAndBilling">Payment &amp; Billing</option>
                <option value="AccountAccess">Account Access</option>
                <option value="TechnicalIssue">Technical Issue</option>
                <option value="Other">Other</option>
              </select>
              <button type="button" className="btn btn-grey-small filter-clear" onClick={() => { setSearch(''); setStatus(''); setCategory('') }}>Clear Filters</button>
            </div>
          </div>

          <div className="box-padding support-table-wrap" style={{ position: 'relative', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #ff9900',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : (
              <>
                <table className="support-table">
                  <thead>
                    <tr style={{fontSize:"14px"}}>
                      <th style={{fontSize:"14px"}}>{activeTab === 'candidates' ? 'Candidate' : 'Recruiter'}</th>
                      <th style={{fontSize:"14px"}}>Subject / Issue</th>
                      <th style={{fontSize:"14px"}}>Category</th>
                      <th style={{fontSize:"14px"}}>Raised on</th>
                      <th style={{fontSize:"14px"}}>Status</th>
                      <th className="action-column" style={{fontSize:"14px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTickets.map((ticket, index) => {
                      const uiStatus = getStatusLabel(ticket.status);
                      return (
                        <tr key={ticket.ticketId}>
                          <td>
                            <div className="ticket-user">
                              {/* <img src={getAvatarUrl(ticket.raisedByAvatarUrl, ticket.raisedByName, index)} alt="" /> */}
                              <div>
                                <h6 style={{fontSize:"16px"}}>{ticket.raisedByName}</h6>
                                <span style={{fontSize:"14px" , color :"#66789C"}}>{ticket.ticketId.slice(0, 8).toUpperCase()}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ maxWidth: '300px' }}>
                            <strong style={{fontSize:"16px", display: 'block', wordBreak: 'break-word'}}> {ticket.subject}</strong>
                            <span style={{fontSize:"14px" , color :"#66789C"}} className="ticket-description">{ticket.descriptionPreview}</span>
                          </td>
                          <td>
                            <span className="font-sm color-text-paragraph-2">
                              {getCategoryLabel(ticket.category)}
                            </span>
                          </td>
                          <td>
                            <span className="font-sm">{formatDate(ticket.createdAt)}</span>
                          </td>
                          <td>
                            <span className="ticket-status" style={statusStyle[uiStatus]}>
                              {uiStatus}
                            </span>
                          </td>
                          <td className="text-end">
                            <button type="button" className="btn btn-default support-review" style={{ fontSize: '13px', fontWeight: 600 }} onClick={() => { setSelectedTicketId(ticket.ticketId); setReply('') }}>
                              Review <span aria-hidden="true">→</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!filteredTickets.length && (
                  <div className="support-empty">
                    <MessageSquareText size={26} />
                    <p>No support tickets match these filters.</p>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px', padding: '10px 0' }}>
                    <button
                      type="button"
                      className="btn btn-grey-small"
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', minHeight: '38px', borderRadius: '6px' }}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <span className="font-sm color-text-paragraph-2" style={{ fontWeight: '600' }}>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      className="btn btn-grey-small"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', minHeight: '38px', borderRadius: '6px' }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedTicketId && (
        <>
          <button type="button" aria-label="Close ticket details" className="support-overlay" onClick={() => setSelectedTicketId(null)} />
          <aside className="support-drawer" aria-label="Ticket details">
            {loadingDetail || !detailTicket ? (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Loader2 className="animate-spin text-primary" size={32} style={{ animation: 'spin 1s linear infinite', color: '#ff9900' }} />
                <span className="mt-2 font-sm color-text-paragraph-2">Loading details...</span>
              </div>
            ) : (
              <>
                <div className="support-drawer-head">
                  <div>
                    <span className="drawer-eyebrow">
                      {activeTab === 'candidates' ? 'Candidate ticket' : 'Recruiter ticket'}
                    </span>
                    <h4>{detailTicket.ticketId.slice(0, 8).toUpperCase()}</h4>
                  </div>
                  <button type="button" className="drawer-close" onClick={() => setSelectedTicketId(null)} aria-label="Close">
                    <X size={20} />
                  </button>
                </div>
                <div className="ticket-summary">
                  <div className="ticket-user">
                    <img src={getAvatarUrl(detailTicket.raisedByAvatarUrl, detailTicket.raisedByName, 0)} alt="" />
                    <div>
                      <h6>{detailTicket.raisedByName}</h6>
                      <span>{activeTab === 'candidates' ? 'Candidate' : 'Recruiter'} · {getCategoryLabel(detailTicket.category)}</span>
                    </div>
                  </div>
                  <div className="ticket-status-group">
                    <span className="status-pair-label">
                      Status
                      <span className="ticket-status" style={statusStyle[getStatusLabel(detailTicket.status)]}>
                        {getStatusLabel(detailTicket.status)}
                      </span>
                    </span>
                  </div>
                </div>
                <section className="drawer-section">
                  <span className="drawer-label">Subject</span>
                  <h5>{detailTicket.subject}</h5>
                  <span className="drawer-label mt-3">Description</span>
                  <p>{detailTicket.description}</p>
                  <div className="ticket-meta">
                    <span><Clock3 size={14} /> Raised {formatDate(detailTicket.createdAt)}</span>
                    <span>{detailTicket.replies ? detailTicket.replies.length : 0} message{(detailTicket.replies ? detailTicket.replies.length : 0) !== 1 ? 's' : ''}</span>
                  </div>
                </section>
                <section className="drawer-section conversation-section">
                  <div className="conversation-title">
                    <h5>Conversation</h5>
                    <span>Visible to {activeTab === 'candidates' ? 'candidate' : 'recruiter'}</span>
                  </div>
                  <div className="messages">
                    {detailTicket.replies && detailTicket.replies.map((replyItem, index) => {
                      const isMine = replyItem.senderType === 'Admin';
                      const author = replyItem.senderName || (isMine ? 'Admin' : detailTicket.raisedByName);
                      const timeString = formatDate(replyItem.createdAt) + ', ' + new Date(replyItem.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                      return (
                        <article className={`message ${isMine ? 'is-admin' : ''}`} key={`${replyItem.replyId}-${index}`}>
                          <div className="message-author">
                            {author}
                            <span>{replyItem.senderType}</span>
                          </div>
                          <p>{replyItem.message}</p>
                          <time>{timeString}</time>
                        </article>
                      );
                    })}
                  </div>
                </section>

                {detailTicket.status !== 'Resolved' ? (
                  <div className="reply-area">
                    <label htmlFor="admin-reply">Reply to {detailTicket.raisedByName}</label>
                    <div>
                      <textarea 
                        id="admin-reply" 
                        value={reply} 
                        onChange={(event) => setReply(event.target.value)} 
                        onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') sendReply() }} 
                        placeholder="Write a helpful reply..." 
                        rows="3" 
                      />
                      <button 
                        type="button" 
                        className="btn btn-default reply-send" 
                        onClick={sendReply} 
                        disabled={!reply.trim() || sendingReply}
                      >
                        {sendingReply ? (
                          <Loader2 className="animate-spin" size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Send size={16} />
                        )} 
                        Send Reply
                      </button>
                    </div>
                    <small>Press Ctrl/Cmd + Enter to send</small>
                  </div>
                ) : (
                  <div className="resolved-note">
                    <CheckCircle2 size={18} /> This ticket is resolved and closed.
                  </div>
                )}
              </>
            )}
          </aside>
        </>
      )}

      <style jsx>{`
        .support-panel { padding: 20px 28px 12px; border-radius: 16px; } .support-toolbar { display: flex; justify-content: space-between; gap: 18px; align-items: end; border-bottom: 1px solid #edf0f6; } .support-tabs { display: flex; gap: 8px; } .support-tab { padding: 13px 12px 14px; background: none; border: 0; border-bottom: 2px solid transparent; color: #697a9f; font-weight: 600; cursor: pointer; } .support-tab.is-active { color: #f59b00; border-color: #ffa300; } .support-tab span { margin-left: 6px; padding: 1px 7px; border-radius: 10px; font-size: 11px; background: #f1f3f6; } .support-tab.is-active span { color: #b06d00; background: #fff0cf; } .support-filters { display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 12px; } .support-filters input, .support-filters select { height: 42px; min-width: 128px; padding: 0 12px; border: 1px solid #dce2ef; border-radius: 5px; color: #657596; background: #fff; outline: none; } .support-search { display: flex; align-items: center; gap: 8px; height: 42px; padding: 0 11px; border: 1px solid #dce2ef; border-radius: 5px; color: #8c9ab4; } .support-search input { min-width: 145px; height: auto; padding: 0; border: 0; } .support-filters select:focus, .support-search:focus-within { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255,163,0,.1); } .support-filters .btn { height: 42px; padding: 0 16px; } .support-table { width: 100%; min-width: 980px; border-collapse: collapse; } .support-table th { padding: 14px 8px; color: #122359; font-size: 13px; font-weight: 700; text-align: left; border-bottom: 1px solid #e9edf4; } .support-table td { padding: 16px 8px; border-bottom: 1px solid #f0f2f6; vertical-align: middle; color: #122359; } .ticket-user { display: flex; align-items: center; gap: 10px; min-width: 180px; } .ticket-user img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; } .ticket-user h6 { margin: 0; color: #122359; font-size: 14px; } .ticket-user span, .ticket-description { display: block; margin-top: 3px; color: #6f80a3; font-size: 12px; } .ticket-description { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .ticket-status { display: inline-block; padding: 4px 11px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; } .support-review { padding: 7px 14px; font-size: 12px; white-space: nowrap; } .support-empty { display: grid; place-items: center; gap: 8px; padding: 44px; color: #7282a1; } .support-empty p { margin: 0; } .support-overlay { position: fixed; inset: 0; z-index: 1000; border: 0; background: rgba(18,35,89,.28); cursor: default; } .support-drawer { position: fixed; z-index: 1001; top: 0; right: 0; width: min(500px, 100vw); height: 100dvh; overflow-y: auto; background: #fff; box-shadow: -12px 0 40px rgba(18,35,89,.18); } .support-drawer-head { display: flex; justify-content: space-between; padding: 24px 26px 20px; border-bottom: 1px solid #edf0f5; } .drawer-eyebrow, .drawer-label { display: block; color: #8190ac; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; } .support-drawer h4 { margin: 4px 0 0; color: #122359; } .drawer-close { display: grid; width: 34px; height: 34px; place-items: center; border: 0; border-radius: 8px; color: #5e6e8d; background: #f3f5f9; cursor: pointer; } .ticket-summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 26px; background: #fbfcff; } .ticket-status-group { display: flex; gap: 14px; } .status-pair-label { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; color: #8190ac; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; } .user-resolved-note { margin: 0 26px 20px; background: #eaf1ff; color: #2a5bb0; } .drawer-section { padding: 21px 26px; border-bottom: 1px solid #edf0f5; } .drawer-section h5 { margin: 5px 0 0; color: #122359; font-size: 16px; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; } .drawer-section p { margin: 6px 0 0; color: #657596; font-size: 14px; line-height: 1.55; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; } .mt-3 { margin-top: 18px; } .ticket-meta { display: flex; justify-content: space-between; gap: 8px; margin-top: 15px; color: #7181a0; font-size: 12px; } .ticket-meta span:first-child { display: flex; align-items: center; gap: 5px; } .conversation-section { padding-bottom: 14px; } .conversation-title { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; } .conversation-title h5 { margin: 0; } .conversation-title span { color: #8190ac; font-size: 11px; } .messages { display: grid; gap: 10px; } .message { max-width: 88%; padding: 12px 14px; border: 1px solid #e4e9f2; border-radius: 10px 10px 10px 2px; background: #f7f9fd; } .message.is-admin { justify-self: end; border-color: #ffe0a6; border-radius: 10px 10px 2px 10px; background: #fff8ea; } .message-author { color: #122359; font-size: 13px; font-weight: 700; } .message-author span { margin-left: 7px; color: #8290a9; font-size: 11px; font-weight: 500; } .message p { margin: 5px 0; color: #455675; font-size: 13px; line-height: 1.45; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; } .message time { color: #8290a9; font-size: 11px; } .reply-area { padding: 20px 26px 12px; } .reply-area label { color: #122359; font-size: 13px; font-weight: 700; } .reply-area > div { display: flex; gap: 8px; margin-top: 8px; } .reply-area textarea { flex: 1; padding: 10px; resize: vertical; border: 1px solid #dce2ef; border-radius: 7px; font: inherit; font-size: 13px; outline: none; } .reply-area textarea:focus { border-color: #ffa300; } .reply-send { align-self: end; display: flex; align-items: center; gap: 5px; padding: 10px 12px; white-space: nowrap; } .reply-send:disabled { cursor: not-allowed; opacity: .5; } .reply-area small { color: #8895ad; font-size: 11px; } .resolved-note { display: flex; align-items: center; gap: 8px; margin: 20px 26px 10px; padding: 12px; border-radius: 8px; background: #e9f8ef; color: #277d4b; font-size: 13px; } @media (max-width: 850px) { .support-panel { padding: 16px; } .support-toolbar { align-items: stretch; flex-direction: column; } .support-filters { padding-bottom: 8px; } .support-filters input, .support-search { flex: 1; } } @media (max-width: 520px) { .support-drawer { width: 100vw; } .ticket-summary, .ticket-meta { align-items: flex-start; flex-direction: column; } .reply-area > div { flex-direction: column; } .reply-send { align-self: stretch; justify-content: center; } }
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
        .support-table .action-column { padding-right: 8px; text-align: right; }
        @media (max-width: 1120px) { .support-toolbar { align-items: stretch; flex-direction: column; } .support-tabs { min-height: 55px; } .support-filters { justify-content: flex-start; } }
        @media (max-width: 620px) { .support-filters { flex-wrap: wrap; } .support-filters .support-search { width: 100% !important; flex-basis: 100%; } .support-filters select { flex: 1 1 calc(50% - 4px); } }
      `}</style>
      <Footer />
    </>
  )
}