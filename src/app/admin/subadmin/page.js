'use client'
import { useState } from 'react'
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
  Key
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
    group: 'User Management',
    icon:Users,
    items: [
      { key: 'candidates',        label: 'View Candidates' },
      { key: 'candidates.approve', label: 'Approve / Reject Candidates' },
      { key: 'candidates.suspend', label: 'Suspend / Delete Candidates' },
      { key: 'employers',         label: 'View Employers' },
      { key: 'employers.approve', label: 'Approve / Reject Employers' },
      { key: 'employers.badges',  label: 'Issue / Revoke Trust Badges' },
    ],
  },
  {
    group: 'Verification Queues',
    icon: ShieldCheck,
    items: [
      { key: 'verify.kyc',      label: 'KYC / National ID Queue' },
      { key: 'verify.passport', label: 'Passport Queue' },
      { key: 'verify.iti',      label: 'ITI Certificate Review' },
      { key: 'verify.gst',      label: 'GST / PAN / Trade License' },
      { key: 'verify.poe',      label: 'POE License Queue' },
      { key: 'verify.rpsl',     label: 'RPSL License Queue' },
      { key: 'verify.ai',       label: 'Low AI Confidence Queue' },
    ],
  },
  {
    group: 'Finance & Payments',
    icon: CreditCard,
    items: [
      { key: 'finance.view',    label: 'View Transactions' },
      { key: 'finance.invoice', label: 'Download GST Invoices' },
      { key: 'finance.refund',  label: 'Process Refunds' },
      { key: 'finance.deposit', label: 'Security Deposit Tracking' },
    ],
  },
  {
    group: 'Platform Settings',
    icon: Settings,
    items: [
      { key: 'settings.view',   label: 'View Settings' },
      { key: 'settings.edit',   label: 'Edit Platform Config' },
      { key: 'settings.credits', label: 'Manage Credit Packs' },
    ],
  },
  {
    group: 'Audit & Compliance',
    icon: ClipboardList,
    items: [
      { key: 'audit.view',   label: 'View Audit Logs' },
      { key: 'audit.export', label: 'Export Reports / DPDP' },
    ],
  },
  {
    group: 'Sub Admin',
    icon:Key,
    items: [
      { key: 'subadmin.view',   label: 'View Sub Admins' },
      { key: 'subadmin.create', label: 'Create Sub Admins' },
      { key: 'subadmin.edit',   label: 'Edit Permissions' },
      { key: 'subadmin.delete', label: 'Delete Sub Admins' },
    ],
  },
]

// Preset roles
const PRESETS = {
  'Verification Officer': [
    'dashboard',
    'candidates', 'employers',
    'verify.kyc', 'verify.passport', 'verify.iti',
    'verify.gst', 'verify.poe', 'verify.rpsl', 'verify.ai',
  ],
  'Finance Admin': [
    'dashboard',
    'finance.view', 'finance.invoice', 'finance.refund', 'finance.deposit',
  ],
  'Employer Manager': [
    'dashboard',
    'employers', 'employers.approve', 'employers.badges',
  ],
  'Read Only': ['dashboard', 'candidates', 'employers', 'audit.view'],
}

const ALL_KEYS = ACCESS_MODULES.flatMap(m => m.items.map(i => i.key))

const SAMPLE_ADMINS = [
  {
    id: 1, name: 'Sarah Jenkins',  email: 'sarah.j@skillbridge.io',  phone: '+91 98001 11001',
    role: 'Verification Officer', status: 'Active',   lastLogin: '2 hours ago',  joined: 'Oct 10, 2023', img: 'avata2',
    access: PRESETS['Verification Officer'],
  },
  {
    id: 2, name: 'Robert Chen',    email: 'robert.c@skillbridge.io', phone: '+91 98002 22002',
    role: 'Finance Admin',        status: 'Active',   lastLogin: '1 day ago',    joined: 'Oct 12, 2023', img: 'avata3',
    access: PRESETS['Finance Admin'],
  },
  {
    id: 3, name: 'Priya Singh',    email: 'priya.s@skillbridge.io',  phone: '+91 98003 33003',
    role: 'Employer Manager',     status: 'Active',   lastLogin: '3 hours ago',  joined: 'Oct 15, 2023', img: 'avata4',
    access: PRESETS['Employer Manager'],
  },
  {
    id: 4, name: 'David Miller',   email: 'david.m@skillbridge.io',  phone: '+91 98004 44004',
    role: 'Read Only',            status: 'Suspended', lastLogin: '5 days ago',  joined: 'Nov 01, 2023', img: 'avata5',
    access: PRESETS['Read Only'],
  },
]

