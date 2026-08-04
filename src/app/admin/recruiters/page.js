'use client'

import Footer from "../../../components/Footer"
import Link from "next/link"
import { Building, Clock, ShieldCheck, FileText } from "lucide-react";
import { useState } from "react";


const recruiters = [
  {
    id: 1,
    logo: "user1.png",
    company: "TechNova Solutions",
    sector: "Information Technology",
    person: "Sarah Jenkins",
    email: "sarah@technova.io",
    plan: "Paid",
    gst: "Verified",
    status: "Active",
    registered: "2023-10-12"
  },
  {
    id: 2,
    logo: "user2.png",
    company: "GreenLeaf Organic",
    sector: "Retail & FMCG",
    person: "Marcus Vane",
    email: "marcus@greenleaf.com",
    plan: "Trial",
    gst: "Pending",
    status: "Pending",
    registered: "2024-01-05"
  },
  {
    id: 3,
    logo: "user3.png",
    company: "Stellar Logistics",
    sector: "Supply Chain",
    person: "Rajesh Kumar",
    email: "rajesh@stellar.com",
    plan: "Paid",
    gst: "Rejected",
    status: "Suspended",
    registered: "2023-08-20"
  },
  {
    id: 4,
    logo: "user4.png",
    company: "CloudBridge Systems",
    sector: "Cloud Services",
    person: "Emily Chen",
    email: "emily@cloudbridge.com",
    plan: "Paid",
    gst: "Verified",
    status: "Active",
    registered: "2023-11-28"
  },
  {
    id: 5,
    logo: "user5.png",
    company: "Astra Finance",
    sector: "Banking & Finance",
    person: "David Miller",
    email: "david@astrafin.com",
    plan: "Trial",
    gst: "Verified",
    status: "Active",
    registered: "2024-01-15"
  }
]

