'use client'
import { useEffect, useState } from 'react'
import React from 'react'; // ensure import
import Footer from '../../../components/Footer'
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Plus,
  LayoutDashboard,
  CreditCard,
  Settings,
  ClipboardList,
  Key,
  Pencil,
  Trash2,
  Ban,
  CheckCircle
} from "lucide-react";
// ── All pages/features the admin can grant access to ──
const ACCESS_MODULES = [
  {
    group: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { key: 'dashboard', label: 'Dashboard' },
    ],
  },
  {
    group: 'Candidate Access',
    icon: Users,
    items: [
      { key: 'candidates.view', label: 'View Candidates' },
      { key: 'candidates.approve', label: 'Approve / Reject Candidates' },
      { key: 'candidates.suspend', label: 'Suspend / Delete Candidates' },
    ],
  },
  {
    group: 'Recruiter Access',
    icon: Users,
    items: [
      { key: 'recruiters.view', label: 'View Recruiters' },
      { key: 'employers.approve', label: 'Approve / Reject Employers' },
      { key: 'employers.badges', label: 'Issue / Revoke Trust Badges' },
    ],
  },
  {
    group: 'Verification Queues',
    icon: ShieldCheck,
    items: [
      { key: 'verify.kyc', label: 'KYC / National ID Queue' },
      { key: 'verify.passport', label: 'Passport Queue' },
      { key: 'verify.iti', label: 'ITI Certificate Review' },
      { key: 'verify.gst', label: 'GST / PAN / Trade License' },
      { key: 'verify.poe', label: 'POE License Queue' },
      { key: 'verify.rpsl', label: 'RPSL License Queue' },
      { key: 'verify.ai', label: 'Low AI Confidence Queue' },
    ],
  },
  {
    group: 'Revenue & Payments',
    icon: CreditCard,
    items: [
      { key: 'revenue.view', label: 'View Revenue & Transactions' },
      { key: 'finance.invoice', label: 'Download GST Invoices' },
      { key: 'finance.refund', label: 'Process Refunds' },
      { key: 'finance.deposit', label: 'Security Deposit Tracking' },
    ],
  },
  {
    group: 'Plans & Credits',
    icon: CreditCard,
    items: [
      { key: 'plans.view', label: 'View Plans' },
      { key: 'plans.edit', label: 'Create / Edit Plans' },
    ],
  },
  {
    group: 'Help & Support',
    icon: ClipboardList,
    items: [
      { key: 'support.view', label: 'View Support Tickets' },
      { key: 'support.reply', label: 'Reply / Resolve Tickets' },
    ],
  },
  {
    group: 'Legal Pages',
    icon: ClipboardList,
    items: [
      { key: 'legal.view', label: 'View Legal Pages' },
      { key: 'legal.edit', label: 'Edit Legal Pages' },
    ],
  },
  {
    group: 'Platform Settings',
    icon: Settings,
    items: [
      { key: 'settings.view', label: 'View Settings' },
      { key: 'settings.edit', label: 'Edit Platform Config' },
      { key: 'settings.credits', label: 'Manage Credit Packs' },
    ],
  },
  {
    group: 'Audit & Compliance',
    icon: ClipboardList,
    items: [
      { key: 'audit.view', label: 'View Audit Logs' },
      { key: 'audit.export', label: 'Export Reports / DPDP' },
    ],
  },
  {
    group: 'Sub Admin',
    icon: Key,
    items: [
      { key: 'subadmin.view', label: 'View Sub Admins' },
      { key: 'subadmin.create', label: 'Create Sub Admins' },
      { key: 'subadmin.edit', label: 'Edit Permissions' },
      { key: 'subadmin.delete', label: 'Delete Sub Admins' },
    ],
  },
]

// Preset roles
const PRESETS = {
  'Verification Officer': [
    'dashboard',
    'candidates.view', 'recruiters.view',
    'verify.kyc', 'verify.passport', 'verify.iti',
    'verify.gst', 'verify.poe', 'verify.rpsl', 'verify.ai',
  ],
  'Finance Admin': [
    'dashboard',
    'revenue.view', 'finance.invoice', 'finance.refund', 'finance.deposit',
  ],
  'Employer Manager': [
    'dashboard',
    'recruiters.view', 'employers.approve', 'employers.badges',
  ],
  'Read Only': ['dashboard', 'candidates.view', 'recruiters.view', 'revenue.view', 'plans.view', 'support.view', 'audit.view', 'legal.view'],
}

