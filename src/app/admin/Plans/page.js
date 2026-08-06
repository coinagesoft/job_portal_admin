'use client';

import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Check,
  ChevronDown,
  CreditCard,
  Edit3,
  Plus,
  Save,
  Trash2,
  Users,
} from 'lucide-react';

const regions = [
  { id: 'us', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$', group: 'Global' },
  { id: 'in', name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹', group: 'Global' },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£', group: 'Global' },
  { id: 'au', name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$', group: 'Global' },
  { id: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', symbol: 'AED', group: 'Gulf countries' },
  { id: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', symbol: 'SAR', group: 'Gulf countries' },
  { id: 'qa', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', symbol: 'QAR', group: 'Gulf countries' },
  { id: 'kw', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD', symbol: 'KWD', group: 'Gulf countries' },
  { id: 'bh', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD', symbol: 'BHD', group: 'Gulf countries' },
  { id: 'om', name: 'Oman', flag: '🇴🇲', currency: 'OMR', symbol: 'OMR', group: 'Gulf countries' },
  { id: 'eg', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', symbol: 'E£', group: 'Middle East' },
  { id: 'jo', name: 'Jordan', flag: '🇯🇴', currency: 'JOD', symbol: 'JOD', group: 'Middle East' },
  { id: 'lb', name: 'Lebanon', flag: '🇱🇧', currency: 'LBP', symbol: 'L£', group: 'Middle East' },
  { id: 'tr', name: 'Turkey', flag: '🇹🇷', currency: 'TRY', symbol: '₺', group: 'Middle East' },
];

const basePlans = {
  recruiter: [
    { id: 'rec-lifetime', name: 'Recruiter Lifetime', description: 'One payment for full, permanent recruiter access', price: 499, period: 'one-time', badge: 'Full lifetime access', active: true, features: ['Unlimited job posts', 'Unlimited candidate profile views', 'Unlimited recruiter seats', 'Priority support and account manager'] },
  ],
  candidate: [
    { id: 'can-lifetime', name: 'Candidate Lifetime', description: 'One payment for full, permanent candidate access', price: 99, period: 'one-time', badge: 'Full lifetime access', active: true, features: ['Professional candidate profile', 'Unlimited job applications', 'Priority applications', 'Featured profile placement'] },
  ],
  credits: [
    { id: 'credit-100', name: 'Starter credits', credits: 100, price: 25, bonus: '', active: true },
    { id: 'credit-500', name: 'Growth credits', credits: 500, price: 99, bonus: '50 bonus credits', active: true },
    { id: 'credit-1000', name: 'Scale credits', credits: 1000, price: 179, bonus: '150 bonus credits', active: true },
  ],
};

const priceMultiplier = { us: 1, in: 0.42, gb: 0.82, au: 1.36, ae: 3.67, sa: 3.75, qa: 3.64, kw: 0.31, bh: 0.38, om: 0.38, eg: 48.5, jo: 0.71, lb: 89500, tr: 40.6 };

function makeRegionalPlans(regionId) {
  const multiplier = priceMultiplier[regionId];
  return Object.fromEntries(
    Object.entries(basePlans).map(([key, plans]) => [
      key,
      plans.map((plan) => ({ ...plan, price: Math.round(plan.price * multiplier * 100) / 100 })),
    ]),
  );
}

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState('recruiter');
  const [regionId, setRegionId] = useState('us');
  const [plansByRegion, setPlansByRegion] = useState(() =>
    Object.fromEntries(regions.map((region) => [region.id, makeRegionalPlans(region.id)])),
  );
  const [editingId, setEditingId] = useState(null);
  const [featureDraft, setFeatureDraft] = useState('');
  const [saved, setSaved] = useState(false);
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);

  const region = useMemo(() => regions.find((item) => item.id === regionId), [regionId]);
  const plans = plansByRegion[regionId][activeTab];
  const tabs = [
    { id: 'recruiter', label: 'Recruiter membership', icon: Users },
    { id: 'candidate', label: 'Candidate membership', icon: BadgeCheck },
    { id: 'credits', label: 'Recruiter credits', icon: CreditCard },
  ];
  const regionGroups = ['Global', 'Gulf countries', 'Middle East'];

  const selectRegion = (id) => {
    setRegionId(id);
    setEditingId(null);
    setSaved(false);
    setRegionPickerOpen(false);
  };

  const updatePlan = (id, changes) => {
    setPlansByRegion((current) => ({
      ...current,
      [regionId]: {
        ...current[regionId],
        [activeTab]: current[regionId][activeTab].map((plan) => plan.id === id ? { ...plan, ...changes } : plan),
      },
    }));
    setSaved(false);
  };

  const addPlan = (type = activeTab) => {
    const id = `${type}-${Date.now()}`;
    const membershipDefaults = type === 'recruiter'
      ? {
        name: 'New recruiter plan',
        description: 'Describe the recruiter membership access',
        price: 0,
        period: 'one-time',
        badge: '',
        active: true,
        features: ['Add a recruiter plan feature'],
      }
      : {
        name: 'New candidate plan',
        description: 'Describe the candidate membership access',
        price: 0,
        period: 'one-time',
        badge: '',
        active: true,
        features: ['Add a candidate plan feature'],
      };
    const newPlan = type === 'credits'
      ? { id, name: 'New credit pack', credits: 100, price: 0, bonus: '', active: true }
      : { id, ...membershipDefaults };
    setPlansByRegion((current) => ({
      ...current,
      [regionId]: { ...current[regionId], [type]: [...current[regionId][type], newPlan] },
    }));
    setFeatureDraft(newPlan.features?.join('\n') ?? '');
    setEditingId(id);
    setSaved(false);
  };

  const deletePlan = (id, type = activeTab) => {
    setPlansByRegion((current) => ({
      ...current,
      [regionId]: { ...current[regionId], [type]: current[regionId][type].filter((plan) => plan.id !== id) },
    }));
    setEditingId(null);
    setSaved(false);
  };

  const saveChanges = () => {
    setSaved(true);
    setEditingId(null);
  };

  const togglePlanEditor = (plan) => {
    if (editingId === plan.id) {
      setEditingId(null);
      return;
    }
    setFeatureDraft(plan.features?.join('\n') ?? '');
    setEditingId(plan.id);
  };

  return (
    <div className="plans-page">
      <div className="box-heading plans-heading">
        <div className="box-title">
          <h3 className="mb-5">Plans &amp; Pricing</h3>
          <p className="font-sm color-text-paragraph-2 mb-0">Manage full-access lifetime memberships and recruiter credit packs by country.</p>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: 'none', backgroundColor: 'revert' }}>
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><span>Plans</span></li>
            </ul>
          </div>
        </div>
      </div>

      <section className="plans-toolbar">
        <div>
          <p className="plans-eyebrow">PRICE REGION</p>
          <div className="region-picker">
            <button className="country-select" onClick={() => setRegionPickerOpen((open) => !open)} aria-haspopup="listbox" aria-expanded={regionPickerOpen}>
              <span className="country-flag">{region.flag}</span><span className="country-label"><small>Pricing country</small><b>{region.name}</b></span><span className="currency-code">{region.currency}</span><ChevronDown size={17} className={regionPickerOpen ? 'open' : ''} />
            </button>
            {regionPickerOpen && <div className="region-menu" role="listbox" aria-label="Choose price region">
              <div className="region-menu-title">Choose pricing region</div>
              {regionGroups.map((group) => <div className="region-group" key={group}>
                <span>{group}</span>
                {regions.filter((item) => item.group === group).map((item) => <button key={item.id} className={item.id === regionId ? 'selected' : ''} onClick={() => selectRegion(item.id)} role="option" aria-selected={item.id === regionId}><i>{item.flag}</i><b>{item.name}</b><em>{item.currency}</em><Check size={15} /></button>)}
              </div>)}
            </div>}
          </div>
          <p className="plans-helper">Prices shown in {region.currency}. Changes only apply to {region.name}.</p>
        </div>
        <button className="plans-save" onClick={saveChanges}>
          <Save size={17} /> {saved ? 'Changes saved' : 'Save changes'}
        </button>
      </section>

      <div className="plans-tabs" role="tablist" aria-label="Plan type">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => { setActiveTab(tab.id); setEditingId(null); }}><Icon size={18} />{tab.label}</button>;
        })}
      </div>

      <div className={activeTab === 'credits' ? 'credit-grid' : 'membership-grid'}>
        {plans.map((plan) => {
          const isEditing = editingId === plan.id;
          return (
            <article className={`plan-card ${plan.badge ? 'featured' : ''}`} key={plan.id}>
              {plan.badge && <span className="plan-badge">{plan.badge}</span>}
              <div className="plan-card-top">
                <div>
                  {isEditing ? <input className="edit-name" autoFocus value={plan.name} onChange={(event) => updatePlan(plan.id, { name: event.target.value })} aria-label="Plan name" /> : <h4>{plan.name}</h4>}
                  {isEditing && activeTab !== 'credits' ? <input className="edit-description" value={plan.description} onChange={(event) => updatePlan(plan.id, { description: event.target.value })} aria-label="Plan description" /> : <p>{activeTab === 'credits' ? `${plan.credits.toLocaleString()} credits for recruiters` : plan.description}</p>}
                </div>
                <button className="plan-edit" onClick={() => togglePlanEditor(plan)} aria-label={`Edit ${plan.name}`}><Edit3 size={16} /></button>
              </div>
              <div className="plan-price">
                <span className="currency">{region.symbol}</span>
                {isEditing ? <input type="number" min="0" step="0.01" value={plan.price} onChange={(event) => updatePlan(plan.id, { price: event.target.value === '' ? '' : Number(event.target.value) })} aria-label={`${plan.name} price`} /> : <strong>{Number(plan.price).toLocaleString(undefined, { minimumFractionDigits: Number(plan.price) % 1 ? 2 : 0, maximumFractionDigits: 2 })}</strong>}
                <span className="price-period">{activeTab === 'credits' ? 'one-time' : plan.period}</span>
              </div>
              {activeTab === 'credits' ? (isEditing ? (
                <div className="edit-fields">
                  <label>Credit quantity<input type="number" min="1" value={plan.credits} onChange={(event) => updatePlan(plan.id, { credits: Math.max(1, Number(event.target.value)) })} /></label>
                  <label>Bonus credits<input value={plan.bonus} placeholder="e.g. 50 bonus credits" onChange={(event) => updatePlan(plan.id, { bonus: event.target.value })} /></label>
                </div>
              ) : <div className="credit-details">
                <div><span>Cost per credit</span><b>{region.symbol}{(Number(plan.price) / plan.credits).toFixed(2)}</b></div>
                {plan.bonus ? <span className="credit-bonus">+ {plan.bonus}</span> : <span className="credit-bonus muted">No bonus credits</span>}
              </div>) : (isEditing ? (
                <label className="feature-editor">Full-access features<textarea value={featureDraft} onChange={(event) => { setFeatureDraft(event.target.value); updatePlan(plan.id, { features: event.target.value.split('\n').map((feature) => feature.trim()).filter(Boolean) }); }} /></label>
              ) : <ul className="plan-features">{plan.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>)}
              <div className="plan-footer">
                <button className={`plan-status ${plan.active ? 'is-active' : 'is-inactive'}`} onClick={() => updatePlan(plan.id, { active: !plan.active })} aria-label={`Set ${plan.name} ${plan.active ? 'inactive' : 'active'}`}>
                  <i /> {plan.active ? 'Active' : 'Inactive'}
                </button>
                {isEditing ? <button className="card-save" onClick={() => setEditingId(null)}><Save size={14} />Done</button> : <button className="remove-plan" onClick={() => deletePlan(plan.id)} aria-label={`Remove ${plan.name}`}><Trash2 size={15} /></button>}
              </div>
            </article>
          );
        })}
        <button className="add-plan" onClick={() => addPlan()}>
          <Plus size={22} />
          <span>{activeTab === 'credits' ? 'Add credit pack' : `Create ${activeTab} plan`}</span>
        </button>
      </div>

      <style jsx>{`
        .plans-page { padding-bottom: 34px; color: #172b60; }
        .plans-heading { margin-bottom: 24px; }
        .plans-toolbar { background: #fff; padding: 20px 24px; border-radius: 12px; border: 1px solid #e8edf7; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 20px; box-shadow: 0 7px 22px rgba(34, 59, 115, .04); }
        .plans-eyebrow { margin: 0 0 7px; color: #7786a7; font-size: 10px; line-height: 1; font-weight: 800; letter-spacing: .09em; }
        .region-picker { position: relative; display: inline-block; } .country-select { min-width: 340px; min-height: 58px; border: 1px solid #dbe4f1; background: linear-gradient(135deg, #fff 0%, #f6f9ff 100%); padding: 8px 12px 8px 9px; border-radius: 10px; display: inline-flex; align-items: center; gap: 10px; font-size: 13px; color: #172b60; text-align: left; box-shadow: 0 5px 12px rgba(31, 54, 104, .06); transition: border-color .2s, box-shadow .2s, transform .2s; } .country-select:hover, .country-select:focus { border-color: #ffb13a; box-shadow: 0 8px 18px rgba(255, 163, 0, .14); transform: translateY(-1px); } .country-select svg { color: #7181a0; transition: transform .2s; } .country-select svg.open { transform: rotate(180deg); } .country-flag { width: 38px; height: 38px; border-radius: 8px; background: #fff; border: 1px solid #edf1f7; display: grid; place-items: center; font-size: 21px; box-shadow: 0 2px 5px rgba(38, 55, 92, .06); } .country-label { display: grid; gap: 3px; min-width: 0; } .country-label b { font-size: 13px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .country-label small { color: #8491aa; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; } .currency-code { margin-left: auto; color: #e58e00; background: #fff2d8; border: 1px solid #ffe1a5; padding: 5px 7px; border-radius: 5px; font-size: 10px; font-weight: 800; letter-spacing: .05em; }
        .region-menu { position: absolute; z-index: 20; top: calc(100% + 8px); left: 0; width: 330px; max-height: 405px; overflow-y: auto; padding: 8px; background: #fff; border: 1px solid #d9e2ef; border-radius: 10px; box-shadow: 0 16px 38px rgba(24, 43, 88, .18); } .region-menu-title { padding: 7px 9px 9px; font-size: 11px; color: #7b89a5; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; } .region-group + .region-group { margin-top: 6px; border-top: 1px solid #edf1f6; padding-top: 7px; } .region-group > span { padding: 3px 9px 5px; display: block; color: #ffa300; font-weight: 800; font-size: 10px; letter-spacing: .07em; text-transform: uppercase; } .region-group button { width: 100%; border: 0; background: transparent; border-radius: 6px; padding: 8px 9px; display: flex; align-items: center; gap: 8px; color: #263a6c; text-align: left; } .region-group button:hover, .region-group button.selected { background: #fff6e6; } .region-group button i { font-size: 17px; font-style: normal; } .region-group button b { font-size: 12px; } .region-group button em { margin-left: auto; color: #8090aa; font-size: 10px; font-weight: 800; font-style: normal; letter-spacing: .05em; } .region-group button svg { color: #f5a000; margin-left: 3px; opacity: 0; } .region-group button.selected svg { opacity: 1; }
        .plans-helper { margin: 5px 0 0; font-size: 12px; color: #7381a1; }
        .plans-save { border: 0; background: #ffa300; color: #fff; border-radius: 7px; height: 42px; padding: 0 17px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
        .plans-tabs { border-bottom: 1px solid #dde4f0; display: flex; gap: 26px; margin-bottom: 25px; overflow-x: auto; }
        .plans-tabs button { border: 0; border-bottom: 3px solid transparent; background: transparent; color: #71809f; padding: 0 1px 13px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; white-space: nowrap; }
        .plans-tabs button.active { color: #ff9e00; border-color: #ff9e00; }
        .membership-grid, .credit-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
        .plan-card { position: relative; overflow: hidden; border: 1px solid #e1e7f1; border-radius: 12px; background: #fff; padding: 25px 23px 18px; box-shadow: 0 6px 22px rgba(28, 50, 99, .04); min-height: 320px; display: flex; flex-direction: column; }
        .plan-card.featured { border: 2px solid #ffa300; padding: 24px 22px 17px; box-shadow: 0 9px 28px rgba(255, 163, 0, .12); }
        .plan-badge { position: absolute; top: 0; right: 0; border-radius: 0 10px 0 10px; padding: 6px 12px; background: #ffa300; color: white; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
        .plan-card-top { display: flex; justify-content: space-between; gap: 10px; }
        h4 { color: #172b60; font-size: 19px; margin: 0 0 6px; font-weight: 800; } .plan-card-top p { color: #7482a1; line-height: 1.4; font-size: 12px; margin: 0; min-height: 34px; }
        .plan-edit, .remove-plan { border: 0; background: #f4f7fb; color: #66799e; height: 31px; width: 31px; display: grid; place-items: center; border-radius: 6px; flex: 0 0 auto; }
        .plan-edit:hover, .remove-plan:hover { color: #e25656; background: #fff1f1; }
        .plan-price { min-height: 64px; margin: 21px 0 16px; display: flex; align-items: baseline; color: #172b60; }
        .plan-price .currency { font-size: 20px; font-weight: 800; margin-right: 3px; } .plan-price strong { font-size: 37px; line-height: 1; letter-spacing: -1px; } .price-period { margin-left: 7px; color: #7d8ba7; font-size: 12px; font-weight: 600; }
        .plan-price input { width: 130px; height: 46px; border: 1px solid #ffa300; border-radius: 6px; color: #172b60; font-size: 25px; font-weight: 800; padding: 0 8px; outline: none; }
        .edit-name, .edit-description, .edit-fields input, .feature-editor textarea { width: 100%; border: 1px solid #d5deec; border-radius: 6px; background: #fff; color: #172b60; outline: none; } .edit-name:focus, .edit-description:focus, .edit-fields input:focus, .feature-editor textarea:focus { border-color: #ffa300; }
        .edit-name { height: 34px; padding: 0 8px; font-weight: 800; font-size: 16px; margin-bottom: 6px; } .edit-description { height: 30px; padding: 0 8px; font-size: 12px; color: #526686; }
        .edit-fields { display: grid; gap: 10px; } .edit-fields label, .feature-editor { display: grid; gap: 5px; color: #71809f; font-size: 11px; font-weight: 700; } .edit-fields input { height: 34px; padding: 0 8px; font-size: 13px; font-weight: 500; } .feature-editor textarea { min-height: 106px; resize: vertical; padding: 8px; font: 12px/1.5 inherit; }
        .plan-features { list-style: none; margin: 0; padding: 0; display: grid; gap: 11px; } .plan-features li { color: #526686; display: flex; align-items: center; gap: 8px; font-size: 12px; } .plan-features svg { color: #32b884; flex: 0 0 auto; }
        .plan-footer { margin-top: auto; padding-top: 18px; border-top: 1px solid #edf0f5; display: flex; align-items: center; justify-content: space-between; } .plan-status { border: 0; background: transparent; padding: 0; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; } .plan-status i { width: 7px; height: 7px; border-radius: 50%; } .plan-status.is-active { color: #35a875; } .plan-status.is-active i { background: #35ba82; } .plan-status.is-inactive { color: #8b96a9; } .plan-status.is-inactive i { background: #aab3c1; } .card-save { border: 0; background: #172b60; color: #fff; border-radius: 5px; padding: 6px 9px; display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; }
        .credit-grid .plan-card { min-height: 250px; } .credit-details { margin-top: 2px; display: grid; gap: 14px; } .credit-details div { border-radius: 7px; background: #f5f8fc; padding: 11px 12px; display: flex; justify-content: space-between; align-items: center; color: #6c7e9d; font-size: 12px; } .credit-details b { color: #253a70; } .credit-bonus { color: #269b70; font-size: 12px; font-weight: 700; } .credit-bonus.muted { color: #8190aa; font-weight: 500; }
        .add-plan { min-height: 250px; border: 2px dashed #cdd7e8; border-radius: 12px; color: #6c7d9d; background: rgba(255,255,255,.52); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-size: 13px; font-weight: 700; } .add-plan:hover { color: #ff9e00; border-color: #ffb53d; background: #fff; }
        @media (max-width: 991px) { .membership-grid, .credit-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 600px) { .plans-toolbar { align-items: flex-start; flex-direction: column; padding: 17px; } .country-select { min-width: min(340px, calc(100vw - 72px)); } .region-menu { width: min(330px, calc(100vw - 72px)); } .plans-save { width: 100%; justify-content: center; } .membership-grid, .credit-grid { grid-template-columns: 1fr; } .plans-tabs { gap: 18px; } }
      `}</style>
    </div>
  );
}
