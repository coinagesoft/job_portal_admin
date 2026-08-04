'use client'
import { useState } from 'react'

export default function AdminSupportPage() {

  const [activeTab, setActiveTab] = useState('candidates')
const [selectedTicket, setSelectedTicket] = useState(null)
const [status, setStatus] = useState("");
const [category, setCategory] = useState("");
const [search, setSearch] = useState("");
  const candidateTickets = [
    { id: "SUP-4201", name: "John Carter", img: "avata1", issue: "Resume upload failed", category: "Profile", status: "Pending", date: "14 Apr 2026" },
    { id: "SUP-4202", name: "Aisha Khan", img: "avata2", issue: "Payment issue", category: "Billing", status: "Resolved", date: "12 Apr 2026" }
  ]

  const recruiterTickets = [
    { id: "SUP-5101", name: "TechFlow Pvt Ltd", img: "avata3", issue: "Job posting error", category: "Technical", status: "Pending", date: "15 Apr 2026" },
    { id: "SUP-5102", name: "NextHire Ltd", img: "avata4", issue: "Invoice mismatch", category: "Billing", status: "In Progress", date: "13 Apr 2026" }
  ]

  const data = activeTab === 'candidates' ? candidateTickets : recruiterTickets
const filteredData = data.filter((r) => {
  return (
    // search
    (r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.issue.toLowerCase().includes(search.toLowerCase())) &&

    // status
    (status === "" || r.status === status) &&

    // category
    (category === "" || r.category === category)
  );
});
  return (

    <>
   <div className="box-heading mb-3">
        <div className="box-title">
          <h3 className="mb-5">Help & Support</h3>
          <p className="font-sm color-text-paragraph-2">
    Manage user queries, resolve technical issues, and assist candidates and recruiters efficiently.
          </p>
        </div>

        <div className="box-breadcrumb">
          <div className="breadcrumbs mb-15" style={{border:"none" ,  backgroundColor:"revert"}}>
            <ul>
              <li>
                <a className="icon-home" href="/admin/dashboard">
                  Admin
                </a>
              </li>
              <li>
                <span>Help & Support</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    <div className="section-box">
      <div className="panel-white">

        {/* ================= TABS (LIKE YOUR THEME) ================= */}
        <div className="panel-head d-flex justify-content-between"
          style={{ flexWrap: 'wrap', gap: '12px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 0 }}>

          {/* Tabs */}
          <div className="d-flex align-items-end" style={{ overflowX: 'auto' }}>

            {['candidates', 'recruiters'].map(tab => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  borderBottom: activeTab === tab ? '2px solid #ffa300' : '2px solid transparent',
                  color: activeTab === tab ? '#ffa300' : '#888',
                  fontWeight: activeTab === tab ? 600 : 500,
                  fontSize: '14px'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}

                <span style={{
                  marginLeft: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: activeTab === tab ? '#ffc151' : '#f5f5f5',
                  color: activeTab === tab ? '#ffa300' : '#888',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {tab === 'candidates' ? candidateTickets.length : recruiterTickets.length}
                </span>

              </div>
            ))}

          </div>

          {/* Filter */}
        <div className="d-flex align-items-center" style={{ gap: "8px", flexWrap: "wrap", paddingBottom: "12px" }}>

  {/* Search */}
  <input
    className="form-control"
    placeholder="Search ticket..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ width: "180px" }}
  />

 <select
  className="form-control"
  style={{ width: "140px" }}
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="">Status</option>
  <option value="Pending">Pending</option>
  <option value="Resolved">Resolved</option>
  <option value="In Progress">In Progress</option>
</select>

  {/* Category */}
<select
  className="form-control"
  style={{ width: "140px" }}
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">Category</option>
  <option value="Billing">Billing</option>
  <option value="Technical">Technical</option>
  <option value="Profile">Profile</option>
</select>

  {/* Reset */}
<button
  className="btn btn-secondary"
  onClick={() => {
    setSearch("");
    setStatus("");
    setCategory("");
  }}
>
  Clear Filters
</button>

</div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="box-padding" style={{ overflowX: 'auto' }}>

          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>

            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th>User</th>
                <th>Issue</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((row) => {

                const statusStyle = {
                  'Pending': { color: '#e65100', bg: '#fff3e0' },
                  'Resolved': { color: '#2e7d32', bg: '#e8f5e9' },
                  'In Progress': { color: '#ffa300', bg: '#ffc151' }
                }[row.status]

                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f5f5f5' }}>

                    {/* USER */}
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={`/assets/imgs/page/dashboard/${row.img}.png`}
                          style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                        />
                        <div>
                          <h6>{row.name}</h6>
                          <span className="font-xs color-text-paragraph-2">{row.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* ISSUE */}
                    <td style={{ padding: '16px 8px' }}>
                      <span className="font-sm">{row.issue}</span>
                    </td>

                    {/* CATEGORY */}
                    <td style={{ padding: '16px 8px' }}>
                      <span className="font-sm color-text-paragraph-2">{row.category}</span>
                    </td>

                    {/* DATE */}
                    <td style={{ padding: '16px 8px' }}>
                      <span className="font-sm">{row.date}</span>
                    </td>

                    {/* STATUS */}
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        color: statusStyle.color,
                        background: statusStyle.bg
                      }}>
                        {row.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td style={{ textAlign: 'right' }}>
                      <a className="btn btn-default hover-up"
                      onClick={() => setSelectedTicket(row)}

                        style={{ padding: '6px 16px', fontSize: '13px' }}>
                        Review →
                      </a>
                    </td>

                  </tr>
                )
              })}
            </tbody>

          </table>

        </div>

      </div>
      {selectedTicket && (
  <div
    onClick={() => setSelectedTicket(null)}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.3)',
      zIndex: 9998
    }}
  />
)}
      {selectedTicket && (
  <div style={{
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: '100%',
    background: '#fff',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
    zIndex: 9999,
    overflowY: 'auto',
    transition: '0.3s'
  }}>

    <div className="p-20">

      {/* CLOSE */}
      <div className="d-flex justify-content-between align-items-center mb-15">
        <h5>Ticket Details</h5>
        <button
          className="btn btn-grey-small"
          onClick={() => setSelectedTicket(null)}
        >
          ✕
        </button>
      </div>

      {/* HEADER */}
      <div className="mb-15">
        <strong>{selectedTicket.id}</strong>
        <p className="font-sm color-text-paragraph-2 mb-0">
          {selectedTicket.name} · {selectedTicket.category}
        </p>
      </div>

      <hr />

      {/* ISSUE */}
      <div className="mb-15">
        <h6>Description</h6>
        <p className="font-sm">
          {selectedTicket.issue}
        </p>
      </div>

      {/* STATUS */}
      <div className="mb-15">
        <span className="btn btn-tags-sm">
          {selectedTicket.status}
        </span>
      </div>

      <hr />

      {/* CONVERSATION (dummy) */}
      <div className="mb-15">
        <h6>Conversation</h6>

        <div className="mb-10">
          <strong>User:</strong>
          <p className="font-sm mb-0">
            I am facing this issue since yesterday.
          </p>
        </div>

        <div>
          <strong>Admin:</strong>
          <p className="font-sm mb-0">
            We are checking this issue.
          </p>
        </div>
      </div>

      <hr />

      {/* REPLY */}
      <div className="mb-15">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Write reply..."
        />
      </div>

      {/* ACTIONS */}
      <div className="d-flex gap-2 flex-wrap">
        <button className="btn btn-default">Send Reply</button>
        <button className="btn btn-grey-small">Mark In Progress</button>
        <button className="btn btn-grey-small">Resolve</button>
      </div>

    </div>
  </div>
)}
    </div>
    </>
  )
}