const ALL_KEYS = ACCESS_MODULES.flatMap(m => m.items.map(i => i.key))
const ADMINS_PER_PAGE = 10

const SAMPLE_ADMINS = [
  {
    id: 1, name: 'Sarah Jenkins', email: 'sarah.j@skillbridge.io', phone: '+91 98001 11001',
    role: 'Verification Officer', status: 'Active', lastLogin: '2 hours ago', joined: 'Oct 10, 2023', img: 'avata2',
    access: PRESETS['Verification Officer'],
  },
  {
    id: 2, name: 'Robert Chen', email: 'robert.c@skillbridge.io', phone: '+91 98002 22002',
    role: 'Finance Admin', status: 'Active', lastLogin: '1 day ago', joined: 'Oct 12, 2023', img: 'avata3',
    access: PRESETS['Finance Admin'],
  },
  {
    id: 3, name: 'Priya Singh', email: 'priya.s@skillbridge.io', phone: '+91 98003 33003',
    role: 'Employer Manager', status: 'Active', lastLogin: '3 hours ago', joined: 'Oct 15, 2023', img: 'avata4',
    access: PRESETS['Employer Manager'],
  },
  {
    id: 4, name: 'David Miller', email: 'david.m@skillbridge.io', phone: '+91 98004 44004',
    role: 'Read Only', status: 'Suspended', lastLogin: '5 days ago', joined: 'Nov 01, 2023', img: 'avata5',
    access: PRESETS['Read Only'],
  },
]

const BLANK = { name: '', email: '', phone: '', password: '', role: 'Verification Officer', presets: ['Verification Officer'], status: 'Active', access: [...PRESETS['Verification Officer']] }

function StatusBadge({ status }) {
  const s = status === 'Active'
    ? { color: '#2e7d32', bg: '#e8f5e9', border: '#a5d6a7' }
    : { color: '#c62828', bg: '#fdecea', border: '#ef9a9a' }
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap', color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {status}
    </span>
  )
}

// Toggle switch
const PARENT_FEATURES = {
  'candidates.approve': 'candidates.view',
  'candidates.suspend': 'candidates.view',
  'employers.approve': 'recruiters.view',
  'employers.badges': 'recruiters.view',
  'finance.invoice': 'revenue.view',
  'finance.refund': 'revenue.view',
  'finance.deposit': 'revenue.view',
  'plans.edit': 'plans.view',
  'support.reply': 'support.view',
  'legal.edit': 'legal.view',
  'settings.edit': 'settings.view',
  'settings.credits': 'settings.view',
  'audit.export': 'audit.view',
  'subadmin.create': 'subadmin.view',
  'subadmin.edit': 'subadmin.view',
  'subadmin.delete': 'subadmin.view',
}

function normalizeAccess(access = []) {
  const legacyKeys = { candidates: 'candidates.view', employers: 'recruiters.view', 'finance.view': 'revenue.view' }
  return [...new Set(access.map((key) => legacyKeys[key] || key))]
}

function Toggle({ value, onChange, disabled = false }) {
  const handleClick = (event) => {
    event.stopPropagation()
    if (!disabled) onChange()
  }
  return (
    <button type="button" onClick={handleClick} disabled={disabled} aria-pressed={value} style={{
      width: '38px', height: '20px', borderRadius: '10px', flexShrink: 0,
      background: value ? '#ffa300' : '#ddd', border: 'none',
      position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, transition: 'background .2s',
    }}>
      <div style={{
        position: 'absolute', top: '2px', left: value ? '19px' : '2px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: '#fff', transition: 'left .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.25)',
      }} />
    </button>
  )
}

