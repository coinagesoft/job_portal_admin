'use client'

import { useState, useRef, useEffect } from 'react'
import {
  BarChart3, Briefcase, BriefcaseBusiness, Building2, Check, ChevronDown, ChevronUp,
  GraduationCap, ImageOff, ImagePlus, Lightbulb, MapPin, MonitorCog, Plus, Save,
  Search, Trash2, Upload, UserCog, Users, X
} from 'lucide-react'

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

/** Image field with URL input + real file upload preview + broken-image fallback. Reused for hero background, locations, and roles. */
function ImageField({ value, onChange, label = 'Image URL', height = 200, showPreview = true }) {
  const fileRef = useRef(null)
  const [broken, setBroken] = useState(false)

  const onUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { onChange(reader.result); setBroken(false) }
    reader.readAsDataURL(file)
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
        {value && <button type="button" className="remove-btn" onClick={() => { onChange(''); setBroken(false) }}><Trash2 size={13} />Remove</button>}
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
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
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
function RegistrationDropdownSection({ title, description, icon, items, setItems, markChanged, idPrefix, addLabel, itemLabel, sectionRef }) {
  const enabledCount = items.filter((item) => item.enabled).length
  const maxItems = 10 // Default to 10 items

  const move = (index, dir) => setItems((current) => {
    const next = [...current]
    const swapWith = index + dir
    ;[next[index], next[swapWith]] = [next[swapWith], next[index]]
    return next
  })

  return (
    <section ref={sectionRef} className="home-section registration-dropdown-section">
      <div className="section-heading">
        <span className="section-icon">{icon}</span>
        <div><h5>{title}</h5><p>{description}</p></div>
        <button type="button" className="add-item" onClick={() => { setItems((current) => [...current, { id: `${idPrefix}-${Date.now()}`, name: `New ${itemLabel.toLowerCase()}`, enabled: true }]); markChanged() }}><Plus size={15} />{addLabel}</button>
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
              <button type="button" disabled={index === 0} onClick={() => { move(index, -1); markChanged() }} aria-label="Move up"><ChevronUp size={13} /></button>
              <button type="button" disabled={index === items.length - 1} onClick={() => { move(index, 1); markChanged() }} aria-label="Move down"><ChevronDown size={13} /></button>
            </div>
            <span className="reg-index">{index + 1}</span>
            <input className="reg-name-input" aria-label={`${itemLabel} name`} value={item.name} onChange={(event) => { setItems((current) => current.map((row) => row.id === item.id ? { ...row, name: event.target.value } : row)); markChanged() }} />
            <div className="row-actions">
              <span>{item.enabled ? 'Shown' : 'Hidden'}</span><Toggle enabled={item.enabled} onChange={(enabled) => { setItems((current) => current.map((row) => row.id === item.id ? { ...row, enabled } : row)); markChanged() }} />
              <button type="button" className="delete-item" onClick={() => { setItems((current) => current.filter((row) => row.id !== item.id)); markChanged() }} aria-label={`Remove ${item.name}`}><Trash2 size={14} /></button>
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

  const [hero, setHero] = useState({
    title: 'India\'s #1 Global Job Portal for Skilled Workers',
    subtitle: 'Find verified opportunities across India, UAE, Saudi Arabia, Qatar, and Singapore for technicians, engineers, drivers, construction professionals, marine staff, and skilled workers.',
    background: '/assets/imgs/page/homepage1/banner1.png',
    industryPlaceholder: 'Trade Category',
    locationPlaceholder: 'Location',
  })
  const [industries, setIndustries] = useState(initialIndustries)
  const [stats, setStats] = useState(initialStats)
  const [locations, setLocations] = useState(initialLocations)
  const [roles, setRoles] = useState(initialRoles)

  const [registrationIndustries, setRegistrationIndustries] = useState(initialRegistrationIndustries)
  const [departments, setDepartments] = useState(initialRegistrationBusinessCategories)
  const [tradeCategories, setTradeCategories] = useState(initialRegistrationBusinessCategories)
  const [suggestions, setSuggestions] = useState(initialSuggestions)

  const leftSectionRef = useRef(null)
  const suggestionsPanelRef = useRef(null)

  const [saved, setSaved] = useState(false)

  const updateCollection = (setter, id, changes) => setter((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item))
  const removeItem = (setter, id) => setter((items) => items.filter((item) => item.id !== id))
  const newId = (prefix) => `${prefix}-${Date.now()}`
  const markChanged = () => setSaved(false)
  const save = () => setSaved(true)

  const addIndustryToDropdown = (name) => {
    setIndustries((items) => [...items, { id: newId('industry'), name, jobs: '0 Jobs Available', icon: '', enabled: true, showInDropdown: true }])
    markChanged()
  }
  const addLocationToDropdown = (name) => {
    setLocations((items) => [...items, { id: newId('location'), name, image: '', enabled: true, showInDropdown: true }])
    markChanged()
  }

  const approveSuggestion = (suggestion) => {
    // map suggestion types to the correct recruiter dropdown (Department / Industry / Role)
    if (suggestion.type === 'Department') {
      setDepartments((items) => [...items, { id: newId('reg'), name: suggestion.name, enabled: true }])
    } else if (suggestion.type === 'Role' || suggestion.type === 'Trade' || suggestion.type === 'Trade category' || suggestion.type === 'Role category') {
      setTradeCategories((items) => [...items, { id: newId('reg'), name: suggestion.name, enabled: true }])
    } else if (suggestion.type === 'Industry') {
      setRegistrationIndustries((items) => [...items, { id: newId('reg'), name: suggestion.name, enabled: true }])
    }
    setSuggestions((items) => items.filter((item) => item.id !== suggestion.id))
    markChanged()
  }
  const rejectSuggestion = (id) => setSuggestions((items) => items.filter((item) => item.id !== id))

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

  return (
    <section className="homepage-manager">
      <div className="homepage-manager-bar">
        <div>
          <span>{activeTab === 'candidate' ? 'Candidate website' : 'Recruiter / Employer'}</span>
          <h4>{activeTab === 'candidate' ? 'Home Page Management' : 'Recruiter Registration Management'}</h4>
          <p>{activeTab === 'candidate'
            ? 'Control the content and cards shown to candidates on the public home page.'
            : 'Control the dropdown options shown to recruiters during employer registration.'}</p>
        </div>
        <button type="button" className="homepage-save" onClick={save}><Save size={16} />{saved ? 'Changes saved' : 'Save changes'}</button>
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
            <div className="section-heading"><span className="section-icon"><MonitorCog size={19} /></span><div><h5>Hero section</h5><p>Set the first message, background image, and search controls.</p></div></div>
            <div className="hero-editor-grid">
              <div className="hero-fields">
                <label>Hero title<textarea value={hero.title} rows={3} onChange={(event) => { setHero({ ...hero, title: event.target.value }); markChanged() }} /></label>
                <label>Supporting text<textarea value={hero.subtitle} rows={3} onChange={(event) => { setHero({ ...hero, subtitle: event.target.value }); markChanged() }} /></label>
                <ImageField label="Hero background image" value={hero.background} onChange={(value) => { setHero({ ...hero, background: value }); markChanged() }} showPreview={false} />
                <div className="search-field-grid">
                  <label>Industry dropdown label<input value={hero.industryPlaceholder} onChange={(event) => { setHero({ ...hero, industryPlaceholder: event.target.value }); markChanged() }} /></label>
                  <label>Location dropdown label<input value={hero.locationPlaceholder} onChange={(event) => { setHero({ ...hero, locationPlaceholder: event.target.value }); markChanged() }} /></label>
                </div>
                <div className="search-field-grid">
                  <DropdownItemsEditor label="Industry dropdown items" items={industries} onAdd={addIndustryToDropdown} onRemove={(id) => { updateCollection(setIndustries, id, { showInDropdown: false }); markChanged() }} />
                  <DropdownItemsEditor label="Location dropdown items" items={locations} onAdd={addLocationToDropdown} onRemove={(id) => { updateCollection(setLocations, id, { showInDropdown: false }); markChanged() }} />
                </div>
              </div>
              <div className="hero-preview" style={{ backgroundImage: `linear-gradient(90deg, rgba(18,35,89,.82), rgba(18,35,89,.52)), url(${hero.background})` }}>
                <span>Live preview</span><h3>{hero.title}</h3><p>{hero.subtitle}</p>
                <div><button>{hero.industryPlaceholder}</button><button>{hero.locationPlaceholder}</button><button className="preview-search"><Search size={14} />Search</button></div>
              </div>
            </div>
          </section>

          <section className="home-section">
            <div className="section-heading">
              <span className="section-icon"><BriefcaseBusiness size={19} /></span>
              <div><h5>Browse by industry</h5><p>Choose the industries displayed on the home screen and upload an icon for each.</p></div>
              <button type="button" className="add-item" onClick={() => { setIndustries((items) => [...items, { id: newId('industry'), name: 'New industry', jobs: '0 Jobs Available', icon: '', enabled: true, showInDropdown: false }]); markChanged() }}><Plus size={15} />Add industry</button>
            </div>
            <div className="compact-list">
              {industries.map((industry) => (
                <div className="compact-row industry-row" key={industry.id}>
                  <IconUploadField value={industry.icon} onChange={(value) => { updateCollection(setIndustries, industry.id, { icon: value }); markChanged() }} />
                  <label>Industry name<input value={industry.name} onChange={(event) => { updateCollection(setIndustries, industry.id, { name: event.target.value }); markChanged() }} /></label>
                  <div className="row-actions">
                    <span>{industry.enabled ? 'Visible' : 'Hidden'}</span><Toggle enabled={industry.enabled} onChange={(enabled) => { updateCollection(setIndustries, industry.id, { enabled }); markChanged() }} />
                    <button type="button" className="delete-item" onClick={() => { removeItem(setIndustries, industry.id); markChanged() }} aria-label={`Remove ${industry.name}`}><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="home-section">
            <div className="section-heading"><span className="section-icon"><BarChart3 size={19} /></span><div><h5>Hiring statistics</h5><p>Edit the proof points shown below the industry cards.</p></div><button type="button" className="add-item" onClick={() => { setStats((items) => [...items, { id: newId('stat'), value: '0+', label: 'New statistic', description: 'Add a short description' }]); markChanged() }}><Plus size={15} />Add statistic</button></div>
            <div className="stats-editor">{stats.map((stat) => <article className="stat-edit-card" key={stat.id}><label>Value<input value={stat.value} onChange={(event) => { updateCollection(setStats, stat.id, { value: event.target.value }); markChanged() }} /></label><label>Label<input value={stat.label} onChange={(event) => { updateCollection(setStats, stat.id, { label: event.target.value }); markChanged() }} /></label><label>Description<textarea rows={3} value={stat.description} onChange={(event) => { updateCollection(setStats, stat.id, { description: event.target.value }); markChanged() }} /></label><button type="button" className="delete-text" onClick={() => { removeItem(setStats, stat.id); markChanged() }}><Trash2 size={13} />Remove</button></article>)}</div>
          </section>

          <ContentImageSection
            title="Jobs by location" description="Manage country cards and their featured images shown on the home page."
            icon={<MapPin size={19} />} items={locations} setItems={setLocations} type="location" markChanged={markChanged}
            newItem={() => ({ id: newId('location'), name: 'New location', image: '', enabled: true, showInDropdown: false })}
          />
          <ContentImageSection
            title="Jobs by role" description="Manage the role cards and images shown lower on the home page."
            icon={<ImagePlus size={19} />} items={roles} setItems={setRoles} type="role" markChanged={markChanged}
            newItem={() => ({ id: newId('role'), name: 'New role', image: '', enabled: true })}
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
          />

          {/* Right column - Suggestions inbox with scroll */}
          <section ref={suggestionsPanelRef} className="home-section suggestions-panel">
            <div className="section-heading suggestions-heading">
              <span className="section-icon"><Lightbulb size={19} /></span>
              <div><h5>Suggestions inbox</h5><p>New department, industry, or role suggestions from recruiters. Approve one to add it straight to the matching dropdown list.</p></div>
            </div>
            <div className="suggestions-list-wrapper">
              <div className="suggestions-list">
                {suggestions.length === 0 && <p className="suggestions-empty">No pending suggestions right now.</p>}
                {suggestions.map((suggestion) => (
                  <article className="suggestion-card" key={suggestion.id}>
                    <div className="suggestion-info">
                      <span className="suggestion-type">{suggestion.type}</span>
                      <h6>{suggestion.name}</h6>
                      <p>Suggested by {suggestion.submittedBy} · {suggestion.date}</p>
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
            markChanged={markChanged} idPrefix="dept" addLabel="Add department" itemLabel="department"
          />

          {/* Bottom right - Trade / Role Category dropdown */}
          <RegistrationDropdownSection
            title="Employer registration — Trade / Role Category dropdown"
            description={'Control which options appear in the "Trade / Role Category" field of employer registration, their order, and how many show at once.'}
            icon={<Briefcase size={19} />}
            items={tradeCategories} setItems={setTradeCategories}
            markChanged={markChanged} idPrefix="trade" addLabel="Add trade/role" itemLabel="trade or role category"
          />
        </div>
      )}

      <style jsx>{`
        .homepage-manager { color: #172b60; display: grid; gap: 19px; padding-bottom: 28px; }
        .homepage-manager-bar, .home-section { border: 1px solid #e1e8f3; border-radius: 13px; background: #fff; box-shadow: 0 7px 21px rgba(27, 52, 102, .04); }
        .homepage-manager-bar { padding: 21px 23px; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
        .homepage-manager-bar span { color: #f39b00; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .homepage-manager-bar h4 { margin: 4px 0; font-size: 20px; font-weight: 800; }
        .homepage-manager-bar p, .section-heading p { margin: 0; color: #71809f; font-size: 12px; }
        .homepage-save { border: 0; border-radius: 7px; padding: 11px 15px; background: #ffa300; color: #fff; display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 800; white-space: nowrap; }
        .tab-switch { display: inline-flex; gap: 6px; padding: 5px; border: 1px solid #e1e8f3; border-radius: 11px; background: #f5f7fb; width: max-content; }
        .tab-switch button { border: 0; border-radius: 8px; padding: 9px 16px; background: transparent; color: #5a6c8f; display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 800; }
        .tab-switch button.is-active { background: #fff; color: #172b60; box-shadow: 0 3px 10px rgba(27, 52, 102, .08); }
        .home-section { overflow: hidden; }
        .section-heading { min-height: 60px; padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; }
        .section-heading > div { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .section-heading h5 { margin: 0; font-size: 15px; font-weight: 800; }
        .section-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; flex: 0 0 auto; }
        .add-item { margin-left: auto; padding: 8px 10px; border: 1px solid #ffd28a; border-radius: 6px; background: #fff8ea; color: #ac6d00; display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 800; white-space: nowrap; }
        /* 50/50 columns for editor and preview to keep a stable rectangular preview */
        .hero-editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 21px; padding: 21px; align-items: start; }
        .hero-fields { display: grid; gap: 13px; }
        label { display: grid; gap: 5px; color: #667a9f; font-size: 10px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
        input, textarea, select { width: 100%; box-sizing: border-box; border: 1px solid #d6e0ee; border-radius: 6px; padding: 9px 10px; outline: none; color: #263c70; font: 12px/1.4 inherit; text-transform: none; letter-spacing: 0; background: #fff; }
        input { height: 36px; } textarea { resize: vertical; min-height: 64px; } select { height: 36px; }
        input:focus, textarea:focus, select:focus { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255, 163, 0, .09); }
        .search-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
        .dropdown-hint { margin: 0; font-size: 11px; font-weight: 700; color: #4b7a4f; background: #eef8ef; border: 1px solid #d7ecd9; border-radius: 6px; padding: 8px 10px; }
        .dropdown-hint.is-over { color: #a13f3f; background: #fdefef; border-color: #f3d3d3; }
        /* Fixed rectangular preview to avoid unexpected resizing */
        .hero-preview { height: 360px; padding: 23px; border-radius: 10px; background-position: center; background-size: cover; background-color: #172b60; color: #fff; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
        .hero-preview > span { margin-bottom: 13px; color: #ffe1aa; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .hero-preview h3 { max-width: 400px; margin: 0 0 9px; color: #fff; font-size: 24px; line-height: 1.2; }
        .hero-preview p { margin: 0 0 19px; color: #f1f5ff; font-size: 12px; line-height: 1.5; }
        .hero-preview div { display: grid; grid-template-columns: 1fr 1fr auto; overflow: hidden; border-radius: 6px; background: #fff; }
        .hero-preview button { min-height: 37px; border: 0; border-right: 1px solid #edf0f5; background: #fff; color: #76849e; padding: 0 9px; text-align: left; font-size: 10px; }
        .hero-preview .preview-search { border: 0; background: #ffa300; color: #fff; display: inline-flex; align-items: center; gap: 5px; font-weight: 800; }
        /* Ensure industry list renders as a 4-column card grid on desktop */
        .home-section .compact-list { padding: 5px 21px 18px; display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 18px; }
        .home-section .compact-list > .compact-row { display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; padding: 14px; border: 1px solid #edf1f6; border-radius: 10px; background: #fff; width: auto; box-sizing: border-box; }
        .compact-row.industry-row { grid-template-columns: 44px 1fr auto; align-items: center; }
        .compact-row:last-child { border-bottom: 0; } .row-marker { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 7px; background: #f2f6fc; color: #5270aa; margin-bottom: 0; }
        .row-actions { min-height: 36px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; } .row-actions > span { color: #6e809e; font-size: 10px; font-weight: 700; }
        .delete-item, .delete-text { border: 0; color: #c84b4b; background: #fff1f1; border-radius: 6px; padding: 7px; display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; } .delete-text { margin-top: 5px; width: max-content; }
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
        .approve-btn, .reject-btn { flex: 1; border: 0; border-radius: 6px; padding: 8px; display: inline-flex; align-items: center; justify-content: center; gap: 5px; font-size: 11px; font-weight: 800; }
        .approve-btn { background: #eaf7ec; color: #2f8132; } .approve-btn:hover { background: #dcf1df; }
        .reject-btn { background: #fff1f1; color: #c84b4b; } .reject-btn:hover { background: #ffe6e6; }
        
        @media (max-width: 1150px) { 
          .stats-editor { grid-template-columns: repeat(2, minmax(0, 1fr)); } 
          .compact-list { grid-template-columns: repeat(3, minmax(0, 1fr)); } 
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
          .compact-list { grid-template-columns: 1fr; padding: 5px 16px 16px; }
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

function ContentImageSection({ title, description, icon, items, setItems, type, markChanged, newItem }) {
  const update = (id, changes) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id))
  const add = () => setItems((current) => [...current, newItem()])

  return (
    <section className="home-section">
      <div className="section-heading">
        <span className="section-icon">{icon}</span>
        <div><h5>{title}</h5><p>{description}</p></div>
        <button type="button" className="add-item" onClick={() => { add(); markChanged() }}><Plus size={15} />Add {type}</button>
      </div>
      <div className="image-card-grid">
        {items.map((item) => (
          <article className="image-edit-card" key={item.id}>
            <ImageField value={item.image} onChange={(value) => { update(item.id, { image: value }); markChanged() }} />
            <div className="image-card-body">
              <label>{type === 'location' ? 'Location name' : 'Role name'}<input value={item.name} onChange={(event) => { update(item.id, { name: event.target.value }); markChanged() }} /></label>
              <div className="row-actions">
                <span>{item.enabled ? 'Visible' : 'Hidden'}</span><Toggle enabled={item.enabled} onChange={(enabled) => { update(item.id, { enabled }); markChanged() }} />
                <button type="button" className="delete-item" onClick={() => { remove(item.id); markChanged() }} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <style jsx>{`
        .home-section { overflow: hidden; border: 1px solid #e1e8f3; border-radius: 13px; background: #fff; box-shadow: 0 7px 21px rgba(27, 52, 102, .04); }
        .section-heading { min-height: 60px; padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; }
        .section-heading > div { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .section-heading h5 { margin: 0; color: #172b60; font-size: 15px; font-weight: 800; } .section-heading p { margin: 0; color: #71809f; font-size: 12px; }
        .section-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; flex: 0 0 auto; }
        .add-item { margin-left: auto; padding: 8px 10px; border: 1px solid #ffd28a; border-radius: 6px; background: #fff8ea; color: #ac6d00; display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 800; white-space: nowrap; }
        .image-card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; padding: 20px 21px; }
        .image-edit-card { padding: 14px; border: 1px solid #e3eaf4; border-radius: 10px; background: #fff; display: grid; gap: 12px; }
        .image-card-body { display: grid; gap: 10px; }
        .image-card-body label { display: grid; gap: 5px; color: #667a9f; font-size: 10px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
        .image-card-body input { width: 100%; height: 33px; box-sizing: border-box; border: 1px solid #d6e0ee; border-radius: 6px; padding: 7px; color: #263c70; font: 11px inherit; text-transform: none; letter-spacing: 0; outline: none; }
        .image-card-body input:focus { border-color: #ffa300; }
        .row-actions { min-height: 36px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; } .row-actions > span { color: #6e809e; font-size: 10px; font-weight: 700; }
        .delete-item { border: 0; color: #c84b4b; background: #fff1f1; border-radius: 6px; padding: 7px; display: inline-flex; align-items: center; }
        @media (max-width: 1150px) { .image-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 760px) { .section-heading { align-items: flex-start; flex-wrap: wrap; } .add-item { margin-left: 0; } .image-card-grid { grid-template-columns: 1fr; padding: 16px; } }
      `}</style>
    </section>
  )
}
