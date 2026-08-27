'use client'
import { useEffect, useState } from 'react'
import React from 'react'; // ensure import
import { createPortal } from 'react-dom'; // ensure import
import Footer from '../../../components/Footer'
import { subAdminService } from '../../../services/subAdminService'
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
  CheckCircle,
  AlertCircle,
  Home,
  Briefcase,
  HelpCircle,
  ScrollText,
  FileText
} from "lucide-react";

// ── Sidebar tabs the admin can grant access to ──
// This list mirrors the admin sidebar 1:1 (in the same order). A sub admin
// will only ever see the tabs whose `key` is present in their `access` array.
// "Logout" is intentionally NOT in this list — every sub admin can always log out.
const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'candidates', label: 'Candidates', icon: Users },
  { key: 'recruiters', label: 'Recruiters', icon: Briefcase },
  { key: 'revenue', label: 'Revenue', icon: CreditCard },
  { key: 'plans', label: 'Plans', icon: CreditCard },
  { key: 'home_management', label: 'Home Management', icon: Home },
  { key: 'users', label: 'Users', icon: Key },
  { key: 'help_support', label: 'Help & Support', icon: HelpCircle },
  { key: 'audit_logs', label: 'Audit Logs', icon: ScrollText },
  { key: 'legal_pages', label: 'Legal Pages', icon: FileText },
  { key: 'settings', label: 'Settings', icon: Settings },
]

// Preset roles — each preset is just a list of TABS keys now
const PRESETS = {
  'Verification Officer': ['dashboard', 'candidates', 'recruiters'],
  'Finance Admin': ['dashboard', 'revenue'],
  'Employer Manager': ['dashboard', 'recruiters'],
  'Read Only': ['dashboard', 'candidates', 'recruiters', 'revenue', 'plans'],
}

const ALL_KEYS = TABS.map(t => t.key)
const ADMINS_PER_PAGE = 10

// Sub admins created before this change may still have old, granular
// feature-level keys saved in localStorage (e.g. "candidates.view").
// This maps those legacy keys onto the new tab-level keys so old data
// keeps working instead of breaking.
const LEGACY_TO_TAB = {
  candidates: 'candidates', 'candidates.view': 'candidates', 'candidates.approve': 'candidates', 'candidates.suspend': 'candidates',
  employers: 'recruiters', 'recruiters.view': 'recruiters', 'employers.approve': 'recruiters', 'employers.badges': 'recruiters',
  'revenue.view': 'revenue', 'finance.view': 'revenue', 'finance.invoice': 'revenue', 'finance.refund': 'revenue', 'finance.deposit': 'revenue',
  'plans.view': 'plans', 'plans.edit': 'plans',
  'verify.kyc': 'candidates', 'verify.passport': 'candidates', 'verify.iti': 'candidates', 'verify.gst': 'candidates', 'verify.poe': 'candidates', 'verify.rpsl': 'candidates', 'verify.ai': 'candidates',
  'support.view': 'help_support', 'support.reply': 'help_support',
  'legal.view': 'legal_pages', 'legal.edit': 'legal_pages',
  'settings.view': 'settings', 'settings.edit': 'settings', 'settings.credits': 'settings',
  'audit.view': 'audit_logs', 'audit.export': 'audit_logs',
  'subadmin.view': 'users', 'subadmin.create': 'users', 'subadmin.edit': 'users', 'subadmin.delete': 'users',
}

// Helper you can import into the sidebar component to decide which tabs to
// render for the logged-in sub admin. Logout is always allowed.
export function canAccessTab(access, key) {
  if (key === 'logout') return true
  return Array.isArray(access) && access.includes(key)
}

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

const DEFAULT_SUPER_ADMIN = {
  name: 'Steven Jobs',
  email: 'steven.jobs@jobbox.io',
  phone: '+91 98000 00000',
  role: 'Super Admin',
  status: 'Active',
  lastLogin: 'Now',
  joined: 'Platform owner',
  img: 'avata1',
}

const SUB_ADMIN_ROLE = 'Sub Admin'
const BLANK = { name: '', email: '', phone: '', role: SUB_ADMIN_ROLE, presets: [], status: 'Active', access: [...PRESETS['Verification Officer']] }

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

