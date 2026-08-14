"use client";

import Footer from "../../../components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  UserCheck,
  Ban,
  ShieldCheck,
  Eye,
  HardHat,
  CalendarPlus,
} from "lucide-react";
import { candidateService } from "../../../services/candidateService";

export default function CandidatesPage() {
  const [candidatesList, setCandidatesList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const fetchCandidates = () => {
    setLoadingList(true);
    candidateService
      .getCandidates()
      .then((res) => {
        setLoadingList(false);
        if (Array.isArray(res)) {
          setCandidatesList(res);
        } else if (res && Array.isArray(res.items)) {
          setCandidatesList(res.items);
        }
      })
      .catch((err) => {
        setLoadingList(false);
        console.error("Failed to fetch candidates:", err);
      });
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSetStatus = (id, newStatus) => {
    const reason =
      newStatus === "Active" ? "Activated by admin" : "Suspended by admin";
    candidateService
      .updateAccountStatus(id, newStatus, reason)
      .then(() => {
        fetchCandidates();
      })
      .catch((err) => {
        alert(err.message || `Failed to update status to ${newStatus}`);
      });
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const filteredCandidates = candidatesList.filter((c) => {
    return (
      ((c.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(search.toLowerCase())) &&
      (status === "" || c.status === status)
    );
  });

  const pageCount = Math.max(
    1,
    Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE),
  );
  const currentPage = Math.min(page, pageCount);
  const visibleCandidates = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getVisiblePageNumbers = () => {
    const pages = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, page - 1);
      const end = Math.min(pageCount - 1, page + 1);
      if (start > 2) {
        pages.push('ellipsis-start');
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < pageCount - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(pageCount);
    }
    return pages;
  };

  const activeCount = candidatesList.filter(
    (c) => c.status === "Active",
  ).length;

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "short",
  });

  const joinedThisMonth = candidatesList.filter((c) => {
    return c.joined && c.joined.startsWith(currentMonth);
  }).length;

  const suspendedCount = candidatesList.filter(
    (c) => c.status === "Suspended",
  ).length;

  const getCandidateAvatar = (c) => {
    if (c && c.img) {
      if (c.img.startsWith("http://") || c.img.startsWith("https://")) {
        return c.img;
      }
      return `/assets/imgs/page/candidates/${c.img}`;
    }
    return "/assets/imgs/page/candidates/candidate-profile.png";
  };


  return (
    <>
      {/* Header */}
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-5">Candidates</h3>
          <p className="font-sm color-text-paragraph-2 mb-3">
            Browse candidates, view profiles, and manage account statuses.
          </p>
        </div>

        <div className="box-breadcrumb">
          <div
            className="breadcrumbs"
            style={{ border: "none", backgroundColor: "revert" }}
          >
            <ul>
              <li>
                <a className="icon-home" href="/admin/dashboard">
                  Admin
                </a>
              </li>
              <li>
                <span>Candidates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="section-box">
        <div className="row">
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div
                className="card-image "
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0px",
                }}
              >
                <img
                  src="/assets/imgs/page/dashboard/candidates.svg"
                  alt="candidates"
                  style={{ width: 28, height: 28, objectFit: "contain" }}
                />
              </div>
              <div className="card-info">
                <div className="card-title">
                  <h3>
                    {candidatesList.length} <br />
                    <span className="font-sm status up">Total</span>
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Total Candidates</p>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div
                className="card-image"
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0px",
                }}
              >
                <UserCheck size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <div className="card-title">
                  <h3>
                    {activeCount}
                    <br />
                    <span className="font-sm status up">Active</span>
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Active Candidates</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div
                className="card-image"
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 0,
                }}
              >
                <CalendarPlus size={28} color="#2563eb" />
              </div>

              <div className="card-info">
                <div className="card-title">
                  <h3>
                    {joinedThisMonth}
                    <br />
                    <span className="font-sm status up">This Month</span>
                  </h3>
                </div>

                <p className="color-text-paragraph-2">Candidates Joined</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div
                className="card-image"
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0px",
                }}
              >
                <img
                  src="/assets/imgs/page/dashboard/recruiters.svg"
                  alt="suspended"
                  style={{
                    width: 28,
                    height: 28,
                    objectFit: "contain",
                    marginRight: "0px",
                  }}
                />
              </div>
              <div className="card-info">
                <div className="card-title">
                  <h3>
                    {suspendedCount}
                    <br />
                    <span className="font-sm status down">Suspended</span>
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Suspended Accounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-box mt-20">
        <div className="panel-white">
          <div className="box-padding">
            {/* Filters */}
            <div className="row g-3 align-items-end mb-25">
              <div className="col-xl-8 col-lg-12">
                <div className="form-group mb-0">
                  <i className="fi-rr-search"></i>
                  <input
                    type="text"
                    className="form-control form-icons"
                    placeholder="Search candidates by name or email..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-xl-4 col-lg-12">
                <div className="row g-2">
                  <div className="col-md-6 col-6">
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-6">
                    <button
                      type="button"
                      className="btn btn-grey-small filter-clear w-100"
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
              </div>
            </div>

            {/* Desktop Table */}
            <div className="table-responsive d-none d-lg-block">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th style={{ minWidth: "240px" }}>Candidate</th>
                    <th style={{ minWidth: "150px" }}>Trade Category</th>
                    <th style={{ minWidth: "120px" }}>Status</th>
                    <th style={{ minWidth: "130px" }}>Joined Date</th>
                    <th style={{ minWidth: "230px" }}>Actions</th>
                  </tr>
                </thead>

                 <tbody>
                  {loadingList ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 color-text-paragraph-2"
                      >
                        Loading candidates...
                      </td>
                    </tr>
                  ) : filteredCandidates.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 color-text-paragraph-2"
                      >
                        No candidates found.
                      </td>
                    </tr>
                  ) : (
                    visibleCandidates.map((c) => (
                      <tr key={c.candidateId || c.id}>
                        <td className="align-middle">
                          <Link
                            href={`/admin/candidates/candidateDetails?id=${c.candidateId || c.id}`}
                            className="d-flex align-items-center text-decoration-none color-brand-1"
                          >
                            <img
                              src={getCandidateAvatar(c)}
                              alt={c.name}
                              style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />

                            <div className="ms-3">
                              <h6 className="mb-0 text-dark hover-primary">
                                {c.name || "N/A"}
                              </h6>
                              <span className="font-sm color-text-paragraph-2">
                                {c.email || "No Email"}
                              </span>
                            </div>
                          </Link>
                        </td>

                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <span
                              style={{
                                color: "#122359",
                                fontWeight: 600,
                                fontSize: "14px",
                              }}
                            >
                              {c.trade || c.tradeCategory || c.primaryTrade || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="align-middle">
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "4px 12px",
                              borderRadius: "20px",
                              display: "inline-block",
                              width: "90px",
                              textAlign: "center",
                              background:
                                c.status === "Active" ? "#e8f5e9" : "#fdecea",
                              color:
                                c.status === "Active" ? "#2e7d32" : "#c62828",
                              border:
                                c.status === "Active"
                                  ? "1px solid #a5d6a7"
                                  : "1px solid #ef9a9a",
                            }}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td className="align-middle">{c.joined || "N/A"}</td>

                        <td className="align-middle">
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              href={`/admin/candidates/candidateDetails?id=${c.candidateId || c.id}`}
                              className="action-icon action-view"
                              title="View Candidate"
                            >
                              <Eye size={18} />
                            </Link>

                            {c.status === "Suspended" ? (
                              <button
                                className="action-icon action-active"
                                title="Activate"
                                onClick={() => handleSetStatus(c.candidateId || c.id, "Active")}
                              >
                                <ShieldCheck size={18} />
                              </button>
                            ) : (
                              <button
                                className="action-icon action-suspend"
                                title="Suspend"
                                onClick={() =>
                                  handleSetStatus(c.candidateId || c.id, "Suspended")
                                }
                              >
                                <Ban size={18} />
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

            {/* Mobile / Tablet Cards */}
            <div className="d-block d-lg-none">
              {loadingList ? (
                <div className="text-center py-4 color-text-paragraph-2">
                  Loading candidates...
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-4 color-text-paragraph-2">
                  No candidates found.
                </div>
              ) : (
                <div className="row">
                  {visibleCandidates.map((c) => (
                    <div className="col-md-6 mb-15" key={c.candidateId || c.id}>
                      <div className="panel-white h-100">
                        <div className="box-padding">
                          <div className="d-flex align-items-center mb-15">
                            <Link
                              href={`/admin/candidates/candidateDetails?id=${c.candidateId || c.id}`}
                              className="d-flex align-items-center text-decoration-none color-brand-1"
                            >
                              <img
                                src={getCandidateAvatar(c)}
                                alt={c.name}
                                style={{
                                  width: "52px",
                                  height: "52px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />

                              <div className="ms-3">
                                <h6 className="mb-0 text-dark">{c.name || "N/A"}</h6>
                                <span className="font-sm color-text-paragraph-2">
                                  {c.email || "No Email"}
                                </span>
                              </div>
                            </Link>
                          </div>

                          <div className="mb-10">
                            <p className="font-sm mb-5 d-flex align-items-center gap-2">
                              <HardHat size={14} color="#ffa300" />
                              <strong>Trade:</strong> {c.trade || c.tradeCategory || c.primaryTrade || "N/A"}
                            </p>

                            <p className="font-sm mb-5">
                              <strong>Joined:</strong> {c.joined || "N/A"}
                            </p>

                            <p className="font-sm mb-0">
                              <strong>Status:</strong>{" "}
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  padding: "2px 10px",
                                  borderRadius: "20px",
                                  display: "inline-block",
                                  background:
                                    c.status === "Active" ? "#e8f5e9" : "#fdecea",
                                  color:
                                    c.status === "Active" ? "#2e7d32" : "#c62828",
                                  border:
                                    c.status === "Active"
                                      ? "1px solid #a5d6a7"
                                      : "1px solid #ef9a9a",
                                }}
                              >
                                {c.status}
                              </span>
                            </p>
                          </div>

                        <div className="d-flex gap-2 mt-15">
                          <Link
                            href={`/admin/candidates/candidateDetails?id=${c.candidateId || c.id}`}
                            className="btn hover-up w-100 action-btn action-btn-view justify-content-center"
                          >
                            <Eye size={13} />
                            View Profile
                          </Link>

                          {c.status === "Suspended" ? (
                            <button
                              className="btn hover-up w-100 action-btn action-btn-activate justify-content-center"
                              onClick={() => handleSetStatus(c.candidateId || c.id, "Active")}
                            >
                              <ShieldCheck size={13} />
                              Activate
                            </button>
                          ) : (
                            <button
                              className="btn hover-up w-100 action-btn action-btn-suspend justify-content-center"
                              onClick={() => handleSetStatus(c.candidateId || c.id, "Suspended")}
                            >
                              <Ban size={13} />
                              Suspend
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Pagination */}
            {/* Pagination */}
            {filteredCandidates.length > 0 && (
              <div className="table-pagination">
                <span>
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredCandidates.length,
                  )}{" "}
                  of {filteredCandidates.length} candidates
                </span>

                <div>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  {getVisiblePageNumbers().map((item, index) => {
                    if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          style={{
                            padding: '0 8px',
                            alignSelf: 'center',
                            color: '#7b8aa5',
                            fontWeight: 'bold',
                            userSelect: 'none'
                          }}
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={item}
                        className={currentPage === item ? "active" : ""}
                        onClick={() => setPage(item)}
                      >
                        {item}
                      </button>
                    );
                  })}

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
        .action-btn {
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .action-btn-view {
          background: #122359;
          color: #fff;
          border-color: #122359;
        }
        .action-btn-view:hover {
          background: #1a2f6e;
          color: #fff;
        }
        .action-btn-activate {
          background: #16a34a;
          color: #fff;
          border-color: #16a34a;
        }
        .action-btn-activate:hover {
          background: #128a3e;
        }
        .action-btn-suspend {
          background: #ffa300;
          color: #fff;
          border-color: #ffa300;
        }
        .action-btn-suspend:hover {
          background: #e69200;
        }
        .filter-clear {
          height: 42px;
          min-width: 104px;
          border: 1px solid #f7b342;
          border-radius: 8px;
          background: #fff;
          color: #9a6200;
          font-size: 12px;
          font-weight: 700;
          box-shadow: none;
        }
        .filter-clear:hover {
          background: #fff6e6;
          border-color: #ffa300;
          color: #122359;
        }
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
  );
}