export default function SubAdminPage() {
  const [admins, setAdmins] = useState(SAMPLE_ADMINS)
  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState(false)     // 'create' | 'edit' | false
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [delId, setDelId] = useState(null)      // confirm delete
  const [hydrated, setHydrated] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const saved = window.localStorage.getItem('jobbox_subadmins')
    if (saved) {
      try { setAdmins(JSON.parse(saved).map((admin) => ({ ...admin, access: normalizeAccess(admin.access) }))) } catch { window.localStorage.removeItem('jobbox_subadmins') }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem('jobbox_subadmins', JSON.stringify(admins))
  }, [admins, hydrated])

  const filtered = admins.filter(a =>
    [a.name, a.email, a.role].some(v => v.toLowerCase().includes(search.toLowerCase()))
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / ADMINS_PER_PAGE))
  const currentPage = Math.min(page, pageCount)
  const visibleAdmins = filtered.slice((currentPage - 1) * ADMINS_PER_PAGE, currentPage * ADMINS_PER_PAGE)

  // ── form helpers ──
  const openCreate = () => {
    setSearch('')
    setPage(1)
    setForm({ ...BLANK, presets: ['Verification Officer'], access: [...PRESETS['Verification Officer']] })
    setEditId(null)
    setDrawer('create')
  }
  const openEdit = (a) => {
    setSearch('')
    setPage(1)
    setForm({ name: a.name, email: a.email, phone: a.phone, password: '', role: a.role, presets: PRESETS[a.role] ? [a.role] : [], status: a.status, access: [...a.access] })
    setEditId(a.id)
    setDrawer('edit')
  }
  const applyPreset = (role) => {
    setForm((current) => {
      const selected = current.presets || []
      const presets = selected.includes(role) ? selected.filter((preset) => preset !== role) : [...selected, role]
      const access = [...new Set(presets.flatMap((preset) => PRESETS[preset] || []))]
      return { ...current, presets, role: presets.length === 1 ? presets[0] : 'Custom', access }
    })
  }

  const toggleKey = (key) => {
    setForm(f => {
      const has = f.access.includes(key)
      const dependentKeys = Object.entries(PARENT_FEATURES).filter(([, parent]) => parent === key).map(([child]) => child)
      const nextAccess = has
        ? f.access.filter(k => k !== key && !dependentKeys.includes(k))
        : [...new Set([...f.access, ...(PARENT_FEATURES[key] ? [PARENT_FEATURES[key]] : []), key])]
      return { ...f, presets: [], role: 'Custom', access: nextAccess }
    })
  }

  const toggleGroup = (module) => {
    const keys = module.items.map(i => i.key)
    const allOn = keys.every(k => form.access.includes(k))
    setForm(f => ({
      ...f, presets: [], role: 'Custom',
      access: allOn ? f.access.filter(k => !keys.includes(k)) : [...new Set([...f.access, ...keys])]
    }))
  }

  const toggleAll = () => {
    const allOn = ALL_KEYS.every(k => form.access.includes(k))
    setForm(f => ({ ...f, presets: [], role: allOn ? 'Custom' : 'Super Admin', access: allOn ? [] : [...ALL_KEYS] }))
  }

  const itemIsDisabled = (key) => Boolean(PARENT_FEATURES[key] && !form.access.includes(PARENT_FEATURES[key]))

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return
    if (drawer === 'create') {
      setAdmins(a => [...a, {
        id: Date.now(), img: 'avata1',
        lastLogin: 'Never',
        joined: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        ...form,
      }])
    } else {
      setAdmins(a => a.map(ad => ad.id === editId ? { ...ad, ...form } : ad))
    }
    setPage(1)
    setDrawer(false)
  }

  const handleDelete = (id) => { setAdmins(a => a.filter(ad => ad.id !== id)); setDelId(null) }
  const toggleStatus = (id) => setAdmins(a => a.map(ad => ad.id === id ? { ...ad, status: ad.status === 'Active' ? 'Suspended' : 'Active' } : ad))

  return (
    <>
      {/* ── PAGE HEADING ── */}
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-5">Sub Admin Management</h3>
          <p className="font-sm color-text-paragraph-2 mb-3">
            Create sub-admin accounts and control exactly which pages and features they can access.
          </p>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: "none", backgroundColor: "revert" }} >
            <ul>
              <li><a className="icon-home" href="/dashboard">Admin</a></li>
              <li><span>Sub Admins</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="section-box">
        <div className="row">
          {[
            {
              label: 'Total Sub Admins',
              value: admins.length,
              icon: Users
            },
            {
              label: 'Active',
              value: admins.filter(a => a.status === 'Active').length,
              icon: UserCheck
            },
            {
              label: 'Suspended',
              value: admins.filter(a => a.status === 'Suspended').length,
              icon: UserX
            },
            {
              label: 'Role Presets',
              value: Object.keys(PRESETS).length,
              icon: ShieldCheck
            },
          ].map((c, i) => {
            const Icon = c.icon;

            return (
              <div key={i} className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <div className="card-style-1 hover-up">

                  {/* ✅ SAME STRUCTURE */}
                  <div className="card-image">
                    <Icon size={28} strokeWidth={2.2} />
                  </div>

                  <div className="card-info">
                    <div className="card-title">
                      <h3>{c.value}</h3>
                    </div>

                    <p className="color-text-paragraph-2">
                      {c.label}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SUB ADMIN TABLE PANEL ── */}
      <div className="section-box">
        <div className="panel-white">

          {/* Toolbar */}
          <div className="panel-head" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <h5 className="mb-0">All Sub Admins</h5>
            <div className="d-flex align-items-center mt-5" style={{ gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                {/* Dummy hidden fields trick Chrome into NOT autofilling the real search */}
                <input type="text" name="username" style={{ display: 'none' }} readOnly />
                <input type="password" name="password" style={{ display: 'none' }} readOnly />

                <input
                  className="form-control font-xs"
                  placeholder="Search name, email, role..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  autoComplete="off"
                  type="search"
                  name="admin-search"
                  style={{ paddingLeft: '12px', width: '320px' }}
                />
              </div>
              <button
                className="btn btn-default hover-up d-flex align-items-center gap-2"
                onClick={openCreate}
                style={{ padding: '13px 18px', fontSize: '13px', fontWeight: 600 }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Sub Admin
              </button>
            </div>
          </div>

          {/* Table */}
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  {['Sub Admin', 'Role', 'Status', 'Last Login', 'Joined', 'Actions'].map((h, i) => (
                    <th key={h}
                      style={{ padding: '12px 12px', textAlign: i === 6 ? 'center' : 'left', letterSpacing: '0.4px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleAdmins.map(admin => (
                  <React.Fragment key={admin.id}>
                    <tr key={admin.id} className="hover-up"
                      style={{ borderBottom: '1px solid #f5f5f5' }}>

                      {/* Name + email */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={`/assets/imgs/page/dashboard/${admin.img}.png`} alt=""
                            style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                          <div>
                            <h6>{admin.name}</h6>
                            <span className="font-sm color-text-paragraph-2">{admin.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td >
                        <span className="role-badge">
                          {admin.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 12px' }}>
                        <StatusBadge status={admin.status} />
                      </td>

                      {/* Last login */}
                      <td style={{ padding: '14px 12px', whiteSpace: 'nowrap' }}>
                        <span className="font-sm color-text-paragraph-2">{admin.lastLogin}</span>
                      </td>

                      {/* Joined */}
                      <td style={{ padding: '14px 12px', whiteSpace: 'nowrap' }}>
                        <span className="font-sm color-text-paragraph-2">{admin.joined}</span>
                      </td>

                      {/* Actions */}
                      <td style={{
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}>

                        <div className="d-flex align-items-center justify-content-center" style={{ gap: '6px' }}>

                          {/* EDIT */}
                          <button
                            className="btn btn-grey-small"
                            onClick={() => openEdit(admin)}
                            title="Edit"
                            style={{ padding: '4px 6px' }}
                          >
                            <Pencil size={15} />
                          </button>

                          {/* STATUS */}
                          <button
                            className="btn btn-grey-small"
                            onClick={() => toggleStatus(admin.id)}
                            title={admin.status === 'Active' ? 'Suspend' : 'Activate'}
                            style={{
                              padding: '4px 6px',
                              color: admin.status === 'Active' ? '#c62828' : '#2e7d32'
                            }}
                          >
                            {admin.status === 'Active'
                              ? <Ban size={15} />
                              : <CheckCircle size={15} />
                            }
                          </button>

                          {/* DELETE */}
                          <button
                            className="btn btn-grey-small"
                            onClick={() => setDelId(admin.id)}
                            title="Delete"
                            style={{
                              padding: '4px 6px',
                              color: '#c62828'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>

                      </td>
                    </tr>

                  </React.Fragment>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>
                      <span className="font-sm color-text-paragraph-2">No sub admins found.</span>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
            {filtered.length > 0 && (
              <div className="subadmin-pagination">
                <span>Showing {(currentPage - 1) * ADMINS_PER_PAGE + 1}–{Math.min(currentPage * ADMINS_PER_PAGE, filtered.length)} of {filtered.length} sub admins</span>
                <div>
                  <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
                  {Array.from({ length: pageCount }, (_, index) => (
                    <button type="button" key={index} className={currentPage === index + 1 ? 'active' : ''} onClick={() => setPage(index + 1)}>{index + 1}</button>
                  ))}
                  <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════
          CREATE / EDIT DRAWER (slide-in panel)
      ══════════════════════════════════════ */}
      {drawer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}>
          {/* Backdrop */}
          <div onClick={() => setDrawer(false)}
            style={{ flex: 1, background: 'rgba(0,0,0,0.45)' }} />

          {/* Drawer panel */}
          <div style={{
            width: '560px', maxWidth: '95vw', background: '#fff',
            height: '100vh', overflowY: 'auto',
            boxShadow: '-4px 0 24px rgba(0,0,0,.15)',
            display: 'flex', flexDirection: 'column',
          }}>

            {/* Drawer header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h5 className="mb-0">{drawer === 'create' ? 'Add New Sub Admin' : 'Edit Sub Admin'}</h5>
                <p className="font-xs color-text-paragraph-2 mb-0 mt-3">
                  {drawer === 'create' ? 'Fill details and assign page/feature access.' : 'Update details and permissions.'}
                </p>
              </div>
              <button onClick={() => setDrawer(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888', padding: '4px' }}>
                ✕
              </button>
            </div>

            {/* Drawer body */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>

              {/* ── Basic Info ── */}
              <p className="font-xs color-text-paragraph-2 mb-15"
                style={{ textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                Basic Information
              </p>

              <div className="row">
                <div className="col-12 mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5"
                    style={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Full Name *
                  </label>
                  <input className="form-control" type="text" placeholder="e.g. Sarah Jenkins"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="col-12 mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5"
                    style={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Email Address *
                  </label>
                  <input className="form-control" type="email" placeholder="admin@skillbridge.io"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="col-12 mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5"
                    style={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Phone Number
                  </label>
                  <input className="form-control" type="tel" placeholder="+91 98000 00000"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="col-12 mb-15">
                  <label
                    className="font-xs color-text-paragraph-2 mb-5"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }}
                  >
                    Role
                  </label>

                  <select
                    className="form-control"
                    value={form.role}
                    onChange={(e) => {
                      const role = e.target.value;
                      setForm(f => ({
                        ...f,
                        role,
                        presets: role !== 'Custom' ? [role] : [],
                        access: PRESETS[role]
                          ? [...PRESETS[role]]
                          : f.access
                      }));
                    }}
                  >
                    <option value="Verification Officer">Verification Officer</option>
                    <option value="Finance Admin">Finance Admin</option>
                    <option value="Employer Manager">Employer Manager</option>
                    <option value="Read Only">Read Only</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="col-12 mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5"
                    style={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {drawer === 'create' ? 'Password *' : 'New Password (leave blank to keep)'}
                  </label>
                  <input className="form-control" type="password" placeholder="Min 8 characters"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <div className="col-12 mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5"
                    style={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Account Status
                  </label>
                  <select className="form-control" value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option>Active</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>

              {/* ── Role Preset ── */}
              <p className="font-xs color-text-paragraph-2 mb-15 mt-10"
                style={{ textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                Role Preset
              </p>
              <p className="font-xs color-text-paragraph-2 mb-10">
                Select one or more presets to combine their permissions, or adjust individual features below.
              </p>
              <div className="preset-picker">
                {Object.keys(PRESETS).map(preset => (
                  <button key={preset} onClick={() => applyPreset(preset)}
                    className={`preset-option ${(form.presets || []).includes(preset) ? 'is-selected' : ''}`}
                    aria-pressed={(form.presets || []).includes(preset)}>
                    <span className="preset-check">✓</span>{preset}
                  </button>
                ))}
                {form.role === 'Custom' && (
                  <span className="custom-role-badge">
                    Custom permissions
                  </span>
                )}
              </div>
              <p className="preset-summary">{(form.presets || []).length ? `${form.presets.length} preset${form.presets.length > 1 ? 's' : ''} selected` : 'No preset selected — using custom permissions'}</p>

              {/* ── Access Control ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                <p className="font-xs color-text-paragraph-2 mb-0"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                  Page & Feature Access
                </p>
                <button onClick={toggleAll}
                  style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#ffa300' }}>
                  {ALL_KEYS.every(k => form.access.includes(k)) ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {ACCESS_MODULES.map(module => {
                  const keys = module.items.map(i => i.key)
                  const allOn = keys.every(k => form.access.includes(k))
                  const someOn = keys.some(k => form.access.includes(k))
                  return (
                    <div key={module.group} className={`permission-module ${someOn ? 'has-access' : ''}`}>

                      {/* Group header */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '13px 16px',
                        background: allOn ? '#fff8ea' : someOn ? '#fbfcff' : '#fff',
                        cursor: 'pointer',
                      }} onClick={() => toggleGroup(module)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {(() => {
                            const Icon = module.icon;
                            return <Icon size={16} strokeWidth={2.2} />;
                          })()}

                          <span className="font-sm" style={{ fontWeight: 700, color: '#122359' }}>
                            {module.group}
                          </span>

                          <span style={{ fontSize: '10px', color: '#888' }}>
                            ({module.items.filter(i => form.access.includes(i.key)).length}/{module.items.length})
                          </span>
                        </div>
                        <Toggle value={allOn} onChange={() => toggleGroup(module)} />
                      </div>

                      {/* Individual items */}
                      <div className="permission-items">
                        {module.items.map(item => {
                          const on = form.access.includes(item.key)
                          const disabled = itemIsDisabled(item.key)
                          return (
                            <div key={item.key} className={`permission-item ${on ? 'is-enabled' : ''} ${disabled ? 'is-disabled' : ''}`}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: on ? '#ffa300' : '#ddd', flexShrink: 0 }}></span>
                                <span className="font-xs" style={{ color: disabled ? '#aab2c3' : on ? '#122359' : '#888', fontWeight: on ? 600 : 400 }}>{item.label}</span>
                              </div>
                              <Toggle value={on} disabled={disabled} onChange={() => toggleKey(item.key)} />
                            </div>
                          )
                        })}
                      </div>

                    </div>
                  )
                })}
              </div>

              {/* Access summary */}
              <div style={{ marginTop: '20px', padding: '12px 16px', background: '#F8FAFF', borderRadius: '8px', border: '1px solid #ffc151' }}>
                <p className="font-xs mb-0" style={{ color: '#ffa300', fontWeight: 600 }}>
                  ✓ {form.access.length} of {ALL_KEYS.length} features selected
                </p>
              </div>

            </div>

            {/* Drawer footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', flexShrink: 0, background: '#fff' }}>
              <button className="btn btn-default hover-up" onClick={handleSave}
                style={{ flex: 1, padding: '11px', fontSize: '14px', fontWeight: 600 }}>
                {drawer === 'create' ? '✓ Create Sub Admin' : '✓ Save Changes'}
              </button>
              <button className="btn btn-grey-small hover-up" onClick={() => setDrawer(false)}
                style={{ padding: '11px 20px', fontSize: '14px' }}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {delId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', width: '380px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fdecea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 12px' }}>
                ✕
              </div>
              <h5 className="mb-5">Delete Sub Admin?</h5>
              <p className="font-sm color-text-paragraph-2 mb-0">
                This will permanently remove <strong>{admins.find(a => a.id === delId)?.name}</strong> and revoke all their access. This cannot be undone.
              </p>
            </div>
            <div className="d-flex" style={{ gap: '10px' }}>
              <button onClick={() => handleDelete(delId)}
                className="btn hover-up"
                style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700, background: '#c62828', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Yes, Delete
              </button>
              <button onClick={() => setDelId(null)}
                className="btn btn-grey-small hover-up"
                style={{ flex: 1, padding: '10px', fontSize: '13px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .preset-picker { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 8px; }
        .preset-option { display: inline-flex; align-items: center; gap: 7px; min-height: 36px; padding: 0 12px; border: 1px solid #dce3ef; border-radius: 8px; background: #fff; color: #526685; font-size: 12px; font-weight: 700; cursor: pointer; transition: .2s ease; }
        .preset-option:hover { border-color: #ffa300; color: #122359; background: #fffaf1; }
        .preset-option.is-selected { border-color: #ffa300; background: #fff3dc; color: #a56600; box-shadow: 0 3px 8px rgba(255,163,0,.12); }
        .preset-check { display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; width: 16px; height: 16px; min-width: 16px; padding: 0; border: 1px solid #cbd4e3; border-radius: 4px; color: transparent; font-size: 10px; line-height: 1; }
        .is-selected .preset-check { border-color: #ffa300; background: #ffa300; color: #fff; }
        .custom-role-badge { display: inline-flex; align-items: center; min-height: 36px; padding: 0 12px; border: 1px solid #ffd28a; border-radius: 8px; background: #fff8ea; color: #a56600; font-size: 12px; font-weight: 700; }
        .preset-summary { margin: 0 0 18px; color: #7182a1; font-size: 11px; }
        .permission-module { overflow: hidden; border: 1px solid #e0e6f0; border-radius: 12px; background: #fff; box-shadow: 0 2px 8px rgba(18,35,89,.025); transition: border-color .2s, box-shadow .2s; }
        .permission-module.has-access { border-color: #ffd28a; }
        .permission-module:hover { border-color: #ffa300; box-shadow: 0 8px 18px rgba(18,35,89,.06); }
        .permission-items { display: flex; flex-direction: column; gap: 2px; padding: 8px 16px 12px; border-top: 1px solid #edf0f5; background: #fff; }
        .permission-item { display: flex; align-items: center; justify-content: space-between; min-height: 34px; padding: 5px 0; border-bottom: 1px solid #f3f5f8; }
        .permission-item:last-child { border-bottom: 0; }
        .permission-item.is-enabled { background: linear-gradient(90deg, rgba(255,163,0,.055), transparent 70%); }
        .permission-item.is-disabled { opacity: .7; }
        .role-badge { display: inline-flex; align-items: center; min-height: 25px; padding: 4px 10px; border: 1px solid #ffd28a; border-radius: 20px; background: #fff3dc; color: #9b5d00; font-size: 12px; font-weight: 700; line-height: 1; white-space: nowrap; }
        .access-count { display: inline-flex; align-items: center; min-height: 30px; padding: 4px 10px; border: 1px solid #ffd28a; border-radius: 7px; background: #fffaf1; color: #9b5d00; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .subadmin-pagination { padding: 15px 20px; border-top: 1px solid #edf1f6; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #7b8aa5; font-size: 12px; }
        .subadmin-pagination > div { display: flex; gap: 5px; }
        .subadmin-pagination button { height: 30px; min-width: 30px; padding: 0 9px; border: 1px solid #dce4ef; border-radius: 5px; background: #fff; color: #5f7194; font-size: 11px; font-weight: 700; }
        .subadmin-pagination button.active { color: #fff; background: #ffa300; border-color: #ffa300; }
        .subadmin-pagination button:disabled { opacity: .45; cursor: not-allowed; }
        @media (max-width: 575px) { .subadmin-pagination { align-items: flex-start; flex-direction: column; } }
      `}</style>

      <Footer />
    </>
  )
}
