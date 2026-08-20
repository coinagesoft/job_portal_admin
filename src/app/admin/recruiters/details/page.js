"use client";
import { useState, useEffect, use } from "react";
import { recruiterService } from "../../../../services/recruiterService";
import Footer from "../../../../components/Footer";
import { useRouter } from "next/navigation";
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
  UserCheck,
  Ban,
  Eye,
  ShieldCheck
} from "lucide-react";

export default function EmployerDetailsPage({ searchParams }) {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);
  const id = resolvedSearchParams?.id;

  const getDocUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const base = "https://jobportal.coinage.in";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  const [recruiterData, setRecruiterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [invoiceTxn, setInvoiceTxn] = useState(null);
  const [documentsList, setDocumentsList] = useState([]);
  
  // Document request states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [optionalDocs, setOptionalDocs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const fetchRecruiterDetails = (recId) => {
    setLoading(true);
    recruiterService.getRecruiterById(recId)
      .then((res) => {
        if (res && res.success && res.data) {
          setRecruiterData(res.data);
        } else if (res && res.data) {
          setRecruiterData(res.data);
        } else if (res) {
          setRecruiterData(res);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recruiter details:", err);
        setLoading(false);
      });
  };

  const fetchDocumentsAndChecklist = (recId) => {
    recruiterService.getRecruiterDocumentChecklist(recId)
      .then((checklistRes) => {
        const checklistData = checklistRes?.data?.documents || checklistRes?.documents || [];
        
        recruiterService.getRecruiterDocuments(recId)
          .then((docsRes) => {
            const docsData = docsRes?.data?.documents || docsRes?.documents || [];
            
            const mergedDocs = checklistData.map((chkDoc) => {
              const uploadedDoc = docsData.find(
                (d) => 
                  (d.documentId && d.documentId !== "00000000-0000-0000-0000-000000000000" && d.documentId === chkDoc.documentId) ||
                  (d.documentTypeId && d.documentTypeId === chkDoc.documentTypeId)
              );
              
              const status = uploadedDoc?.status || chkDoc.status || "NotUploaded";
              const docId = (uploadedDoc?.documentId && uploadedDoc.documentId !== "00000000-0000-0000-0000-000000000000") ? uploadedDoc.documentId : chkDoc.documentId;
              
              return {
                documentId: docId,
                documentTypeId: chkDoc.documentTypeId,
                title: chkDoc.documentName || "Document",
                sub: `${chkDoc.category || "General"} (${chkDoc.documentCategory || "Optional"})`,
                status: status,
                statusColor: status === "Verified" ? "#2e7d32" : status === "Rejected" ? "#c62828" : status === "Pending" ? "#e65100" : "#64748b",
                statusBg: status === "Verified" ? "#e8f5e9" : status === "Rejected" ? "#fdecea" : status === "Pending" ? "#fff3e0" : "#f1f5f9",
                img: uploadedDoc?.fileUrl || uploadedDoc?.url || uploadedDoc?.documentUrl || chkDoc.url || chkDoc.fileUrl || null,
                isMandatory: chkDoc.isMandatory,
                requiresVerification: chkDoc.requiresVerification,
                uploadedAt: (uploadedDoc?.uploadedAt || chkDoc.uploadedAt) && (uploadedDoc?.uploadedAt || chkDoc.uploadedAt) !== "0001-01-01T00:00:00" ? new Date(uploadedDoc?.uploadedAt || chkDoc.uploadedAt).toLocaleDateString() : null,
              };
            });
            
            setDocumentsList(mergedDocs);
          })
          .catch((docsErr) => {
            console.error("Failed to fetch uploaded documents:", docsErr);
            const fallbackMerged = checklistData.map((chkDoc) => {
              const status = chkDoc.status || "NotUploaded";
              return {
                documentId: chkDoc.documentId,
                documentTypeId: chkDoc.documentTypeId,
                title: chkDoc.documentName || "Document",
                sub: `${chkDoc.category || "General"} (${chkDoc.documentCategory || "Optional"})`,
                status: status,
                statusColor: status === "Verified" ? "#2e7d32" : status === "Rejected" ? "#c62828" : status === "Pending" ? "#e65100" : "#64748b",
                statusBg: status === "Verified" ? "#e8f5e9" : status === "Rejected" ? "#fdecea" : status === "Pending" ? "#fff3e0" : "#f1f5f9",
                img: chkDoc.fileUrl || chkDoc.url || null,
                isMandatory: chkDoc.isMandatory,
                requiresVerification: chkDoc.requiresVerification,
                uploadedAt: chkDoc.uploadedAt && chkDoc.uploadedAt !== "0001-01-01T00:00:00" ? new Date(chkDoc.uploadedAt).toLocaleDateString() : null,
              };
            });
            setDocumentsList(fallbackMerged);
          });
      })
      .catch((err) => {
        console.error("Failed to fetch document checklist:", err);
      });
  };

  const fetchOptionalDocNames = () => {
    recruiterService.getAllOptionalNames()
      .then((res) => {
        const data = res?.data || res || [];
        setOptionalDocs(data);
        if (data.length > 0) {
          setSelectedDocId(data[0].documentTypeId);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch optional document names:", err);
      });
  };

  useEffect(() => {
    let targetId = id;
    if (!targetId && typeof window !== 'undefined') {
      const searchStr = window.location.search;
      if (searchStr && searchStr.startsWith('?')) {
        const urlParams = new URLSearchParams(searchStr);
        targetId = urlParams.get('id');
      }
    }
    if (targetId) {
      fetchRecruiterDetails(targetId);
      fetchDocumentsAndChecklist(targetId);
      fetchOptionalDocNames();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleUpdateStatus = (newStatus) => {
    if (!recruiterData?.id) return;
    const reason = newStatus === "Active" ? "Activated/Approved by admin" : "Suspended by admin";
    recruiterService.updateAccountStatus(recruiterData.id, newStatus, reason)
      .then(() => {
        fetchRecruiterDetails(recruiterData.id);
      })
      .catch((err) => {
        alert(err.message || `Failed to update status to ${newStatus}`);
      });
  };

  const handleUpdateDocumentStatus = (docId, newStatus) => {
    const remarks = prompt("Enter remarks/reason for this status change:", newStatus === "Approved" || newStatus === "Verified" ? "Verified by admin" : "Rejected by admin");
    if (remarks === null) return;
    
    recruiterService.updateDocumentStatus(docId, newStatus, remarks)
      .then(() => {
        const recId = id || recruiterData?.id;
        if (recId) {
          fetchDocumentsAndChecklist(recId);
        }
      })
      .catch((err) => {
        alert(err.message || `Failed to update document status to ${newStatus}`);
      });
  };

  const handleSendDocumentRequest = (e) => {
    e.preventDefault();
    const recId = id || recruiterData?.id;
    if (!recId || !selectedDocId) return;
    
    const selectedDoc = optionalDocs.find(d => d.documentTypeId === selectedDocId);
    const docName = selectedDoc ? selectedDoc.documentName : "";
    
    setSubmittingRequest(true);
    recruiterService.requestDocument(recId, selectedDocId, docName, requestMessage)
      .then(() => {
        alert("Document request sent successfully!");
        setShowRequestModal(false);
        setRequestMessage("");
        fetchDocumentsAndChecklist(recId);
      })
      .catch((err) => {
        alert(err.message || "Failed to send document request");
      })
      .finally(() => {
        setSubmittingRequest(false);
      });
  };

  const generateLocalPdf = async (txn, serverTextContent = null) => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const company = recruiterData?.company || "Employer";
      const invoiceNum = txn.transactionNumber || txn.invoice || txn.transactionId;
      const amount = typeof txn.amount === 'number' ? `INR ${txn.amount}` : txn.amount;
      const dateVal = txn.date ? new Date(txn.date).toLocaleDateString() : "N/A";
      const paymentMethod = txn.payment || "N/A";
      const txnId = txn.transactionId || txn.id;
      const statusVal = txn.paymentStatus || txn.status || "N/A";
      const descriptionVal = txn.description || "N/A";
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(18, 35, 89); // Navy
      doc.text("JOBBOX", 20, 25);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Gray
      doc.setFont("helvetica", "normal");
      doc.text("Job Portal Admin Invoice", 20, 31);
      
      doc.setDrawColor(226, 232, 240); // Slate Border
      doc.line(20, 38, 190, 38);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(18, 35, 89);
      doc.text(`INVOICE: ${invoiceNum}`, 20, 48);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Date: ${dateVal}`, 20, 56);
      doc.text(`Transaction ID: ${txnId}`, 20, 62);
      doc.text(`Payment Method: ${paymentMethod}`, 20, 68);
      doc.text(`Payment Status: ${statusVal}`, 20, 74);
      
      doc.setFont("helvetica", "bold");
      doc.text("Billed To:", 130, 48);
      doc.setFont("helvetica", "normal");
      doc.text(company, 130, 54);
      if (recruiterData?.companyInformation?.address && recruiterData.companyInformation.address !== "N/A") {
        const addressLines = doc.splitTextToSize(recruiterData.companyInformation.address, 55);
        doc.text(addressLines, 130, 60);
      }
      
      // Table Header
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 88, 170, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("Description", 24, 93);
      doc.text("Amount", 160, 93);
      
      // Table Content
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(descriptionVal, 24, 103);
      doc.text(amount, 160, 103);
      
      doc.line(20, 108, 190, 108);
      
      // Total
      doc.setFont("helvetica", "bold");
      doc.text("Total Paid", 120, 118);
      doc.text(amount, 160, 118);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("Thank you for your business.", 20, 135);
      doc.text("For any support queries, please contact support@jobbox.io", 20, 140);
      
      doc.save(`Invoice-${invoiceNum}.pdf`);
    } catch (e) {
      console.error("jspdf generation failed:", e);
      // Text fallback if jspdf fails
      const content = serverTextContent || `JOBBOX
Invoice ${txn.transactionNumber || txn.invoice || txn.transactionId}
--------------------------------
Payment received from ${recruiterData?.company || "Employer"}

${txn.description}                         ₹${txn.amount}

Date: ${txn.date}
Transaction ID: ${txn.transactionId || txn.id}
Payment Method: ${txn.payment}
Status: ${txn.paymentStatus || txn.status}
--------------------------------
Thank you for your business.
`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${txn.transactionNumber || txn.invoice || txn.transactionId}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadInvoice = (txn) => {
    const recId = recruiterData?.id || id;
    if (!recId) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('jobbox_access_token') : null;
    
    let baseUrl = '';
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
        baseUrl = 'https://jobportal.coinage.in';
      }
    }

    const endpoint = `${baseUrl}/api/admin/recruiters/${recId}/transactions/${txn.transactionId || txn.id}/invoice/download`;

    fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to download invoice from server");
        }
        
        const contentType = response.headers.get("content-type") || "";
        
        if (contentType.includes("application/json")) {
          const json = await response.json();
          if (json && json.invoiceUrl) {
            window.open(json.invoiceUrl, '_blank');
          } else if (json && json.content) {
            generateLocalPdf(txn, json.content);
          } else {
            generateLocalPdf(txn);
          }
        } else {
          // Response is a PDF file stream
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Invoice-${txn.transactionNumber || txn.invoice || txn.transactionId}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }
      })
      .catch((err) => {
        console.error("PDF download failed, falling back to client-side PDF:", err);
        generateLocalPdf(txn);
      });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #ffa300',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h5 style={{ color: '#122359', fontWeight: 600 }}>Loading Recruiter Profile...</h5>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!recruiterData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '15px' }}>
        <h5 style={{ color: '#122359', fontWeight: 600 }}>Recruiter Profile Not Found</h5>
        <p className="color-text-paragraph-2">Please ensure you have selected a valid recruiter.</p>
        <button className="btn btn-warning text-white" onClick={() => router.push('/admin/recruiters')}>Back to Recruiters</button>
      </div>
    );
  }

  const transactionsList = recruiterData.transactions || [];

  const getTxnStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
      case 'Success':
      case 'Successfull':
        return { bg: "#e8f5e9", color: "#2e7d32" };
      case 'Pending':
        return { bg: "#fff3e0", color: "#e65100" };
      case 'Refunded':
      case 'Failed':
        return { bg: "#ffebee", color: "#c62828" };
      default:
        return { bg: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <>
      {/* ── PAGE HEADING ── */}
      <div className="box-heading d-flex align-items-center justify-content-between mb-3">
        {/* LEFT */}
        <div className="box-title d-flex align-items-center" style={{ gap: "12px" }}>
          {recruiterData.logo ? (
            <img
              src={recruiterData.logo}
              alt={recruiterData.company}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "8px",
                objectFit: "cover",
                flexShrink: 0
              }}
            />
          ) : (
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
              {recruiterData.company ? recruiterData.company.substring(0, 2).toUpperCase() : "CO"}
            </div>
          )}

          <div className="mt-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="mb-0">{recruiterData.company || "Company Details"}</h5>
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
                Employer
              </span>
            </div>

            <div className="d-flex align-items-center mt-1" style={{ gap: "10px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 10px",
                  borderRadius: "20px",
                  background: recruiterData.accountStatus === 'Active' ? '#e8f5e9' : recruiterData.accountStatus === 'Suspended' ? '#ffebee' : '#fff3e0',
                  color: recruiterData.accountStatus === 'Active' ? '#2e7d32' : recruiterData.accountStatus === 'Suspended' ? '#c62828' : '#e65100',
                }}
              >
                {recruiterData.accountStatus || "Pending"}
              </span>

              <span className="font-xs color-text-paragraph-2">
                ID: {recruiterData.id}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: "none", backgroundColor: "revert" }}>
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
                <span>Details - {recruiterData.recruiter?.name || "View"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="row">
        {/* ════ LEFT COLUMN ════ */}
        <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">
          {/* Recruiter Information */}
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
                      {recruiterData.recruiter?.name || recruiterData.primaryContact?.name || "N/A"}
                    </p>
                  </div>

                  <div className="col-6 mb-15">
                    <p className="font-xs color-text-paragraph-2">ROLE</p>
                    <p className="font-sm mb-0" style={{ fontWeight: 600 }}>
                      {recruiterData.recruiter?.role || recruiterData.primaryContact?.role || "N/A"}
                    </p>
                  </div>

                  <div className="col-6 mb-15">
                    <p className="font-xs color-text-paragraph-2">EMAIL</p>
                    <p className="font-sm mb-0" style={{ fontWeight: 600 }}>
                      {recruiterData.recruiter?.email || recruiterData.primaryContact?.email || "N/A"}
                    </p>
                  </div>

                  <div className="col-6 mb-15">
                    <p className="font-xs color-text-paragraph-2">MEMBERSHIP DETAILS</p>
                    <p className="font-sm mb-1" style={{ fontWeight: 600, color: "#122359" }}>
                      {recruiterData.membership?.planName || "Free Plan"}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: recruiterData.membership?.isActive ? "#e8f5e9" : "#fff7e6",
                        color: recruiterData.membership?.isActive ? "#2e7d32" : "#b7791f",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {recruiterData.membership?.expiresAt 
                        ? `Valid till: ${new Date(recruiterData.membership.expiresAt).toLocaleDateString()}`
                        : "No expiry"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head d-flex justify-content-between" style={{ alignItems: "center" }}>
                <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                  <h6 className="mb-0">Company Information</h6>
                </div>
              </div>
              <div className="panel-body">
                <div className="row">
                  {[
                    {
                      label: "LEGAL NAME",
                      value: recruiterData.companyInformation?.legalName || "N/A",
                    },
                    {
                      label: "INDUSTRY TYPE",
                      value: recruiterData.companyInformation?.industryType || recruiterData.sector || "N/A",
                    },
                    {
                      label: "DISPLAY NAME",
                      value: recruiterData.companyInformation?.displayName || recruiterData.company || "N/A",
                    },
                    {
                      label: "TOTAL EMPLOYEES",
                      value: recruiterData.companyInformation?.totalEmployees || "N/A",
                    },
                    {
                      label: "FOUNDED (YEAR)",
                      value: recruiterData.companyInformation?.foundedYear || "N/A",
                    },
                    {
                      label: "ADDRESS",
                      value: recruiterData.companyInformation?.address || "N/A",
                    },
                    {
                      label: "BUSINESS TYPE",
                      value: recruiterData.companyInformation?.businessType || "N/A",
                    },
                    {
                      label: "COMPANY SIZE",
                      value: recruiterData.companyInformation?.companySize || "N/A",
                    },
                    {
                      label: "OFFICIAL WEBSITE",
                      value: recruiterData.companyInformation?.website || "N/A",
                    },
                  ].map((item) => (
                    <div key={item.label} className="col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-20">
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
                      <p className="font-sm mb-0" style={{ fontWeight: 600, color: "#122359" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Documents */}
          <div className="section-box">
            <div className="panel-white">
              <div className="panel-head d-flex justify-content-between align-items-center flex-wrap" style={{ gap: "8px" }}>
                <div>
                  <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                    <i className="fi-rr-document font-sm color-brand-2"></i>
                    <h6 className="mb-0">Compliance Documents</h6>
                  </div>
                  <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                    {documentsList.length} documents in checklist
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-warning text-white font-xs hover-up"
                  onClick={() => setShowRequestModal(true)}
                  style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: 700 }}
                >
                  + Request Optional Document
                </button>
              </div>

              <div className="panel-body">
                <div className="row">
                  {documentsList.map((doc, idx) => (
                    <div key={doc.title + idx} className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-20">
                      <div 
                        className="card-grid-2 hover-up" 
                        onClick={() => router.push(`/admin/verifications/preview?id=${recruiterData?.id || id}`)}
                        style={{ marginBottom: 0, cursor: "pointer" }}
                      >
                        <div className="card-block-info" style={{ padding: "15px" }}>
                          <div className="d-flex align-items-center gap-2 mb-10">
                            <FileText size={18} color="#94a3b8" />
                            <div>
                              <h6 className="font-sm mb-0" style={{ fontWeight: 700, color: "#122359" }}>
                                {doc.title}
                              </h6>
                              <span className="font-xs color-text-paragraph-2">
                                {doc.sub}
                              </span>
                            </div>
                          </div>

                          <div className="d-flex align-items-center justify-content-between">
                            <span
                              style={{
                                background: doc.statusBg,
                                color: doc.statusColor,
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "10px",
                                fontWeight: 700,
                              }}
                            >
                              {doc.status === "Approved" ? "Verified" : (doc.status === "NotUploaded" ? "Not Uploaded" : doc.status)}
                            </span>
                            {doc.uploadedAt ? (
                              <span className="font-xs text-muted">
                                Uploaded: {doc.uploadedAt}
                              </span>
                            ) : (
                              <span className="font-xs text-muted">
                                Not Uploaded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Action Panel */}
          <div className="section-box">
            <div className="panel-white">
              <div className="box-padding">
                <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: '14px' }}>
                  <div>
                    <h6 className="mb-5" style={{ fontWeight: 700, color: '#122359' }}>
                      Account Status Approval Actions
                    </h6>
                    <p className="font-xs color-text-paragraph-2 mb-0">
                      {recruiterData.accountStatus === 'Suspended'
                        ? 'This employer account is currently suspended.'
                        : recruiterData.accountStatus === 'Active'
                        ? 'This account is active and verified.'
                        : 'Review this employer’s profile details and documents to approve or suspend.'}
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    {recruiterData.accountStatus !== 'Active' && (
                      <button
                        onClick={() => handleUpdateStatus('Active')}
                        className="btn btn-warning font-sm text-white"
                        style={{ height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <UserCheck size={16} />
                        Approve / Activate Account
                      </button>
                    )}
                    {recruiterData.accountStatus !== 'Suspended' && (
                      <button
                        onClick={() => handleUpdateStatus('Suspended')}
                        className="btn btn-danger font-sm"
                        style={{ height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <Ban size={16} />
                        Suspend Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
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
                      <h5 className="mb-0">
                        {recruiterData.quickInsights?.registeredOn 
                          ? new Date(recruiterData.quickInsights.registeredOn).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                          : "N/A"}
                      </h5>
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
                        {recruiterData.quickInsights?.totalOpenJobs !== undefined ? recruiterData.quickInsights.totalOpenJobs : "0"}
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
                      <h5 className="mb-0">
                        {recruiterData.quickInsights?.totalJobPosts !== undefined ? recruiterData.quickInsights.totalJobPosts : "0"}
                      </h5>
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
                      <h5 className="mb-0">
                        {recruiterData.quickInsights?.currentCredits !== undefined ? recruiterData.quickInsights.currentCredits.toLocaleString() : "0"}
                      </h5>
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
                  <span className="font-sm color-text-paragraph-2" style={{ fontWeight: 500 }}>
                    Profile Completion
                  </span>
                  <strong style={{ fontSize: "13px", fontWeight: 700, color: "#122359" }}>
                    {recruiterData.accountHealth?.profileCompletion || 0}%
                  </strong>
                </div>

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
                      width: `${recruiterData.accountHealth?.profileCompletion || 0}%`,
                      height: "100%",
                      background: "#f59e0b",
                      borderRadius: "999px",
                      transition: "width .4s ease",
                    }}
                  />
                </div>

                <p className="font-xs color-text-paragraph-2 mb-0" style={{ lineHeight: "20px" }}>
                  {recruiterData.accountHealth?.issues && recruiterData.accountHealth.issues.length > 0 
                    ? recruiterData.accountHealth.issues.join(", ")
                    : "All verification documentation and credentials are in good standing."}
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
                  {recruiterData.primaryContact?.name ? recruiterData.primaryContact.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "CO"}
                </div>
                <h6 className="mb-0">{recruiterData.primaryContact?.name || "N/A"}</h6>
                <p className="font-xs color-text-paragraph-2 mt-5 mb-20">
                  {recruiterData.primaryContact?.role || "N/A"}
                </p>
                <a
                  className="btn btn-grey-big hover-up font-sm mb-10"
                  href={`mailto:${recruiterData.primaryContact?.email}`}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <i className="fi-rr-envelope"></i>Email HR
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRANSACTION HISTORY ── */}
      <div className="section-box">
        <div className="panel-white">
          <div className="panel-head d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">Transaction History</h6>
              <p className="font-xs color-text-paragraph-2 mt-5 mb-0">
                All payments made by this recruiter — memberships, credit packs and fees.
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
                  {transactionsList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 color-text-paragraph-2">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    transactionsList.map((txn) => {
                      const s = getTxnStatusStyle(txn.paymentStatus || txn.status);
                      const displayAmt = typeof txn.amount === 'number' ? `₹${txn.amount}` : txn.amount;
                      const displayDate = txn.date ? new Date(txn.date).toLocaleDateString() : "N/A";
                      return (
                        <tr key={txn.transactionId || txn.id}>
                          <td>{displayDate}</td>
                          <td style={{ fontWeight: 600, color: "#122359" }}>
                            {txn.description}
                          </td>
                          <td>{txn.type}</td>
                          <td>{displayAmt}</td>
                          <td>{txn.payment}</td>
                          <td>{txn.transactionId || txn.id}</td>
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
                              {txn.paymentStatus || txn.status}
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
                              {txn.transactionNumber || txn.invoice || "Invoice"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <p className="font-xs color-text-paragraph-2 mt-15 mb-0">
              Showing {transactionsList.length} of {transactionsList.length} transactions
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <span style={{ fontWeight: 800, fontSize: "15px", color: "#ffa300", letterSpacing: "0.5px", textAlign: "left" }}>
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

            <h5 style={{ margin: "0 0 6px", color: "#122359", fontWeight: 800, textAlign: "left" }}>
              Invoice {invoiceTxn.transactionNumber || invoiceTxn.invoice}
            </h5>
            <p className="font-sm color-text-paragraph-2" style={{ margin: "0 0 18px", textAlign: "left" }}>
              Payment received from {recruiterData.company}
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
              <span style={{ fontWeight: 700, color: "#122359", fontSize: "14px" }}>
                {invoiceTxn.description}
              </span>
              <span style={{ fontWeight: 800, color: "#122359", fontSize: "16px" }}>
                {typeof invoiceTxn.amount === 'number' ? `₹${invoiceTxn.amount}` : invoiceTxn.amount}
              </span>
            </div>

            <div style={{ textAlign: "left", marginBottom: "20px" }}>
              <p className="font-sm mb-1" style={{ color: "#334155" }}>
                Date: {invoiceTxn.date ? new Date(invoiceTxn.date).toLocaleDateString() : "N/A"}
              </p>
              <p className="font-sm mb-1" style={{ color: "#334155" }}>
                Transaction ID: {invoiceTxn.transactionId || invoiceTxn.id}
              </p>
              <p className="font-sm mb-0" style={{ color: "#334155" }}>
                Payment: {invoiceTxn.payment}
              </p>
            </div>

            <button
              onClick={() => {
                handleDownloadInvoice(invoiceTxn);
                setInvoiceTxn(null);
              }}
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

      {/* ── PREVIEW DOC MODAL ── */}
      {previewDoc && (() => {
        const resolvedUrl = getDocUrl(previewDoc.img);
        const isPdf = previewDoc.img && previewDoc.img.toLowerCase().endsWith('.pdf');
        return (
          <div
            onClick={() => setPreviewDoc(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(10,20,50,0.72)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: "16px",
                maxWidth: "720px",
                width: "100%",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              }}
            >
              {/* Header */}
              <div style={{
                padding: '16px 20px', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0',
              }}>
                <div>
                  <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase',
                    letterSpacing: '0.5px', fontWeight: 600, margin: 0 }}>{previewDoc.sub}</p>
                  <h6 style={{ margin: 0, color: '#122359', fontWeight: 700 }}>{previewDoc.title}</h6>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setPreviewDoc(null)} style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: '#f1f5f9', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <X size={16} color="#475569" />
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <div style={{ background: '#f8fafc', padding: '20px', maxHeight: '55vh', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                {previewDoc.img ? (
                  isPdf ? (
                    <iframe
                      src={resolvedUrl}
                      style={{ width: '100%', height: '50vh', border: '1px solid #e2e8f0', borderRadius: '10px' }}
                    />
                  ) : (
                    <img
                      src={resolvedUrl}
                      alt={previewDoc.title}
                      style={{ width: '100%', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                    />
                  )
                ) : (
                  <div style={{ padding: "40px", color: "#122359", fontWeight: 600 }}>
                    No Preview Available
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* ── REQUEST OPTIONAL DOCUMENT MODAL ── */}
      {showRequestModal && (
        <div
          onClick={() => setShowRequestModal(false)}
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
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <h5 style={{ margin: 0, color: "#122359", fontWeight: 800 }}>
                Request Optional Document
              </h5>
              <button
                onClick={() => setShowRequestModal(false)}
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

            <form onSubmit={handleSendDocumentRequest}>
              <div className="mb-15">
                <label className="form-label font-sm" style={{ fontWeight: 600, color: "#122359", display: "block", marginBottom: "6px" }}>
                  Select Document Type
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  style={{
                    width: "100%",
                    height: "42px",
                    background: "#fff",
                    border: "1px solid #e3e8f4",
                    borderRadius: "9px",
                    padding: "0 14px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#122359"
                  }}
                  required
                >
                  <option value="" disabled>-- Select Optional Document --</option>
                  {optionalDocs.map((doc) => (
                    <option key={doc.documentTypeId} value={doc.documentTypeId}>
                      {doc.documentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-20">
                <label className="form-label font-sm" style={{ fontWeight: 600, color: "#122359", display: "block", marginBottom: "6px" }}>
                  Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="e.g. Please upload your optional license copy for further review."
                  style={{
                    width: "100%",
                    height: "100px",
                    background: "#fff",
                    border: "1px solid #e3e8f4",
                    borderRadius: "9px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "#122359",
                    resize: "none"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingRequest}
                style={{
                  width: "100%",
                  background: "#ffa300",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "13px 0",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {submittingRequest ? "Sending Request..." : "Send Request"}
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}