'use client'

import { useState } from 'react'
import Footer from '../../../components/Footer'
import { useRouter } from 'next/navigation'
import { Clock, FileText, AlertTriangle, CheckCircle } from "lucide-react";

export default function VerificationQueuePage() {
  const [activeTab, setActiveTab] = useState('candidate')
  const [search, setSearch] = useState('')
  const router = useRouter()
const [filters, setFilters] = useState({
  priority: 'all',
  confidence: 'all'
})
const candidateRecords = [
  { name: 'Vikram Sahay', id: 'VER-9021', img: 'avata1', type: 'Candidate', date: '10/24/2023', time: '09:30 AM', priority: 'Urgent', confidence: 98 },
  { name: 'Sarah Jenkins', id: 'VER-8842', img: 'avata2', type: 'Candidate', date: '10/24/2023', time: '10:15 AM', priority: 'High', confidence: 85 },
  { name: 'Elena Rodriguez', id: 'VER-8655', img: 'avata4', type: 'Candidate', date: '10/24/2023', time: '11:45 AM', priority: 'High', confidence: 78 },
  { name: 'David Smith', id: 'VER-8540', img: 'avata5', type: 'Candidate', date: '10/24/2023', time: '12:30 PM', priority: 'Normal', confidence: 94 },
  { name: 'Priya Sharma', id: 'VER-8212', img: 'avata3', type: 'Candidate', date: '10/24/2023', time: '02:10 PM', priority: 'Normal', confidence: 90 },
]

const recruiterRecords = [
  { name: 'Global Marine Ltd', id: 'VER-8450', img: 'avata2', type: 'Recruiter', date: '10/24/2023', time: '01:10 PM', priority: 'High', confidence: 72 },
  { name: 'Oceanic Corp', id: 'VER-8321', img: 'avata3', type: 'Recruiter', date: '10/24/2023', time: '01:40 PM', priority: 'Urgent', confidence: 68 },
  { name: 'NexusGlobal Pvt Ltd', id: 'VER-8001', img: 'avata1', type: 'Recruiter', date: '10/24/2023', time: '03:20 PM', priority: 'Urgent', confidence: 88 },
  { name: 'Skyline Logistics', id: 'VER-7902', img: 'avata4', type: 'Recruiter', date: '10/24/2023', time: '03:50 PM', priority: 'Normal', confidence: 82 },
  { name: 'BlueWave Shipping', id: 'VER-7805', img: 'avata5', type: 'Recruiter', date: '10/24/2023', time: '04:20 PM', priority: 'High', confidence: 76 },
]

let records = activeTab === 'candidate' ? candidateRecords : recruiterRecords;

records = records.filter((r) => {
  const searchMatch =
    search === "" ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toString().toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase());

  // Priority filter
  if (filters.priority !== 'all' && r.priority !== filters.priority) {
    return false;
  }

  // Confidence filter
  if (filters.confidence !== 'all') {
    if (filters.confidence === 'high' && r.confidence < 90) return false;
    if (filters.confidence === 'medium' && (r.confidence < 80 || r.confidence > 90)) return false;
    if (filters.confidence === 'low' && r.confidence >= 80) return false;
  }

  return searchMatch; // ✅ IMPORTANT
});
  return (
    <>
      {/* PAGE HEADING */}
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-5">Verification Queue</h3>
          <p className="font-sm color-text-paragraph-2">Manage and process pending identity and business verifications.</p>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs">
            <ul>
              <li><a className="icon-home" href="/dashboard">Admin</a></li>
              <li><span>Verifications</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── ROW 1: 4 STAT CARDS ── */}
      <div className="section-box mt-3">
        <div className="row">

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">
                <img src="/assets/imgs/page/dashboard/tasks.svg" alt="jobBox" style={{height:'28px'}} />
              </div>
              <div className="card-info">
                <div className="card-title"><h3>142</h3></div>
                <p className="color-text-paragraph-2">Total Pending</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">
  <FileText size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <div className="card-title"><h3>28</h3></div>
                <p className="color-text-paragraph-2">Employer Docs</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">
  <AlertTriangle size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <div className="card-title"><h3>12</h3></div>
                <p className="color-text-paragraph-2">Low Confidence</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">
  <CheckCircle size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <div className="card-title"><h3>64</h3></div>
                <p className="color-text-paragraph-2">Verified Today</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── MAIN TABLE PANEL ── */}
      <div className="section-box">
        <div className="panel-white">