// Stored values can include +91; newly entered numbers are kept as 10 digits.
const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
  return /^\d{10}$/.test(digits)
}

const getEmailError = (email) => {
  if (!email.trim()) return 'Email address is required.'
  return isValidEmail(email) ? '' : 'Enter a valid email address.'
}

const getPhoneError = (phone) => {
  if (!phone.trim()) return 'Phone number is required.'
  return isValidPhone(phone) ? '' : 'Enter a valid 10-digit phone number.'
}

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

// Migrate any legacy granular keys to tab-level keys, and drop anything unknown.
function normalizeAccess(access = []) {
  const mapped = access.map((key) => LEGACY_TO_TAB[key] || key)
  return [...new Set(mapped.filter((key) => ALL_KEYS.includes(key)))]
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

const mapApiToUi = (apiItem) => {
  const access = [];
  if (apiItem.permissions) {
    Object.entries(apiItem.permissions).forEach(([key, allowed]) => {
      if (allowed) access.push(key);
    });
  }
  
  // Format joined date
  let joinedStr = 'Never';
  if (apiItem.createdAt) {
    try {
      joinedStr = new Date(apiItem.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      joinedStr = apiItem.createdAt;
    }
  }

  // Format last login
  let lastLoginStr = 'Never';
  if (apiItem.lastLoginAt) {
    try {
      const diffMs = Date.now() - new Date(apiItem.lastLoginAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 60) {
        lastLoginStr = diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        lastLoginStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        lastLoginStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }
    } catch (e) {
      lastLoginStr = apiItem.lastLoginAt;
    }
  }

  return {
    id: apiItem.adminId, // use adminId as the local id
    userId: apiItem.userId,
    name: apiItem.fullName || '',
    email: apiItem.email || '',
    phone: apiItem.mobileNumber || '',
    role: apiItem.roleName || 'Verification Officer',
    status: apiItem.isActive ? 'Active' : 'Suspended',
    lastLogin: lastLoginStr,
    joined: joinedStr,
    img: 'avata2', // default fallback avatar
    access: access
  };
};

const mapUiToApi = (uiForm, isUpdate = false) => {
  const permissions = {};
  TABS.forEach(tab => {
    permissions[tab.key] = uiForm.access.includes(tab.key);
  });

  const payload = {
    fullName: uiForm.name,
    mobileNumber: uiForm.phone,
    countryCode: "+91",
    roleName: SUB_ADMIN_ROLE,
    permissions: permissions,
    isActive: uiForm.status === 'Active'
  };

  if (!isUpdate) {
    payload.email = uiForm.email;
  }

  return payload;
};

export default function SubAdminPage() {
  const [admins, setAdmins] = useState([])
  const [superAdmin, setSuperAdmin] = useState(DEFAULT_SUPER_ADMIN)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [drawer, setDrawer] = useState(false)     // 'create' | 'edit' | false
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [formErrors, setFormErrors] = useState({})
  const [delId, setDelId] = useState(null)      // confirm delete
  const [hydrated, setHydrated] = useState(false)
  const [page, setPage] = useState(1)
  const [loadingList, setLoadingList] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [activeCount, setActiveCount] = useState(0)
  const [suspendedCount, setSuspendedCount] = useState(0)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeDrawer = () => {
    setDrawer(false);
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchSubAdmins = () => {
    setLoadingList(true)
    subAdminService.getSubAdmins({
      search: search,
      status: statusFilter,
      page: page,
      pageSize: ADMINS_PER_PAGE
    })
    .then((res) => {
      setLoadingList(false)
      if (res && res.items) {
        setAdmins(res.items.map(mapApiToUi));
        setTotalCount(res.totalSubAdmins || res.totalCount || 0);
        setActiveCount(res.activeCount || 0);
        setSuspendedCount(res.suspendedCount || 0);
      }
    })
    .catch((err) => {
      setLoadingList(false)
      console.error("Failed to fetch sub-admins:", err);
    });
  }

  useEffect(() => {
    const savedSuperAdmin = window.localStorage.getItem('jobbox_superadmin')
    if (savedSuperAdmin) {
      try { setSuperAdmin((current) => ({ ...current, ...JSON.parse(savedSuperAdmin), role: 'Super Admin', status: 'Active' })) } catch { window.localStorage.removeItem('jobbox_superadmin') }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      fetchSubAdmins();
    }
  }, [search, statusFilter, page, hydrated])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem('jobbox_superadmin', JSON.stringify(superAdmin))
  }, [superAdmin, hydrated])

  const pageCount = Math.max(1, Math.ceil(totalCount / ADMINS_PER_PAGE))
  const currentPage = page
  const visibleAdmins = admins.filter((admin) => {
    const matchesSearch =
      !search ||
      (admin.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (admin.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (admin.roleName || '').toLowerCase().includes(search.toLowerCase()) ||
      (admin.role || '').toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'Active' && admin.status === 'Active') ||
      (statusFilter === 'Suspended' && admin.status === 'Suspended');
      
    return matchesSearch && matchesStatus;
  });

  // ── form helpers ──
  const openCreate = () => {
    setSearch('')
    setPage(1)
    setForm({ ...BLANK, access: [...PRESETS['Verification Officer']] })
    setFormErrors({})
    setEditId(null)
    setToast({ show: false, message: '', type: 'success' })
    setDrawer('create')
  }
  const openEdit = (a) => {
    setSearch('')
    setPage(1)
    setForm({ name: a.name, email: a.email, phone: a.phone, role: SUB_ADMIN_ROLE, presets: [], status: a.status, access: [...a.access] })
    setFormErrors({})
    setEditId(a.id)
    setToast({ show: false, message: '', type: 'success' })
    setDrawer('edit')
  }
  const toggleTab = (key) => {
    setForm(f => {
      const has = f.access.includes(key)
      return {
        ...f,
        access: has ? f.access.filter(k => k !== key) : [...f.access, key],
      }
    })
  }

  const toggleAll = () => {
    const allOn = ALL_KEYS.every(k => form.access.includes(k))
    setForm(f => ({ ...f, access: allOn ? [] : [...ALL_KEYS] }))
  }

  const handleSave = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Full name is required.'
    const emailError = getEmailError(form.email)
    const phoneError = getPhoneError(form.phone)
    if (emailError) errors.email = emailError
    if (phoneError) errors.phone = phoneError

    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    
    if (drawer === 'super') {
      const updatedProfile = { ...superAdmin, name: form.name.trim(), email: form.email.trim(), phone: form.phone, role: 'Super Admin', status: 'Active' }
      setSuperAdmin(updatedProfile)
      window.dispatchEvent(new CustomEvent('jobbox-superadmin-updated', { detail: updatedProfile }))
      closeDrawer()
      showToast('Super Admin profile updated successfully!', 'success')
    } else if (drawer === 'create') {
      const apiPayload = mapUiToApi(form);
      subAdminService.createSubAdmin(apiPayload)
        .then(() => {
          fetchSubAdmins();
          setPage(1);
          closeDrawer();
          showToast('Sub Admin created successfully!', 'success');
        })
        .catch((err) => {
          showToast(err.message || "Failed to create sub admin", 'error');
        });
    } else {
      const apiPayload = mapUiToApi(form, true);
      subAdminService.updateSubAdmin(editId, apiPayload)
        .then(() => {
          fetchSubAdmins();
          closeDrawer();
          showToast('Sub Admin updated successfully!', 'success');
        })
        .catch((err) => {
          showToast(err.message || "Failed to update sub admin", 'error');
        });
    }
  }

  const handleDelete = (id) => {
    subAdminService.deleteSubAdmin(id)
      .then(() => {
        fetchSubAdmins();
        setDelId(null);
        showToast('Sub Admin deleted successfully!', 'success');
      })
      .catch((err) => {
        showToast(err.message || "Failed to delete sub admin", 'error');
        setDelId(null);
      });
  }

  const toggleStatus = (id) => {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;
    
    const promise = admin.status === 'Active'
      ? subAdminService.suspendSubAdmin(id, 'Suspended by admin')
      : subAdminService.activateSubAdmin(id);
      
    promise
      .then(() => {
        fetchSubAdmins();
        showToast('Sub Admin status updated successfully!', 'success');
      })
      .catch((err) => {
        showToast(err.message || "Failed to toggle status", 'error');
      });
  }

  const openSuperAdminEditor = () => {
    setForm({ name: superAdmin.name, email: superAdmin.email, phone: superAdmin.phone || '', role: 'Super Admin', presets: [], status: 'Active', access: [...ALL_KEYS] })
    setFormErrors({})
    setDrawer('super')
  }

  return (
    <>
      {/* ── PAGE HEADING ── */}
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-5">User Management</h3>
          <p className="font-sm color-text-paragraph-2 mb-3">
            The Super Admin has full protected access. Create sub-admin accounts and manage their page and feature access.
          </p>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: "none", backgroundColor: "revert" }} >
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><span>Users</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="section-box">
        <div className="row">
          {[
            {
              label: 'Total Users',
              value: totalCount + 1,
              icon: Users
            },
            {
              label: 'Active',
              value: activeCount + (superAdmin.status === 'Active' ? 1 : 0),
              icon: UserCheck
            },
            {
              label: 'Suspended',
              value: suspendedCount + (superAdmin.status === 'Suspended' ? 1 : 0),
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
            <h5 className="mb-0">Users</h5>
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
              <select
                className="form-control font-xs"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                aria-label="Filter by status"
                style={{ width: '150px', flexShrink: 0 }}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
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
                <tr style={{ borderBottom: '1px solid #eee' , fontWeight:700}}>
                  {['User', 'Role', 'Status', 'Last Login', 'Joined', 'Access'].map((h, i) => (
                    <th key={h}
                      style={{ padding: '12px 12px', textAlign: i === 5 ? 'center' : 'left', letterSpacing: '0.4px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f0d69b', background: '#fffaf0' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* <img src={`/assets/imgs/page/dashboard/${superAdmin.img}.png`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} /> */}
                      <div>
                        <h6>{superAdmin.name}</h6>
                        <span className="font-sm color-text-paragraph-2">{superAdmin.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="role-badge">{superAdmin.role}</span></td>
                  <td style={{ padding: '14px 12px' }}><StatusBadge status={superAdmin.status} /></td>
                  <td style={{ padding: '14px 12px', whiteSpace: 'nowrap' }}><span className="font-sm color-text-paragraph-2">{superAdmin.lastLogin}</span></td>
                  <td style={{ padding: '14px 12px', whiteSpace: 'nowrap' }}><span className="font-sm color-text-paragraph-2">{superAdmin.joined}</span></td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <div className="super-admin-actions">
                      <span className="super-admin-access"><ShieldCheck size={15} /> Full access · locked</span>
                    </div>
                  </td>
                </tr>
                {visibleAdmins.map(admin => (
                  <React.Fragment key={admin.id}>
                    <tr key={admin.id} className="hover-up"
                      style={{ borderBottom: '1px solid #f5f5f5' }}>

                      {/* Name + email */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* <img src={`/assets/imgs/page/dashboard/${admin.img}.png`} alt=""
                            style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} /> */}
                          <div>
                            <h6>{admin.name}</h6>
                            <span className="font-sm color-text-paragraph-2">{admin.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td >
                        <span className="role-badge" >
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

                {admins.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>
                      <span className="font-sm color-text-paragraph-2">No sub admins found.</span>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
            {totalCount > 0 && (
              <div className="subadmin-pagination">
                <span>Showing {(currentPage - 1) * ADMINS_PER_PAGE + 1}–{Math.min(currentPage * ADMINS_PER_PAGE, totalCount)} of {totalCount} sub admins</span>
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
          <div onClick={closeDrawer}
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
                <h5 className="mb-0">{drawer === 'create' ? 'Add New Sub Admin' : drawer === 'super' ? 'Edit Super Admin' : 'Edit Sub Admin'}</h5>
                <p className="font-xs color-text-paragraph-2 mb-0 mt-3">
                  {drawer === 'create' ? 'Fill details and assign page/feature access.' : drawer === 'super' ? 'Update account details. Page and feature access is locked.' : 'Update details and permissions.'}
                </p>
              </div>
              <button onClick={closeDrawer}
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
                    value={form.name} aria-invalid={Boolean(formErrors.name)}
                    onChange={e => {
                      setForm(f => ({ ...f, name: e.target.value }))
                      setFormErrors(errors => ({ ...errors, name: undefined }))
                    }} />
                  {formErrors.name && <p className="form-validation-error">{formErrors.name}</p>}
                </div>
                <div className="col-12 mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5"
                    style={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Email Address *
                  </label>
                  <input className="form-control" type="email" placeholder="admin@skillbridge.io"
                    value={form.email} disabled={drawer === 'edit' || drawer === 'super'}
                    aria-invalid={Boolean(formErrors.email)}
                    onChange={e => {
                      const email = e.target.value
                      setForm(f => ({ ...f, email }))
                      setFormErrors(errors => ({ ...errors, email: getEmailError(email) || undefined }))
                    }}
                    onBlur={e => setFormErrors(errors => ({ ...errors, email: getEmailError(e.target.value) || undefined }))} />
                  {formErrors.email && <p className="form-validation-error">{formErrors.email}</p>}
                </div>
                <div className="col-12 mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5"
                    style={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Phone Number *
                  </label>
                  <input className="form-control" type="tel" placeholder="98000 00000"
                    value={form.phone} inputMode="numeric" maxLength={10} pattern="[0-9]{10}"
                    aria-invalid={Boolean(formErrors.phone)}
                    onChange={e => {
                      // Keep this field numeric and limit it to one 10-digit mobile number.
                      const enteredValue = e.target.value
                      const phone = enteredValue.replace(/\D/g, '').replace(/^91(?=\d{10,}$)/, '').slice(0, 10)
                      setForm(f => ({ ...f, phone }))
                      const phoneError = /[^\d]/.test(enteredValue)
                        ? 'Phone number can contain digits only.'
                        : getPhoneError(phone)
                      setFormErrors(errors => ({ ...errors, phone: phoneError || undefined }))
                    }}
                    onBlur={e => setFormErrors(errors => ({ ...errors, phone: getPhoneError(e.target.value) || undefined }))} />
                  {formErrors.phone && <p className="form-validation-error">{formErrors.phone}</p>}
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

                  <input
                    className="form-control"
                    type="text"
                    value={drawer === 'super' ? 'Super Admin' : SUB_ADMIN_ROLE}
                    readOnly
                    aria-label="Role"
                  />
                </div>
                <div className="col-12 mb-15">
                  <label className="font-xs color-text-paragraph-2 mb-5"
                    style={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Account Status
                  </label>
                  <select className="form-control" value={form.status} disabled={drawer === 'super'}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option>Active</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>

              {/* ── Access Control ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                <p className="font-xs color-text-paragraph-2 mb-0"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                  Sidebar Tab Access
                </p>
                <button onClick={toggleAll} disabled={drawer === 'super'}
                  style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '4px 10px', cursor: drawer === 'super' ? 'not-allowed' : 'pointer', fontSize: '11px', fontWeight: 600, color: '#ffa300', opacity: drawer === 'super' ? .5 : 1 }}>
                  {ALL_KEYS.every(k => form.access.includes(k)) ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <p className="font-xs color-text-paragraph-2 mb-15">
                Turn on the tabs this sub admin should see in the sidebar. Everything else stays hidden for them — "Logout" is always visible to everyone.
              </p>

              {/* Flat list — one toggle per sidebar tab */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TABS.map(tab => {
                  const on = form.access.includes(tab.key)
                  const Icon = tab.icon
                  return (
                    <div key={tab.key} className={`permission-tab ${on ? 'is-enabled' : ''}`}
                      onClick={() => drawer !== 'super' && toggleTab(tab.key)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} strokeWidth={2.2} />
                        <span className="font-sm" style={{ fontWeight: 700, color: on ? '#122359' : '#526685' }}>
                          {tab.label}
                        </span>
                      </div>
                      <Toggle value={on} disabled={drawer === 'super'} onChange={() => toggleTab(tab.key)} />
                    </div>
                  )
                })}
              </div>

              {/* Access summary */}
              <div style={{ marginTop: '20px', padding: '12px 16px', background: '#F8FAFF', borderRadius: '8px', border: '1px solid #ffc151' }}>
                <p className="font-xs mb-0" style={{ color: '#ffa300', fontWeight: 600 }}>
                  ✓ {form.access.length} of {ALL_KEYS.length} tabs selected
                </p>
              </div>

            </div>

            {/* Drawer footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', flexShrink: 0, background: '#fff' }}>
              <button className="btn btn-default hover-up" onClick={handleSave}
                style={{ flex: 1, padding: '11px', fontSize: '14px', fontWeight: 600 }}>
                {drawer === 'create' ? '✓ Create Sub Admin' : '✓ Save Changes'}
              </button>
              <button className="btn btn-grey-small hover-up" onClick={closeDrawer}
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
        .form-validation-error { margin: 5px 0 0; color: #c62828; font-size: 11px; font-weight: 600; }
        .form-control[aria-invalid='true'] { border-color: #c62828; }
        .preset-picker { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 8px; }
        .preset-option { display: inline-flex; align-items: center; gap: 7px; min-height: 36px; padding: 0 12px; border: 1px solid #dce3ef; border-radius: 8px; background: #fff; color: #526685; font-size: 12px; font-weight: 700; cursor: pointer; transition: .2s ease; }
        .preset-option:hover { border-color: #ffa300; color: #122359; background: #fffaf1; }
        .preset-option.is-selected { border-color: #ffa300; background: #fff3dc; color: #a56600; box-shadow: 0 3px 8px rgba(255,163,0,.12); }
        .custom-role-badge { display: inline-flex; align-items: center; min-height: 36px; padding: 0 12px; border: 1px solid #ffd28a; border-radius: 8px; background: #fff8ea; color: #a56600; font-size: 12px; font-weight: 700; }
        .preset-summary { margin: 0 0 18px; color: #7182a1; font-size: 11px; }
        .permission-tab { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border: 1px solid #e0e6f0; border-radius: 12px; background: #fff; cursor: pointer; box-shadow: 0 2px 8px rgba(18,35,89,.025); transition: border-color .2s, box-shadow .2s, background .2s; }
        .permission-tab:hover { border-color: #ffa300; box-shadow: 0 8px 18px rgba(18,35,89,.06); }
        .permission-tab.is-enabled { border-color: #ffd28a; background: #fff8ea; }
        .role-badge { display: inline-flex; align-items: center; min-height: 25px; padding: 4px 10px; border: 1px solid #ffd28a; border-radius: 20px; background: #fff3dc; color: #9b5d00; font-size: 12px; font-weight: 700; line-height: 1; white-space: nowrap; }
        .super-admin-access { display: inline-flex; align-items: center; gap: 6px; min-height: 28px; padding: 4px 10px; border: 1px solid #b9d9c7; border-radius: 7px; background: #edf9f1; color: #28754a; font-size: 11px; font-weight: 700; white-space: nowrap; }
        .super-admin-actions { display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
        .access-count { display: inline-flex; align-items: center; min-height: 30px; padding: 4px 10px; border: 1px solid #ffd28a; border-radius: 7px; background: #fffaf1; color: #9b5d00; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .subadmin-pagination { padding: 15px 20px; border-top: 1px solid #edf1f6; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #7b8aa5; font-size: 12px; }
        .subadmin-pagination > div { display: flex; gap: 5px; }
        .subadmin-pagination button { height: 30px; min-width: 30px; padding: 0 9px; border: 1px solid #dce4ef; border-radius: 5px; background: #fff; color: #5f7194; font-size: 11px; font-weight: 700; }
        .subadmin-pagination button.active { color: #fff; background: #ffa300; border-color: #ffa300; }
        .subadmin-pagination button:disabled { opacity: .45; cursor: not-allowed; }
        @media (max-width: 575px) { .subadmin-pagination { align-items: flex-start; flex-direction: column; } }
      `}</style>

      {hydrated && toast.show && createPortal(
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

      <Footer />
    </>
  )
}
