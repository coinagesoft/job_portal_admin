'use client'

import Footer from "../../../components/Footer"
import Link from "next/link";
import { useState } from "react";
import { UserCheck, Clock } from "lucide-react";

const initialCandidates = [
  {
    id: 1,
    img: "user1.png",
    name: "Alexander Wright",
    email: "a.wright@techflow.io",
    nationalId: "9823-1120-X",
    accountType: "Candidate",
    status: "Active",
    company: "TechFlow Solutions",
    joined: "Oct 12, 2023"
  },
  {
    id: 2,
    img: "user2.png",
    name: "Sarah Jenkins",
    email: "sarah.j@gmail.com",
    nationalId: "1244-9981-A",
    accountType: "Candidate",
    status: "Pending",
    company: "N/A",
    joined: "Oct 15, 2023"
  },
  {
    id: 3,
    img: "user3.png",
    name: "Marcus Thorne",
    email: "m.thorne@buildit.com",
    nationalId: "5562-0012-Q",
    accountType: "Candidate",
    status: "Active",
    company: "BuildIt Construction",
    joined: "Sep 28, 2023"
  },
  {
    id: 4,
    img: "user4.png",
    name: "Elena Rodriguez",
    email: "elena.rod@outlook.com",
    nationalId: "2231-5540-L",
    accountType: "Candidate",
    status: "Suspended",
    company: "N/A",
    joined: "Nov 02, 2023"
  },
  {
    id: 5,
    img: "user5.png",
    name: "Jameson Lee",
    email: "j.lee@healthnexus.org",
    nationalId: "7781-3321-K",
    accountType: "Candidate",
    status: "Active",
    company: "HealthNexus",
    joined: "Oct 05, 2023"
  },
  {
    id: 6,
    img: "user6.png",
    name: "Olivia Carter",
    email: "olivia.carter@mail.com",
    nationalId: "6634-9920-M",
    accountType: "Candidate",
    status: "Pending",
    company: "FutureCore",
    joined: "Nov 10, 2023"
  }
];

export default function CandidatesPage() {
  const [candidatesList, setCandidatesList] = useState(initialCandidates);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const handleSetStatus = (id, newStatus) => {
    setCandidatesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const filteredCandidates = candidatesList.filter((c) => {
    return (
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())) &&
      (status === "" || c.status === status)
    );
  });

  const activeCount = candidatesList.filter((c) => c.status === "Active").length;
  const pendingCount = candidatesList.filter((c) => c.status === "Pending").length;
  const suspendedCount = candidatesList.filter((c) => c.status === "Suspended").length;

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
          <div className="breadcrumbs" style={{ border: "none", backgroundColor: "revert" }}>
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><span>Candidates</span></li>
            </ul>
          </div>
        </div>
      </div>

   {/* Stats */}