export default function RecruiterPage() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [gst, setGst] = useState("");
  const [status, setStatus] = useState("");
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' }
      case 'Pending':
        return { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' }
      case 'Suspended':
        return { bg: '#fdecea', color: '#c62828', border: '#ef9a9a' }
      default:
        return { bg: '#f5f5f5', color: '#555', border: '#ddd' }
    }
  }
  const filteredRecruiters = recruiters.filter((r) => {
    return (
      (r.company.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())) &&
      (plan === "" || r.plan === plan) &&
      (gst === "" || r.gst === gst) &&
      (status === "" || r.status === status)
    );
  });
  return (
    <>

      {/* Header */}
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-5">Recruiter Management</h3>
          <p className="font-sm color-text-paragraph-2">
            Manage employer accounts, verifications and subscription tiers.
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
                <span>Recruiters</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Stats */}
      <div className="section-box mt-20">
        <div className="row g-3 align-items-stretch">

          {/* 1 */}
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 d-flex">
            <div className="card-style-1 hover-up w-100">
              <div className="card-image">
                <img src="/assets/imgs/page/dashboard/candidates.svg" alt="" />
              </div>
              <div className="card-info">
                <div className="card-title">
                  <h3>
                    1,284
                    <span className="font-sm status up ms-2">+12%</span>
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Total Employers</p>
              </div>
            </div>
          </div>

          {/* 2 */}
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 d-flex">
            <div className="card-style-1 hover-up w-100">
              <div className="card-image">
                <img src="/assets/imgs/page/dashboard/tasks.svg" alt="" />
              </div>
              <div className="card-info">
                <div className="card-title">
                  <h3>
                    24 <br></br>
                    <span className="font-sm status down ms-2">Pending</span>
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Pending Approvals</p>
              </div>
            </div>
          </div>

          {/* 3 */}
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 d-flex">
            <div className="card-style-1 hover-up w-100">
              <div className="card-image">
                <ShieldCheck size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <div className="card-title">
                  <h3>
                    92% <br></br>
                    <span className="font-sm status up ms-2">GST</span>
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Verification Rate</p>
              </div>
            </div>
          </div>

          {/* 4 */}
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 d-flex">
            <div className="card-style-1 hover-up w-100">
              <div className="card-image">
                <FileText size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <div className="card-title">
                  <h3>
                    842 <br></br>
                    <span className="font-sm status up ms-2">+5%</span>
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Active Recruiters</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Search + Filters */}
     

      {/* Table */}
      <div className="section-box">
        <div className="panel-white">
          <div className="box-padding">
   <div className="row g-3 align-items-end mb-3">

              <div className="col-xl-5 col-lg-12">
                <label className="font-sm mb-10">
                  Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Company, Email or GST..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}

                />
              </div>

              <div className="col-xl-7 col-lg-12">
                <div className="row g-2 align-items-end">

                  {/* Plan */}
                  <div className="col-md-3 col-6">
                    <select
                      className="form-control filter-select"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                    >
                      <option value="">Plan: All</option>
                      <option value="Paid">Paid</option>
                      <option value="Trial">Trial</option>
                    </select>
                  </div>

                  {/* GST */}
                  <div className="col-md-3 col-6">
                    <select
                      className="form-control filter-select"
                      value={gst}
                      onChange={(e) => setGst(e.target.value)}
                    >
                      <option value="">GST: All</option>
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Status (FIXED) */}
                  <div className="col-md-3 col-6">
                    <select
                      className="form-control filter-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Status: All</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Clear */}
                  <div className="col-md-3 col-6">
                    <button className="btn btn-secondary w-100 h-100 py-3  "
                      onClick={() => {
    setSearch("");
    setStatus("");
      setPlan("");
        setGst("");
  }}
                    >
                      Clear Filters
                    </button>
                  </div>

                </div>
              </div>




            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">

                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ minWidth: "260px" }}>
                      Employer / Company
                    </th>
                    <th style={{ minWidth: "220px" }}>
                      Contact Person
                    </th>
                    <th style={{ minWidth: "50px" }} className="text-center">Plan</th>
                    <th style={{ minWidth: "120px" }}>GST Status</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecruiters.map((r) => (
                    <tr key={r.id}>

                      {/* Company */}
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <img
                            src={`/assets/imgs/page/candidates/${r.logo}`}
                            style={{
                              width: "46px",
                              height: "46px",
                              borderRadius: "50%",
                              objectFit: "cover"
                            }}
                          />

                          <div className="ms-3">
                            <h6 className="mb-0">{r.company}</h6>
                            <span className="font-sm color-text-paragraph-2">
                              {r.sector}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td>
                        <h6 className="mb-0">{r.person}</h6>
                        <span className="font-sm color-text-paragraph-2">
                          {r.email}
                        </span>
                      </td>

                      {/* Plan */}
                      <td>
                        {(() => {
                          const gstStyle =
                            r.plan === 'Paid'
                              ? { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' }
                              : r.plan === 'Trail'
                                ? { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' }
                                : { bg: '#fdecea', color: '#c62828', border: '#ef9a9a' }

                          return (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: gstStyle.bg,
                                color: gstStyle.color,
                                border: `1px solid ${gstStyle.border}`
                              }}
                            >
                              {r.plan}
                            </span>
                          )
                        })()}
                      </td>

                      {/* GST */}
                      <td>
                        {(() => {
                          const gstStyle =
                            r.gst === 'Verified'
                              ? { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' }
                              : r.gst === 'Pending'
                                ? { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' }
                                : { bg: '#fdecea', color: '#c62828', border: '#ef9a9a' }

                          return (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: gstStyle.bg,
                                color: gstStyle.color,
                                border: `1px solid ${gstStyle.border}`
                              }}
                            >
                              {r.gst}
                            </span>
                          )
                        })()}
                      </td>

                      {/* Status */}
                      <td>
                        {(() => {
                          const s = getStatusStyle(r.status)
                          return (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: s.bg,
                                color: s.color,
                                border: `1px solid ${s.border}`
                              }}
                            >
                              {r.status}
                            </span>
                          )
                        })()}
                      </td>

                      {/* Registered */}
                      <td style={{ minWidth: "120px" }}>{r.registered}</td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2">

                          <Link
                            href={`/admin/recruiters/Edit?id=${r.id}`}
                            className="btn btn-grey-small"
                          >
                            <i className="fi-rr-edit"></i>
                          </Link>

                          <button className="btn btn-grey-small">
                            <i className="fi-rr-trash"></i>
                          </button>

                          <Link
                            href={`/admin/recruiters/details?id=${r.id}`}
                            className="btn btn-grey-small"
                          >
                            <i className="fi-rr-eye"></i>
                          </Link>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

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
      </div>
      <Footer />
    </>
  )
}