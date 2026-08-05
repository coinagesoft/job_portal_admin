'use client'

import Footer from "../../../components/Footer"
import Link from "next/link"
import { ShieldCheck, FileText } from "lucide-react";
import { useState } from "react";

const initialRecruiters = [
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
];

export default function RecruiterPage() {
  const [recruitersList, setRecruitersList] = useState(initialRecruiters);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [gst, setGst] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handlePlanChange = (value) => {
    setPlan(value);
    setPage(1);
  };

  const handleGstChange = (value) => {
    setGst(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleToggleVerification = (id) => {
    setRecruitersList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newGst = r.gst === "Verified" ? "Pending" : "Verified";
          return { ...r, gst: newGst };
        }
        return r;
      })
    );
  };

  const handleToggleSuspend = (id) => {
    setRecruitersList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newStatus = r.status === "Suspended" ? "Active" : "Suspended";
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

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
  };

  const filteredRecruiters = recruitersList.filter((r) => {
    return (
      (r.company.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.person.toLowerCase().includes(search.toLowerCase())) &&
      (plan === "" || r.plan === plan) &&
      (gst === "" || r.gst === gst) &&
      (status === "" || r.status === status)
    );
  });

  const pageCount = Math.max(1, Math.ceil(filteredRecruiters.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visibleRecruiters = filteredRecruiters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const verifiedCount = recruitersList.filter(r => r.gst === 'Verified').length;
  const verificationRate = recruitersList.length > 0 ? Math.round((verifiedCount / recruitersList.length) * 100) : 0;
  const pendingApprovalsCount = recruitersList.filter(r => r.status === 'Pending').length;
  const activeRecruitersCount = recruitersList.filter(r => r.status === 'Active').length;

  return (
    <>
      {/* Header */}
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-5">Recruiter Management</h3>
          <p className="font-sm color-text-paragraph-2">
            Manage employer accounts, verifications, documents and subscription tiers.
          </p>
        </div>

        <div className="box-breadcrumb">
          <div className="breadcrumbs mb-15" style={{ border: "none", backgroundColor: "revert" }}>
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
                    {recruitersList.length}
                    <span className="font-sm status up ms-2">Total</span>
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
                    {pendingApprovalsCount} <br />
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
                    {verificationRate}% <br />
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
                    {activeRecruitersCount} <br />
                    <span className="font-sm status up ms-2">Active</span>
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Active Recruiters</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Filters & Table */}
      <div className="section-box mt-20">
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
                  placeholder="Search by Company, Contact or Email..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>

              <div className="col-xl-7 col-lg-12">
                <div className="row g-2 align-items-end">

                  {/* Plan */}
                  <div className="col-md-3 col-6">
                    <select
                      className="form-control filter-select"
                      value={plan}
                      onChange={(e) => handlePlanChange(e.target.value)}
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
                      onChange={(e) => handleGstChange(e.target.value)}
                    >
                      <option value="">GST: All</option>
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="col-md-3 col-6">
                    <select
                      className="form-control filter-select"
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="">Status: All</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Clear */}
                  <div className="col-md-3 col-6">
                    <button
                      className="btn btn-secondary w-100 h-100 py-3"
                      onClick={() => {
                        setSearch("");
                        setStatus("");
                        setPlan("");
                        setGst("");
                        setPage(1);
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">

                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ minWidth: "240px" }}>
                      Employer / Company
                    </th>
                    <th style={{ minWidth: "200px" }}>
                      Contact Person
                    </th>
                    <th style={{ minWidth: "70px" }} className="text-center">Plan</th>
                    <th style={{ minWidth: "110px" }}>GST Status</th>
                    <th style={{ minWidth: "100px" }}>Status</th>
                    <th style={{ minWidth: "110px" }}>Registered</th>
                    <th style={{ minWidth: "320px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecruiters.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 color-text-paragraph-2">
                        No recruiters found.
                      </td>
                    </tr>
                  ) : (
                    visibleRecruiters.map((r) => (
                      <tr key={r.id}>

                        {/* Company */}
                        <td className="align-middle">
                          <Link
                            href={`/admin/recruiters/details?id=${r.id}`}
                            className="d-flex align-items-center text-decoration-none"
                          >
                            <img
                              src={`/assets/imgs/page/candidates/${r.logo}`}
                              alt={r.company}
                              style={{
                                width: "46px",
                                height: "46px",
                                borderRadius: "50%",
                                objectFit: "cover"
                              }}
                            />

                            <div className="ms-3">
                              <h6 className="mb-0 text-dark hover-primary">{r.company}</h6>
                              <span className="font-sm color-text-paragraph-2">
                                {r.sector}
                              </span>
                            </div>
                          </Link>
                        </td>

                        {/* Contact */}
                        <td>
                          <h6 className="mb-0">{r.person}</h6>
                          <span className="font-sm color-text-paragraph-2">
                            {r.email}
                          </span>
                        </td>

                        {/* Plan */}
                        <td className="text-center">
                          {(() => {
                            const planStyle =
                              r.plan === 'Paid'
                                ? { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' }
                                : { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' }

                            return (
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  background: planStyle.bg,
                                  color: planStyle.color,
                                  border: `1px solid ${planStyle.border}`
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
                        <td style={{ minWidth: "110px" }}>{r.registered}</td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex align-items-center gap-2">

                            {/* View Profile */}
                            <Link
                              href={`/admin/recruiters/details?id=${r.id}`}
                              className="btn hover-up"
                              style={{
                                background: '#f8fafc',
                                color: '#334155',
                                border: '1px solid #cbd5e1',
                                borderRadius: '20px',
                                padding: '5px 12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Details"
                            >
                              <i className="fi-rr-eye" style={{ fontSize: '13px', color: '#475569' }}></i>
                              <span>View</span>
                            </Link>

                            {/* Documents Button (Replacing Edit) */}
                            <Link
                              href={`/admin/verifications/preview?id=${r.id}`}
                              className="btn hover-up"
                              style={{
                                background: '#f0f4ff',
                                color: '#0f52ba',
                                border: '1px solid #c7d2fe',
                                borderRadius: '20px',
                                padding: '5px 12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Verification Documents"
                            >
                              <i className="fi-rr-file" style={{ fontSize: '13px' }}></i>
                              <span>Documents</span>
                            </Link>

                            {/* Verification Button */}
                            {r.gst !== 'Verified' ? (
                              <button
                                className="btn hover-up"
                                style={{
                                  background: '#e0f2fe',
                                  color: '#0369a1',
                                  border: '1px solid #bae6fd',
                                  borderRadius: '20px',
                                  padding: '5px 12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleToggleVerification(r.id)}
                                title="Verify Company from Admin Side"
                              >
                                <i className="fi-rr-shield-check" style={{ fontSize: '13px' }}></i>
                                <span>Verify</span>
                              </button>
                            ) : (
                              <button
                                className="btn hover-up"
                                style={{
                                  background: '#f0fdf4',
                                  color: '#16a34a',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: '20px',
                                  padding: '5px 12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: 'default'
                                }}
                                title="Company Verified"
                              >
                                <i className="fi-rr-check-circle" style={{ fontSize: '13px' }}></i>
                                <span>Verified</span>
                              </button>
                            )}

                            {/* Suspend / Activate Account (Replacing Delete) */}
                            {r.status === 'Suspended' ? (
                              <button
                                className="btn hover-up"
                                style={{
                                  background: '#f0fdf4',
                                  color: '#16a34a',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: '20px',
                                  padding: '5px 12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleToggleSuspend(r.id)}
                                title="Activate Account"
                              >
                                <i className="fi-rr-check-circle" style={{ fontSize: '13px' }}></i>
                                <span>Activate</span>
                              </button>
                            ) : (
                              <button
                                className="btn hover-up"
                                style={{
                                  background: '#fff1f2',
                                  color: '#e11d48',
                                  border: '1px solid #fecdd3',
                                  borderRadius: '20px',
                                  padding: '5px 12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleToggleSuspend(r.id)}
                                title="Suspend Account"
                              >
                                <i className="fi-rr-ban" style={{ fontSize: '13px' }}></i>
                                <span>Suspend</span>
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

            {filteredRecruiters.length > 0 && (
              <div className="table-pagination">
                <span>
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecruiters.length)}{" "}
                  of {filteredRecruiters.length} recruiters
                </span>

                <div>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: pageCount }, (_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === pageCount}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style jsx>{`
        .table-pagination {
          padding: 15px 20px;
          border-top: 1px solid #edf1f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #7b8aa5;
          font-size: 12px;
        }
        .table-pagination div {
          display: flex;
          gap: 5px;
        }
        .table-pagination button {
          height: 30px;
          min-width: 30px;
          padding: 0 9px;
          border: 1px solid #dce4ef;
          border-radius: 5px;
          background: #fff;
          color: #5f7194;
          font-size: 11px;
          font-weight: 700;
        }
        .table-pagination button.active {
          color: #fff;
          background: #ffa300;
          border-color: #ffa300;
        }
        .table-pagination button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>
      <Footer />
    </>
  )
}