const BLANK = { name: '', email: '', phone: '', password: '', role: 'Verification Officer', status: 'Active', access: [...PRESETS['Verification Officer']] }

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
function Toggle({ value, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: '38px', height: '20px', borderRadius: '10px', flexShrink: 0,
      background: value ? '#ffa300' : '#ddd',
      position: 'relative', cursor: 'pointer', transition: 'background .2s',
    }}>
      <div style={{
        position: 'absolute', top: '2px', left: value ? '19px' : '2px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: '#fff', transition: 'left .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.25)',
      }} />
    </div>
  )
}

export default function SubAdminPage() {
  const [admins, setAdmins]   = useState(SAMPLE_ADMINS)
  const [search, setSearch]   = useState('')
  const [drawer, setDrawer]   = useState(false)     // 'create' | 'edit' | false
  const [editId, setEditId]   = useState(null)
  const [form,   setForm]     = useState(BLANK)
  const [viewId, setViewId]   = useState(null)      // expanded permissions row
  const [delId,  setDelId]    = useState(null)      // confirm delete

const filtered = drawer
  ? admins   // ← show ALL admins when drawer is open (table is behind overlay anyway)
  : admins.filter(a =>
      [a.name, a.email, a.role].some(v => v.toLowerCase().includes(search.toLowerCase()))
    )

  // ── form helpers ──
const openCreate = () => {
  setSearch('')   // ← ADD THIS LINE
  setForm({ ...BLANK, access: [...PRESETS['Verification Officer']] })
  setEditId(null)
  setDrawer('create')
}// In openEdit, add search reset so filtered table stays visible:
const openEdit = (a) => {
  setSearch('')   // ← ADD THIS LINE
  setForm({ name: a.name, email: a.email, phone: a.phone, password: '', role: a.role, status: a.status, access: [...a.access] })
  setEditId(a.id)
  setDrawer('edit')
}
  const applyPreset = (role) => {
    const keys = PRESETS[role] || []
    setForm(f => ({ ...f, role, access: [...keys] }))
  }

  const toggleKey = (key) => {
    setForm(f => {
      const has = f.access.includes(key)
      return { ...f, role: 'Custom', access: has ? f.access.filter(k => k !== key) : [...f.access, key] }
    })
  }

  const toggleGroup = (module) => {
    const keys = module.items.map(i => i.key)
    const allOn = keys.every(k => form.access.includes(k))
    setForm(f => ({
      ...f, role: 'Custom',
      access: allOn ? f.access.filter(k => !keys.includes(k)) : [...new Set([...f.access, ...keys])]
    }))
  }

  const toggleAll = () => {
    const allOn = ALL_KEYS.every(k => form.access.includes(k))
    setForm(f => ({ ...f, role: allOn ? 'Custom' : 'Super Admin', access: allOn ? [] : [...ALL_KEYS] }))
  }

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
          <div className="breadcrumbs">
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
    onChange={e => setSearch(e.target.value)}
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
                  {['Sub Admin', 'Role', 'Access', 'Status', 'Last Login', 'Joined', 'Actions'].map((h, i) => (
                    <th key={h}
                      style={{ padding: '12px 12px', textAlign: i === 6 ? 'center' : 'left',  letterSpacing: '0.4px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(admin => (
                <React.Fragment key={admin.id}>
                    <tr key={admin.id} className="hover-up"
                      style={{ borderBottom: viewId === admin.id ? 'none' : '1px solid #f5f5f5' }}>

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
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: '#ffc151', color: '#ffa300', whiteSpace: 'nowrap' }}>
                          {admin.role}
                        </span>
                      </td>

                      {/* Access count — click to expand */}
                      <td >
                        <button onClick={() => setViewId(viewId === admin.id ? null : admin.id)}
                          style={{ background: 'none', border: '1px solid #ffc151', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#ffa300' }}>
                          {admin.access.length} / {ALL_KEYS.length} features &#8964;
                        </button>
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
<td className="text-end">

  <div className="d-flex align-items-center justify-content-end" style={{ gap: '6px' }}>

    {/* EDIT */}
    <button
      className="btn btn-grey-small"
      onClick={() => openEdit(admin)}
      title="Edit"
      style={{ padding: '4px 6px' }}
    >
      ✎
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
      {admin.status === 'Active' ? '✓' : '⊘'}
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
      ✕
    </button>

  </div>

</td>
                    </tr>

                    {/* Expanded permission view */}
                    {viewId === admin.id && (
                      <tr key={`perm-${admin.id}`}>
                        <td colSpan={7} style={{ background: '#F8FAFF', borderBottom: '1px solid #f5f5f5', padding: '12px 20px 20px' }}>
                          <p className="font-xs color-text-paragraph-2 mb-12"
                            style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                            Access granted to {admin.name}
                          </p>
                          
                          <div className="row">
                            {ACCESS_MODULES.map(module => {
                              const granted = module.items.filter(i => admin.access.includes(i.key))
                              if (!granted.length) return null
                              return (
                                <div key={module.group} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-15">
                                 <p className="font-xs mb-8" style={{ fontWeight: 700, color: '#122359', display: 'flex', alignItems: 'center', gap: '5px' }}>
  {React.createElement(module.icon, { size: 13, strokeWidth: 2.2 })}
  {module.group}
</p>
                                  {granted.map(item => (
                                    <div key={item.key} className="d-flex align-items-center mb-5" style={{ gap: '6px' }}>
                                      <span style={{ color: '#2e7d32', fontSize: '11px' }}>✓</span>
                                      <span className="font-xs color-text-paragraph-2">{item.label}</span>
                                    </div>
                                  ))}
                                </div>
                              )
                            })}
                          </div>
                          <div className="mt-10">
                            <button className="btn btn-default hover-up font-xs" onClick={() => openEdit(admin)}
                              style={{ padding: '6px 14px' }}>
                               Edit Permissions
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
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
                Choose a preset to auto-fill permissions, or build a custom role below.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {Object.keys(PRESETS).map(preset => (
                  <button key={preset} onClick={() => applyPreset(preset)}
                    className={`btn hover-up font-xs`}
                    style={{
                      padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                      fontWeight: 600, fontSize: '12px',
                      background: form.role === preset ? '#ffa300' : '#f5f5f5',
                      color: form.role === preset ? '#fff' : '#444',
                      border: form.role === preset ? '1px solid #ffa300' : '1px solid #ddd',
                    }}>
                    {preset}
                  </button>
                ))}
                {form.role === 'Custom' && (
                  <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80' }}>
                    Custom
                  </span>
                )}
              </div>

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
                    <div key={module.group} style={{ border: '1px solid #ffc151', borderRadius: '10px', overflow: 'hidden' }}>

                      {/* Group header */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: allOn ? '#ffc151' : someOn ? '#FAFBFF' : '#fff',
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
                      <div style={{ padding: '8px 16px 12px', borderTop: '1px solid #ffc151', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {module.items.map(item => {
                          const on = form.access.includes(item.key)
                          return (
                            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: on ? '#ffa300' : '#ddd', flexShrink: 0 }}></span>
                                <span className="font-xs" style={{ color: on ? '#122359' : '#888', fontWeight: on ? 600 : 400 }}>{item.label}</span>
                              </div>
                              <Toggle value={on} onChange={() => toggleKey(item.key)} />
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


      <Footer />
    </>
  )
}