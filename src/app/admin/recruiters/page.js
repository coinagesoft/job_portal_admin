'use client'

import Footer from "../../../components/Footer"
import { useRouter } from "next/navigation"
import { ShieldCheck, FileText, Search, MoreVertical, Ban, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    docsVerified: 10,
    docsTotal: 10,
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
    docsVerified: 4,
    docsTotal: 10,
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
    docsVerified: 6,
    docsTotal: 10,
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
    docsVerified: 10,
    docsTotal: 10,
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
    docsVerified: 8,
    docsTotal: 10,
    status: "Active",
    registered: "2024-01-15"
  }
];

export default function RecruiterPage() {
  const router = useRouter();
  const [recruitersList, setRecruitersList] = useState(initialRecruiters);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const ITEMS_PER_PAGE = 5;

  // Close the actions menu on any click outside it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".actions-menu")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);
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

  const getVerificationStyle = (gst) => {
    switch (gst) {
      case 'Verified':
        return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' }
      case 'Pending':
        return { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' }
      case 'Rejected':
        return { bg: '#fdecea', color: '#c62828', border: '#ef9a9a' }
      default:
        return { bg: '#f5f5f5', color: '#555', border: '#ddd' }
    }
  };

  const goToDetails = (id) => router.push(`/admin/recruiters/details?id=${id}`);

  const filteredRecruiters = recruitersList.filter((r) => {
    return (
      (r.company.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.person.toLowerCase().includes(search.toLowerCase())) &&
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

            <div className="rec-toolbar">
              <div className="rec-search-box">
                <Search size={16} className="rec-search-icon" />
                <input
                  type="text"
                  name="rec-search"
                  className="rec-search-input"
                  placeholder="Search by Company, Contact or Email..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                />
              </div>

              <div className="rec-toolbar-filters" style={{ marginLeft: "auto" }}>
                <select
                  className="rec-filter-select"
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="">Status: All</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>

                <button
                  type="button"
                  className="rec-clear-btn"
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                    setPage(1);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle rec-table">

                <thead>
                  <tr>
                    <th style={{ minWidth: "240px" }}>
                      Employer / Company
                    </th>
                    <th style={{ minWidth: "200px" }}>
                      Contact Person
                    </th>
                    <th style={{ minWidth: "160px" }}>Verification</th>
                    <th style={{ minWidth: "100px" }}>Status</th>
                    <th style={{ minWidth: "110px" }}>Registered</th>
                    <th style={{ minWidth: "70px" }} className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecruiters.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 color-text-paragraph-2">
                        No recruiters found.
                      </td>
                    </tr>
                  ) : (
                    visibleRecruiters.map((r) => (
                      <tr key={r.id} className="rec-row" onClick={() => goToDetails(r.id)}>

                        {/* Company */}
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
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
                              <h6 className="mb-0 text-dark">{r.company}</h6>
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

                        {/* Verification */}
                        <td>
                          {(() => {
                            const v = getVerificationStyle(r.gst);
                            const docsComplete = r.docsVerified >= r.docsTotal;
                            return (
                              <div className="verify-cell">
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    background: v.bg,
                                    color: v.color,
                                    border: `1px solid ${v.border}`,
                                    display: 'inline-block'
                                  }}
                                >
                                  {r.gst}
                                </span>
                                <span className={`verify-docs-count ${docsComplete ? 'is-complete' : ''}`}>
                                  <FileText size={12} />
                                  {r.docsVerified}/{r.docsTotal} docs
                                </span>
                              </div>
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
                        <td className="text-end" onClick={(e) => e.stopPropagation()}>
                          <div className="actions-menu">
                            <button
                              type="button"
                              className="actions-menu-trigger"
                              onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
                              aria-label="Row actions"
                              aria-expanded={openMenuId === r.id}
                            >
                              <MoreVertical size={18} />
                            </button>

                            {openMenuId === r.id && (
                              <div className="actions-menu-dropdown">
                                <button
                                  type="button"
                                  className="actions-menu-item"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    router.push(`/admin/verifications/preview?id=${r.id}`);
                                  }}
                                >
                                  <FileText size={14} />
                                  <span>Documents</span>
                                </button>

                                <div className="actions-menu-divider" />

                                {r.gst === 'Verified' ? (
                                  <span className="actions-menu-item is-disabled">
                                    <CheckCircle2 size={14} />
                                    <span>Verified</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    className="actions-menu-item"
                                    onClick={() => { handleToggleVerification(r.id); setOpenMenuId(null); }}
                                  >
                                    <ShieldCheck size={14} />
                                    <span>Verify</span>
                                  </button>
                                )}

                                {r.status === 'Suspended' ? (
                                  <button
                                    type="button"
                                    className="actions-menu-item is-positive"
                                    onClick={() => { handleToggleSuspend(r.id); setOpenMenuId(null); }}
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>Activate</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="actions-menu-item is-danger"
                                    onClick={() => { handleToggleSuspend(r.id); setOpenMenuId(null); }}
                                  >
                                    <Ban size={14} />
                                    <span>Suspend</span>
                                  </button>
                                )}
                              </div>
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
        .rec-toolbar {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          gap: 12px;
          margin-bottom: 20px;
          width: 100%;
          min-width: 0;
        }
        .rec-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 42px;
          border: 1px solid #e3e8f4;
          background: #f5f7fc;
          border-radius: 9px;
          padding: 0 14px;
          flex: 1 1 180px;
          min-width: 120px;
          max-width: 340px;
          transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
        }
        .rec-search-box:focus-within {
          border-color: #ffcb80;
          box-shadow: 0 0 0 3px rgba(239,150,0,.1);
          background: #fff;
        }
        .rec-search-icon {
          color: #94a3c4;
          flex-shrink: 0;
        }
        .rec-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 42px;
          padding: 0 14px;

          background: #fff;
          border: 1px solid #e3e8f4;
          border-radius: 9px;
          overflow: hidden;
        }
          .rec-search-input {
          flex: 1;
          width: 100%;
          height: 100%;

          border: none !important;
          border-left: 0 !important;
          border-right: 0 !important;
          outline: none !important;
          box-shadow: none !important;

          background: transparent !important;
          appearance: none;
          -webkit-appearance: none;

          padding: 0;
          margin: 0;

          font-size: 13px;
          color: #33415c;
        }

        .rec-search-input:focus,
        .rec-search-input:hover,
        .rec-search-input:active {
          border: none !important;
          border-left: 0 !important;
          border-right: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }

        .rec-search-input::-webkit-search-decoration,
        .rec-search-input::-webkit-search-cancel-button,
        .rec-search-input::-webkit-search-results-button,
        .rec-search-input::-webkit-search-results-decoration {
          -webkit-appearance: none;
        }
        .rec-toolbar-filters {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 0 1 auto;
          min-width: 0;
          flex-wrap: nowrap;
        }
        .rec-filter-select {
          height: 42px;
          width: 130px;
          min-width: 90px;
          flex: 0 1 auto;
          border: 1px solid #e3e8f4;
          background: #f5f7fc;
          border-radius: 9px;
          padding: 0 12px;
          font-size: 13px;
          font-weight: 600;
          color: #33415c;
          outline: none;
          cursor: pointer;
        }
        .rec-filter-select:focus { border-color: #ffcb80; }
        .rec-clear-btn {
          height: 42px;
          padding: 0 16px;
          border: 1.5px solid #f39b00;
          background: #fff;
          color: #f39b00;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background .15s ease, color .15s ease;
        }
        .rec-clear-btn:hover { background: #fff8ec; }

        @media (max-width: 640px) {
          .rec-toolbar {
            flex-wrap: wrap;
          }
          .rec-search-box {
            max-width: 100%;
            flex: 1 1 100%;
          }
          .rec-toolbar-filters {
            flex-wrap: wrap;
            width: 100%;
            margin-left: 0 !important;
          }
          .rec-filter-select {
            flex: 1 1 auto;
            width: auto;
          }
        }

        .verify-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
        }
        .verify-docs-count {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #8592aa;
        }
        .verify-docs-count.is-complete { color: #2e9e6d; }

        .rec-table thead tr {
          border-bottom: 1px solid #edf1f6;
        }
        .rec-table thead th {
          color: #172b60;
          font-weight: 700;
          font-size: 13px;
          padding-bottom: 14px;
          border: none;
        }
        .rec-table tbody td {
          border-top: 1px solid #edf1f6;
          padding-top: 16px;
          padding-bottom: 16px;
        }
        .rec-row { cursor: pointer; }

        .actions-menu { position: relative; display: inline-block; }
        .actions-menu-trigger {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e3e8f4;
          background: #fff;
          color: #5c6b8a;
          border-radius: 8px;
          transition: background .15s ease, border-color .15s ease;
        }
        .actions-menu-trigger:hover { background: #f5f7fc; border-color: #cdd7ec; }
        .actions-menu-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 176px;
          background: #fff;
          border: 1px solid #e6eaf3;
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(23,43,96,.14);
          padding: 6px;
          z-index: 20;
        }
        .actions-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 9px 10px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          color: #33415c;
          background: transparent;
          border: 0;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }
        .actions-menu-item:hover { background: #f5f7fc; color: #172b60; }
        .actions-menu-divider {
          height: 1px;
          background: #edf1f6;
          margin: 5px 4px;
        }
        .actions-menu-item.is-disabled {
          color: #16a34a;
          cursor: default;
        }
        .actions-menu-item.is-disabled:hover { background: transparent; }
        .actions-menu-item.is-positive { color: #16a34a; }
        .actions-menu-item.is-positive:hover { background: #f0fdf4; }
        .actions-menu-item.is-danger { color: #e11d48; }
        .actions-menu-item.is-danger:hover { background: #fff1f2; }

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