'use client'

import { useState, useRef, useEffect } from 'react'
import {
  AlertTriangle, BarChart3, Briefcase, BriefcaseBusiness, Building2, Check, ChevronDown, ChevronUp,
  GraduationCap, ImageOff, ImagePlus, Lightbulb, Loader2, MapPin, MonitorCog, Plus, Save,
  Search, Trash2, Upload, UserCog, Users, X
} from 'lucide-react'
import { homepageService } from '../services/homepageService'

/* ---------------------------------- data ---------------------------------- */

const initialIndustries = [
  { id: 'retail', name: 'Retail', jobs: '1 Jobs Available', icon: '', enabled: true, showInDropdown: true },
  { id: 'manufacturing', name: 'Manufacturing', jobs: '6 Jobs Available', icon: '', enabled: true, showInDropdown: true },
  { id: 'marine', name: 'Marine & Shipping', jobs: '1 Jobs Available', icon: '', enabled: true, showInDropdown: true },
  { id: 'logistics', name: 'Logistics & Transportation', jobs: '2 Jobs Available', icon: '', enabled: true, showInDropdown: true },
  { id: 'construction', name: 'Construction & Infrastructure', jobs: '1 Jobs Available', icon: '', enabled: true, showInDropdown: false },
]

const initialStats = [
  { id: 'placed', value: '25K+', label: 'Candidates Placed', description: 'Skilled candidates successfully placed in domestic and overseas project opportunities' },
  { id: 'countries', value: '22+', label: 'Countries Overseas', description: 'Active hiring network supporting international manpower deployment programs' },
  { id: 'skilled', value: '10K+', label: 'Skilled People', description: 'Verified professionals in construction, fabrication, logistics, marine and construction' },
  { id: 'clients', value: '65+', label: 'Happy Clients', description: 'Trusted employers and recruitment partners with repeat hiring demand' },
]

const initialLocations = [
  { id: 'qatar', name: 'Qatar', image: '/assets/imgs/page/homepage1/location1.png', enabled: true, showInDropdown: true },
  { id: 'london', name: 'United Kingdom', image: '/assets/imgs/page/homepage1/location2.png', enabled: true, showInDropdown: true },
  { id: 'india', name: 'India', image: '/assets/imgs/page/homepage1/location3.png', enabled: true, showInDropdown: true },
  { id: 'uae', name: 'United Arab Emirates', image: '/assets/imgs/page/homepage1/location4.png', enabled: true, showInDropdown: false },
]

const initialRoles = [
  { id: 'warehouse', name: 'Warehouse', image: '/assets/imgs/page/homepage2/img1.png', enabled: true },
  { id: 'travel', name: 'Travel & Tourism', image: '/assets/imgs/page/homepage2/img2.png', enabled: true },
  { id: 'handling', name: 'Warehouse & Material Handling', image: '/assets/imgs/page/homepage2/img3.png', enabled: true },
  { id: 'machining', name: 'Manufacturing & Machining', image: '/assets/imgs/page/homepage2/img4.png', enabled: true },
]

const initialRegistrationIndustries = [
  { id: 'reg-agency', name: 'Recruitment agency', enabled: true },
  { id: 'reg-construction', name: 'Construction & Infrastructure', enabled: true },
  { id: 'reg-marine', name: 'Marine & Shipping', enabled: true },
  { id: 'reg-oilgas', name: 'Oil & Gas', enabled: true },
  { id: 'reg-manufacturing', name: 'Manufacturing', enabled: true },
  { id: 'reg-logistics', name: 'Logistics & Transportation', enabled: true },
  { id: 'reg-retail', name: 'Retail', enabled: false },
  { id: 'reg-it', name: 'IT Services', enabled: false },
  { id: 'reg-hospitality', name: 'Hospitality & Tourism', enabled: false },
]

const initialRegistrationBusinessCategories = [
  { id: 'cat-staffing', name: 'Staffing Agency', enabled: true },
  { id: 'cat-manpower', name: 'Manpower Supply', enabled: true },
  { id: 'cat-consultancy', name: 'HR Consultancy', enabled: true },
  { id: 'cat-direct', name: 'Direct Employer', enabled: true },
  { id: 'cat-training', name: 'Training Provider', enabled: false },
  { id: 'cat-payroll', name: 'Payroll Outsourcing', enabled: false },
]

const initialSuggestions = [
  { id: 'sugg-1', type: 'Industry', name: 'Renewable Energy', submittedBy: 'Al Noor Recruiters', date: '2026-08-01' },
  { id: 'sugg-2', type: 'Department', name: 'Operations', submittedBy: 'Prime HR Solutions', date: '2026-08-03' },
  { id: 'sugg-3', type: 'Role', name: 'Site Supervisor', submittedBy: 'Al Noor Recruiters', date: '2026-08-04' },
  { id: 'sugg-4', type: 'Industry', name: 'Renewables & Solar', submittedBy: 'GreenHire', date: '2026-08-05' },
  { id: 'sugg-5', type: 'Department', name: 'Compliance', submittedBy: 'SafeStaff', date: '2026-08-06' },
]

/* --------------------------------- helpers --------------------------------- */

function Toggle({ enabled, onChange }) {
  return (
    <>
      <button type="button" className={`homepage-toggle ${enabled ? 'is-on' : ''}`} onClick={() => onChange(!enabled)} aria-pressed={enabled}><i /></button>
      <style jsx>{`
        .homepage-toggle { width: 34px; height: 19px; border: 0; border-radius: 20px; padding: 2px; background: #d6dce7; transition: .2s; flex: 0 0 auto; }
        .homepage-toggle i { display: block; width: 15px; height: 15px; border-radius: 50%; background: #fff; transition: .2s; }
        .homepage-toggle.is-on { background: #ffa300; } .homepage-toggle.is-on i { transform: translateX(15px); }
      `}</style>
    </>
  )
}

/** Helper utility to compress and resize an existing Base64 data URL string. */
const compressAndResizeDataUrl = (dataUrl, maxWidth, maxHeight, callback) => {
  if (typeof window === 'undefined' || !dataUrl || !dataUrl.startsWith('data:image/')) {
    callback(dataUrl)
    return
  }
  if (dataUrl.length < 20000) {
    callback(dataUrl)
    return
  }
  const img = new Image()
  img.onload = () => {
    let width = img.width
    let height = img.height

    if (width > maxWidth || height > maxHeight) {
      if (width > height) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      } else {
        width = Math.round((width * maxHeight) / height)
        height = maxHeight
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)

    const isPNG = dataUrl.includes('image/png') || dataUrl.includes('image/gif')
    const outputType = isPNG ? 'image/png' : 'image/jpeg'
    const quality = isPNG ? undefined : 0.75

    const compressed = canvas.toDataURL(outputType, quality)
    callback(compressed)
  }
  img.onerror = () => {
    callback(dataUrl)
  }
  img.src = dataUrl
}

/** Helper utility to compress and resize image files before converting them to Base64 strings. */
const compressAndResizeImage = (file, maxWidth, maxHeight, callback) => {
  if (typeof window === 'undefined') return
  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        } else {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      const isPNGOrGIF = file.type === 'image/png' || file.type === 'image/gif'
      const outputType = isPNGOrGIF ? 'image/png' : 'image/jpeg'
      const quality = isPNGOrGIF ? undefined : 0.75

      const dataUrl = canvas.toDataURL(outputType, quality)
      callback(dataUrl)
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(file)
}

/** Prepend base API domain for relative image URLs like "/uploads/..." */
const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`
  return `https://jobportal.coinage.in${cleanPath}`
}

/** Image field with URL input + real file upload preview + broken-image fallback. Reused for hero background, locations, and roles. */
function ImageField({ value, onChange, onFileChange, label = 'Image URL', height = 200, showPreview = true }) {
  const fileRef = useRef(null)
  const [broken, setBroken] = useState(false)

  const onUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (onFileChange) {
      onFileChange(file)
    }
    compressAndResizeImage(file, 1200, 1200, (compressedDataUrl) => {
      onChange(compressedDataUrl)
      setBroken(false)
    })
  }

  return (
    <div className="image-field">
      {showPreview && (
        <div className="image-preview" style={{ height }}>
          {value && !broken
            ? <img src={value} alt="" onError={() => setBroken(true)} onLoad={() => setBroken(false)} />
            : <div className="image-fallback"><ImageOff size={22} /><span>No image</span></div>}
        </div>
      )}
      <label>{label}
        <input value={value} onChange={(event) => { onChange(event.target.value); setBroken(false) }} placeholder="/assets/imgs/..." />
      </label>
      <div className="image-field-actions">
        <button type="button" className="upload-btn" onClick={() => fileRef.current?.click()}><Upload size={13} />Upload image</button>
        {value && <button type="button" className="remove-btn" onClick={() => { onChange(''); if (onFileChange) onFileChange(null); setBroken(false) }}><Trash2 size={13} />Remove</button>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
      <style jsx>{`
        .image-field { display: grid; gap: 8px; }
        .image-preview { border-radius: 8px; background: #eef2f7; display: grid; place-items: center; overflow: hidden; border: 1px solid #e3eaf4; }
        .image-preview img { width: 100%; height: 100%; object-fit: cover; background: #f6f8fc; }
        .image-fallback { display: grid; justify-items: center; gap: 4px; color: #9aa9c4; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
        label { display: grid; gap: 5px; color: #667a9f; font-size: 10px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
        input { width: 100%; box-sizing: border-box; height: 33px; border: 1px solid #d6e0ee; border-radius: 6px; padding: 7px; color: #263c70; font: 11px inherit; text-transform: none; letter-spacing: 0; outline: none; }
        input:focus { border-color: #ffa300; }
        .image-field-actions { display: flex; gap: 8px; }
        .upload-btn, .remove-btn { flex: 1; border: 1px solid #d6e0ee; border-radius: 6px; padding: 7px 9px; background: #f8faff; color: #45577f; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 11px; font-weight: 700; }
        .upload-btn:hover { background: #eef3ff; }
        .remove-btn { color: #c84b4b; background: #fff1f1; border-color: #ffdada; flex: 0 0 auto; }
        .remove-btn:hover { background: #ffe6e6; }
      `}</style>
    </div>
  )
}