<div
  className="d-flex align-items-center"
  style={{
    gap: '10px',
    paddingBottom: '12px',
    flexWrap: 'nowrap',
    overflowX: 'auto'
  }}
>

  {/* Search */}
  <input
    className="form-control"
    placeholder="Search..."
    value={search}

    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: '620px',
      minWidth: '180px',
      fontSize: '13px'
    }}
  />

  {/* Priority */}
  <select
    className="form-control"
    style={{ width: '130px', fontSize: '13px' }}
    value={filters.priority}
    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
  >
    <option value="all">Priority</option>
    <option value="Urgent">Urgent</option>
    <option value="High">High</option>
    <option value="Normal">Normal</option>
  </select>

  {/* Confidence */}
  <select
    className="form-control"
    style={{ width: '150px', fontSize: '13px' }}
    value={filters.confidence}
    onChange={(e) => setFilters({ ...filters, confidence: e.target.value })}
  >
    <option value="all">AI Confidence</option>
    <option value="high">Above 90%</option>
    <option value="medium">80–90%</option>
    <option value="low">Below 80%</option>
  </select>

  {/* Reset */}
  <button
    className="btn btn-secondary"
    style={{ whiteSpace: 'nowrap' }}
 onClick={() => {
    setFilters({ priority: 'all', confidence: 'all' });
    setSearch(""); // ✅ CLEAR SEARCH ALSO
  }}  >
                      Clear Filters
  </button>

