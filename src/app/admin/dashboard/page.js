'use client'
import { useEffect } from 'react'
import Footer from '../../../components/Footer'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import {
  DollarSign,
  Users,
  Wallet,
  Building,
  FileText,
  User,
  ShieldCheck,
  Search
} from "lucide-react";
export default function DashboardPage() {
  const router = useRouter()
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
    script.onload = () => initCharts()
    document.body.appendChild(script)
    return () => {
      try { document.body.removeChild(script) } catch (e) { }
    }
  }, [])


  function initCharts() {
    if (window._chart1) { window._chart1.destroy(); window._chart1 = null }
    if (window._chart2) { window._chart2.destroy(); window._chart2 = null }
    if (window._chart3) { window._chart3.destroy(); window._chart3 = null }

    // Registration Growth Line Chart
    const ctx1 = document.getElementById('registrationChart')
    if (ctx1) {
      window._chart1 = new window.Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Candidates',
              data: [160, 185, 200, 220, 260, 310, 295],
              borderColor: '#e05151',
              backgroundColor: 'rgba(224,81,81,0.08)',
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Employers',
              data: [20, 35, 45, 55, 60, 70, 65],
              borderColor: '#3fbfad',
              backgroundColor: 'rgba(63,191,173,0.08)',
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#888', font: { size: 11 } }, border: { display: false } },
            y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#888', font: { size: 11 } }, border: { display: false }, beginAtZero: true },
          },
        },
      })
    }

    // Revenue Bar Chart
    const ctx2 = document.getElementById('revenueChart')
    if (ctx2) {
      window._chart2 = new window.Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue',
            data: [45000, 52000, 48000, 61000, 72000, 89000],
            backgroundColor: '#e05151',
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#888', font: { size: 11 } }, border: { display: false } },
            y: {
              grid: { color: 'rgba(0,0,0,0.04)' },
              ticks: { color: '#888', font: { size: 11 }, callback: (v) => '$' + (v / 1000) + 'k' },
              border: { display: false },
              beginAtZero: true,
            },
          },
        },
      })
    }

    // Employer Distribution Donut
    const ctx3 = document.getElementById('donutChart')
    if (ctx3) {
      window._chart3 = new window.Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: ['Corporate', 'SME', 'Staffing Agency'],
          datasets: [{
            data: [40, 30, 30],
            backgroundColor: ['#e05151', '#3fbfad', '#2c3e50'],
            borderWidth: 0,
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: { legend: { display: false } },
        },
      })
    }
  }

  return (
    <>
      {/* PAGE HEADING */}
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-5">Dashboard</h3>
          <p className="font-sm color-text-paragraph-2 mb-3">Welcome back, Admin. Here&apos;s what&apos;s happening on the platform today.</p>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{border:"none" ,  backgroundColor:"none"}}>
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><span>Dashboard</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ROW 1: 4 PRIMARY STAT CARDS */}
      <div className="section-box">
        <div className="row">
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div className="card-image">  <Wallet size={28} strokeWidth={2.2} />
              </div>
              <div className="card-info">
                <div className="card-title"><h3>$128,430<span className="font-sm status up">12.5<span>%</span></span></h3></div>
                <p className="color-text-paragraph-2">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div className="card-image"><img src="/assets/imgs/page/dashboard/candidates.svg" alt="jobBox" /></div>
              <div className="card-info">
                <div className="card-title"><h3>14,205<span className="font-sm status up">4.2<span>%</span></span></h3></div>
                <p className="color-text-paragraph-2">Total Candidates</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div className="card-image"><img src="/assets/imgs/page/dashboard/recruiters.svg" alt="jobBox" /></div>
              <div className="card-info">
                <div className="card-title"><h3>842<span className="font-sm status up">1.8<span>%</span></span></h3></div>
                <p className="color-text-paragraph-2">Active Employers</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="card-style-1 hover-up">
              <div className="card-image"><FileText size={28} strokeWidth={2.2} /></div>
              <div className="card-info">
                <div className="card-title"><h3>24,500<span className="font-sm status down">- 0.4%</span></h3></div>
                <p className="color-text-paragraph-2">Credits Sold</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: 3 SECONDARY STAT CARDS */}
      <div className="section-box">
        <div className="row">
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="card-style-1 hover-up">
              <div className="card-image"><User size={28} strokeWidth={2.2} /></div>
              <div className="card-info">
                <div className="card-title"><h3>1,240 / 4,820</h3></div>
                <p className="color-text-paragraph-2">Trial vs Paid Users</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="card-style-1 hover-up">
              <div className="card-image"><ShieldCheck size={28} strokeWidth={2.2} /></div>
              <div className="card-info">
                <div className="card-title"><h3>42<span className="font-sm status down">8 High Priority</span></h3></div>
                <p className="color-text-paragraph-2">Pending Verifications</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="card-style-1 hover-up">
              <div className="card-image"><Search size={28} strokeWidth={2.2} /></div>
              <div className="card-info">
                <div className="card-title"><h3>15<span className="font-sm status up">New requests</span></h3></div>
                <p className="color-text-paragraph-2">Employer Approvals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: REGISTRATION GROWTH + EMPLOYER DISTRIBUTION */}
      <div className="row">

        <div className="col-xxl-8 col-xl-8 col-lg-7 col-md-12">
          <div className="section-box">
            <div className="container">
              <div className="panel-white">
                <div className="panel-head" style={{ flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h5>Registration Growth</h5>
                    <p className="font-xs color-text-paragraph-2 my-2">New user acquisitions over time</p>
                  </div>
                  <div className="d-flex" style={{ gap: '6px', flexShrink: 0 }}>
                    <a className="btn btn-grey-small" href="#">Week</a>
                    <a className="btn btn-grey-small" href="#">Month</a>
                    <a className="btn btn-grey-small" href="#">Year</a>
                  </div>
                </div>
                <div className="panel-body">
                  <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                    <canvas id="registrationChart" role="img" aria-label="Line chart showing candidate and employer registrations over 7 days">Registration chart</canvas>
                  </div>
                  <div className="d-flex mt-10" style={{ gap: '20px' }}>
                    <span className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#e05151', flexShrink: 0 }}></span>Candidates
                    </span>
                    <span className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#3fbfad', flexShrink: 0 }}></span>Employers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-12">
          <div className="section-box">
            <div className="container">
              <div className="panel-white">
                <div className="panel-head">
                  <div>
                    <h5>Employer Distribution</h5>
                    <p className="font-xs color-text-paragraph-2 my-2">Segmentation by organization size</p>
                  </div>
                </div>
                <div className="panel-body text-center">
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <canvas id="donutChart" role="img" aria-label="Donut chart: Corporate 40%, SME 30%, Staffing Agency 30%">Employer distribution</canvas>
                  </div>
                  <div className="d-flex justify-content-center mt-10 mb-15" style={{ gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Corporate', color: '#e05151' },
                      { label: 'SME', color: '#3fbfad' },
                      { label: 'Agency', color: '#2c3e50' },
                    ].map(d => (
                      <span key={d.label} className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: d.color, flexShrink: 0 }}></span>
                        {d.label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-10">
                    {[
                      { label: 'Corporate', pct: '40.0%' },
                      { label: 'SME', pct: '30.0%' },
                      { label: 'Staffing Agency', pct: '30.0%' },
                    ].map((item) => (
                      <div key={item.label} className="d-flex justify-content-between mb-5">
                        <span className="font-sm color-text-paragraph-2">{item.label}</span>
                        <strong className="font-sm color-brand-1">{item.pct}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 4: REVENUE BAR CHART */}
      <div className="section-box">
        <div className="container">
          <div className="panel-white">
            <div className="panel-head " style={{ flexWrap: 'wrap', gap: '10px' }}>
              <div className='mb-2'>
                <h5>Revenue &amp; Credit Growth</h5>
                <p className="font-xs color-text-paragraph-2 mt-2">Monthly financial performance summary</p>
              </div>
              <a className="btn btn-default icon-edit hover-up" href="#" style={{ flexShrink: 0 }}>Export Report</a>
            </div>
            <div className="panel-body">
              <div style={{ position: 'relative', width: '100%', height: '280px' }}>
                <canvas id="revenueChart" role="img" aria-label="Bar chart showing monthly revenue Jan to Jun">Revenue chart</canvas>
              </div>
              <div className="d-flex mt-10" style={{ gap: '20px' }}>
                <span className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#e05151', flexShrink: 0 }}></span>Revenue
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5: 3 TABLES */}
      <div className="row">

        {/* Recent Registrations */}
        <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
          <div className="section-box">
            <div className="container">
              <div className="panel-white">
                <div className="panel-head">
                  <h5>Recent Registrations</h5>
                  <a className="font-sm color-brand-1" href="/admin/candidates">View All ›</a>
                </div>
                <div className="panel-body" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '280px' }}>
                    <thead>
                      <tr>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>User</th>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Type</th>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "CAND-101",
                          name: "Alexander Wright",
                          time: "2 mins ago",
                          type: "candidate",
                          img: "avata1"
                        },
                        {
                          id: "REC-201",
                          name: "Sophia Chen",
                          time: "15 mins ago",
                          type: "recruiter",
                          img: "avata2"
                        },
                        {
                          id: "CAND-102",
                          name: "Marcus Miller",
                          time: "1 hour ago",
                          type: "candidate",
                          img: "avata3"
                        },
                        {
                          id: "REC-202",
                          name: "Elena Rodriguez",
                          time: "3 hours ago",
                          type: "recruiter",
                          img: "avata4"
                        },
                        {
                          id: "CAND-103",
                          name: "David Kim",
                          time: "5 hours ago",
                          type: "candidate",
                          img: "avata5"
                        }
                      ].map((u) => (
                        <tr key={u.name} className="hover-up">
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <img src={`/assets/imgs/page/dashboard/${u.img}.png`} alt="jobBox"
                                style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
                              <div style={{ minWidth: 0 }}>
                                <p className="font-sm mb-0" style={{ fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>{u.name}</p>
                                <span className="font-xs color-text-paragraph-2">{u.time}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '1px solid #f5f5f5' }}>
                            <span style={{
                              fontSize: '10px', fontWeight: 700, letterSpacing: '0.4px', padding: '3px 7px', borderRadius: '4px', whiteSpace: 'nowrap',
                              background: u.type === 'CANDIDATE' ? '#ffc151' : '#e8f5e9',
                              color: u.type === 'CANDIDATE' ? '#ffa300' : '#2e7d32'
                            }}>{u.type}</span>
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <button
                              className="btn btn-grey-small"
                              onClick={() => {
                                if (u.type === "candidate") {
                                  router.push(`/admin/candidates/candidateDetails?${u.id}`)
                                } else {
                                  router.push(`/admin/recruiters/details?${u.id}`)
                                }
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Verifications */}
        <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
          <div className="section-box">
            <div className="container">
              <div className="panel-white">
                <div className="panel-head">
                  <h5>Urgent Verifications</h5>
                  <a className="font-sm color-brand-1" href="/admin/verifications">Go to Queue ›</a>
                </div>
                <div className="panel-body" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '240px' }}>
                    <thead>
                      <tr>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>Candidate</th>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Priority</th>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Liam Johnson', wait: '12h', priority: 'High', score: 92, color: '#2e7d32' },
                        { name: 'Emma Wilson', wait: '18h', priority: 'Medium', score: 85, color: '#ffa300' },
                        { name: 'Noah Brown', wait: '1d', priority: 'Critical', score: 45, color: '#c62828' },
                        { name: 'Olivia Garcia', wait: '1d', priority: 'Medium', score: 88, color: '#ffa300' },
                        { name: 'James Davis', wait: '2d', priority: 'Low', score: 96, color: '#2e7d32' },
                      ].map((v) => (
                        <tr key={v.name} className="hover-up">
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <p className="font-sm mb-0" style={{ fontWeight: 600, lineHeight: 1.3 }}>{v.name}</p>
                            <span className="font-xs color-text-paragraph-2">&#9203; {v.wait}</span>
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: v.color }}>{v.priority}</span>
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <strong style={{ fontSize: '13px', color: v.color }}>{v.score}%</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
          <div className="section-box">
            <div className="container">
              <div className="panel-white">
                <div className="panel-head">
                  <h5>Recent Payments</h5>
                  <Link href="/admin/finance" className="font-sm color-brand-1">
                    Finance ›
                  </Link>
                </div>
                <div className="panel-body" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '240px' }}>
                    <thead>
                      <tr>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>Entity</th>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Amount</th>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { entity: 'Tech Solutions Ltd', time: '10:45 AM', amount: '$2,400', status: 'Success', color: '#2e7d32', bg: '#e8f5e9' },
                        { entity: 'Sarah Jenkins', time: '09:30 AM', amount: '$49', status: 'Success', color: '#2e7d32', bg: '#e8f5e9' },
                        { entity: 'Global Recruiters', time: 'Yesterday', amount: '$1,200', status: 'Pending', color: '#e65100', bg: '#fff3e0' },
                        { entity: 'Mike Peters', time: 'Yesterday', amount: '$25', status: 'Failed', color: '#c62828', bg: '#fdecea' },
                        { entity: 'Innovate Hub', time: '2 days ago', amount: '$5,000', status: 'Success', color: '#2e7d32', bg: '#e8f5e9' },
                      ].map((p) => (
                        <tr key={p.entity} className="hover-up">
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <p className="font-sm mb-0" style={{ fontWeight: 600, lineHeight: 1.3 }}>{p.entity}</p>
                            <span className="font-xs color-text-paragraph-2">{p.time}</span>
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <strong className="font-sm">{p.amount}</strong>
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                              borderRadius: '4px', color: p.color, background: p.bg,
                              display: 'inline-block'
                            }}>{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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