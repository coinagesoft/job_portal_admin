'use client'

import Footer from "../../../components/Footer"
import { useRouter } from "next/navigation"
import { ShieldCheck, FileText, Search, MoreVertical, Ban, CheckCircle2, Info, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { recruiterService } from "../../../services/recruiterService";

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

const standardDocLabels = [
  "gst",
  "pan",
  "brc",
  "business reg",
  "business registration",
  "moa",
  "articles of association",
  "poe",
  "establishment",
  "rpsl",
  "maritime",
  "poe license",
  "cancelled cheque",
  "director kyc",
  "trade license"
];

const isStandardDoc = (name) => {
  if (!name) return false;
  const normalized = name.trim().toLowerCase();
  return standardDocLabels.some((std) => normalized.includes(std));
};

export default function RecruiterPage() {
  const router = useRouter();
  const [recruitersList, setRecruitersList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [requiredDocs, setRequiredDocs] = useState({});
  const [docOptions, setDocOptions] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchRecruiters = () => {
    setLoadingList(true);
    recruiterService.getRecruiters()
      .then((res) => {
        setLoadingList(false);
        if (Array.isArray(res)) {
          setRecruitersList(res);
        } else if (res && Array.isArray(res.items)) {
          setRecruitersList(res.items);
        } else if (res && Array.isArray(res.data)) {
          setRecruitersList(res.data);
        }
      })
      .catch((err) => {
        setLoadingList(false);
        console.error("Failed to fetch recruiters:", err);
      });
  };

  const fetchMasterDocuments = () => {
    recruiterService.getMasterAllDocuments()
      .then((res) => {
        const data = res?.data || res || [];
        if (Array.isArray(data)) {
          const mappedOptions = data.map((doc) => ({
            key: doc.id,
            label: doc.documentName,
          }));
          setDocOptions(mappedOptions);
          
          const mappedRequired = {};
          data.forEach((doc) => {
            mappedRequired[doc.id] = doc.isMandatory;
          });
          setRequiredDocs(mappedRequired);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch master document types:", err);
      });
  };

  useEffect(() => {
    fetchRecruiters();
    fetchMasterDocuments();
  }, []);

  const updateRequiredDocs = (newDocs) => {
    setRequiredDocs(newDocs);
    if (typeof window !== "undefined") {
      localStorage.setItem("requiredDocs", JSON.stringify(newDocs));
    }
  };

  const updateDocOptions = (newOptions) => {
    setDocOptions(newOptions);
    if (typeof window !== "undefined") {
      localStorage.setItem("docOptions", JSON.stringify(newOptions));
    }
  };

  const [customDocName, setCustomDocName] = useState("");

  const handleAddCustomDoc = (e) => {
    if (e) e.preventDefault();
    if (!customDocName.trim()) return;

    const docName = customDocName.trim();

    recruiterService.addOptionalDocumentType(docName, "General")
      .then(() => {
        setCustomDocName("");
        fetchMasterDocuments();
      })
      .catch((err) => {
        alert(err.message || "Failed to add optional document type to server");
      });
  };

  const recruiterDocs = {
    1: ["gst", "pan", "brc", "moa", "poe", "rpsl", "poe_license", "cheque", "kyc", "trade"],
    2: ["gst", "pan", "brc", "poe"],
    3: ["gst", "pan", "brc", "poe", "kyc", "trade"],
    4: ["gst", "pan", "brc", "moa", "poe", "rpsl", "poe_license", "cheque", "kyc", "trade"],
    5: ["gst", "pan", "brc", "moa", "poe", "cheque", "kyc", "trade"],
  };

  const getRecruiterDocCounts = (recId, requiredDocsState) => {
    const verifiedList = recruiterDocs[recId] || [];
    let verifiedCount = 0;
    let totalCount = 0;
    
    Object.keys(requiredDocsState).forEach((key) => {
      if (requiredDocsState[key]) {
        totalCount++;
        if (verifiedList.includes(key)) {
          verifiedCount++;
        }
      }
    });
    
    return { verifiedCount, totalCount };
  };

  const handleDocCheckboxChange = (docKey) => {
    const newMandatory = !requiredDocs[docKey];
    recruiterService.updateRequiredDocStatus(docKey, newMandatory)
      .then(() => {
        const updated = {
          ...requiredDocs,
          [docKey]: newMandatory,
        };
        updateRequiredDocs(updated);
      })
  };

  const handleDeleteDocument = (docId, docLabel) => {
    if (!window.confirm(`Are you sure you want to delete "${docLabel}"?`)) return;

    recruiterService.deleteDocumentType(docId)
      .then(() => {
        showToast(`Document type "${docLabel}" deleted successfully.`);
        fetchMasterDocuments();
      })
      .catch((err) => {
        showToast(err.message || `Failed to delete document type "${docLabel}"`, "error");
      });
  };

  const handleResetDefaults = () => {
    setIsResetting(true);
    recruiterService.getMasterAllDocuments()
      .then((res) => {
        const data = res?.data || res || [];
        if (Array.isArray(data)) {
          const updatePromises = data.map((doc) => {
            const targetMandatory = isStandardDoc(doc.documentName);
            return recruiterService.updateRequiredDocStatus(doc.id, targetMandatory);
          });

          Promise.all(updatePromises)
            .then(() => {
              fetchMasterDocuments();
              setIsResetting(false);
            })
            .catch((err) => {
              console.error("Failed to update some documents during reset:", err);
              alert("Failed to reset document configurations on the server.");
              fetchMasterDocuments();
              setIsResetting(false);
            });
        } else {
          alert("Invalid document data received from server.");
          setIsResetting(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch master documents for reset:", err);
        alert("Failed to fetch document configurations from the server.");
        setIsResetting(false);
      });
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const ITEMS_PER_PAGE = 5;

  // Close the actions menu or document dropdown on any click outside them.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".actions-menu")) {
        setOpenMenuId(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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
    const recruiter = recruitersList.find((r) => r.id === id);
    const companyName = recruiter ? recruiter.company : "Recruiter";

    recruiterService.updateAccountStatus(id, "Active", "Verified by admin")
      .then(() => {
        fetchRecruiters();
        showToast(
          `Recruiter "${companyName}" has been successfully activated & verified!`,
          "success"
        );
      })
      .catch((err) => {
        showToast(err.message || "Failed to update verification status", "error");
      });
  };

  const handleToggleSuspend = (id, currentStatus) => {
    const newStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
    const reason = newStatus === "Active" ? "Activated by admin" : "Suspended by admin";
    
    const recruiter = recruitersList.find((r) => r.id === id);
    const companyName = recruiter ? recruiter.company : "Recruiter";

    recruiterService.updateAccountStatus(id, newStatus, reason)
      .then(() => {
        fetchRecruiters();
        showToast(
          `Recruiter "${companyName}" has been successfully ${
            newStatus === "Active" ? "activated" : "suspended"
          }!`,
          "success"
        );
      })
      .catch((err) => {
        showToast(err.message || `Failed to update status to ${newStatus}`, "error");
      });
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

  const filteredRecruiters = (recruitersList || []).filter((r) => {
    return (
      ((r.company || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.person || "").toLowerCase().includes(search.toLowerCase())) &&
      (status === "" || r.status === status)
    );
  });

  const pageCount = Math.max(1, Math.ceil(filteredRecruiters.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visibleRecruiters = filteredRecruiters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const verifiedCount = (recruitersList || []).filter(r => (r.verificationStatus || r.gst) === 'Verified').length;
  const verificationRate = (recruitersList || []).length > 0 ? Math.round((verifiedCount / recruitersList.length) * 100) : 0;
  const pendingApprovalsCount = (recruitersList || []).filter(r => r.status === 'Pending').length;
  const activeRecruitersCount = (recruitersList || []).filter(r => r.status === 'Active').length;

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
                    {/* <span className="font-sm status up ms-2">Total</span> */}
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
          {/* <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 d-flex">
            <div className="card-style-1 hover-up w-100">
              <div className="card-image">
                <ShieldCheck size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <div className="card-title">
                  <h3>
                    {verificationRate}% <br /> */}
                    {/* <span className="font-sm status up ms-2">GST</span> */}
                  {/* </h3>
                </div>
                <p className="color-text-paragraph-2">Verification Rate</p>
              </div>
            </div>
          </div> */}

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
                    {/* <span className="font-sm status up ms-2">Active</span> */}
                  </h3>
                </div>
                <p className="color-text-paragraph-2">Active Recruiters</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Company Document Standards Configuration ── */}
      <div className="section-box mt-20">
        <div className="panel-white">
          <div className="panel-head" style={{ alignItems: "center" }}>
            <div>
              <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                <Info size={18} className="color-brand-2" />
                <h6 className="mb-0" style={{ fontSize: "20px" }}>
                  Company Document Standards Configuration
                </h6>
              </div>
              <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                Manage the mandatory and conditional document criteria required to approve and verify recruiter accounts on the platform.
              </p>
            </div>
          </div>
          <div className="panel-body" style={{ padding: "20px 24px" }}>
            <div className="d-flex align-items-center" style={{ gap: "12px", position: "relative" }}>
              <span className="font-sm" style={{ fontWeight: 600, color: "#122359", minWidth: "fit-content" }}>
                Required Documents:
              </span>
              
              <div ref={dropdownRef} style={{ position: "relative", width: "320px" }}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: "100%",
                    height: "42px",
                    background: "#fff",
                    border: "1px solid #e3e8f4",
                    borderRadius: "9px",
                    padding: "0 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#122359",
                    textAlign: "left",
                    gap: "8px"
                  }}
                >
                  <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {Object.values(requiredDocs).filter(Boolean).length === 0
                      ? "None selected"
                      : `${Object.values(requiredDocs).filter(Boolean).length} documents selected`}
                  </span>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "46px",
                      left: 0,
                      width: "100%",
                      background: "#fff",
                      border: "1px solid #e3e8f4",
                      borderRadius: "9px",
                      boxShadow: "0 10px 25px rgba(18, 35, 89, 0.08)",
                      zIndex: 100,
                      maxHeight: "340px",
                      overflowY: "auto",
                      padding: "10px"
                    }}
                  >
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {docOptions.map((doc) => {
                        const isSelected = !!requiredDocs[doc.key];
                        return (
                          <div
                            key={doc.key}
                            onClick={() => handleDocCheckboxChange(doc.key)}
                            className="d-flex align-items-center justify-content-between"
                            style={{
                              padding: "8px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              userSelect: "none",
                              margin: "2px 0",
                              transition: "background 0.15s, color 0.15s",
                              background: isSelected ? "#fff3e0" : "transparent",
                              color: isSelected ? "#e65100" : "#475569",
                              fontWeight: isSelected ? "600" : "400"
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.background = "#f5f7fc";
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <span style={{ fontSize: "13px" }}>{doc.label}</span>
                            <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                              {isSelected && (
                                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#e65100" }}>✓</span>
                              )}
                              {!isStandardDoc(doc.label) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDocument(doc.key, doc.label);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: "4px",
                                    cursor: "pointer",
                                    color: "#ef4444",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "4px",
                                    transition: "background 0.15s, color 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#fee2e2";
                                    e.currentTarget.style.color = "#dc2626";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "none";
                                    e.currentTarget.style.color = "#ef4444";
                                  }}
                                  title={`Delete ${doc.label}`}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Add Custom Doc Input */}
                    <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "8px", paddingTop: "8px" }}>
                      <div className="d-flex" style={{ gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          placeholder="Type custom doc name..."
                          value={customDocName}
                          onChange={(e) => setCustomDocName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomDoc();
                            }
                          }}
                          style={{
                            flex: 1,
                            height: "32px",
                            border: "1px solid #e3e8f4",
                            borderRadius: "6px",
                            padding: "0 8px",
                            fontSize: "12px",
                            color: "#122359"
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomDoc}
                          style={{
                            height: "32px",
                            background: "#ffa300",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0 10px",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#fff",
                            cursor: "pointer"
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset to defaults button */}
              <button
                type="button"
                disabled={isResetting}
                onClick={handleResetDefaults}
                style={{
                  height: "42px",
                  background: isResetting ? "#e2e8f0" : "#f5f7fc",
                  border: "1px solid #e3e8f4",
                  borderRadius: "9px",
                  padding: "0 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: isResetting ? "#94a3b8" : "#475569",
                  cursor: isResetting ? "not-allowed" : "pointer",
                  transition: "background 0.15s, border-color 0.15s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eef2ff";
                  e.currentTarget.style.borderColor = "#c7d2fe";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f5f7fc";
                  e.currentTarget.style.borderColor = "#e3e8f4";
                }}
              >
                {isResetting ? "Resetting..." : "Reset Defaults"}
              </button>
            </div>

            {/* Selected Documents Chips */}
            <div className="d-flex flex-wrap mt-15" style={{ gap: "6px" }}>
              {docOptions.map((opt) => {
                if (!requiredDocs[opt.key]) return null;
                return (
                  <span
                    key={opt.key}
                    className="d-flex align-items-center"
                    style={{
                      background: "#fff3e0",
                      color: "#e65100",
                      border: "1px solid #ffe0b2",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 600,
                      gap: "6px"
                    }}
                  >
                    <span>{opt.label}</span>
                    <button
                      type="button"
                      onClick={() => handleDocCheckboxChange(opt.key)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e65100",
                        padding: 0,
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "10px",
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center"
                      }}
                      aria-label={`Remove ${opt.label}`}
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="section-box" style={{ marginTop: "8px" }}>
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
                    <th style={{ minWidth: "240px" ,fontSize: "14px"}}>
                      Employer / Company
                    </th>
                    <th style={{ minWidth: "200px" ,fontSize: "14px"}}>
                      Contact Person
                    </th>
                    <th style={{ minWidth: "160px" ,fontSize: "14px"}}>
                      Verification
                    </th>
                    <th style={{ minWidth: "100px" ,fontSize: "14px"}}>
                      Status
                    </th>
                    <th style={{ minWidth: "110px" ,fontSize: "14px"}}>
                      Registered
                    </th>
                    <th style={{ minWidth: "70px" ,fontSize: "14px"}} className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingList ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #ff9900',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          <span className="font-sm color-text-paragraph-2">Loading recruiters...</span>
                        </div>
                        <style>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                      </td>
                    </tr>
                  ) : filteredRecruiters.length === 0 ? (
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
                            {r.logo ? (
                              <img
                                src={r.logo.startsWith('http') ? r.logo : `/assets/imgs/page/candidates/${r.logo}`}
                                alt={r.company}
                                style={{
                                  width: "46px",
                                  height: "46px",
                                  borderRadius: "50%",
                                  objectFit: "cover"
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "46px",
                                  height: "46px",
                                  borderRadius: "50%",
                                  background: "#f1f5f9",
                                  color: "#122359",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  fontSize: "14px"
                                }}
                              >
                                {r.company ? r.company.substring(0, 2).toUpperCase() : "CO"}
                              </div>
                            )}

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
                            const verificationStatus = r.verificationStatus || r.gst || "Pending";
                            const v = getVerificationStyle(verificationStatus);
                            const verifiedCount = r.docsVerified !== undefined ? r.docsVerified : 0;
                            const totalCount = r.docsTotal !== undefined ? r.docsTotal : 8;
                            const docsComplete = verifiedCount >= totalCount;
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
                                  {verificationStatus}
                                </span>
                                <span className={`verify-docs-count ${docsComplete ? 'is-complete' : ''}`}>
                                  <FileText size={12} />
                                  {verifiedCount}/{totalCount} docs
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

                                {(r.verificationStatus || r.gst) === 'Verified' ? (
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
                                    onClick={() => { handleToggleSuspend(r.id, r.status); setOpenMenuId(null); }}
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>Activate</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="actions-menu-item is-danger"
                                    onClick={() => { handleToggleSuspend(r.id, r.status); setOpenMenuId(null); }}
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
      {mounted && toast.show && createPortal(
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999999,
            background: "#fff",
            color: "#122359",
            borderLeft: toast.type === "success" ? "4px solid #2e7d32" : "4px solid #c62828",
            padding: "14px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(18, 35, 89, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 500,
            fontSize: "13px",
            borderTop: "1px solid #f1f5f9",
            borderRight: "1px solid #f1f5f9",
            borderBottom: "1px solid #f1f5f9",
            animation: "slideIn 0.3s ease-out"
          }}
        >
          <span style={{ 
            color: toast.type === "success" ? "#2e7d32" : "#c62828",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: toast.type === "success" ? "#e8f5e9" : "#fdecea"
          }}>
            {toast.type === "success" ? "✓" : "✗"}
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "8px",
              padding: 0,
              fontSize: "12px"
            }}
            onMouseEnter={(e) => e.target.style.color = "#122359"}
            onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
          >
            ✕
          </button>
        </div>,
        document.body
      )}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <Footer />
    </>
  )
}