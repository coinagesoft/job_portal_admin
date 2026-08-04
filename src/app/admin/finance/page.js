'use client';

import { useState } from "react";
import Footer from "../../../components/Footer";
import { DollarSign, CreditCard, RefreshCcw, Wallet } from "lucide-react";
export default function FinancePage() {

  const [activeTab, setActiveTab] = useState("transactions");
  const [filters, setFilters] = useState({
    status: "all",
    type: "all"
  })
  // ───────── DATA ─────────
  const transactions = [
    {
      id: "TXN-9101",
      company_name: "TechFlow Solutions",
      recruiter_name: "Amit Sharma",
      user_type: "recruiter",

      transaction_type: "credit_purchase",
      amount: "$1250.00",
      status: "completed",
      gateway: "Stripe",
      payment_method: "Card",
      credit_quantity: 500,
      created_at: "24 Oct 2023, 10:30 AM"
    },

    {
      id: "TXN-9102",
      candidate_name: "Sarah Jenkins",
      user_type: "candidate",
      candidate_type: "fresher",

      transaction_type: "subscription",
      amount: "$49.00",
      status: "completed",
      gateway: "Razorpay",
      payment_method: "UPI",
      credit_quantity: 0,
      created_at: "24 Oct 2023, 11:10 AM"
    },

    {
      id: "TXN-9103",
      company_name: "Apex Recruitment",
      recruiter_name: "Rahul Mehta",
      user_type: "recruiter",

      transaction_type: "credit_purchase",
      amount: "$2500.00",
      status: "pending",
      gateway: "Stripe",
      payment_method: "Net Banking",
      credit_quantity: 1000,
      created_at: "24 Oct 2023, 01:45 PM"
    }
  ];

  const invoices = [
    {
      id: "INV-2101",
      client: "TechFlow Solutions",
      amount: "$1200.00",
      status: "paid",
      gst_amount: "$216.00",
      invoice_date: "23 Oct 2023",
      pdf_url: "#"
    },
    {
      id: "INV-2102",
      client: "Apex Recruitment",
      amount: "$800.00",
      status: "pending",
      gst_amount: "$144.00",
      invoice_date: "23 Oct 2023",
      pdf_url: "#"
    },
    {
      id: "INV-2103",
      client: "Global Talent Hub",
      amount: "$950.00",
      status: "paid",
      gst_amount: "$171.00",
      invoice_date: "22 Oct 2023",
      pdf_url: "#"
    },
    {
      id: "INV-2104",
      client: "BlueWave Shipping",
      amount: "$600.00",
      status: "overdue",
      gst_amount: "$108.00",
      invoice_date: "20 Oct 2023",
      pdf_url: "#"
    },
    {
      id: "INV-2105",
      client: "Skyline Logistics",
      amount: "$1500.00",
      status: "paid",
      gst_amount: "$270.00",
      invoice_date: "19 Oct 2023",
      pdf_url: "#"
    }
  ];

  const refunds = [
    {
      id: "REF-3101",
      transaction_id: "TXN-9105",
      refund_amount: "-$200.00",
      status: "completed",
      reason: "Duplicate payment",
      initiated_by: "Admin"
    },
    {
      id: "REF-3102",
      transaction_id: "TXN-9103",
      refund_amount: "-$150.00",
      status: "processing",
      reason: "User request",
      initiated_by: "System"
    },
    {
      id: "REF-3103",
      transaction_id: "TXN-9102",
      refund_amount: "-$49.00",
      status: "completed",
      reason: "Subscription cancel",
      initiated_by: "Admin"
    },
    {
      id: "REF-3104",
      transaction_id: "TXN-9104",
      refund_amount: "-$49.00",
      status: "failed",
      reason: "Invalid account",
      initiated_by: "System"
    },
    {
      id: "REF-3105",
      transaction_id: "TXN-9101",
      refund_amount: "-$100.00",
      status: "processing",
      reason: "Partial refund",
      initiated_by: "Admin"
    }
  ];

  const deposits = [
    {
      id: "DEP-4101",
      employer_id: "EMP-1001",
      amount: "$5000.00",
      status: "held",
      paid_at: "24 Oct 2023"
    },
    {
      id: "DEP-4102",
      employer_id: "EMP-1002",
      amount: "$2000.00",
      status: "returned",
      paid_at: "23 Oct 2023"
    },
    {
      id: "DEP-4103",
      employer_id: "EMP-1003",
      amount: "$3000.00",
      status: "held",
      paid_at: "22 Oct 2023"
    },
    {
      id: "DEP-4104",
      employer_id: "EMP-1004",
      amount: "$2500.00",
      status: "held",
      paid_at: "21 Oct 2023"
    },
    {
      id: "DEP-4105",
      employer_id: "EMP-1005",
      amount: "$4000.00",
      status: "returned",
      paid_at: "20 Oct 2023"
    }
  ];

  const getStatusStyle = (status) => {
    if (["completed", "paid", "success"].includes(status))
      return { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" }

    if (["pending", "processing"].includes(status))
      return { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" }

    return { bg: "#fdecea", color: "#c62828", border: "#ef9a9a" }
  }

  const getFilteredData = (data) => {
  return data.filter((row) => {

    // STATUS FILTER
    if (filters.status !== "all" && row.status !== filters.status) {
      return false;
    }

    // TYPE FILTER (ONLY for transactions)
    if (
      filters.type !== "all" &&
      row.transaction_type &&
      row.transaction_type !== filters.type
    ) {
      return false;
    }

    return true;
  });
};
  return (
    <div className="page-content">

      {/* ───────── HEADER ───────── */}
      <div className="box-heading d-flex justify-content-between align-items-center flex-wrap gap-3">

        <div className="box-title">
          <h3 className="mb-5">Payments & Finance</h3>
          <p className="color-text-paragraph-2 mb-0">
            Manage platform transactions, credits, and revenue performance.
          </p>
        </div>


        <div className="d-flex align-items-center  flex-wrap gap-2">

          <div className="box-breadcrumb w-100">
            <div className="breadcrumbs" style={{border:"none" ,  backgroundColor:"revert"}}>
              <ul>
                <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
                {/* <li><a href="/admin/finance">Candidates</a></li> */}
                <li><span>Finance</span></li>
              </ul>
            </div>

          </div>

        </div>
        <input
          className="form-control mt-2"
          placeholder="Search invoice #"
          style={{ height: '44px', minWidth: '250px', maxWidth: '400px' }}
        />
      </div>

      {/* ───────── STATS ───────── */}
   <div className="row mt-20">
  {[
    {
      title: "Total Revenue",
      value: "$148,290",
      change: "+12.4%",
      icon: DollarSign
    },
    {
      title: "Credits Sold",
      value: "842,500",
      change: "+8.1%",
      icon: CreditCard
    },
    {
      title: "Refunds ",
      value: "$1,420",
      change: "-2.3%",
      icon: RefreshCcw
    },
    {
      title: "Total Payouts",
      value: "$42,105",
      change: "+5.4%",
      icon: Wallet
    }
  ].map((item, i) => {
    const Icon = item.icon;

    return (
      <div key={i} className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div className="card-style-1 hover-up">

          {/* ✅ SAME as your reference */}
          <div className="card-image">
            <Icon size={28} strokeWidth={2.2} />
          </div>

          <div className="card-info">
            <div className="card-title">
              <h3>
                {item.value}
                <span className={`font-sm status ${item.change.includes('-') ? 'down' : 'up'}`}>
                  {item.change}
                </span>
              </h3>
            </div>

            <p className="color-text-paragraph-2">
              {item.title}
            </p>
          </div>

        </div>
      </div>
    );
  })}
</div>

      {/* ───────── CHART ───────── */}

      {/* ───────── TABS + TABLE ───────── */}
      <div className="panel-white mt-20">

        {/* Tabs */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2  pb-5" style={{ borderBottom: '1px solid #eee' }}>

          <div className="d-flex gap-2 flex-wrap" >
            {["transactions", "invoices", "refunds", "deposits"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-light'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="d-flex align-items-center mb-3" style={{ gap: "8px", flexWrap: "wrap" }}>

            <select
              className="form-control"
              style={{ width: "130px", fontSize: "13px" }}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>

            {activeTab === "transactions" && (
              <select
                className="form-control"
                style={{ width: "140px", fontSize: "13px" }}
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">Type</option>
                <option value="credit_purchase">Credit</option>
                <option value="subscription">Subscription</option>
                <option value="refund">Refund</option>
              </select>
            )}

            <button
              className="btn btn-secondary  h-100  py-3"
              onClick={() => setFilters({ status: "all", type: "all" })}
            >
  Clear Filters            </button>
 
          </div>

        </div>

        {/* TABLES */}

        <div className="table-responsive">

          {/* TRANSACTIONS */}
          {activeTab === "transactions" && (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Date</th>
                  <th>Candidate / Recruiter</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Gateway</th>
                  <th>Method</th>
                  <th>Credits</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
              {getFilteredData(transactions).map((row, i) => {
                  const s = getStatusStyle(row.status)

                  return (
                    <tr key={i}>
                      <td className="font-sm color-text-paragraph-2">{row.id}</td>
                      <td className="font-sm color-text-paragraph-2">{row.created_at}</td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>

                          {/* COMPANY + RECRUITER */}
                          {row.user_type === "recruiter" && (
                            <>
                              <span className="font-sm">{row.company_name}</span>
                              <span className="font-xs color-text-paragraph-2">
                                {row.recruiter_name}
                              </span>
                            </>
                          )}

                          {/* CANDIDATE */}
                          {row.user_type === "candidate" && (
                            <>
                              <span className="font-sm">{row.candidate_name}</span>

                              <span
                                style={{
                                  fontSize: "11px",
                                  marginTop: "4px",
                                  padding: "2px 8px",
                                  borderRadius: "10px",
                                  background:
                                    row.candidate_type === "fresher" ? "#ffc151" : "#f1f8e9",
                                  color:
                                    row.candidate_type === "fresher" ? "#ffa300" : "#2e7d32"
                                }}
                              >
                                {row.candidate_type}
                              </span>
                            </>
                          )}

                        </div>
                      </td>
                      <td className="font-sm color-text-paragraph-2">{row.transaction_type}</td>
                      <td className="font-sm color-text-paragraph-2">{row.amount}</td>
                      <td className="font-sm color-text-paragraph-2">{row.gateway}</td>
                      <td className="font-sm color-text-paragraph-2">{row.payment_method}</td>
                      <td className="font-sm color-text-paragraph-2">{row.credit_quantity}</td>

                      <td className="font-sm color-text-paragraph-2">
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px 12px",
                            borderRadius: "20px",
                            background: s.bg,
                            color: s.color,
                            border: `1px solid ${s.border}`
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {/* INVOICES */}
          {activeTab === "invoices" && (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>GST</th>
                  <th>Date</th>
                  <th>PDF</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {getFilteredData(invoices).map((row, i) => {
                  const s = getStatusStyle(row.status)

                  return (
                    <tr key={i}>
                      <td className="font-sm color-text-paragraph-2">{row.id}</td>
                      <td className="font-sm color-text-paragraph-2">{row.client}</td>
                      <td className="font-sm color-text-paragraph-2">{row.amount}</td>
                      <td className="font-sm color-text-paragraph-2">{row.gst_amount}</td>
                      <td className="font-sm color-text-paragraph-2">{row.invoice_date}</td>
                      <td className="font-sm color-text-paragraph-2">
                        <button className="btn btn-grey-small">View</button>
                      </td>

                      <td className="font-sm color-text-paragraph-2">
                        <span style={{
                          fontSize: "11px",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          background: s.bg,
                          color: s.color,
                          border: `1px solid ${s.border}`
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {/* REFUNDS */}
          {activeTab === "refunds" && (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Txn Ref</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Initiated By</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {getFilteredData(refunds).map((row, i) => {
                  const s = getStatusStyle(row.status)

                  return (
                    <tr key={i}>
                      <td className="font-sm color-text-paragraph-2">{row.id}</td>
                      <td className="font-sm color-text-paragraph-2">{row.transaction_id}</td>
                      <td className="font-sm color-text-paragraph-2">{row.refund_amount}</td>
                      <td className="font-sm color-text-paragraph-2">{row.reason}</td>
                      <td className="font-sm color-text-paragraph-2">{row.initiated_by}</td>

                      <td className="font-sm color-text-paragraph-2">
                        <span style={{
                          fontSize: "11px",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          background: s.bg,
                          color: s.color,
                          border: `1px solid ${s.border}`
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {/* DEPOSITS */}
          {activeTab === "deposits" && (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Deposit ID</th>
                  <th>Employer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {getFilteredData(deposits).map((row, i) => {
                  const s = getStatusStyle(row.status)

                  return (
                    <tr key={i} >
                      <td className="font-sm color-text-paragraph-2">{row.id}</td>
                      <td className="font-sm color-text-paragraph-2">{row.employer_id}</td>
                      <td className="font-sm color-text-paragraph-2">{row.amount}</td>
                      <td className="font-sm color-text-paragraph-2">{row.paid_at}</td>

                      <td className="font-sm color-text-paragraph-2">
                        <span style={{

                          fontSize: "11px",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          background: s.bg,
                          color: s.color,
                          border: `1px solid ${s.border}`
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

        </div>

        {/* FOOTER */}
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

      <Footer />
    </div>
  );
}