/** Small clickable icon uploader used on industry rows — replaces the old hard-to-read icon dropdown. */
function IconUploadField({ value, onChange }) {
  const fileRef = useRef(null)

  const onUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    compressAndResizeImage(file, 128, 128, (compressedDataUrl) => {
      onChange(compressedDataUrl)
    })
  }

  return (
    <div className="icon-upload">
      <button type="button" className="icon-upload-btn" onClick={() => fileRef.current?.click()} title="Click to upload a custom icon" aria-label="Upload icon">
        {value ? <img src={value} alt="" /> : <Briefcase size={18} />}
      </button>
      {value && <button type="button" className="icon-remove" onClick={() => onChange('')} aria-label="Remove icon"><X size={11} /></button>}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
      <style jsx>{`
        .icon-upload { position: relative; width: 44px; height: 44px; flex: 0 0 auto; }
        .icon-upload-btn { width: 44px; height: 44px; border: 1px dashed #c7d3e8; border-radius: 9px; background: #f2f6fc; color: #5270aa; display: grid; place-items: center; overflow: hidden; }
        .icon-upload-btn:hover { background: #e9f0fc; }
        .icon-upload-btn img { width: 100%; height: 100%; object-fit: cover; }
        .icon-remove { position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; border: 0; margin: 0; padding: 0; border-radius: 50%; background: #c84b4b; color: #fff; display: inline-flex; align-items: center; justify-content: center; line-height: 0; cursor: pointer; }
      `}</style>
    </div>
  )
}

/** Chip-style editor: add or remove items that appear in the candidate-facing hero search dropdown. */
function DropdownItemsEditor({ label, items, onAdd, onRemove }) {
  const [draft, setDraft] = useState('')
  const visibleItems = items.filter((item) => item.enabled && item.showInDropdown)

  const submit = () => {
    const name = draft.trim()
    if (!name) return
    onAdd(name)
    setDraft('')
  }

  return (
    <div className="dropdown-editor">
      <span className="dropdown-editor-label">{label}</span>
      <div className="chip-row">
        {visibleItems.length === 0 && <span className="chip-empty">Nothing in this dropdown yet</span>}
        {visibleItems.map((item) => (
          <span className="chip" key={item.id}>
            {item.name}
            <button type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name} from dropdown`}><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="chip-add">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Add new ${label.toLowerCase()}`}
          onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); submit() } }}
        />
        <button type="button" onClick={submit}><Plus size={14} />Add</button>
      </div>
      <style jsx>{`
        .dropdown-editor { display: grid; gap: 8px; }
        .dropdown-editor-label { display: block; color: #667a9f; font-size: 10px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
        .chip-row { display: flex; flex-wrap: wrap; gap: 6px; min-height: 30px; }
        .chip-empty { color: #9aa9c4; font-size: 11px; font-style: italic; padding: 6px 0; }
        .chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 6px 6px 11px; border-radius: 20px; background: #fff2dc; color: #7a4d00; font-size: 11px; font-weight: 700; line-height: 1; }
        .chip button { border: 0; margin: 0; padding: 0; width: 16px; height: 16px; flex: 0 0 auto; border-radius: 50%; background: rgba(122, 77, 0, .15); color: #7a4d00; display: inline-flex; align-items: center; justify-content: center; line-height: 0; cursor: pointer; }
        .chip button:hover { background: rgba(122, 77, 0, .3); }
        .chip-add { display: flex; gap: 8px; }
        .chip-add input { flex: 1; box-sizing: border-box; height: 34px; border: 1px solid #d6e0ee; border-radius: 6px; padding: 7px 9px; outline: none; color: #263c70; font: 12px inherit; }
        .chip-add input:focus { border-color: #ffa300; }
        .chip-add button { border: 0; border-radius: 6px; padding: 0 12px; background: #ffa300; color: #fff; display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; white-space: nowrap; }
      `}</style>
    </div>
  )
}