<div className="section-box">
  <div className="row">

    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
      <div className="card-style-1 hover-up">
        <div className="card-image " style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',marginRight:'0px' }}>
          <img src="/assets/imgs/page/dashboard/candidates.svg" alt="candidates" style={{ width: 28, height: 28, objectFit: 'contain' }} />
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

    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
      <div className="card-style-1 hover-up">
        <div className="card-image" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',marginRight:'0px' }}>
          <UserCheck size={28} strokeWidth={2.2} />
        </div>
        <div className="card-info">
          <div className="card-title">
            <h3>
              {activeCount}<br />
              <span className="font-sm status up">Active</span>
            </h3>
          </div>
          <p className="color-text-paragraph-2">Active Candidates</p>
        </div>
      </div>
    </div>

    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
      <div className="card-style-1 hover-up">
        <div className="card-image" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',marginRight:'0px' }}>
          <Clock size={28} strokeWidth={2.2} />
        </div>
        <div className="card-info">
          <div className="card-title">
            <h3>
              {pendingCount}<br />
              <span className="font-sm status down">Pending</span>
            </h3>
          </div>
          <p className="color-text-paragraph-2">Pending Reviews</p>
        </div>
      </div>
    </div>

    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
      <div className="card-style-1 hover-up">
        <div className="card-image" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',marginRight:'0px' }}>
          <img src="/assets/imgs/page/dashboard/recruiters.svg" alt="suspended" style={{ width: 28, height: 28, objectFit: 'contain',marginRight:'0px' }} />
        </div>
        <div className="card-info">
          <div className="card-title">
            <h3>
              {suspendedCount}<br />
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
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-xl-4 col-lg-12">
                <div className="row g-2">

                  <div className="col-md-6 col-6">
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-6">
                    <button
                      className="btn btn-secondary w-100 py-3"
                      onClick={() => {
                        setSearch("");
                        setStatus("");
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
                    <th style={{ minWidth: '260px' }}>Candidate</th>
                    <th style={{ minWidth: '130px' }}>Status</th>
                    <th style={{ minWidth: '150px' }}>Joined Date</th>
                    <th style={{ minWidth: '220px' }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 color-text-paragraph-2">
                        No candidates found.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((c) => (
                      <tr key={c.id}>

                        {/* Candidate */}
                        <td className="align-middle">
                          <Link
                            href={`/admin/candidates/candidateDetails?id=${c.id}`}
                            className="d-flex align-items-center text-decoration-none color-brand-1"
                          >
                            <img
                              src={`/assets/imgs/page/candidates/${c.img}`}
                              alt={c.name}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />

                            <div className="ms-3">
                              <h6 className="mb-0 text-dark hover-primary">{c.name}</h6>
                              <span className="font-sm color-text-paragraph-2">
                                {c.email}
                              </span>
                            </div>
                          </Link>
                        </td>

                        {/* Status */}
                        <td className="align-middle">
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '4px 12px',
                              borderRadius: '20px',
                              display: 'inline-block',
                              width: '100px',
                              textAlign: 'center',
                              background:
                                c.status === 'Active'
                                  ? '#e8f5e9'
                                  : c.status === 'Pending'
                                    ? '#fff3e0'
                                    : '#fdecea',
                              color:
                                c.status === 'Active'
                                  ? '#2e7d32'
                                  : c.status === 'Pending'
                                    ? '#e65100'
                                    : '#c62828',
                              border:
                                c.status === 'Active'
                                  ? '1px solid #a5d6a7'
                                  : c.status === 'Pending'
                                    ? '1px solid #ffcc80'
                                    : '1px solid #ef9a9a'
                            }}
                          >
                            {c.status}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="align-middle">
                          {c.joined}
                        </td>

                        {/* Actions: Exactly 2 buttons per row */}
                        <td className="align-middle">
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              href={`/admin/candidates/candidateDetails?id=${c.id}`}
                              className="btn hover-up"
                              style={{
                                background: '#f8fafc',
                                color: '#334155',
                                border: '1px solid #cbd5e1',
                                borderRadius: '20px',
                                padding: '5px 14px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Profile (Read-Only)"
                            >
                              <i className="fi-rr-eye" style={{ fontSize: '13px', color: '#475569' }}></i>
                              <span>View Profile</span>
                            </Link>

                            {c.status === 'Suspended' ? (
                              <button
                                className="btn hover-up"
                                style={{
                                  background: '#f0fdf4',
                                  color: '#16a34a',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: '20px',
                                  padding: '5px 14px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleSetStatus(c.id, 'Active')}
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
                                  padding: '5px 14px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleSetStatus(c.id, 'Suspended')}
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

            {/* Mobile / Tablet Cards */}
            <div className="d-block d-lg-none">
              <div className="row">
                {filteredCandidates.map((c) => (
                  <div className="col-md-6 mb-15" key={c.id}>
                    <div className="panel-white h-100">
                      <div className="box-padding">

                        <div className="d-flex align-items-center mb-15">
                          <Link
                            href={`/admin/candidates/candidateDetails?id=${c.id}`}
                            className="d-flex align-items-center text-decoration-none color-brand-1"
                          >
                            <img
                              src={`/assets/imgs/page/candidates/${c.img}`}
                              alt={c.name}
                              style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "50%",
                                objectFit: "cover"
                              }}
                            />

                            <div className="ms-3">
                              <h6 className="mb-0 text-dark">{c.name}</h6>
                              <span className="font-sm color-text-paragraph-2">
                                {c.email}
                              </span>
                            </div>
                          </Link>
                        </div>

                        <div className="mb-10">
                          <p className="font-sm mb-5">
                            <strong>Joined:</strong> {c.joined}
                          </p>

                          <p className="font-sm mb-0">
                            <strong>Status:</strong>{" "}
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '2px 10px',
                                borderRadius: '20px',
                                display: 'inline-block',
                                background:
                                  c.status === 'Active'
                                    ? '#e8f5e9'
                                    : c.status === 'Pending'
                                      ? '#fff3e0'
                                      : '#fdecea',
                                color:
                                  c.status === 'Active'
                                    ? '#2e7d32'
                                    : c.status === 'Pending'
                                      ? '#e65100'
                                      : '#c62828',
                                border:
                                  c.status === 'Active'
                                    ? '1px solid #a5d6a7'
                                    : c.status === 'Pending'
                                      ? '1px solid #ffcc80'
                                      : '1px solid #ef9a9a'
                              }}
                            >
                              {c.status}
                            </span>
                          </p>
                        </div>

                        <div className="d-flex gap-2 mt-15">
                          <Link
                            href={`/admin/candidates/candidateDetails?id=${c.id}`}
                            className="btn hover-up w-100"
                            style={{
                              background: '#f8fafc',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              borderRadius: '20px',
                              padding: '8px 14px',
                              fontSize: '13px',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <i className="fi-rr-eye" style={{ fontSize: '13px', color: '#475569' }}></i>
                            View Profile
                          </Link>

                          {c.status === 'Suspended' ? (
                            <button
                              className="btn hover-up w-100"
                              style={{
                                background: '#f0fdf4',
                                color: '#16a34a',
                                border: '1px solid #bbf7d0',
                                borderRadius: '20px',
                                padding: '8px 14px',
                                fontSize: '13px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                              onClick={() => handleSetStatus(c.id, 'Active')}
                            >
                              <i className="fi-rr-check-circle" style={{ fontSize: '13px' }}></i>
                              Activate
                            </button>
                          ) : (
                            <button
                              className="btn hover-up w-100"
                              style={{
                                background: '#fff1f2',
                                color: '#e11d48',
                                border: '1px solid #fecdd3',
                                borderRadius: '20px',
                                padding: '8px 14px',
                                fontSize: '13px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                              onClick={() => handleSetStatus(c.id, 'Suspended')}
                            >
                              <i className="fi-rr-ban" style={{ fontSize: '13px' }}></i>
                              Suspend
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="paginations mt-25">
              <div className="row align-items-center g-2">
                <div className="col-lg-6">
                  <p className="font-sm color-text-paragraph-2 mb-0">
                    Showing 1–{filteredCandidates.length} of <strong>{candidatesList.length}</strong> candidates
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