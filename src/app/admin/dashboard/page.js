'use client'
import { useEffect, useState } from 'react'
import Footer from '../../../components/Footer'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import {
  Wallet,
  FileText,
  Briefcase,
  ShieldCheck,
  Headphones,
  BadgeDollarSign,
  UserCog,
  Monitor,
  Scale,
  ArrowUpRight,
} from "lucide-react";

// ── shared theme tokens (same navy / amber / gold used across the portal) ──
const NAVY = '#122359'
const AMBER = '#ffa300'
const GOLD = '#ffc151'
const SLATE = '#5b6b9e'
const GREY = '#c7ccd9'

// ── Registration Growth datasets per time range ──
const REGISTRATION_DATA = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    candidates: [160, 185, 200, 220, 260, 310, 295],
    recruiters: [20, 35, 45, 55, 60, 70, 65],
  },
  month: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    candidates: [980, 1050, 1120, 1180, 1240, 1310, 1290, 1350, 1400, 1460, 1520, 1580],
    recruiters: [140, 150, 158, 165, 172, 180, 178, 185, 192, 198, 205, 212],
  },
  year: {
    labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
    candidates: [3200, 5400, 7800, 9600, 11800, 14205],
    recruiters: [180, 320, 480, 610, 740, 842],
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const [regRange, setRegRange] = useState('week')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
    script.onload = () => initCharts()
    document.body.appendChild(script)
    return () => {
      try { document.body.removeChild(script) } catch (e) { }
    }
  }, [])

  // Update the registration chart in place whenever Week/Month/Year is switched
  useEffect(() => {
    const chart = window._chart1
    if (!chart) return
    const range = REGISTRATION_DATA[regRange]
    chart.data.labels = range.labels
    chart.data.datasets[0].data = range.candidates
    chart.data.datasets[1].data = range.recruiters
    chart.update()
  }, [regRange])

  function initCharts() {
    if (window._chart1) { window._chart1.destroy(); window._chart1 = null }
    if (window._chart2) { window._chart2.destroy(); window._chart2 = null }
    if (window._chart3) { window._chart3.destroy(); window._chart3 = null }

    // Registration Growth Line Chart — Candidates vs Recruiters
    const ctx1 = document.getElementById('registrationChart')
    if (ctx1) {
      const range = REGISTRATION_DATA[regRange]
      window._chart1 = new window.Chart(ctx1, {
        type: 'line',
        data: {
          labels: range.labels,
          datasets: [
            {
              label: 'Candidates',
              data: range.candidates,
              borderColor: NAVY,
              backgroundColor: 'rgba(18,35,89,0.08)',
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Recruiters',
              data: range.recruiters,
              borderColor: AMBER,
              backgroundColor: 'rgba(255,163,0,0.10)',
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

    // Revenue & Credit Growth — stacked bar matching the Revenue page's breakdown
    const ctx2 = document.getElementById('revenueChart')
    if (ctx2) {
      window._chart2 = new window.Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Candidate memberships',
              data: [9200, 10400, 9800, 12100, 13600, 14800],
              backgroundColor: NAVY,
              borderRadius: 4,
              borderSkipped: false,
              stack: 'revenue',
            },
            {
              label: 'Recruiter memberships',
              data: [24000, 26500, 24800, 31200, 36400, 42000],
              backgroundColor: AMBER,
              borderRadius: 4,
              borderSkipped: false,
              stack: 'revenue',
            },
            {
              label: 'Credit plans',
              data: [11800, 15100, 13400, 17700, 22000, 24200],
              backgroundColor: GOLD,
              borderRadius: 4,
              borderSkipped: false,
              stack: 'revenue',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#888', font: { size: 11 } }, border: { display: false } },
            y: {
              stacked: true,
              grid: { color: 'rgba(0,0,0,0.04)' },
              ticks: { color: '#888', font: { size: 11 }, callback: (v) => '$' + (v / 1000) + 'k' },
              border: { display: false },
              beginAtZero: true,
            },
          },
        },
      })
    }

    // Recruiters by Industry Donut — segments match the real Industry Type
    // options offered on employer registration / company profile / post-job
    const ctx3 = document.getElementById('donutChart')
    if (ctx3) {
      window._chart3 = new window.Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: ['Construction & Infrastructure', 'Oil & Gas', 'Logistics & Transportation', 'Manufacturing', 'Other'],
          datasets: [{
            data: [28, 22, 18, 14, 18],
            backgroundColor: [NAVY, AMBER, GOLD, SLATE, GREY],
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
          <p className="font-sm color-text-paragraph-2 mb-3">Welcome back, Admin. Here&apos;s a snapshot of every part of the platform today.</p>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: "none", backgroundColor: "revert" }}>
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
            <Link href="/admin/revenue" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><Wallet size={28} strokeWidth={2.2} color={NAVY} /></div>
              <div className="card-info">
                <div className="card-title"><h3>$128,430
                  {/* <span className="font-sm status up">12.5<span>%</span></span> */}
                  </h3></div>
                <p className="color-text-paragraph-2">Total Revenue</p>
              </div>
            </Link>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <Link href="/admin/candidates" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><img src="/assets/imgs/page/dashboard/candidates.svg" alt="jobBox" /></div>
              <div className="card-info">
                <div className="card-title"><h3>14,205
                  {/* <span className="font-sm status up">4.2<span>%</span></span> */}
                  </h3></div>
                <p className="color-text-paragraph-2">Total Candidates</p>
              </div>
            </Link>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <Link href="/admin/recruiters" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><img src="/assets/imgs/page/dashboard/recruiters.svg" alt="jobBox" /></div>
              <div className="card-info">
                <div className="card-title"><h3>842
                  {/* <span className="font-sm status up">1.8<span>%</span></span> */}
                  </h3></div>
                <p className="color-text-paragraph-2">Total Recruiters</p>
              </div>
            </Link>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <Link href="/admin/Plans" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><FileText size={28} strokeWidth={2.2} color={NAVY} /></div>
              <div className="card-info">
                <div className="card-title"><h3>24,500</h3></div>
                <p className="color-text-paragraph-2">Credits Sold</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ROW 2: 3 SECONDARY STAT CARDS */}
      <div className="section-box">
        <div className="row">
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="card-style-1 hover-up">
              <div className="card-image"><Briefcase size={28} strokeWidth={2.2} color={AMBER} /></div>
              <div className="card-info">
                <div className="card-title"><h3>1,180<span className="font-sm color-text-paragraph-2" style={{ marginLeft: '10px', fontWeight: 500 }}>/ 312 Paused</span></h3></div>
                <p className="color-text-paragraph-2">Active Job Postings</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <Link href="/admin/verifications" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><ShieldCheck size={28} strokeWidth={2.2} color={AMBER} /></div>
              <div className="card-info">
                <div className="card-title"><h3>42<span className="font-sm status down">8 High Priority</span></h3></div>
                <p className="color-text-paragraph-2">Pending Verifications</p>
              </div>
            </Link>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <Link href="/admin/helpAndsupport" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><Headphones size={28} strokeWidth={2.2} color={AMBER} /></div>
              <div className="card-info">
                <div className="card-title"><h3>18<span className="font-sm status down">5 Pending</span></h3></div>
                <p className="color-text-paragraph-2">Open Support Tickets</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ROW 3: REGISTRATION GROWTH + RECRUITER DISTRIBUTION */}
      <div className="row">

        <div className="col-xxl-8 col-xl-8 col-lg-7 col-md-12">
          <div className="section-box">
            <div className="container">
              <div className="panel-white">
                <div className="panel-head" style={{ flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h5>Registration Growth</h5>
                    <p className="font-xs color-text-paragraph-2 my-2">New candidate and recruiter sign-ups over time</p>
                  </div>
                  <div className="d-flex" style={{ gap: '6px', flexShrink: 0 }}>
                    {['week', 'month', 'year'].map((r) => (
                      <a
                        key={r}
                        className={`range-tab${regRange === r ? ' active' : ''}`}
                        href="#"
                        onClick={(e) => { e.preventDefault(); setRegRange(r) }}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="panel-body">
                  <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                    <canvas id="registrationChart" role="img" aria-label="Line chart showing candidate and recruiter registrations over 7 days">Registration chart</canvas>
                  </div>
                  <div className="d-flex mt-10" style={{ gap: '20px' }}>
                    <span className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: NAVY, flexShrink: 0 }}></span>Candidates
                    </span>
                    <span className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: AMBER, flexShrink: 0 }}></span>Recruiters
                    </span>
                  </div>
                </div>
                <style jsx>{`
                  .range-tab {
                    border-radius: 3px;
                    background-color: #F2F4FA;
                    font-size: 12px;
                    line-height: 18px;
                    font-weight: 600;
                    padding: 4px 10px;
                    color: #66789C !important;
                    text-decoration: none;
                    display: inline-block;
                  }
                  .range-tab.active {
                    background-color: ${AMBER};
                    color: #ffffff !important;
                  }
                `}</style>
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
                    <h5>Recruiters by Industry</h5>
                    <p className="font-xs color-text-paragraph-2 my-2">Segmentation by Industry Type — the same field recruiters set on their company profile</p>
                  </div>
                </div>
                <div className="panel-body text-center">
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <canvas id="donutChart" role="img" aria-label="Donut chart: Construction & Infrastructure 28%, Oil & Gas 22%, Logistics & Transportation 18%, Manufacturing 14%, Other 18%">Recruiters by industry</canvas>
                  </div>
                  <div className="d-flex justify-content-center mt-10 mb-15" style={{ gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Construction', color: NAVY },
                      { label: 'Oil & Gas', color: AMBER },
                      { label: 'Logistics', color: GOLD },
                      { label: 'Manufacturing', color: SLATE },
                      { label: 'Other', color: GREY },
                    ].map(d => (
                      <span key={d.label} className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: d.color, flexShrink: 0 }}></span>
                        {d.label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-10">
                    {[
                      { label: 'Construction & Infrastructure', pct: '28.0%' },
                      { label: 'Oil & Gas', pct: '22.0%' },
                      { label: 'Logistics & Transportation', pct: '18.0%' },
                      { label: 'Manufacturing', pct: '14.0%' },
                      { label: 'Other', pct: '18.0%' },
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
                <p className="font-xs color-text-paragraph-2 mt-2">Monthly split by candidate, recruiter and credit plans</p>
              </div>
              <a className="btn btn-default icon-edit hover-up" href="#" style={{ flexShrink: 0 }}>Export Report</a>
            </div>
            <div className="panel-body">
              <div style={{ position: 'relative', width: '100%', height: '280px' }}>
                <canvas id="revenueChart" role="img" aria-label="Stacked bar chart showing monthly revenue by plan type, Jan to Jun">Revenue chart</canvas>
              </div>
              <div className="d-flex mt-10" style={{ gap: '20px', flexWrap: 'wrap' }}>
                <span className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: NAVY, flexShrink: 0 }}></span>Candidate memberships
                </span>
                <span className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: AMBER, flexShrink: 0 }}></span>Recruiter memberships
                </span>
                <span className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: GOLD, flexShrink: 0 }}></span>Credit plans
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5: PLATFORM OVERVIEW — one glance at every other section of the admin */}
      <div className="section-box">
        <div className="container">
          <div className="panel-white">
            <div className="panel-head">
              <div>
                <h5>Platform Overview</h5>
                <p className="font-xs color-text-paragraph-2 my-2">A snapshot of every module in the admin panel</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="row">
                {[
                  { href: '/admin/Plans', icon: BadgeDollarSign, title: 'Plans', value: '3 active plans', detail: 'Recruiter, Candidate & Credit tiers' },
                  { href: '/admin/users', icon: UserCog, title: 'Users', value: '6 accounts', detail: '5 active · 1 suspended' },
                  { href: '/admin/audit', icon: Monitor, title: 'Audit Logs', value: '2 critical events', detail: 'In the last 24 hours' },
                  { href: '/admin/managePolicies', icon: Scale, title: 'Legal Pages', value: 'Privacy & Terms', detail: 'Last published this week' },
                ].map((m) => (
                  <div key={m.title} className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-12">
                    <Link
                      href={m.href}
                      className="hover-up"
                      style={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit',
                        border: '1px solid #EFF2FB',
                        borderRadius: '12px',
                        padding: '18px',
                        height: '100%',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(18,35,89,0.06)', flexShrink: 0,
                        }}>
                          <m.icon size={20} strokeWidth={2.2} color={NAVY} />
                        </span>
                        <ArrowUpRight size={16} color="#888" />
                      </div>
                      <p className="font-sm color-text-paragraph-2 mt-10 mb-0">{m.title}</p>
                      <h6 className="mb-0 mt-2" style={{ fontWeight: 700 }}>{m.value}</h6>
                      <span className="font-xs color-text-paragraph-2">{m.detail}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 6: 3 TABLES */}
      <div className="row align-items-stretch">

        {/* Recent Registrations */}
        <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12" style={{ display: 'flex' }}>
          <div className="section-box" style={{ width: '100%', display: 'flex' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="panel-white" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="panel-head">
                  <h5>Recent Registrations</h5>
                  <a className="font-sm color-brand-1" href="/admin/candidates">View All ›</a>
                </div>
                <div className="panel-body" style={{ overflowX: 'auto', flex: 1 }}>
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

        {/* Recent Support Tickets */}
        <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12" style={{ display: 'flex' }}>
          <div className="section-box" style={{ width: '100%', display: 'flex' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="panel-white" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="panel-head">
                  <h5>Recent Support Tickets</h5>
                  <Link href="/admin/helpAndsupport" className="font-sm color-brand-1">
                    Go to Support ›
                  </Link>
                </div>
                <div className="panel-body" style={{ overflowX: 'auto', flex: 1 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '240px' }}>
                    <thead>
                      <tr>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>Ticket</th>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Category</th>
                        <th className="font-xs color-text-paragraph-2" style={{ padding: '6px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'SUP-4201', name: 'John Carter', issue: 'Resume upload failed', category: 'Profile', status: 'Pending', color: '#c76b00', bg: '#fff3df' },
                        { id: 'SUP-5101', name: 'TechFlow Pvt Ltd', issue: 'Job posting error', category: 'Technical', status: 'Pending', color: '#c76b00', bg: '#fff3df' },
                        { id: 'SUP-5102', name: 'NextHire Ltd', issue: 'Invoice mismatch', category: 'Billing', status: 'In Progress', color: '#996000', bg: '#fff0c8' },
                        { id: 'SUP-4202', name: 'Aisha Khan', issue: 'Payment issue', category: 'Billing', status: 'Resolved', color: '#21844c', bg: '#e6f7ed' },
                        { id: 'SUP-4310', name: 'Priya Sharma', issue: 'Profile visibility', category: 'Profile', status: 'Resolved', color: '#21844c', bg: '#e6f7ed' },
                      ].map((t) => (
                        <tr key={t.id} className="hover-up">
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <p className="font-sm mb-0" style={{ fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{t.name}</p>
                            <span className="font-xs color-text-paragraph-2" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{t.issue}</span>
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <span className="font-xs color-text-paragraph-2">{t.category}</span>
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                              borderRadius: '4px', color: t.color, background: t.bg,
                              display: 'inline-block'
                            }}>{t.status}</span>
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
        <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12" style={{ display: 'flex' }}>
          <div className="section-box" style={{ width: '100%', display: 'flex' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="panel-white" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="panel-head">
                  <h5>Recent Payments</h5>
                  <Link href="/admin/revenue" className="font-sm color-brand-1">
                    Revenue ›
                  </Link>
                </div>
                <div className="panel-body" style={{ overflowX: 'auto', flex: 1 }}>
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