/** Reordered, capped-list editor for a registration-time dropdown (e.g. Industry Type, Business Category). Reused across the recruiter tab. */
function RegistrationDropdownSection({
  title, description, icon, items, setItems, markChanged, idPrefix, addLabel, itemLabel, sectionRef,
  onAdd, onDelete, onUpdate, onMove
}) {
  const enabledCount = items.filter((item) => item.enabled).length
  const maxItems = 10 // Default to 10 items

  const handleAdd = () => {
    if (onAdd) {
      onAdd()
    } else {
      setItems((current) => [...current, { id: `${idPrefix}-${Date.now()}`, name: `New ${itemLabel.toLowerCase()}`, enabled: true }])
      markChanged()
    }
  }

  const handleMove = (index, dir) => {
    if (onMove) {
      onMove(index, dir)
    } else {
      setItems((current) => {
        const next = [...current]
        const swapWith = index + dir
        ;[next[index], next[swapWith]] = [next[swapWith], next[index]]
        return next
      })
      markChanged()
    }
  }

  const handleUpdateName = (id, newName) => {
    if (onUpdate) {
      onUpdate(id, { name: newName })
    } else {
      setItems((current) => current.map((row) => row.id === id ? { ...row, name: newName } : row))
      markChanged()
    }
  }

  const handleToggle = (id, enabled) => {
    if (onUpdate) {
      onUpdate(id, { enabled })
    } else {
      setItems((current) => current.map((row) => row.id === id ? { ...row, enabled } : row))
      markChanged()
    }
  }

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id)
    } else {
      setItems((current) => current.filter((row) => row.id !== id))
      markChanged()
    }
  }

  return (
    <section ref={sectionRef} className="home-section registration-dropdown-section">
      <div className="section-heading">
        <span className="section-icon">{icon}</span>
        <div><h5>{title}</h5><p style={{ color: "#66789c" }}>{description}</p></div>
        <button type="button" className="add-item" onClick={handleAdd}><Plus size={15} />{addLabel}</button>
      </div>

      <div className="registration-settings">
        <p className={`dropdown-hint ${enabledCount > maxItems ? 'is-over' : ''}`}>
          {enabledCount} of {maxItems} slots used — enabled items are listed top to bottom in this order in the registration dropdown
        </p>
      </div>

      <div className="registration-list">
        {items.map((item, index) => (
          <div className="registration-row" key={item.id}>
            <div className="reorder-controls">
              <button type="button" disabled={index === 0} onClick={() => handleMove(index, -1)} aria-label="Move up"><ChevronUp size={13} /></button>
              <button type="button" disabled={index === items.length - 1} onClick={() => handleMove(index, 1)} aria-label="Move down"><ChevronDown size={13} /></button>
            </div>
            <span className="reg-index">{index + 1}</span>
            <input className="reg-name-input" aria-label={`${itemLabel} name`} value={item.name} onChange={(event) => handleUpdateName(item.id, event.target.value)} />
            <div className="row-actions">
              <span>{item.enabled ? 'Shown' : 'Hidden'}</span><Toggle enabled={item.enabled} onChange={(enabled) => handleToggle(item.id, enabled)} />
              <button type="button" className="delete-item" onClick={() => handleDelete(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .home-section { overflow: hidden; border: 1px solid #e1e8f3; border-radius: 13px; background: #fff; box-shadow: 0 7px 21px rgba(27, 52, 102, .04); }
        .section-heading { min-height: 60px; padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; }
        .section-heading > div { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .section-heading h5 { margin: 0; color: #172b60; font-size: 15px; font-weight: 800; } .section-heading p { margin: 0; color: #71809f; font-size: 12px; opacity: .95; }
        .section-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; flex: 0 0 auto; }
        .add-item { margin-left: auto; padding: 8px 10px; border: 1px solid #ffd28a; border-radius: 6px; background: #fff8ea; color: #ac6d00; display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 800; white-space: nowrap; }
        label { display: grid; gap: 5px; color: #667a9f; font-size: 10px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
        input { width: 100%; box-sizing: border-box; height: 36px; border: 1px solid #d6e0ee; border-radius: 6px; padding: 9px 10px; outline: none; color: #263c70; font: 12px/1.4 inherit; text-transform: none; letter-spacing: 0; background: #fff; }
        input:focus { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255, 163, 0, .09); }
        .dropdown-hint { margin: 0; font-size: 11px; font-weight: 700; color: #4b7a4f; background: #eef8ef; border: 1px solid #d7ecd9; border-radius: 6px; padding: 8px 10px; }
        .dropdown-hint.is-over { color: #a13f3f; background: #fdefef; border-color: #f3d3d3; }
        .registration-settings { padding: 18px 21px; border-bottom: 1px solid #edf1f6; }
        .registration-list { padding: 4px 21px 10px; max-height: 360px; overflow-y: auto; }
        .registration-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid #edf1f6; }
        .registration-row:last-child { border-bottom: 0; }
        .reorder-controls { display: flex; flex-direction: column; gap: 1px; flex: 0 0 auto; }
        .reorder-controls button { border: 1px solid #e3eaf4; background: #f8faff; border-radius: 4px; padding: 1px; color: #5270aa; display: grid; place-items: center; }
        .reorder-controls button:disabled { opacity: .35; }
        .reg-index { flex: 0 0 auto; width: 16px; color: #9aa9c4; font-size: 11px; font-weight: 800; text-align: center; }
        .reg-name-input { flex: 1; height: 32px; box-sizing: border-box; border: 1px solid #d6e0ee; border-radius: 6px; padding: 0 10px; outline: none; color: #263c70; font: 12px inherit; }
        .reg-name-input:focus { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255, 163, 0, .09); }
        .row-actions { min-height: auto; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex: 0 0 auto; } .row-actions > span { color: #6e809e; font-size: 10px; font-weight: 700; }
        .delete-item { border: 0; color: #c84b4b; background: #fff1f1; border-radius: 6px; padding: 7px; display: inline-flex; align-items: center; }
        @media (max-width: 760px) {
          .section-heading { align-items: flex-start; flex-wrap: wrap; } .add-item { margin-left: 0; }
          .registration-settings { grid-template-columns: 1fr; }
          .registration-row { flex-wrap: wrap; } .registration-row .row-actions { width: 100%; margin-left: 26px; }
        }
      `}</style>
    </section>
  )
}

/* --------------------------------- main --------------------------------- */

export default function HomePageManagement() {
  const [activeTab, setActiveTab] = useState('candidate') // 'candidate' | 'recruiter'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [bannerFile, setBannerFile] = useState(null)

  const [hero, setHero] = useState({
    heroId: '',
    title: 'India\'s #1 Global Job Portal for Skilled Workers',
    subtitle: 'Find verified opportunities across India, UAE, Saudi Arabia, Qatar, and Singapore for technicians, engineers, drivers, construction professionals, marine staff, and skilled workers.',
    background: '/assets/imgs/page/homepage1/banner1.png',
    industryPlaceholder: 'Trade Category',
    locationPlaceholder: 'Location',
    searchPlaceholder: 'Search by job title, skill or company',
    ctaText: '',
    ctaLink: '',
  })
  const [industries, setIndustries] = useState([])
  const [deletedIndustryIds, setDeletedIndustryIds] = useState([])
  const [stats, setStats] = useState([])
  const [locations, setLocations] = useState([])
  const [originalLocations, setOriginalLocations] = useState([])
  const [deletedLocationIds, setDeletedLocationIds] = useState([])
  const [locationFiles, setLocationFiles] = useState({})
  const [roles, setRoles] = useState([])
  const [originalRoles, setOriginalRoles] = useState([])
  const [deletedRoleIds, setDeletedRoleIds] = useState([])
  const [roleFiles, setRoleFiles] = useState({})

  const [registrationIndustries, setRegistrationIndustries] = useState([])
  const [originalRegistrationIndustries, setOriginalRegistrationIndustries] = useState([])
  const [deletedRegIndustryIds, setDeletedRegIndustryIds] = useState([])
  const [departments, setDepartments] = useState([])
  const [originalDepartments, setOriginalDepartments] = useState([])
  const [deletedDepartmentIds, setDeletedDepartmentIds] = useState([])
  const [tradeCategories, setTradeCategories] = useState([])
  const [originalTradeCategories, setOriginalTradeCategories] = useState([])
  const [deletedTradeCategoryIds, setDeletedTradeCategoryIds] = useState([])
  const [suggestions, setSuggestions] = useState([])

  const leftSectionRef = useRef(null)
  const suggestionsPanelRef = useRef(null)

  const [saved, setSaved] = useState(false)

  const fetchPageData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [heroData, industriesData, statsData, locationsData, rolesData, regIndustriesData, departmentsData, tradeCategoriesData, suggestionsData] = await Promise.all([
        homepageService.getHero(),
        homepageService.getIndustries(),
        homepageService.getStats(),
        homepageService.getLocations(),
        homepageService.getRoles(),
        homepageService.getRegistrationIndustries(),
        homepageService.getDepartments(),
        homepageService.getTradeCategories(),
        homepageService.getSuggestions()
      ])

      if (heroData) {
        setHero(prev => ({
          ...prev,
          heroId: heroData.heroId || '',
          title: (heroData.headline || '').slice(0, 100),
          subtitle: (heroData.subheadline || '').slice(0, 250),
          background: getImageUrl(heroData.bannerImageUrl) || '/assets/imgs/page/homepage1/banner1.png',
          searchPlaceholder: heroData.searchPlaceholder || '',
          ctaText: heroData.ctaText || '',
          ctaLink: heroData.ctaLink || '',
        }))
      }

      if (industriesData && Array.isArray(industriesData)) {
        setIndustries(industriesData.map(item => ({
          id: String(item.industryId),
          name: item.name || '',
          jobs: item.jobCountOverride || 0,
          icon: getImageUrl(item.iconUrl),
          enabled: item.isActive !== false,
          showInDropdown: item.showInDropdown !== false
        })))
      }

      if (statsData && statsData.items && Array.isArray(statsData.items)) {
        setStats(statsData.items.map((item, idx) => ({
          id: String(item.id || `stat-${idx}-${Date.now()}`),
          value: item.value || '',
          suffix: item.suffix || '',
          label: item.label || '',
          iconSlug: item.iconSlug || '',
          displayOrder: item.displayOrder || 0
        })))
      }

      if (locationsData && Array.isArray(locationsData)) {
        const mapped = locationsData.map(item => ({
          id: String(item.locationId),
          name: item.name || '',
          image: getImageUrl(item.imageUrl),
          enabled: item.isActive !== false,
          showInDropdown: item.showInDropdown !== false
        }))
        setLocations(mapped)
        setOriginalLocations(JSON.parse(JSON.stringify(mapped)))
      }

      if (rolesData && Array.isArray(rolesData)) {
        const mapped = rolesData.map(item => ({
          id: String(item.roleId),
          name: item.name || '',
          image: getImageUrl(item.iconUrl),
          enabled: item.isActive !== false
        }))
        setRoles(mapped)
        setOriginalRoles(JSON.parse(JSON.stringify(mapped)))
      }

      if (regIndustriesData && Array.isArray(regIndustriesData)) {
        const mapped = regIndustriesData.map(item => ({
          id: String(item.id),
          name: item.name || '',
          enabled: item.isActive !== false
        }))
        setRegistrationIndustries(mapped)
        setOriginalRegistrationIndustries(JSON.parse(JSON.stringify(mapped)))
      }

      if (departmentsData && Array.isArray(departmentsData)) {
        const mapped = departmentsData.map(item => ({
          id: String(item.id),
          name: item.name || '',
          enabled: item.isActive !== false
        }))
        setDepartments(mapped)
        setOriginalDepartments(JSON.parse(JSON.stringify(mapped)))
      }

      if (tradeCategoriesData && Array.isArray(tradeCategoriesData)) {
        const mapped = tradeCategoriesData.map(item => ({
          id: String(item.id),
          name: item.name || '',
          enabled: item.isActive !== false
        }))
        setTradeCategories(mapped)
        setOriginalTradeCategories(JSON.parse(JSON.stringify(mapped)))
      }

      if (suggestionsData && Array.isArray(suggestionsData)) {
        setSuggestions(suggestionsData
          .filter(item => !item.reviewedAt)
          .map(item => {
            let mappedType = '';
            if (item.type === 3 || item.type === '3') mappedType = 'Industry';
            else if (item.type === 4 || item.type === '4') mappedType = 'Department';
            else if (item.type === 5 || item.type === '5') mappedType = 'Role';
            else mappedType = item.type || '';

            return {
              id: item.suggestionId || item.id,
              name: item.suggestedName || item.name || '',
              type: mappedType,
              submittedBy: item.submittedByName || item.submittedBy || item.submittedByCompany || item.userName || item.submittedByEmail || 'Recruiter',
              submittedByEmail: item.submittedByEmail || '',
              date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent')
            };
          })
        )
      }
    } catch (err) {
      console.error('Failed to fetch homepage details:', err)
      setError('Failed to load page configurations from the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPageData()
  }, [])

  const updateCollection = (setter, id, changes) => setter((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item))
  const removeItem = (setter, id) => setter((items) => items.filter((item) => item.id !== id))
  
  const removeIndustry = (id) => {
    if (id && !String(id).startsWith('industry-')) {
      setDeletedIndustryIds(prev => [...prev, id])
    }
    setIndustries((items) => items.filter((item) => item.id !== id))
    markChanged()
  }

  const updateIndustry = (id, changes) => {
    setIndustries((current) => current.map((item) => {
      if (item.id === id) {
        if (id && !String(id).startsWith('industry-')) {
          return { ...item, ...changes, isModified: true }
        }
        return { ...item, ...changes }
      }
      return item
    }))
    markChanged()
  }

  const removeLocation = (id) => {
    if (originalLocations.some(o => o.id === id)) {
      setDeletedLocationIds(prev => [...prev, id])
    }
    setLocationFiles(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setLocations((items) => items.filter((item) => item.id !== id))
    markChanged()
  }

  const updateLocation = (id, changes) => {
    setLocations((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
    markChanged()
  }

  const removeRole = (id) => {
    if (originalRoles.some(o => o.id === id)) {
      setDeletedRoleIds(prev => [...prev, id])
    }
    setRoleFiles(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setRoles((items) => items.filter((item) => item.id !== id))
    markChanged()
  }

  const updateRole = (id, changes) => {
    setRoles((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
    markChanged()
  }

  const removeRegIndustry = (id) => {
    if (originalRegistrationIndustries.some(o => o.id === id)) {
      setDeletedRegIndustryIds(prev => [...prev, id])
    }
    setRegistrationIndustries((items) => items.filter((item) => item.id !== id))
    markChanged()
  }

  const updateRegIndustry = (id, changes) => {
    setRegistrationIndustries((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
    markChanged()
  }

  const moveRegIndustry = (index, dir) => {
    setRegistrationIndustries((current) => {
      const next = [...current]
      const swapWith = index + dir
      ;[next[index], next[swapWith]] = [next[swapWith], next[index]]
      return next
    })
    markChanged()
  }

  const removeDepartment = (id) => {
    if (originalDepartments.some(o => o.id === id)) {
      setDeletedDepartmentIds(prev => [...prev, id])
    }
    setDepartments((items) => items.filter((item) => item.id !== id))
    markChanged()
  }

  const updateDepartment = (id, changes) => {
    setDepartments((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
    markChanged()
  }

  const moveDepartment = (index, dir) => {
    setDepartments((current) => {
      const next = [...current]
      const swapWith = index + dir
      ;[next[index], next[swapWith]] = [next[swapWith], next[index]]
      return next
    })
    markChanged()
  }

  const removeTradeCategory = (id) => {
    if (originalTradeCategories.some(o => o.id === id)) {
      setDeletedTradeCategoryIds(prev => [...prev, id])
    }
    setTradeCategories((items) => items.filter((item) => item.id !== id))
    markChanged()
  }

  const updateTradeCategory = (id, changes) => {
    setTradeCategories((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
    markChanged()
  }

  const moveTradeCategory = (index, dir) => {
    setTradeCategories((current) => {
      const next = [...current]
      const swapWith = index + dir
      ;[next[index], next[swapWith]] = [next[swapWith], next[index]]
      return next
    })
    markChanged()
  }

  const newId = (prefix) => `${prefix}-${Date.now()}`
  const markChanged = () => setSaved(false)
  
  const save = async () => {
    if ((hero.title || '').length > 100) {
      setError('Hero title cannot exceed 100 characters.')
      setTimeout(() => setError(null), 5000)
      return
    }
    if ((hero.subtitle || '').length > 250) {
      setError('Supporting text cannot exceed 250 characters.')
      setTimeout(() => setError(null), 5000)
      return
    }

    if (industries.some(ind => !ind.name || !ind.name.trim())) {
      setError('Industry names cannot be empty.')
      setTimeout(() => setError(null), 5000)
      return
    }

    if (locations.some(loc => !loc.name || !loc.name.trim())) {
      setError('Location names cannot be empty.')
      setTimeout(() => setError(null), 5000)
      return
    }

    if (roles.some(role => !role.name || !role.name.trim())) {
      setError('Role names cannot be empty.')
      setTimeout(() => setError(null), 5000)
      return
    }

    if (registrationIndustries.some(item => !item.name || !item.name.trim())) {
      setError('Registration industry names cannot be empty.')
      setTimeout(() => setError(null), 5000)
      return
    }

    if (departments.some(item => !item.name || !item.name.trim())) {
      setError('Department names cannot be empty.')
      setTimeout(() => setError(null), 5000)
      return
    }

    if (tradeCategories.some(item => !item.name || !item.name.trim())) {
      setError('Trade category names cannot be empty.')
      setTimeout(() => setError(null), 5000)
      return
    }
    setSaving(true)
    setError(null)
    setSuccessMessage('')
    try {
      // Automatically check for any industry with a bloated icon (>20KB base64) and compress it, marking it as modified
      const processedIndustries = await Promise.all(industries.map(async (ind) => {
        if (ind.icon && ind.icon.startsWith('data:image/') && ind.icon.length > 20000) {
          const compressedIcon = await new Promise((resolve) => {
            compressAndResizeDataUrl(ind.icon, 128, 128, resolve)
          })
          return { ...ind, icon: compressedIcon, isModified: true }
        }
        return ind
      }))

      // Automatically check for any role with a bloated icon (>20KB base64) and compress it, marking it as modified
      const processedRoles = await Promise.all(roles.map(async (r) => {
        if (r.image && r.image.startsWith('data:image/') && r.image.length > 20000) {
          const compressedImage = await new Promise((resolve) => {
            compressAndResizeDataUrl(r.image, 128, 128, resolve)
          })
          return { ...r, image: compressedImage, isModified: true }
        }
        return r
      }))

      // 1. Update Hero
      await homepageService.updateHero({
        headline: hero.title,
        subheadline: hero.subtitle,
        searchPlaceholder: hero.searchPlaceholder,
        ctaText: hero.ctaText || null,
        ctaLink: hero.ctaLink || null
      })

      // 2. Delete removed items (including modified old industries that will be recreated, ignoring errors like 404 or constraint issues)
      const modifiedIndustryIds = processedIndustries.filter(ind => !String(ind.id).startsWith('industry-') && ind.isModified).map(ind => ind.id)
      const allDeletedIndustryIds = [...deletedIndustryIds, ...modifiedIndustryIds]
      const failedDeletions = []

      const deletePromises = allDeletedIndustryIds.map(id => homepageService.deleteIndustry(id).catch(err => {
        const item = processedIndustries.find(o => String(o.id) === String(id))
        const name = item ? item.name : id
        console.warn(`Failed to delete industry ${name}:`, err)
        failedDeletions.push(`Industry "${name}"`)
        return Promise.resolve()
      }))
      
      const deleteLocPromises = deletedLocationIds.map(id => homepageService.deleteLocation(id).catch(err => {
        const item = originalLocations.find(o => String(o.id) === String(id))
        const name = item ? item.name : id
        console.warn(`Failed to delete location ${name}:`, err)
        failedDeletions.push(`Location "${name}"`)
        return Promise.resolve()
      }))
      const deleteRolePromises = deletedRoleIds.map(id => homepageService.deleteRole(id).catch(err => {
        const item = originalRoles.find(o => String(o.id) === String(id))
        const name = item ? item.name : id
        console.warn(`Failed to delete role ${name}:`, err)
        failedDeletions.push(`Role "${name}"`)
        return Promise.resolve()
      }))
      const deleteRegIndustryPromises = deletedRegIndustryIds.map(id => homepageService.deleteRegistrationIndustry(id).catch(err => {
        const item = originalRegistrationIndustries.find(o => String(o.id) === String(id))
        const name = item ? item.name : id
        console.warn(`Failed to delete registration industry ${name}:`, err)
        failedDeletions.push(`Registration Industry "${name}"`)
        return Promise.resolve()
      }))
      const deleteDepartmentPromises = deletedDepartmentIds.map(id => homepageService.deleteDepartment(id).catch(err => {
        const item = originalDepartments.find(o => String(o.id) === String(id))
        const name = item ? item.name : id
        console.warn(`Failed to delete department ${name}:`, err)
        failedDeletions.push(`Department "${name}"`)
        return Promise.resolve()
      }))
      const deleteTradeCategoryPromises = deletedTradeCategoryIds.map(id => homepageService.deleteTradeCategory(id).catch(err => {
        const item = originalTradeCategories.find(o => String(o.id) === String(id))
        const name = item ? item.name : id
        console.warn(`Failed to delete trade category ${name}:`, err)
        failedDeletions.push(`Trade category "${name}"`)
        return Promise.resolve()
      }))

      // 3. Save industries (only new/modified ones)
      const savePromises = processedIndustries
        .filter(ind => (ind.id && ind.id.startsWith('industry-')) || ind.isModified)
        .map(ind => {
          const payload = {
            name: ind.name,
            iconUrl: ind.icon || '',
            jobCountOverride: parseInt(ind.jobs, 10) || 0,
            showInDropdown: ind.showInDropdown !== false
          }
          return homepageService.saveIndustry(payload)
        })

      // 4. Save existing locations (PUT updates)
      const saveLocPromises = locations
        .filter(loc => loc.id && !loc.id.startsWith('location-'))
        .map((loc, index) => {
          const payload = {
            name: loc.name,
            country: loc.name,
            jobCountOverride: 0,
            displayOrder: index,
            showInDropdown: loc.showInDropdown !== false
          }
          return homepageService.updateLocation(loc.id, payload)
        })

      // 5. Save existing roles (PUT updates)
      const updateRolePromises = processedRoles
        .filter(r => r.id && !r.id.startsWith('role-'))
        .map((r, index) => {
          const payload = {
            name: r.name,
            iconUrl: r.image || '',
            jobCountOverride: 0,
            displayOrder: index
          }
          return homepageService.updateRole(r.id, payload)
        })

      // 6. Save existing registration industries (PUT updates)
      const updateRegIndustryPromises = registrationIndustries
        .filter(item => item.id && !item.id.startsWith('reg-'))
        .map((item, index) => {
          const payload = {
            name: item.name,
            displayOrder: index
          }
          return homepageService.updateRegistrationIndustry(item.id, payload)
        })

      // 7. Save existing departments (PUT updates)
      const updateDepartmentPromises = departments
        .filter(item => item.id && !item.id.startsWith('dep-'))
        .map((item, index) => {
          const payload = {
            name: item.name,
            displayOrder: index
          }
          return homepageService.updateDepartment(item.id, payload)
        })

      // 8. Save existing trade categories (PUT updates)
      const updateTradeCategoryPromises = tradeCategories
        .filter(item => item.id && !item.id.startsWith('trade-'))
        .map((item, index) => {
          const payload = {
            name: item.name,
            displayOrder: index
          }
          return homepageService.updateTradeCategory(item.id, payload)
        })

      // 9. Save stats
      const statsPayload = {
        items: stats.map((stat, index) => ({
          label: stat.label || '',
          value: stat.value || '',
          suffix: stat.suffix || '',
          iconSlug: stat.iconSlug || '',
          displayOrder: index
        }))
      }

      // Execute primary updates and deletes in parallel
      await Promise.all([
        ...deletePromises,
        ...deleteLocPromises,
        ...deleteRolePromises,
        ...deleteRegIndustryPromises,
        ...deleteDepartmentPromises,
        ...deleteTradeCategoryPromises,
        ...savePromises,
        ...saveLocPromises,
        ...updateRolePromises,
        ...updateRegIndustryPromises,
        ...updateDepartmentPromises,
        ...updateTradeCategoryPromises,
        homepageService.updateStats(statsPayload)
      ])

      // 9. Save new locations (POST create sequentially or in parallel, uploading image files once UUIDs are returned)
      const newLocs = locations.filter(loc => loc.id && loc.id.startsWith('location-'))
      const createNewLocsPromises = newLocs.map(async (loc) => {
        const payload = {
          name: loc.name,
          country: loc.name,
          jobCountOverride: 0,
          showInDropdown: loc.showInDropdown !== false
        }
        const response = await homepageService.createLocation(payload)
        const realId = response.locationId
        if (locationFiles[loc.id]) {
          await homepageService.uploadLocationImage(realId, locationFiles[loc.id])
        }
        if (!loc.enabled) {
          await homepageService.toggleLocation(realId)
        }
      })

      // 10. Save new roles (POST create sequentially or in parallel, uploading image files once UUIDs are returned)
      const newRoles = processedRoles.filter(r => r.id && r.id.startsWith('role-'))
      const createNewRolesPromises = newRoles.map(async (r) => {
        const payload = {
          name: r.name,
          iconUrl: '',
          jobCountOverride: 0
        }
        const response = await homepageService.createRole(payload)
        const realId = response.roleId
        if (roleFiles[r.id]) {
          await homepageService.uploadRoleImage(realId, roleFiles[r.id])
        }
        if (!r.enabled) {
          await homepageService.toggleRole(realId)
        }
      })

      // 11. Save new registration industries (POST create)
      const newRegIndustries = registrationIndustries.filter(item => item.id && item.id.startsWith('reg-'))
      const createNewRegIndustryPromises = newRegIndustries.map(async (item) => {
        const payload = {
          name: item.name
        }
        const response = await homepageService.createRegistrationIndustry(payload)
        const realId = response.id
        if (!item.enabled) {
          await homepageService.toggleRegistrationIndustry(realId)
        }
      })

      // 12. Save new departments (POST create)
      const newDepartments = departments.filter(item => item.id && item.id.startsWith('dep-'))
      const createNewDepartmentPromises = newDepartments.map(async (item) => {
        const payload = {
          name: item.name
        }
        const response = await homepageService.createDepartment(payload)
        const realId = response.id
        if (!item.enabled) {
          await homepageService.toggleDepartment(realId)
        }
      })

      // 13. Save new trade categories (POST create)
      const newTradeCategories = tradeCategories.filter(item => item.id && item.id.startsWith('trade-'))
      const createNewTradeCategoryPromises = newTradeCategories.map(async (item) => {
        const payload = {
          name: item.name
        }
        const response = await homepageService.createTradeCategory(payload)
        const realId = response.id
        if (!item.enabled) {
          await homepageService.toggleTradeCategory(realId)
        }
      })

      await Promise.all([
        ...createNewLocsPromises,
        ...createNewRolesPromises,
        ...createNewRegIndustryPromises,
        ...createNewDepartmentPromises,
        ...createNewTradeCategoryPromises
      ])

      // 14. Secondary operations (banner upload, location image uploads, existing role uploads/toggles)
      const uploadBannerPromise = bannerFile ? homepageService.uploadHeroBanner(bannerFile) : Promise.resolve()
      
      const uploadExistingLocImagePromises = Object.entries(locationFiles)
        .filter(([id]) => !id.startsWith('location-'))
        .map(([id, file]) => {
          if (file) {
            return homepageService.uploadLocationImage(id, file)
          }
          return Promise.resolve()
        })

      const uploadExistingRoleImagePromises = Object.entries(roleFiles)
        .filter(([id]) => !id.startsWith('role-'))
        .map(([id, file]) => {
          if (file) {
            return homepageService.uploadRoleImage(id, file)
          }
          return Promise.resolve()
        })

      const toggleLocPromises = locations
        .filter(loc => {
          if (loc.id.startsWith('location-')) return false
          const original = originalLocations.find(o => o.id === loc.id)
          if (original) {
            return loc.enabled !== original.enabled
          }
          return !loc.enabled
        })
        .map(loc => homepageService.toggleLocation(loc.id))

      const toggleRolePromises = roles
        .filter(r => {
          if (r.id.startsWith('role-')) return false
          const original = originalRoles.find(o => o.id === r.id)
          if (original) {
            return r.enabled !== original.enabled
          }
          return !r.enabled
        })
        .map(r => homepageService.toggleRole(r.id))

      const toggleRegIndustryPromises = registrationIndustries
        .filter(item => {
          if (item.id.startsWith('reg-')) return false
          const original = originalRegistrationIndustries.find(o => o.id === item.id)
          if (original) {
            return item.enabled !== original.enabled
          }
          return !item.enabled
        })
        .map(item => homepageService.toggleRegistrationIndustry(item.id))

      const toggleDepartmentPromises = departments
        .filter(item => {
          if (item.id.startsWith('dep-')) return false
          const original = originalDepartments.find(o => o.id === item.id)
          if (original) {
            return item.enabled !== original.enabled
          }
          return !item.enabled
        })
        .map(item => homepageService.toggleDepartment(item.id))

      const toggleTradeCategoryPromises = tradeCategories
        .filter(item => {
          if (item.id.startsWith('trade-')) return false
          const original = originalTradeCategories.find(o => o.id === item.id)
          if (original) {
            return item.enabled !== original.enabled
          }
          return !item.enabled
        })
        .map(item => homepageService.toggleTradeCategory(item.id))

      await Promise.all([
        uploadBannerPromise,
        ...uploadExistingLocImagePromises,
        ...uploadExistingRoleImagePromises,
        ...toggleLocPromises,
        ...toggleRolePromises,
        ...toggleRegIndustryPromises,
        ...toggleDepartmentPromises,
        ...toggleTradeCategoryPromises
      ])

      setBannerFile(null)
      setLocationFiles({})
      setRoleFiles({})
      setDeletedIndustryIds([])
      setDeletedLocationIds([])
      setDeletedRoleIds([])
      setDeletedRegIndustryIds([])
      setDeletedDepartmentIds([])
      setDeletedTradeCategoryIds([])
      setSaved(true)
      if (failedDeletions.length > 0) {
        setError(`Saved other changes, but failed to delete: ${failedDeletions.join(', ')}. These items might be in use by recruiters, candidates, or jobs.`)
        setTimeout(() => setError(null), 10000)
      } else {
        setSuccessMessage('Homepage settings saved successfully.')
        setTimeout(() => setSuccessMessage(''), 5000)
      }
      
      // Reload to get any updated image URLs/timestamps
      await fetchPageData()
    } catch (err) {
      console.error('Failed to save homepage settings:', err)
      setError(err.message || 'Failed to save changes. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const addIndustryToDropdown = (name) => {
    setIndustries((items) => [...items, { id: newId('industry'), name, jobs: 0, icon: '', enabled: true, showInDropdown: true }])
    markChanged()
  }
  const addLocationToDropdown = (name) => {
    setLocations((items) => [...items, { id: newId('location'), name, image: '', enabled: true, showInDropdown: true }])
    markChanged()
  }

  const approveSuggestion = async (suggestion) => {
    try {
      await homepageService.approveSuggestion(suggestion.id, {
        adminNote: 'Approved via Admin Panel',
        addToList: true
      })
      // map suggestion types to the correct recruiter dropdown (Department / Industry / Role)
      if (suggestion.type === 'Department') {
        setDepartments((items) => [...items, { id: newId('dep'), name: suggestion.name, enabled: true }])
      } else if (suggestion.type === 'Role' || suggestion.type === 'Trade' || suggestion.type === 'Trade category' || suggestion.type === 'Role category') {
        setTradeCategories((items) => [...items, { id: newId('trade'), name: suggestion.name, enabled: true }])
      } else if (suggestion.type === 'Industry') {
        setRegistrationIndustries((items) => [...items, { id: newId('reg'), name: suggestion.name, enabled: true }])
      }
      setSuggestions((items) => items.filter((item) => item.id !== suggestion.id))
    } catch (err) {
      console.error('Failed to approve suggestion:', err)
      setError('Failed to approve suggestion on the server.')
    }
  }
  const rejectSuggestion = async (id) => {
    try {
      await homepageService.rejectSuggestion(id, {
        adminNote: 'Rejected via Admin Panel',
        addToList: false
      })
      setSuggestions((items) => items.filter((item) => item.id !== id))
    } catch (err) {
      console.error('Failed to reject suggestion:', err)
      setError('Failed to reject suggestion on the server.')
    }
  }

  // Sync heights between dropdown and suggestions
  useEffect(() => {
    const syncHeights = () => {
      const left = leftSectionRef.current
      const right = suggestionsPanelRef.current
      if (!left || !right) return
      
      // Get the actual height of the left section
      const leftHeight = left.offsetHeight
      
      // Set the right section to match
      right.style.height = `${leftHeight}px`
    }
    
    // Run after render with a small delay to ensure DOM is painted
    const timeoutId = setTimeout(syncHeights, 100)
    
    // Also sync on resize
    window.addEventListener('resize', syncHeights)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', syncHeights)
    }
  }, [registrationIndustries, suggestions]) // Re-run when items change

  if (loading) {
    return (
      <div className="homepage-loading-container">
        <Loader2 size={40} className="animate-spin" />
        <p>Loading homepage configuration...</p>
        <style jsx>{`
          .homepage-loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
            color: #5a6c8f;
            font-size: 14px;
            font-weight: 600;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
            color: #ffa300;
          }
        `}</style>
      </div>
    )
  }

  return (
    <section className="homepage-manager">
      {successMessage && (
        <div className="homepage-toast success-toast">
          <Check size={18} />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="homepage-toast error-toast">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      <div className="homepage-manager-bar">
        <div>
          <span>{activeTab === 'candidate' ? 'Candidate website' : 'Recruiter / Employer'}</span>
          <h4>{activeTab === 'candidate' ? 'Home Page Management' : 'Recruiter Registration Management'}</h4>
          <p style={{ fontSize: '13px', color: '#66789c' }}>
            {activeTab === 'candidate'
              ? 'Control the content and cards shown to candidates on the public home page.'
              : 'Control the dropdown options shown to recruiters during employer registration.'}
          </p>
        </div>
        <button type="button" className="homepage-save" onClick={save} disabled={saving}>
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin-icon" style={{ marginRight: 6 }} />
              Saving changes...
            </>
          ) : (
            <>
              <Save size={16} />
              {saved ? 'Changes saved' : 'Save changes'}
            </>
          )}
        </button>
      </div>

      <div className="tab-switch" role="tablist">
        <button type="button" role="tab" aria-selected={activeTab === 'candidate'} className={activeTab === 'candidate' ? 'is-active' : ''} onClick={() => setActiveTab('candidate')}>
          <Users size={15} />Candidate
        </button>
        <button type="button" role="tab" aria-selected={activeTab === 'recruiter'} className={activeTab === 'recruiter' ? 'is-active' : ''} onClick={() => setActiveTab('recruiter')}>
          <UserCog size={15} />Recruiter
        </button>
      </div>

      {activeTab === 'candidate' && (
        <>
          <section className="home-section hero-manager">
            <div className="section-heading"><span className="section-icon"><MonitorCog size={19} /></span><div><h4 style={{fontSize:"20px"}}>Hero section</h4><p style={{color:"#66789c"}}>Set the first message, background image, and search controls.</p></div></div>
            <div className="hero-editor-grid">
              <div className="hero-fields">
                <label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span >Hero title</span>
                    <span style={{ fontSize: '10px', color: (hero.title || '').length >= 100 ? '#de4343' : '#64748b', textTransform: 'none', fontWeight: '600' }}>
                      {(hero.title || '').length} / 100 characters
                    </span>
                  </div>
                  <textarea 
                    value={hero.title} 
                    rows={3} 
                    maxLength={100} 
                    disabled={saving} 
                    onChange={(event) => { setHero({ ...hero, title: event.target.value.slice(0, 100) }); markChanged() }} 
                  />
                </label>
                <label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Supporting text</span>
                    <span style={{ fontSize: '10px', color: (hero.subtitle || '').length >= 250 ? '#de4343' : '#64748b', textTransform: 'none', fontWeight: '600' }}>
                      {(hero.subtitle || '').length} / 250 characters
                    </span>
                  </div>
                  <textarea 
                    value={hero.subtitle} 
                    rows={3} 
                    maxLength={250} 
                    disabled={saving} 
                    onChange={(event) => { setHero({ ...hero, subtitle: event.target.value.slice(0, 250) }); markChanged() }} 
                  />
                </label>
                <ImageField
                  label="Hero background image"
                  value={hero.background}
                  onChange={(value) => { setHero({ ...hero, background: value }); markChanged() }}
                  onFileChange={(file) => { setBannerFile(file); markChanged() }}
                  showPreview={false}
                />
                <label>Search box placeholder<input value={hero.searchPlaceholder} disabled={saving} onChange={(event) => { setHero({ ...hero, searchPlaceholder: event.target.value }); markChanged() }} /></label>
                <div className="search-field-grid">
                  <label>CTA Button Text (Optional)<input value={hero.ctaText} disabled={saving} placeholder="e.g. Learn More" onChange={(event) => { setHero({ ...hero, ctaText: event.target.value }); markChanged() }} /></label>
                  <label>CTA Button Link (Optional)<input value={hero.ctaLink} disabled={saving} placeholder="e.g. /about" onChange={(event) => { setHero({ ...hero, ctaLink: event.target.value }); markChanged() }} /></label>
                </div>
                <div className="search-field-grid">
                  <label>Industry dropdown label<input value={hero.industryPlaceholder} disabled={saving} onChange={(event) => { setHero({ ...hero, industryPlaceholder: event.target.value }); markChanged() }} /></label>
                  <label>Location dropdown label<input value={hero.locationPlaceholder} disabled={saving} onChange={(event) => { setHero({ ...hero, locationPlaceholder: event.target.value }); markChanged() }} /></label>
                </div>
                <div className="search-field-grid">
                  <DropdownItemsEditor label="Industry dropdown items" items={industries} onAdd={addIndustryToDropdown} onRemove={(id) => updateIndustry(id, { showInDropdown: false })} />
                  <DropdownItemsEditor label="Location dropdown items" items={locations} onAdd={addLocationToDropdown} onRemove={(id) => removeLocation(id)} />
                </div>
              </div>
              <div className="hero-preview" style={{ backgroundImage: `linear-gradient(90deg, rgba(18,35,89,.82), rgba(18,35,89,.52)), url(${hero.background})` }}>
                <span>Live preview</span>
                <h3>{hero.title}</h3>
                <p>{hero.subtitle}</p>
                <div className="preview-search-container">
                  <div className="preview-search-input">
                    <Search size={14} className="preview-search-icon" style={{ marginRight: 6 }} />
                    <span>{hero.searchPlaceholder || 'Search by job title, skill or company'}</span>
                  </div>
                  <button type="button" className="preview-dropdown-btn">{hero.industryPlaceholder}</button>
                  <button type="button" className="preview-dropdown-btn">{hero.locationPlaceholder}</button>
                  <button type="button" className="preview-search">Search</button>
                </div>
                {hero.ctaText && (
                  <div className="preview-cta-wrapper">
                    <a href={hero.ctaLink || "#"} className="preview-cta" onClick={(e) => e.preventDefault()}>{hero.ctaText}</a>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="home-section">
            <div className="section-heading">
              <span className="section-icon"><BriefcaseBusiness size={19} /></span>
              <div><h5 style={{fontSize:"16px"}}>Browse by industry</h5><p style={{color:"#66789c"}}>Choose the industries displayed on the home screen and upload an icon for each.</p></div>
              <button type="button" className="add-item" onClick={() => { setIndustries((items) => [...items, { id: newId('industry'), name: '', jobs: 0, icon: '', enabled: true, showInDropdown: false }]); markChanged() }}><Plus size={15} />Add industry</button>
            </div>
            <div className="compact-list">
              {industries.filter(item => !item.showInDropdown).map((industry) => (
                <div className="compact-row industry-row" key={industry.id}>
                  <IconUploadField value={industry.icon} onChange={(value) => updateIndustry(industry.id, { icon: value })} />
                  <div className="industry-card-content">
                    <label>Industry name
                      <select
                        value={industry.name}
                        disabled={saving}
                        onChange={(event) => updateIndustry(industry.id, { name: event.target.value })}
                      >
                        <option value="">Select an industry...</option>
                        {registrationIndustries.map(regInd => (
                          <option key={regInd.id} value={regInd.name}>
                            {regInd.name}
                          </option>
                        ))}
                        {industry.name && !registrationIndustries.some(r => r.name === industry.name) && (
                          <option value={industry.name}>{industry.name}</option>
                        )}
                      </select>
                    </label>
                    <label>Job count override<input type="number" value={industry.jobs} disabled={saving} onChange={(event) => updateIndustry(industry.id, { jobs: parseInt(event.target.value, 10) || 0 })} /></label>
                    <div className="row-actions">
                      <span>{industry.enabled ? 'Visible' : 'Hidden'}</span><Toggle enabled={industry.enabled} onChange={(enabled) => updateIndustry(industry.id, { enabled })} />
                      <button type="button" className="delete-item" onClick={() => removeIndustry(industry.id)} aria-label={`Remove ${industry.name}`}><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="home-section">
            <div className="section-heading"><span className="section-icon"><BarChart3 size={19} /></span><div><h5 style={{fontSize:"20px"}}>Hiring statistics</h5><p style={{color:"#66789c"}}>Edit the proof points shown below the industry cards.</p></div><button type="button" className="add-item" onClick={() => { setStats((items) => [...items, { id: newId('stat'), value: '0', suffix: '', label: 'New statistic', iconSlug: '' }]); markChanged() }}><Plus size={15} />Add statistic</button></div>
            <div className="stats-editor">
              {stats.map((stat) => (
                <article className="stat-edit-card" key={stat.id}>
                  <label>Value<input value={stat.value} disabled={saving} onChange={(event) => { updateCollection(setStats, stat.id, { value: event.target.value }); markChanged() }} /></label>
                  <label>Suffix<input value={stat.suffix} placeholder="e.g. K+" disabled={saving} onChange={(event) => { updateCollection(setStats, stat.id, { suffix: event.target.value }); markChanged() }} /></label>
                  <label>Label<input value={stat.label} disabled={saving} onChange={(event) => { updateCollection(setStats, stat.id, { label: event.target.value }); markChanged() }} /></label>
                  <label>Icon Slug<input value={stat.iconSlug} placeholder="e.g. users" disabled={saving} onChange={(event) => { updateCollection(setStats, stat.id, { iconSlug: event.target.value }); markChanged() }} /></label>
                  <button type="button" className="delete-text" onClick={() => { removeItem(setStats, stat.id); markChanged() }}><Trash2 size={13} />Remove</button>
                </article>
              ))}
            </div>
          </section>

          <ContentImageSection
            title="Jobs by location" description="Manage country cards and their featured images shown on the home page."
            icon={<MapPin size={19} />} items={locations} setItems={setLocations} type="location" markChanged={markChanged}
            newItem={() => ({ id: newId('location'), name: 'New location', image: '', enabled: true, showInDropdown: false })}
            onFileChange={(id, file) => {
              setLocationFiles(prev => ({ ...prev, [id]: file }))
              markChanged()
            }}
            onDelete={removeLocation}
            onUpdate={updateLocation}
          />
          <ContentImageSection
            title="Jobs by role" description="Manage the role cards and images shown lower on the home page."
            icon={<ImagePlus size={19} />} items={roles} setItems={setRoles} type="role" markChanged={markChanged}
            newItem={() => ({ id: `role-${Date.now()}`, name: '', image: '', enabled: true })}
            dropdownOptions={tradeCategories}
            onFileChange={(id, file) => {
              setRoleFiles(prev => ({ ...prev, [id]: file }))
              markChanged()
            }}
            onDelete={removeRole}
            onUpdate={updateRole}
          />
        </>
      )}

      {activeTab === 'recruiter' && (
        <div className="recruiter-grid">
          {/* Left column - Industry Type dropdown */}
          <RegistrationDropdownSection
            title="Employer registration — Industry Type dropdown"
            description={'Control which industries appear in the "Industry Type" field of employer registration, their order, and how many show at once.'}
            icon={<GraduationCap size={19} />}
            items={registrationIndustries} setItems={setRegistrationIndustries}
            markChanged={markChanged} idPrefix="reg" addLabel="Add industry type" itemLabel="industry type"
            sectionRef={leftSectionRef}
            onAdd={() => {
              setRegistrationIndustries((current) => [...current, { id: `reg-${Date.now()}`, name: 'New industry type', enabled: true }])
              markChanged()
            }}
            onDelete={removeRegIndustry}
            onUpdate={updateRegIndustry}
            onMove={moveRegIndustry}
          />

          {/* Right column - Suggestions inbox with scroll */}
          <section ref={suggestionsPanelRef} className="home-section suggestions-panel">
            <div className="section-heading suggestions-heading">
              <span className="section-icon"><Lightbulb size={19} /></span>
              <div><h5>Suggestions inbox</h5><p style={{ color: "#66789c" }}>New department, industry, or role suggestions from recruiters. Approve one to add it straight to the matching dropdown list.</p></div>
            </div>
            <div className="suggestions-list-wrapper">
              <div className="suggestions-list">
                {suggestions.length === 0 && <p className="suggestions-empty">No pending suggestions right now.</p>}
                {suggestions.map((suggestion) => (
                  <article className="suggestion-card" key={suggestion.id}>
                    <div className="suggestion-info">
                      <span className="suggestion-type">{suggestion.type}</span>
                      <h6>{suggestion.name}</h6>
                      <p>
                        Suggested by {suggestion.submittedBy}
                        {suggestion.submittedByEmail && suggestion.submittedByEmail !== suggestion.submittedBy ? ` (${suggestion.submittedByEmail})` : ''}
                        {' '}· {suggestion.date}
                      </p>
                    </div>
                    <div className="suggestion-actions">
                      <button type="button" className="approve-btn" onClick={() => approveSuggestion(suggestion)}><Check size={13} />Approve</button>
                      <button type="button" className="reject-btn" onClick={() => rejectSuggestion(suggestion.id)}><X size={13} />Reject</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom left - Department dropdown */}
          <RegistrationDropdownSection
            title="Employer registration — Department dropdown"
            description={'Control which options appear in the "Department" field of employer registration, their order, and how many show at once.'}
            icon={<Building2 size={19} />}
            items={departments} setItems={setDepartments}
            markChanged={markChanged} idPrefix="dep" addLabel="Add department" itemLabel="department"
            onAdd={() => {
              setDepartments((current) => [...current, { id: `dep-${Date.now()}`, name: 'New department', enabled: true }])
              markChanged()
            }}
            onDelete={removeDepartment}
            onUpdate={updateDepartment}
            onMove={moveDepartment}
          />

          {/* Bottom right - Trade / Role Category dropdown */}
          <RegistrationDropdownSection
            title="Employer registration — Trade / Role Category dropdown"
            description={'Control which options appear in the "Trade / Role Category" field of employer registration, their order, and how many show at once.'}
            icon={<Briefcase size={19} />}
            items={tradeCategories} setItems={setTradeCategories}
            markChanged={markChanged} idPrefix="trade" addLabel="Add trade/role" itemLabel="trade or role category"
            onAdd={() => {
              setTradeCategories((current) => [...current, { id: `trade-${Date.now()}`, name: 'New trade or role category', enabled: true }])
              markChanged()
            }}
            onDelete={removeTradeCategory}
            onUpdate={updateTradeCategory}
            onMove={moveTradeCategory}
          />
        </div>
      )}

      <style jsx>{`
        .homepage-manager { color: #172b60; display: grid; gap: 19px; padding-bottom: 28px; }
        .homepage-manager-bar, .home-section { border: 1px solid #e1e8f3; border-radius: 13px; background: #fff; box-shadow: 0 7px 21px rgba(27, 52, 102, .04); transition: all 0.35s ease !important; }
        .homepage-manager-bar:hover, .home-section:hover { transform: translateY(-8px) !important; border-color: rgba(255, 153, 0, 0.32) !important; box-shadow: 0 0 0 1px rgba(255, 153, 0, 0.18), 0 20px 40px rgba(255, 153, 0, 0.12) !important; }
        .home-section:hover .section-heading { border-bottom-color: rgba(255, 153, 0, 0.32) !important; }
        .homepage-manager-bar { padding: 21px 23px; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
        .homepage-manager-bar span { color: #f39b00; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .homepage-manager-bar h4 { margin: 4px 0; font-size: 20px; font-weight: 800; }
        .homepage-manager-bar p, .section-heading p { margin: 0; color: #71809f; font-size: 12px; }
        .homepage-save { border: 0; border-radius: 8px; padding: 11px 18px; background: #ffa300; color: #fff; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; white-space: nowrap; cursor: pointer; transition: background 0.15s ease, transform 0.1s ease; }
        .homepage-save:hover { background: #e08f00; }
        .homepage-save:active { transform: scale(0.97); }
        .tab-switch { display: inline-flex; gap: 6px; padding: 5px; border: 1px solid #e1e8f3; border-radius: 11px; background: #f5f7fb; width: max-content; }
        .tab-switch button { border: 0; border-radius: 8px; padding: 9px 16px; background: transparent; color: #5a6c8f; display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.15s ease; }
        .tab-switch button:hover { color: #172b60; }
        .tab-switch button.is-active { background: #fff; color: #172b60; box-shadow: 0 3px 10px rgba(27, 52, 102, .08); }
        .home-section { overflow: hidden; }
        .section-heading { min-height: 60px; padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; transition: border-bottom-color 0.35s ease !important; }
        .section-heading > div { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .section-heading h5 { margin: 0; font-size: 15px; font-weight: 800; }
        .section-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; flex: 0 0 auto; }
        .add-item { margin-left: auto; padding: 8px 10px; border: 1px solid #ffd28a; border-radius: 6px; background: #fff8ea; color: #ac6d00; display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 800; white-space: nowrap; cursor: pointer; transition: background 0.15s ease; }
        .add-item:hover { background: #fff3db; }
        /* 50/50 columns for editor and preview to keep a stable rectangular preview */
        .hero-editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 21px; padding: 21px; align-items: start; }
        .hero-fields { display: grid; gap: 13px; }
        label { display: grid; gap: 6px; color: #64748b; font-size: 10px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
        input, textarea, select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d6e0ee;
          border-radius: 8px;
          padding: 8px 12px;
          outline: none;
          color: #1e293b;
          font-size: 13px;
          font-family: inherit;
          font-weight: 500;
          line-height: 1.4;
          text-transform: none;
          letter-spacing: 0;
          background: #fff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        input { height: 38px; }
        select {
          height: 38px;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 10px center;
          background-repeat: no-repeat;
          background-size: 18px 18px;
          padding-right: 32px !important;
        }
        textarea { resize: vertical; min-height: 70px; }
        input:focus, textarea:focus, select:focus { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255, 163, 0, .09); }
        .search-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
        .dropdown-hint { margin: 0; font-size: 11px; font-weight: 700; color: #4b7a4f; background: #eef8ef; border: 1px solid #d7ecd9; border-radius: 6px; padding: 8px 10px; }
        .dropdown-hint.is-over { color: #a13f3f; background: #fdefef; border-color: #f3d3d3; }
        /* Fixed rectangular preview to avoid unexpected resizing */
        .hero-preview { height: 360px; padding: 23px; border-radius: 10px; background-position: center; background-size: cover; background-color: #172b60; color: #fff; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
        .hero-preview > span { margin-bottom: 13px; color: #ffe1aa; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .hero-preview h3 { max-width: 400px; margin: 0 0 9px; color: #fff; font-size: 24px; line-height: 1.2; }
        .hero-preview p { margin: 0 0 19px; color: #f1f5ff; font-size: 12px; line-height: 1.5; }
        
        .preview-search-container { display: grid; grid-template-columns: 2fr 1fr 1fr auto; align-items: center; height: 38px; border-radius: 6px; background: #fff; overflow: hidden; }
        .preview-search-input { display: flex; align-items: center; padding: 0 12px; color: #76849e; font-size: 11px; border-right: 1px solid #edf0f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 100%; }
        .preview-search-icon { color: #9aa9c4; flex-shrink: 0; }
        .preview-dropdown-btn { height: 100%; border: 0; border-right: 1px solid #edf0f5; background: #fff; color: #76849e; padding: 0 12px; text-align: left; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; outline: none; display: flex; align-items: center; }
        .hero-preview .preview-search { border: 0; height: 100%; background: #ffa300; color: #fff; display: inline-flex; align-items: center; justify-content: center; padding: 0 16px; font-size: 11px; font-weight: 800; }
        
        .preview-cta-wrapper { display: flex; margin-top: 10px; }
        .preview-cta { display: inline-block; background: #ffa300; color: #fff; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 800; text-decoration: none; border: 0; cursor: pointer; }
        .preview-cta:hover { background: #e08f00; }

        /* Toast Notifications */
        .homepage-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 13px;
          animation: fadeIn 0.3s ease-out;
        }
        .success-toast {
          background: #E9F7EF;
          color: #2e7d32;
          border: 1px solid #c3e6cb;
        }
        .error-toast {
          background: #FDF2F2;
          color: #de4343;
          border: 1px solid #f5c2c2;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-icon {
          animation: spin 1s linear infinite;
        }
        /* Four consistent industry cards per desktop row, with controls beneath the field. */
        .home-section .compact-list { padding: 5px 21px 18px; display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 18px; }
        .home-section .compact-list > .compact-row { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 10px 12px; align-items: start; padding: 14px; border: 1px solid #edf1f6; border-radius: 10px; background: #fff; width: auto; box-sizing: border-box; }
        .compact-row.industry-row { grid-template-columns: 44px minmax(0, 1fr); align-items: start; }
        .industry-card-content { min-width: 0; display: grid; gap: 10px; }
        .industry-card-content .row-actions { justify-self: start; }
        .compact-row:last-child { border-bottom: 0; } .row-marker { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 7px; background: #f2f6fc; color: #5270aa; margin-bottom: 0; }
        .row-actions { min-height: 36px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; } .row-actions > span { color: #6e809e; font-size: 10px; font-weight: 700; }
        .delete-item, .delete-text { border: 0; color: #ef4444; background: #fef2f2; border-radius: 8px; padding: 8px; display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; cursor: pointer; transition: background 0.15s ease, color 0.15s ease; }
        .delete-item:hover, .delete-text:hover { background: #fee2e2; color: #dc2626; }
        .delete-text { margin-top: 5px; width: max-content; }
        /* Ensure stats editor uses 3 columns on desktop */
        .home-section .stats-editor { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 13px; padding: 20px 21px; }
        .home-section .stats-editor > .stat-edit-card { display: grid; align-content: start; gap: 10px; padding: 14px; border: 1px solid #e3eaf4; border-radius: 9px; width: auto; box-sizing: border-box; }
        .stat-edit-card label:first-child input { color: #f09b00; font-size: 19px; font-weight: 800; }
        /* Keep the two management panels aligned while allowing their inner lists to scroll. */
        .recruiter-grid { --recruiter-panel-height: 560px; display: grid; grid-template-columns: 1fr 1fr; gap: 19px; align-items: stretch; }
        .recruiter-grid > * { display: flex; flex-direction: column; }
        .recruiter-grid .home-section { flex: 1; }
        .recruiter-grid .registration-dropdown-section { flex: 1; }
        .recruiter-grid > :nth-child(-n + 2) { height: var(--recruiter-panel-height); min-height: 0; }
        
        /* Suggestions panel with scroll - matching dropdown height */
        .suggestions-panel { 
          display: flex; 
          flex-direction: column; 
          min-height: 0;
          overflow: hidden;
        }
        .suggestions-heading { 
          flex: 0 0 auto; 
        }
        .suggestions-list-wrapper { 
          flex: 1; 
          overflow: hidden; 
          padding: 8px 16px 16px; 
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .suggestions-list { 
          flex: 1;
          overflow-y: auto; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          padding-right: 4px;
          max-height: 100%;
        }
        .suggestions-list::-webkit-scrollbar { width: 6px; }
        .suggestions-list::-webkit-scrollbar-track { background: #f1f4f9; border-radius: 4px; }
        .suggestions-list::-webkit-scrollbar-thumb { background: #d6dce7; border-radius: 4px; }
        .suggestions-list::-webkit-scrollbar-thumb:hover { background: #c0c8d6; }
        
        .suggestion-card { 
          border: 1px solid #e3eaf4; 
          border-radius: 10px; 
          padding: 13px; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between; 
          gap: 10px; 
          flex: 0 0 auto;
        }
        .suggestion-info { flex: 1 1 auto; }
        .suggestion-actions { flex: 0 0 auto; display: flex; gap: 8px; }
        .two-column-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .suggestions-empty { margin: 0; color: #9aa9c4; font-size: 12px; font-style: italic; padding: 10px 0; }
        .suggestion-type { display: inline-block; width: max-content; padding: 3px 8px; border-radius: 20px; background: #eef3ff; color: #3554a3; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
        .suggestion-info h6 { margin: 6px 0 2px; font-size: 13px; font-weight: 800; color: #172b60; }
        .suggestion-info p { margin: 0; color: #71809f; font-size: 11px; }
        .suggestion-actions { display: flex; gap: 8px; }
        .approve-btn, .reject-btn { flex: 1; border: 0; border-radius: 8px; padding: 9px 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease; }
        .approve-btn:active, .reject-btn:active { transform: scale(0.97); }
        .approve-btn { background: #f0fdf4; color: #16a34a; }
        .approve-btn:hover { background: #dcfce7; color: #15803d; }
        .reject-btn { background: #fef2f2; color: #ef4444; }
        .reject-btn:hover { background: #fee2e2; color: #dc2626; }
        
        @media (max-width: 1150px) { 
          .stats-editor { grid-template-columns: repeat(2, minmax(0, 1fr)); } 
          .home-section .compact-list { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .recruiter-grid { grid-template-columns: 1fr; } 
          .recruiter-grid > :nth-child(-n + 2) { height: auto; }
          .suggestions-panel { position: static; min-height: 350px; }
        }
        @media (max-width: 760px) {
          .homepage-manager-bar, .section-heading { display: flex; align-items: flex-start; flex-wrap: wrap; }
          .homepage-save { width: 100%; justify-content: center; } .add-item { margin-left: 0; }
          .hero-editor-grid { grid-template-columns: 1fr; padding: 16px; }
          .search-field-grid { grid-template-columns: 1fr; }
          .two-column-row { grid-template-columns: 1fr; gap: 12px; }
          .home-section .compact-list { grid-template-columns: 1fr !important; padding: 5px 16px 16px; }
          .compact-row, .compact-row.industry-row { grid-template-columns: 44px 1fr; }
          .compact-row .row-actions { grid-column: 1 / -1; }
          .stats-editor { grid-template-columns: 1fr; padding: 16px; }
          .recruiter-grid { grid-template-columns: 1fr; gap: 19px; }
          .suggestions-panel { min-height: 300px; }
        }
      `}</style>
    </section>
  )
}

/* ---------------------- location / role cards (image based) ---------------------- */

function ContentImageSection({ title, description, icon, items, setItems, type, markChanged, newItem, onFileChange, onDelete, onUpdate, dropdownOptions }) {
  const update = (id, changes) => {
    if (onUpdate) {
      onUpdate(id, changes)
    } else {
      setItems((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
      markChanged()
    }
  }
  const remove = (id) => {
    if (onDelete) {
      onDelete(id)
    } else {
      setItems((current) => current.filter((item) => item.id !== id))
      markChanged()
    }
  }
  const add = () => {
    setItems((current) => [...current, newItem()])
    markChanged()
  }

  return (
    <section className="home-section">
      <div className="section-heading">
        <span className="section-icon">{icon}</span>
        <div><h5 style={{ fontSize: "20px" }}>{title}</h5><p>{description}</p></div>
        <button type="button" className="add-item" onClick={add}><Plus size={15} />Add {type}</button>
      </div>
      <div className="image-card-grid">
        {items.map((item) => (
          <article className="image-edit-card" key={item.id}>
            <ImageField 
              value={item.image} 
              onChange={(value) => update(item.id, { image: value })} 
              onFileChange={onFileChange ? (file) => onFileChange(item.id, file) : undefined}
            />
            <div className="image-card-body">
              <label>
                {type === 'location' ? 'Location name' : 'Role name'}
                {type === 'role' && dropdownOptions ? (
                  <select value={item.name} onChange={(event) => update(item.id, { name: event.target.value })}>
                    <option value="">Select a role...</option>
                    {dropdownOptions.map(opt => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                    {item.name && !dropdownOptions.some(o => o.name === item.name) && (
                      <option value={item.name}>{item.name}</option>
                    )}
                  </select>
                ) : (
                  <input value={item.name} onChange={(event) => update(item.id, { name: event.target.value })} />
                )}
              </label>
              <div className="row-actions">
                <span>{item.enabled ? 'Visible' : 'Hidden'}</span><Toggle enabled={item.enabled} onChange={(enabled) => update(item.id, { enabled })} />
                <button type="button" className="delete-item" onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <style jsx>{`
        .home-section { overflow: hidden; border: 1px solid #e1e8f3; border-radius: 13px; background: #fff; box-shadow: 0 7px 21px rgba(27, 52, 102, .04); transition: all 0.35s ease !important; }
        .home-section:hover { transform: translateY(-8px) !important; border-color: rgba(255, 153, 0, 0.32) !important; box-shadow: 0 0 0 1px rgba(255, 153, 0, 0.18), 0 20px 40px rgba(255, 153, 0, 0.12) !important; }
        .home-section:hover .section-heading { border-bottom-color: rgba(255, 153, 0, 0.32) !important; }
        .section-heading { min-height: 60px; padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; transition: border-bottom-color 0.35s ease !important; }
        .section-heading > div { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .section-heading h5 { margin: 0; color: #172b60; font-size: 15px; font-weight: 800; } .section-heading p { margin: 0; color: #71809f; font-size: 12px; }
        .section-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; flex: 0 0 auto; }
        .add-item { margin-left: auto; padding: 8px 10px; border: 1px solid #ffd28a; border-radius: 6px; background: #fff8ea; color: #ac6d00; display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 800; white-space: nowrap; cursor: pointer; transition: background 0.15s ease; }
        .add-item:hover { background: #fff3db; }
        .image-card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; padding: 20px 21px; }
        .image-edit-card { padding: 14px; border: 1px solid #e3eaf4; border-radius: 10px; background: #fff; display: grid; gap: 12px; }
        .image-card-body { display: grid; gap: 14px; }
        .image-card-body label { display: grid; gap: 6px; color: #64748b; font-size: 10px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
        .image-card-body input, .image-card-body select {
          width: 100%;
          height: 38px;
          box-sizing: border-box;
          border: 1px solid #d6e0ee;
          border-radius: 8px;
          padding: 8px 12px;
          color: #1e293b;
          font-size: 13px;
          font-family: inherit;
          font-weight: 500;
          text-transform: none;
          letter-spacing: 0;
          outline: none;
          background: #fff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .image-card-body select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 10px center;
          background-repeat: no-repeat;
          background-size: 18px 18px;
          padding-right: 32px !important;
        }
        .image-card-body input:focus, .image-card-body select:focus {
          border-color: #ffa300;
          box-shadow: 0 0 0 3px rgba(255, 163, 0, .09);
        }
        .row-actions { min-height: 36px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; } .row-actions > span { color: #6e809e; font-size: 10px; font-weight: 700; }
        .delete-item {
          border: 0;
          color: #ef4444;
          background: #fef2f2;
          border-radius: 8px;
          padding: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .delete-item:hover {
          background: #fee2e2;
          color: #dc2626;
        }
        @media (max-width: 1150px) { .image-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 760px) { .section-heading { align-items: flex-start; flex-wrap: wrap; } .add-item { margin-left: 0; } .image-card-grid { grid-template-columns: 1fr; padding: 16px; } }
      `}</style>
    </section>
  )
}