</div>
          {/* Tabs + Filter/Sort */}
          <div className="panel-head d-flex justify-content-between" style={{ flexWrap: 'wrap', gap: '12px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '0' }}>

            {/* Tab bar */}
            <div className="d-flex align-items-end" style={{ gap: '0', overflowX: 'auto' }}>

  {/* Candidate Tab */}
  <div onClick={() => setActiveTab('candidate')} style={{
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: activeTab === 'candidate' ? '2px solid #ffa300' : '2px solid transparent',
    color: activeTab === 'candidate' ? '#ffa300' : '#888',
    fontWeight: 600,
    fontSize: '14px'
  }}>
    Candidate Verification
    <span style={{
      marginLeft: '8px',
      fontSize: '11px',
      fontWeight: 700,
      background: activeTab === 'candidate' ? '#ffc151' : '#f5f5f5',
      color: activeTab === 'candidate' ? '#ffa300' : '#888',
      padding: '2px 8px',
      borderRadius: '10px'
    }}>
      {candidateRecords.length}
    </span>
  </div>

  {/* Recruiter Tab */}
  <div onClick={() => setActiveTab('recruiter')} style={{
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: activeTab === 'recruiter' ? '2px solid #ffa300' : '2px solid transparent',
    color: activeTab === 'recruiter' ? '#ffa300' : '#888',
    fontWeight: 600,
    fontSize: '14px'
  }}>
    Recruiter Verification
    <span style={{
      marginLeft: '8px',
      fontSize: '11px',
      fontWeight: 700,
      background: activeTab === 'recruiter' ? '#ffc151' : '#f5f5f5',
      color: activeTab === 'recruiter' ? '#ffa300' : '#888',
      padding: '2px 8px',
      borderRadius: '10px'
    }}>
      {recruiterRecords.length}
    </span>
  </div>

</div>



          </div>

          {/* Table */}
          <div className="box-padding" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '12px 0', width: '36px' }}>
                  </th>
                  <th >
                    User / Entity
                  </th>
                  <th >
                    Type
                  </th>
                  <th >
                    Submitted
                  </th>
                  <th >
                    Priority
                  </th>
                  <th >
                    AI Confidence
                  </th>
                  <th >
                    Actions
                  </th>
                </tr>
              </thead>
           <tbody>
  {records.map((row) => {
                
                  const priorityStyle = {
                    'Urgent': { color: '#c62828', bg: '#fdecea', border: '#ef9a9a' },
                    'High':   { color: '#e65100', bg: '#fff3e0', border: '#ffcc80' },
                    'Normal': { color: '#555',    bg: '#f5f5f5', border: '#ddd'    },
                  }[row.priority]

                  const confColor = row.confidence >= 90 ? '#2e7d32' : row.confidence >= 80 ? '#ffa300' : '#e65100'

                  return (
                    <tr key={row.id} className="hover-up" style={{ borderBottom: '1px solid #f5f5f5' }}>

                      {/* Checkbox */}
                      <td >
                      </td>

                      {/* User / Entity */}
                      <td style={{ padding: '16px 8px' }} className='align-middle'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={`/assets/imgs/page/dashboard/${row.img}.png`} alt={row.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                          <div>
                            <h6>{row.name}</h6>
                            <span className="font-sm color-text-paragraph-2">{row.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '16px 8px' }}>
                        <span className="font-sm color-text-paragraph-2">{row.type}</span>
                      </td>

                      {/* Submitted */}
                      <td style={{ padding: '16px 8px', whiteSpace: 'nowrap' }}>
                        <h6>{row.date}</h6>
                        <span className="font-xs color-text-paragraph-2">{row.time}</span>
                      </td>

                      {/* Priority */}
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
                          color: priorityStyle.color, background: priorityStyle.bg,
                          border: `1px solid ${priorityStyle.border}`, whiteSpace: 'nowrap'
                        }}>{row.priority}</span>
                      </td>

                      {/* AI Confidence */}
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '120px' }}>
                          <div style={{ flex: 1, height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${row.confidence}%`, height: '100%',
                              background: confColor, borderRadius: '3px'
                            }}></div>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: confColor, minWidth: '36px' }}>
                            {row.confidence}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 0', textAlign: 'right' }} >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                       
                         <button
  className="btn btn-default hover-up"
  style={{
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: 600
  }}
  onClick={() => {
    if (activeTab === "candidate") {
      router.push(`/admin/verifications/preview/?${row.id}`)
    } else {
      router.push(`/admin/recruiters/Edit?${row.id}`)
    }
  }}
>
  Review ›
</button>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
              <div className="paginations mt-25">
        <div className="row align-items-center g-2">
          <div className="col-lg-6">
            <p className="font-sm color-text-paragraph-2 mb-0">
              Showing 1–6 of <strong>3,248</strong> candidates
            </p>
          </div>

          <div className="col-lg-6 text-lg-end">
            <ul className="pager justify-content-lg-end">
              <li><a className="pager-prev"></a></li>
              <li><a className="pager-number active">1</a></li>
              <li><a className="pager-next"></a></li>
            </ul>
          </div>
        </div>
      </div>

        </div>
      </div>

      {/* ── BOTTOM ROW: COMPLIANCE REMINDER + WORKLOAD STATUS ── */}
      <div className="row">

        {/* Compliance Reminder */}
        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12">
          <div className="section-box">
            <div className="panel-white" style={{ background: '#f0f6ff', border: '1px solid #bdd4f5' }}>
              <div className="panel-body">
                <div className="d-flex align-items-center mb-15" style={{ gap: '10px' }}>
                  <h5 className="mb-0" style={{ color: '#ffa300' }}>Compliance Reminder</h5>
                </div>
                <p className="font-sm color-text-paragraph-2 mb-15" style={{ lineHeight: 1.7 }}>
                  All verification decisions are logged for audit purposes. Ensure you have
                  reviewed both the <strong>National ID</strong> and the <strong>AI Liveness Score</strong> before
                  final approval. For international users, verify against the global sanctions list.
                </p>
                <a className="font-sm color-brand-1" href="#" style={{ fontWeight: 600 }}>
                  View Compliance Guidelines
                </a>
              </div>
            </div>
          </div>
        </div>

       

      </div>

      <Footer />
    </>
  )
}