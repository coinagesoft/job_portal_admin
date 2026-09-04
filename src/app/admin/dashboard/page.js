'use client'
import { useEffect, useState } from 'react'
import Footer from '../../../components/Footer'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { apiRequest } from '../../../services/api'
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

export default function DashboardPage() {
  const router = useRouter()
  const [regRange, setRegRange] = useState('week')
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    registrationGrowth: null,
    recruitersByIndustry: null,
    revenueGrowth: null,
    platformOverview: null,
    recentRegistrations: [],
    recentSupportTickets: [],
    recentPayments: [],
  })
  const [dashboardError, setDashboardError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadDashboard = async () => {
      try {
        setDashboardError('')
        const [stats, registrationGrowth, recruitersByIndustry, revenueGrowth, platformOverview, recentRegistrations, recentSupportTickets, recentPayments] = await Promise.all([
          apiRequest('/api/admin/dashboard/stats-widgets', { method: 'GET' }),
          apiRequest(`/api/admin/dashboard/registration-growth?range=${regRange}`, { method: 'GET' }),
          apiRequest('/api/admin/dashboard/recruiters-by-industry', { method: 'GET' }),
          apiRequest('/api/admin/dashboard/revenue-credit-growth', { method: 'GET' }),
          apiRequest('/api/admin/dashboard/platform-overview', { method: 'GET' }),
          apiRequest('/api/admin/dashboard/recent-registrations?limit=5', { method: 'GET' }),
          apiRequest('/api/admin/dashboard/recent-support-tickets?limit=5', { method: 'GET' }),
          apiRequest('/api/admin/dashboard/recent-payments?limit=5', { method: 'GET' }),
        ])

        if (!cancelled) {
          setDashboardData({
            stats: stats?.data,
            registrationGrowth: registrationGrowth?.data,
            recruitersByIndustry: recruitersByIndustry?.data,
            revenueGrowth: revenueGrowth?.data,
            platformOverview: platformOverview?.data,
            recentRegistrations: recentRegistrations?.data || [],
            recentSupportTickets: recentSupportTickets?.data || [],
            recentPayments: recentPayments?.data || [],
          })
        }
      } catch (error) {
        if (!cancelled) setDashboardError(error.message || 'Unable to load dashboard data.')
      }
    }

    loadDashboard()
    return () => { cancelled = true }
  }, [regRange])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
    script.onload = () => initCharts()
    document.body.appendChild(script)
    return () => {
      try { document.body.removeChild(script) } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (window.Chart) initCharts()
  }, [dashboardData])

  function initCharts() {
    if (window._chart1) { window._chart1.destroy(); window._chart1 = null }
    if (window._chart2) { window._chart2.destroy(); window._chart2 = null }
    if (window._chart3) { window._chart3.destroy(); window._chart3 = null }

    // Registration Growth Line Chart — Candidates vs Recruiters
    const ctx1 = document.getElementById('registrationChart')
    if (ctx1) {
      const range = dashboardData.registrationGrowth || { labels: [], candidates: [], recruiters: [] }
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
          labels: dashboardData.revenueGrowth?.labels || [],
          datasets: [
            {
              label: 'Candidate memberships',
              data: dashboardData.revenueGrowth?.candidateMemberships || [],
              backgroundColor: NAVY,
              borderRadius: 4,
              borderSkipped: false,
              stack: 'revenue',
            },
            {
              label: 'Recruiter memberships',
              data: dashboardData.revenueGrowth?.recruiterMemberships || [],
              backgroundColor: AMBER,
              borderRadius: 4,
              borderSkipped: false,
              stack: 'revenue',
            },
            {
              label: 'Credit plans',
              data: dashboardData.revenueGrowth?.creditPlans || [],
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
              ticks: { color: '#888', font: { size: 11 }, callback: (v) => '₹' + v },
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
          labels: dashboardData.recruitersByIndustry?.slices?.map((slice) => slice.industry) || [],
          datasets: [{
            data: dashboardData.recruitersByIndustry?.slices?.map((slice) => slice.count) || [],
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

  const stats = dashboardData.stats || {}
  const platformOverview = dashboardData.platformOverview || {}
  const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '-'
  const formatTime = (value) => value ? new Date(value).toLocaleString() : '-'

  return (
    <>
      {dashboardError && <div className="alert alert-danger mb-20">{dashboardError}</div>}
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
                <div className="card-title"><h3>₹{stats.totalRevenue?.value ?? 0}</h3></div>
                <p className="color-text-paragraph-2">Total Revenue</p>
              </div>
            </Link>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <Link href="/admin/candidates" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><img src="/assets/imgs/page/dashboard/candidates.svg" alt="jobBox" /></div>
              <div className="card-info">
                <div className="card-title"><h3>{stats.totalCandidates?.value ?? 0}</h3></div>
                <p className="color-text-paragraph-2">Total Candidates</p>
              </div>
            </Link>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <Link href="/admin/recruiters" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><img src="/assets/imgs/page/dashboard/recruiters.svg" alt="jobBox" /></div>
              <div className="card-info">
                <div className="card-title"><h3>{stats.totalRecruiters?.value ?? 0}</h3></div>
                <p className="color-text-paragraph-2">Total Recruiters</p>
              </div>
            </Link>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <Link href="/admin/Plans" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><FileText size={28} strokeWidth={2.2} color={NAVY} /></div>
              <div className="card-info">
                <div className="card-title"><h3>{stats.creditsSold?.value ?? 0}</h3></div>
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
                <div className="card-title"><h3>{stats.activeJobPostings?.active ?? 0}<span className="font-sm color-text-paragraph-2" style={{ marginLeft: '10px', fontWeight: 500 }}>/ {stats.activeJobPostings?.paused ?? 0} Paused</span></h3></div>
                <p className="color-text-paragraph-2">Active Job Postings</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <Link href="/admin/recruiters" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><ShieldCheck size={28} strokeWidth={2.2} color={AMBER} /></div>
              <div className="card-info">
                <div className="card-title"><h3>{stats.pendingVerifications?.total ?? 0}</h3></div>
                <p className="color-text-paragraph-2">Pending Verifications</p>
              </div>
            </Link>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <Link href="/admin/helpAndsupport" className="card-style-1 hover-up" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-image"><Headphones size={28} strokeWidth={2.2} color={AMBER} /></div>
              <div className="card-info">
                {/* <div className="card-title"><h3>{stats.openSupportTickets?.open ?? 0}<span className="font-sm status down">{stats.openSupportTickets?.pending ?? 0} Pending</span></h3></div> */}
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
                    <canvas id="donutChart" role="img" aria-label="Recruiters by industry">Recruiters by industry</canvas>
                  </div>
                  <div className="d-flex justify-content-center mt-10 mb-15" style={{ gap: '10px', flexWrap: 'wrap' }}>
                    {(dashboardData.recruitersByIndustry?.slices || []).map((d, index) => (
                      <span key={d.industry} className="font-xs color-text-paragraph-2" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: [NAVY, AMBER, GOLD, SLATE, GREY][index % 5], flexShrink: 0 }}></span>
                        {d.industry}
                      </span>
                    ))}
                  </div>
                  <div className="mt-10">
                    {(dashboardData.recruitersByIndustry?.slices || []).map((item) => (
                      <div key={item.industry} className="d-flex justify-content-between mb-5">
                        <span className="font-sm color-text-paragraph-2">{item.industry}</span>
                        <strong className="font-sm color-brand-1">{item.percentage}%</strong>
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
              {/* <a className="btn btn-default icon-edit hover-up" href="#" style={{ flexShrink: 0 }}>Export Report</a> */}
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
                  { href: '/admin/Plans', icon: BadgeDollarSign, title: 'Plans', value: `${platformOverview.plans?.activeCount ?? 0} active plans`, detail: `${platformOverview.plans?.recruiterPlanCount ?? 0} recruiter · ${platformOverview.plans?.candidatePlanCount ?? 0} candidate · ${platformOverview.plans?.creditPlanCount ?? 0} credit` },
                  { href: '/admin/users', icon: UserCog, title: 'Users', value: `${platformOverview.users?.total ?? 0} accounts`, detail: `${platformOverview.users?.active ?? 0} active · ${platformOverview.users?.inactive ?? 0} inactive` },
                  { href: '/admin/audit', icon: Monitor, title: 'Audit Logs', value: `${platformOverview.auditLogs?.criticalLast24Hours ?? 0} critical events`, detail: `${platformOverview.auditLogs?.totalLast24Hours ?? 0} in the last 24 hours` },
                  { href: '/admin/managePolicies', icon: Scale, title: 'Legal Pages', value: `${platformOverview.legalPages?.publishedCount ?? 0} published`, detail: `${platformOverview.legalPages?.totalDocuments ?? 0} total · last ${formatDate(platformOverview.legalPages?.lastPublishedAt)}` },
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
                      {dashboardData.recentRegistrations.map((u) => (
                        <tr key={u.userId} className="hover-up">
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ minWidth: 0 }}>
                                <p className="font-sm mb-0" style={{ fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>{u.name}</p>
                                <span className="font-xs color-text-paragraph-2">{formatTime(u.createdAt)}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '1px solid #f5f5f5' }}>
                            <span style={{
                              fontSize: '10px', fontWeight: 700, letterSpacing: '0.4px', padding: '3px 7px', borderRadius: '4px', whiteSpace: 'nowrap',

                            background: u.type === 'candidate' ? '#fff3df' : '#e8f5e9',
                              color: u.type === 'candidate' ? '#c76b00' : '#2e7d32'

                            }}>{u.type}</span>
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <button
                              className="btn btn-grey-small"
                              onClick={() => {
                                if (u.type === "candidate") {
                                  router.push(`/admin/candidates/candidateDetails?${u.candidateId || u.userId}`)
                                } else {
                                  router.push(`/admin/recruiters/details?${u.employerId || u.userId}`)
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
                      {dashboardData.recentSupportTickets.map((t) => {
                        const statusStyle = t.status?.toLowerCase() === 'resolved'
                          ? { color: '#21844c', bg: '#e6f7ed' }
                          : { color: '#c76b00', bg: '#fff3df' }
                        return (
                        <tr key={t.ticketId} className="hover-up">
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <p className="font-sm mb-0" style={{ fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{t.raisedByName}</p>
                            <span className="font-xs color-text-paragraph-2" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{t.subject}</span>
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <span className="font-xs color-text-paragraph-2">{t.category}</span>
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                              borderRadius: '4px', color: statusStyle.color, background: statusStyle.bg,
                              display: 'inline-block'
                            }}>{t.status}</span>
                          </td>
                        </tr>
                        )
                      })}
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
                      {dashboardData.recentPayments.map((p) => {
                        const statusStyle = p.paymentStatus?.toLowerCase() === 'success'
                          ? { color: '#2e7d32', bg: '#e8f5e9' }
                          : { color: '#e65100', bg: '#fff3e0' }
                        return (
                        <tr key={p.transactionId} className="hover-up">
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <p className="font-sm mb-0" style={{ fontWeight: 600, lineHeight: 1.3 }}>{p.entityName}</p>
                            <span className="font-xs color-text-paragraph-2">{formatTime(p.createdAt)}</span>
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <strong className="font-sm">₹{p.amount}</strong>
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                              borderRadius: '4px', color: statusStyle.color, background: statusStyle.bg,
                              display: 'inline-block'
                            }}>{p.paymentStatus}</span>
                          </td>
                        </tr>
                        )
                      })}
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