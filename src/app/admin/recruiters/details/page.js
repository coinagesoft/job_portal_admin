"use client";
import { useState } from "react";
import Footer from "../../../../components/Footer";
import {
  Brain,
  AlertTriangle,
  User,
  Clock,
  Calendar,
  Briefcase,
  Wallet,
  Download,
  X,
  Receipt,
  FileText,
  Info,
} from "lucide-react";
export default function EmployerDetailsPage() {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [invoiceTxn, setInvoiceTxn] = useState(null);

  const TRANSACTIONS = [
    {
      id: "REV-10491",
      invoice: "INV-10491",
      date: "25 Jul 2026",
      description: "Enterprise Credit Pack",
      type: "Credit Pack",
      credits: "10,000",
      amount: "₹10,000",
      payment: "UPI",
      status: "Paid",
    },
    {
      id: "REV-10486",
      invoice: "INV-10486",
      date: "18 Jun 2026",
      description: "Gold Credit Pack",
      type: "Credit Pack",
      credits: "5,000",
      amount: "₹5,000",
      payment: "Credit Card",
      status: "Paid",
    },
    {
      id: "REV-10462",
      invoice: "INV-10462",
      date: "12 Apr 2026",
      description: "Silver Credit Pack",
      type: "Credit Pack",
      credits: "2,500",
      amount: "₹2,500",
      payment: "UPI",
      status: "Pending",
    },
    {
      id: "REV-10440",
      invoice: "INV-10440",
      date: "01 Jan 2026",
      description: "Gold Membership (Annual)",
      type: "Membership",
      credits: "-",
      amount: "₹4,999",
      payment: "UPI",
      status: "Paid",
    },
    {
      id: "REV-10398",
      invoice: "INV-10398",
      date: "08 Feb 2025",
      description: "Starter Credit Pack",
      type: "Credit Pack",
      credits: "500",
      amount: "₹999",
      payment: "Credit Card",
      status: "Refunded",
    },
    {
      id: "REV-10312",
      invoice: "INV-10312",
      date: "15 Oct 2023",
      description: "Employer Registration Fee",
      type: "Registration",
      credits: "-",
      amount: "₹499",
      payment: "Net Banking",
      status: "Paid",
    },
  ];

  const STATUS_STYLE = {
    Paid: { bg: "#e8f5e9", color: "#2e7d32" },
    Pending: { bg: "#fff3e0", color: "#e65100" },
    Refunded: { bg: "#ffebee", color: "#c62828" },
  };

  const handleDownloadInvoice = (txn) => {
    const content = `JOBBOX
Invoice ${txn.invoice}
--------------------------------
Payment received from Stellar Logistics Pvt. Ltd.

${txn.description}                         ${txn.amount}

Date: ${txn.date}
Transaction ID: ${txn.id}
Payment Method: ${txn.payment}
Status: ${txn.status}
--------------------------------
Thank you for your business.
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${txn.invoice}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ── PAGE HEADING: employer name + status + action buttons ── */}
      <div className="box-heading d-flex align-items-center justify-content-between mb-3">
        {/* LEFT */}
        <div
          className="box-title d-flex align-items-center"
          style={{ gap: "12px" }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
              background: "#ffa300",
              color: "#fff",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            SL
          </div>

          <div className="mt-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="mb-0">Stellar Logistics Pvt. Ltd.</h5>
              <span
                className="badge"
                style={{
                  backgroundColor: "#e2e8f0",
                  color: "#475569",
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "12px",
                }}
              >
                View Only
              </span>
            </div>

            <div
              className="d-flex align-items-center mt-1"
              style={{ gap: "10px" }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 10px",
                  borderRadius: "20px",
                  background: "#fff3e0",
                  color: "#e65100",
                }}
              >
                Pending Review
              </span>

              <span className="font-xs color-text-paragraph-2">
                ID: REC-902831
              </span>
            </div>
            <div
              className="d-flex align-items-center mt-2"
              style={{ gap: "14px", flexWrap: "wrap" }}
            >
              {/* Removed AI/Risk/Assigned badges from top header */}

              {/* <span className="font-xs color-text-paragraph-2 d-flex align-items-center gap-1">
    <Clock size={14} strokeWidth={2} />
    42 mins in queue
  </span> */}
            </div>
          </div>
        </div>

        {/* RIGHT */}
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
                <a href="/admin/recruiters">Recruiters</a>
              </li>
              <li>
                <span>Details - Alexander Wright</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* ── MAIN LAYOUT ── */}
      <div className="row">
        {/* ════ LEFT COLUMN ════ */}
        <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <h6 className="mb-0">Recruiter Information</h6>
              </div>

              <div className="panel-body">
                <div className="row">
                  <div className="col-6 mb-15">
                    <p className="font-xs color-text-paragraph-2">NAME</p>
                    <p className="font-sm mb-0" style={{ fontWeight: 600 }}>
                      Sarah Jenkins
                    </p>
                  </div>

                  <div className="col-6 mb-15">
                    <p className="font-xs color-text-paragraph-2">ROLE</p>
                    <p className="font-sm mb-0" style={{ fontWeight: 600 }}>
                      HR Director
                    </p>
                  </div>

                  <div className="col-6 mb-15">
                    <p className="font-xs color-text-paragraph-2">EMAIL</p>
                    <p className="font-sm mb-0" style={{ fontWeight: 600 }}>
                      sarah@stellar.com
                    </p>
                  </div>

                  <div className="col-6 mb-15">
                    <p className="font-xs color-text-paragraph-2">
                      MEMBERSHIP DETAILS
                    </p>

                    <p
                      className="font-sm mb-1"
                      style={{ fontWeight: 600, color: "#122359" }}
                    >
                      Gold Membership
                    </p>

                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: "#fff7e6",
                        color: "#b7791f",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      Valid till: 31 Dec 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Company Information */}
          <div className="section-box">
            <div className="panel-white">
              {/* ── TOP ACTION BAR (NEW) ── */}

              <div
                className="panel-head d-flex justify-content-between"
                style={{ alignItems: "center" }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "8px" }}
                >
                  <h6 className="mb-0">Company Information</h6>
                </div>
              </div>
              <div className="panel-body">
                <div className="row">
                  {[
                    {
                      label: "LEGAL NAME",
                      value: "Stellar Logistics Private Limited",
                    },
                    {
                      label: "INDUSTRY TYPE",
                      value: "Logistics & Supply Chain",
                    },
                    {
                      label: "DISPLAY NAME",
                      value: "Stellar Express",
                    },
                    {
                      label: "TOTAL EMPLOYEES",
                      value: "1,250+",
                    },
                    {
                      label: "FOUNDED (YEAR)",
                      value: "2018",
                    },
                    {
                      label: "ADDRESS",
                      value:
                        "Plot 24, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093",
                    },
                    {
                      label: "BUSINESS TYPE",
                      value: "Private Limited Company",
                    },
                    {
                      label: "COMPANY SIZE",
                      value: "1001–5000 Employees",
                    },
                    {
                      label: "COMPANY TYPE",
                      value: "Direct Employer",
                    },
                    {
                      label: "OFFICIAL WEBSITE",
                      value: "www.stellarlogistics.com",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-20 "
                    >
                      <p
                        className="font-xs color-text-paragraph-2 mb-5"
                        style={{
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                          fontSize: "10px",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="font-sm mb-0"
                        style={{ fontWeight: 600, color: "#122359" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Analysis section removed */}

          {/* Compliance Documents */}
          <div className="section-box">
            <div className="panel-white">
              <div
                className="panel-head"
                style={{
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "8px" }}
                  >
                    <i className="fi-rr-document font-sm color-brand-2"></i>
                    <h6 className="mb-0">Compliance Documents</h6>
                  </div>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    5 documents uploaded for verification
                  </p>
                </div>
                <a className="font-sm color-brand-2 hover-up" href="#">
                  <i className="fi-rr-download mr-5"></i>Download All (.zip)
                </a>
              </div>

              <div className="panel-body">
                <div className="row">
                  {[
                    {
                      title: "GST Certificate",
                      sub: "GST Document",
                      status: "Verified",
                      statusColor: "#2e7d32",
                      statusBg: "#e8f5e9",
                      img: "https://www.legalwiz.in/wp-content/uploads/image-570.png",
                      expired: false,
                      aiMatch: null,
                      meta: null,
                    },
                    {
                      title: "PAN Card - Corporate",
                      sub: "PAN Document",
                      status: "Verified",
                      statusColor: "#2e7d32",
                      statusBg: "#e8f5e9",
                      img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGCen-C1d098jk5azlItLqxCsPwRy5ET0KczRjB1I7B6TvbqgyJn5GxG6cuywT3D3yPnnydre4oqifOE03SFYEqmS9kN6azD-TawLZWwLPe9mOiGJqLh0adYt11LqlUNvv_HQOhmVDAJE/s1600/IMG-20180320-WA0001.jpg",
                      expired: false,
                      aiMatch: null,
                      meta: null,
                    },
                    {
                      title: "POE License Copy",
                      sub: "POE Document",
                      status: "Verified",
                      statusColor: "#2e7d32",
                      statusBg: "#e8f5e9",
                      img: "https://pbs.twimg.com/media/GYeyu9hW0AE5iyz?format=jpg&name=900x900",
                      expired: false,
                      aiMatch: {
                        label: "98% Match",
                        color: "#2e7d32",
                        bg: "#e8f5e9",
                      },
                      meta: {
                        licenseNo: "POE-9928/2023",
                        validTill: "2025-12-31",
                      },
                    },
                    {
                      title: "RPSL Certification",
                      sub: "RPSL Document",
                      status: "Pending",
                      statusColor: "#e65100",
                      statusBg: "#fff3e0",
                      img: "https://vigilss.com/wp-content/uploads/2023/07/RPSL-LIC-1-768x723.png",
                      aiMatch: {
                        label: "64% Match",
                        color: "#e65100",
                        bg: "#fff3e0",
                      },
                      meta: {
                        licenseNo: "RPSL-MUM-442",
                        validTill: "2023-01-15",
                      },
                    },
                    {
                      title: "Business Reg Certificate",
                      sub: "BR Document",
                      status: "Verified",
                      statusColor: "#2e7d32",
                      statusBg: "#e8f5e9",
                      img: "https://imgv2-2-f.scribdassets.com/img/document/768783389/original/959dd3323c/1?v=1",
                      expired: false,
                      aiMatch: null,
                      meta: null,
                    },
                  ].map((doc) => (
                    <div
                      key={doc.title}
                      className="col-xl-5 col-lg-5 col-md-6 col-sm-6 mb-20"
                    >
                      <div className="card-grid-2" style={{ marginBottom: 0 }}>
                        {/* Expired badge */}
                        {doc.expired && (
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              zIndex: 2,
                              background: "#dc2626",
                              color: "#fff",
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            EXPIRED
                          </div>
                        )}
                        {/* Thumbnail */}
                        <div
                          style={{
                            height: "165px",
                            overflow: "hidden",
                            background: "#dde4f0",
                          }}
                        >
                          <img
                            src={doc.img}
                            alt={doc.title}
                            onClick={() => setPreviewDoc(doc)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              cursor: "pointer", // 🔥 important
                            }}
                          />
                        </div>
                        {/* Card body */}
                        <div
                          className="card-block-info"
                          style={{ padding: "12px" }}
                        >
                          <div className="d-flex align-items-start justify-content-between mb-5">
                            <p
                              className="font-sm mb-0"
                              style={{
                                fontWeight: 600,
                                color: "#122359",
                                lineHeight: 1.3,
                              }}
                            >
                              {doc.title}
                            </p>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "20px",
                                background: doc.statusBg,
                                color: doc.statusColor,
                                whiteSpace: "nowrap",
                                marginLeft: "6px",
                                flexShrink: 0,
                              }}
                            >
                              {doc.status}
                            </span>
                          </div>
                          <p className="font-xs color-text-paragraph-2 mb-0">
                            {doc.sub}
                          </p>

                          {doc.aiMatch && (
                            <div
                              className="d-flex align-items-center mt-10"
                              style={{ gap: "6px" }}
                            >
                              <span
                                className="font-xs color-text-paragraph-2"
                                style={{
                                  textTransform: "uppercase",
                                  fontSize: "9px",
                                  letterSpacing: "0.4px",
                                }}
                              >
                                AI EXTRACTION
                              </span>
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  padding: "1px 7px",
                                  borderRadius: "20px",
                                  background: doc.aiMatch.bg,
                                  color: doc.aiMatch.color,
                                }}
                              >
                                {doc.aiMatch.label}
                              </span>
                            </div>
                          )}

                          {doc.meta && (
                            <div className="employers-info mt-10">
                              <div className="row">
                                <div className="col-6">
                                  <p
                                    className="font-xs color-text-paragraph-2 mb-0"
                                    style={{
                                      fontSize: "9px",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    License No.
                                  </p>
                                  <p
                                    className="font-xs mb-0"
                                    style={{
                                      fontWeight: 600,
                                      color: "#122359",
                                    }}
                                  >
                                    {doc.meta.licenseNo}
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p
                                    className="font-xs color-text-paragraph-2 mb-0"
                                    style={{
                                      fontSize: "9px",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Valid Till
                                  </p>
                                  <p
                                    className="font-xs mb-0"
                                    style={{
                                      fontWeight: 600,
                                      color: "#122359",
                                    }}
                                  >
                                    {doc.meta.validTill}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Required Company Documents Checklist ── */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: "center" }}>
                <div>
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "8px" }}
                  >
                    <Info size={18} className="color-brand-2" />
                    <h6 className="mb-0">Required Company Documents</h6>
                  </div>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    Mandatory and conditional verification documents required for Stellar Logistics Pvt. Ltd.'s business profile.
                  </p>
                </div>
              </div>
              <div className="panel-body">
                <div className="table-responsive">
                  <table className="table font-sm" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Document Type</th>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Category</th>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Requirement</th>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Status</th>
                        <th style={{ padding: "12px 10px", fontWeight: "600", fontSize: "11px", color: "#475569", textTransform: "uppercase" }}>Description & Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "GST Certificate (GSTIN)",
                          category: "Tax & Compliance",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Verified",
                          statusColor: "#2e7d32",
                          statusBg: "#e8f5e9",
                          desc: "Required for all Indian business entities. Verifies legal identity, active status, and tax registration details."
                        },
                        {
                          name: "Corporate PAN Card",
                          category: "Tax & Compliance",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Verified",
                          statusColor: "#2e7d32",
                          statusBg: "#e8f5e9",
                          desc: "Permanent Account Number registered in company name, validating legal identity and national tax standing."
                        },
                        {
                          name: "Business Registration Certificate",
                          category: "Company Identity",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Verified",
                          statusColor: "#2e7d32",
                          statusBg: "#e8f5e9",
                          desc: "Certificate of Incorporation (COI), Trade License, or Partnership Deed verifying the legal existence of the business."
                        },
                        {
                          name: "Memorandum & Articles of Association (MOA/AOA)",
                          category: "Company Governance",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Missing / Required",
                          statusColor: "#c62828",
                          statusBg: "#ffebee",
                          desc: "Bylaws, shareholding registry, and corporate structure documentation. Needed for Private/Public Limited company audits."
                        },
                        {
                          name: "Proof of Establishment (POE)",
                          category: "Office Verification",
                          importance: "Mandatory",
                          impColor: "#dc2626",
                          impBg: "#fef2f2",
                          status: "Verified",
                          statusColor: "#2e7d32",
                          statusBg: "#e8f5e9",
                          desc: "Utility bill, rent agreement, or property registry matching the registered operating address of the company."
                        },
                        {
                          name: "RPSL License Copy",
                          category: "Recruitment License",
                          importance: "Conditional",
                          impColor: "#2563eb",
                          impBg: "#eff6ff",
                          status: "Pending Review",
                          statusColor: "#e65100",
                          statusBg: "#fff3e0",
                          desc: "Required only for maritime recruitment placing seafarers. Must map to a valid DG Shipping license number."
                        },
                        {
                          name: "POE License Copy",
                          category: "Recruitment License",
                          importance: "Conditional",
                          impColor: "#2563eb",
                          impBg: "#eff6ff",
                          status: "Verified",
                          statusColor: "#2e7d32",
                          statusBg: "#e8f5e9",
                          desc: "Required for overseas placement agencies under the Ministry of External Affairs / Protector of Emigrants."
                        }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover-up" style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "14px 10px", fontWeight: "600", color: "#1e293b" }}>
                            <div className="d-flex align-items-center" style={{ gap: "6px" }}>
                              <FileText size={14} className="color-text-paragraph-2" />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 10px", color: "#475569" }}>
                            {item.category}
                          </td>
                          <td style={{ padding: "14px 10px" }}>
                            <span style={{
                              display: "inline-block",
                              fontSize: "10px",
                              fontWeight: "700",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: item.impBg,
                              color: item.impColor,
                              letterSpacing: "0.2px",
                              textTransform: "uppercase"
                            }}>
                              {item.importance}
                            </span>
                          </td>
                          <td style={{ padding: "14px 10px" }}>
                            <span style={{
                              display: "inline-block",
                              fontSize: "10px",
                              fontWeight: "700",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: item.statusBg,
                              color: item.statusColor,
                              letterSpacing: "0.2px",
                              textTransform: "uppercase"
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 10px", fontSize: "12px", color: "#64748b", lineHeight: "1.4", maxWidth: "320px" }}>
                            {item.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Verification Badges */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head" style={{ alignItems: "center" }}>
                <div>
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "8px" }}
                  >
                    <i className="fi-rr-shield-check font-sm color-brand-2"></i>
                    <h6 className="mb-0">Trust &amp; Verification Badges</h6>
                  </div>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    Verified trust attributes and compliance badges for this
                    recruiter.
                  </p>
                </div>
              </div>
              <div className="panel-body">
                <div className="row gx-2 gy-2">
                  {[
                    {
                      label: "GST Verified",
                      active: true,
                      color: "#115e59",
                      bg: "#d1fae5",
                      border: "#10b981",
                    },
                    {
                      label: "PAN Verified",
                      active: true,
                      color: "#c2410c",
                      bg: "#ffedd5",
                      border: "#fb923c",
                    },
                    {
                      label: "Blue-Tick Verified",
                      active: true,
                      color: "#1d4ed8",
                      bg: "#dbeafe",
                      border: "#93c5fd",
                    },
                    {
                      label: "POE Licensed",
                      active: false,
                      color: "#334155",
                      bg: "#f8fafc",
                      border: "#cbd5e1",
                    },
                    {
                      label: "RPSL Certified",
                      active: false,
                      color: "#334155",
                      bg: "#f8fafc",
                      border: "#cbd5e1",
                    },
                  ].map((badge) => (
                    <div key={badge.label} className="col-auto">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          borderRadius: "999px",
                          background: badge.bg,
                          color: badge.color,
                          fontSize: "12px",
                          fontWeight: 700,
                          border: `1px solid ${badge.border}`,
                          minWidth: "fit-content",
                        }}
                      >
                        {badge.active && (
                          <i
                            className="fi-rr-check"
                            style={{ fontSize: "12px" }}
                          ></i>
                        )}
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end left col */}

        {/* ════ RIGHT SIDEBAR ════ */}
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
          {/* <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <h6 className="mb-0">Verification Summary</h6>
              </div>

              <div className="panel-body">
                <div className="d-flex justify-content-between mb-10">
                  <span className="font-sm color-text-paragraph-2">
                    Payment Status
                  </span>
                  <strong style={{ color: "#2e7d32" }}>Completed</strong>
                </div>

                <div className="d-flex justify-content-between mb-10">
                  <span className="font-sm color-text-paragraph-2">
                    Risk Score
                  </span>
                  <strong style={{ color: "#e65100" }}>Medium</strong>
                </div>

                <div className="d-flex justify-content-between mb-10">
                  <span className="font-sm color-text-paragraph-2">
                    Previous Rejections
                  </span>
                  <strong>1</strong>
                </div>
              </div>
            </div>
          </div> */}
          {/* Quick Insights */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <h6
                  className="mb-0"
                  style={{
                    textTransform: "uppercase",
                    fontSize: "11px",
                    letterSpacing: "0.6px",
                    color: "#66789C",
                  }}
                >
                  Quick Insights
                </h6>
              </div>

              <div className="panel-body">
                {/* Registered */}
                <div className="card-style-1 hover-up mb-15">
                  <div className="card-image">
                    <Calendar size={24} strokeWidth={2.2} />
                  </div>
                  <div className="card-info">
                    <p
                      className="font-xs color-text-paragraph-2 mb-0"
                      style={{
                        textTransform: "uppercase",
                        fontSize: "9px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Registered On
                    </p>
                    <div className="card-title mt-2">
                      <h5 className="mb-0">Oct 2023</h5>
                    </div>
                  </div>
                </div>

                {/* Jobs */}
                <div className="card-style-1 hover-up mb-15">
                  <div className="card-image">
                    <Briefcase size={24} strokeWidth={2.2} />
                  </div>
                  <div className="card-info">
                    <p
                      className="font-xs color-text-paragraph-2 mb-0"
                      style={{
                        textTransform: "uppercase",
                        fontSize: "9px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Total Open Jobs
                    </p>
                    <div className="card-title mt-2">
                      <h5 className="mb-0">
                        42{" "}
                        <span className="font-xs status up">+5 this month</span>
                      </h5>
                    </div>
                  </div>
                </div>
                {/* Total Job Posts */}
                <div className="card-style-1 hover-up mb-15">
                  <div className="card-image">
                    <Briefcase size={24} strokeWidth={2.2} />
                  </div>

                  <div className="card-info">
                    <p
                      className="font-xs color-text-paragraph-2 mb-0"
                      style={{
                        textTransform: "uppercase",
                        fontSize: "9px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Total Job Posts
                    </p>

                    <div className="card-title mt-2">
                      <h5 className="mb-0">68</h5>
                    </div>
                  </div>
                </div>
                {/* Credits */}
                <div className="card-style-1 hover-up">
                  <div className="card-image">
                    <Wallet size={24} strokeWidth={2.2} />
                  </div>
                  <div className="card-info">
                    <p
                      className="font-xs color-text-paragraph-2 mb-0"
                      style={{
                        textTransform: "uppercase",
                        fontSize: "9px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Current Credits
                    </p>
                    <div className="card-title mt-2">
                      <h5 className="mb-0">12,500</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Health */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <h6
                  className="mb-0"
                  style={{
                    textTransform: "uppercase",
                    fontSize: "11px",
                    letterSpacing: "0.6px",
                    color: "#66789C",
                  }}
                >
                  Account Health
                </h6>
              </div>

              <div className="panel-body">
                <div className="d-flex align-items-center justify-content-between mb-10">
                  <span
                    className="font-sm color-text-paragraph-2"
                    style={{ fontWeight: 500 }}
                  >
                    Profile Completion
                  </span>

                  <strong
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#122359",
                    }}
                  >
                    85%
                  </strong>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#e5e7eb",
                    borderRadius: "999px",
                    overflow: "hidden",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "85%",
                      height: "100%",
                      background: "#f59e0b",
                      borderRadius: "999px",
                      transition: "width .4s ease",
                    }}
                  />
                </div>

                <p
                  className="font-xs color-text-paragraph-2 mb-0"
                  style={{
                    lineHeight: "20px",
                  }}
                >
                  RPSL documentation needs re-upload as the previous file has
                  reached its expiry date.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Contact */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head">
                <h6
                  className="mb-0"
                  style={{
                    textTransform: "uppercase",
                    fontSize: "11px",
                    letterSpacing: "0.6px",
                    color: "#66789C",
                  }}
                >
                  Primary Contact
                </h6>
              </div>
              <div className="panel-body text-center">
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#ffa300",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "18px",
                    margin: "0 auto 10px",
                  }}
                >
                  SJ
                </div>
                <h6 className="mb-0">Sarah Jenkins</h6>
                <p className="font-xs color-text-paragraph-2 mt-5 mb-20">
                  HR Director
                </p>
                <a
                  className="btn btn-grey-big hover-up font-sm mb-10"
                  href="#"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <i className="fi-rr-envelope"></i>Message HR
                </a>
                <a className="font-sm color-brand-2 hover-up" href="#">
                  View All Team Members
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* end right sidebar */}
      </div>

      {/* ── TRANSACTION HISTORY (full width, bottom of page) ── */}
      <div className="section-box">
        <div className="panel-white">
          <div className="panel-head d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">Transaction History</h6>
              <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                All payments made by this recruiter — memberships, credit
                packs and fees.
              </p>
            </div>
          </div>

          <div className="panel-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Transaction ID</th>
                    <th>Status</th>
                    <th>Invoice</th>
                  </tr>
                </thead>

                <tbody>
                  {TRANSACTIONS.map((txn) => {
                    const s = STATUS_STYLE[txn.status] || STATUS_STYLE.Paid;
                    return (
                      <tr key={txn.id}>
                        <td>{txn.date}</td>
                        <td style={{ fontWeight: 600, color: "#122359" }}>
                          {txn.description}
                        </td>
                        <td>{txn.type}</td>
                        <td>{txn.amount}</td>
                        <td>{txn.payment}</td>
                        <td>{txn.id}</td>
                        <td>
                          <span
                            style={{
                              background: s.bg,
                              color: s.color,
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => setInvoiceTxn(txn)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              background: "#eef2ff",
                              color: "#3730a3",
                              border: "1px solid #c7d2fe",
                              borderRadius: "8px",
                              padding: "5px 12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            <Receipt size={12} />
                            {txn.invoice}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="font-xs color-text-paragraph-2 mt-15 mb-0">
              Showing {TRANSACTIONS.length} of {TRANSACTIONS.length}{" "}
              transactions
            </p>
          </div>
        </div>
      </div>

      {/* ── INVOICE MODAL ── */}
      {invoiceTxn && (
        <div
          onClick={() => setInvoiceTxn(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(10,20,50,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "15px",
                  color: "#ffa300",
                  letterSpacing: "0.5px",
                  textAlign: "left",
                }}
              >
                JOBBOX
              </span>
              <button
                onClick={() => setInvoiceTxn(null)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "#f1f5f9",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={15} color="#475569" />
              </button>
            </div>

            <h5
              style={{
                margin: "0 0 6px",
                color: "#122359",
                fontWeight: 800,
                textAlign: "left",
              }}
            >
              Invoice {invoiceTxn.invoice}
            </h5>
            <p
              className="font-sm color-text-paragraph-2"
              style={{ margin: "0 0 18px", textAlign: "left" }}
            >
              Payment received from Stellar Logistics Pvt. Ltd.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "14px 16px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{ fontWeight: 700, color: "#122359", fontSize: "14px" }}
              >
                {invoiceTxn.description}
              </span>
              <span
                style={{ fontWeight: 800, color: "#122359", fontSize: "16px" }}
              >
                {invoiceTxn.amount}
              </span>
            </div>

            <div style={{ textAlign: "left", marginBottom: "20px" }}>
              <p className="font-sm mb-1" style={{ color: "#334155" }}>
                Date: {invoiceTxn.date}
              </p>
              <p className="font-sm mb-1" style={{ color: "#334155" }}>
                Transaction ID: {invoiceTxn.id}
              </p>
              <p className="font-sm mb-0" style={{ color: "#334155" }}>
                Payment: {invoiceTxn.payment}
              </p>
            </div>

            <button
              onClick={() => handleDownloadInvoice(invoiceTxn)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "#ffa300",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "13px 0",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <Download size={15} />
              Download Invoice
            </button>
          </div>
        </div>
      )}
      {previewDoc && (
        <div
          onClick={() => setPreviewDoc(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "10px",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <img
              src={previewDoc.img}
              alt={previewDoc.title}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "6px",
              }}
            />

            {/* TITLE */}
            <p
              style={{
                marginTop: "10px",
                fontWeight: 600,
                color: "#122359",
              }}
            >
              {previewDoc.title}
            </p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}