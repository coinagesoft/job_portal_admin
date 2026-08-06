'use client';

import { useMemo, useState } from 'react';
import { BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, Coins, Download, FileText, Search, Users, X } from 'lucide-react';

const countries = [['United States', 'USA'], ['India', 'IND'], ['United Kingdom', 'GBR'], ['Australia', 'AUS'], ['United Arab Emirates', 'UAE'], ['Saudi Arabia', 'KSA'], ['Qatar', 'QAT'], ['Kuwait', 'KWT'], ['Bahrain', 'BHR'], ['Oman', 'OMN'], ['Egypt', 'EGY'], ['Jordan', 'JOR'], ['Lebanon', 'LBN'], ['Turkey', 'TUR']];
const customerNames = ['Nadia Rahman', 'Horizon Talent LLC', 'Apex Recruitment', 'Arjun Mehta', 'Northstar Hiring', 'Talent Bridge Co.', 'Maya Joseph', 'Gulf Talent Partners', 'Oliver James', 'Kareem Al-Sayed'];
const dates = ['28 Oct 2023', '27 Oct 2023', '26 Oct 2023', '25 Oct 2023', '24 Oct 2023', '23 Oct 2023', '22 Oct 2023', '21 Oct 2023', '20 Oct 2023', '19 Oct 2023'];
const transactions = ['candidate', 'recruiter', 'credits'].flatMap((type, typeIndex) => Array.from({ length: 10 }, (_, index) => {
  const [country, code] = countries[(index + typeIndex * 4) % countries.length];
  const number = 10482 - (typeIndex * 10 + index);
  const amount = type === 'candidate' ? 99 : type === 'recruiter' ? 499 : [25, 99, 179][index % 3];
  return { id: `REV-${number}`, date: dates[index], customer: customerNames[(index + typeIndex * 3) % customerNames.length], plan: type === 'candidate' ? 'Candidate Lifetime' : type === 'recruiter' ? 'Recruiter Lifetime' : ['Starter credits · 100', 'Growth credits · 500', 'Scale credits · 1,000'][index % 3], type, country, code, amount, method: type === 'candidate' ? (index % 2 ? 'Card' : 'UPI') : index % 3 ? 'Card' : 'Bank transfer', invoice: `INV-${number}` };
}));

const countryRevenue = [
  { country: 'United Arab Emirates', code: 'AED', monthly: 24680, yearly: 275940 },
  { country: 'Saudi Arabia', code: 'SAR', monthly: 19840, yearly: 218220 },
  { country: 'India', code: 'INR', monthly: 17620, yearly: 193820 },
  { country: 'United States', code: 'USD', monthly: 15960, yearly: 180610 },
  { country: 'Qatar', code: 'QAR', monthly: 11310, yearly: 124950 },
  { country: 'Kuwait', code: 'KWD', monthly: 9610, yearly: 107340 }, { country: 'Bahrain', code: 'BHD', monthly: 8340, yearly: 93120 }, { country: 'Oman', code: 'OMR', monthly: 7780, yearly: 87020 },
  { country: 'United Kingdom', code: 'GBP', monthly: 7540, yearly: 84360 }, { country: 'Australia', code: 'AUD', monthly: 6840, yearly: 76480 }, { country: 'Egypt', code: 'EGP', monthly: 5910, yearly: 66080 },
  { country: 'Jordan', code: 'JOD', monthly: 4890, yearly: 54630 }, { country: 'Lebanon', code: 'LBP', monthly: 3570, yearly: 39870 }, { country: 'Turkey', code: 'TRY', monthly: 3180, yearly: 35490 },
];

const typeLabels = { all: 'All transactions', candidate: 'Candidate memberships', recruiter: 'Recruiter memberships', credits: 'Credit plans' };
const typeStyles = { candidate: 'candidate', recruiter: 'recruiter', credits: 'credits' };

// Transaction dates are stored as "28 Oct 2023" — parse them into real Date objects for range filtering.
function parseTxDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// Format a native <input type="date"> value ("YYYY-MM-DD") into "06 Aug 2026" for display.
const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatDisplayDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return '';
  return `${String(day).padStart(2, '0')} ${monthShort[month - 1]} ${year}`;
}

// Local "today" as YYYY-MM-DD (avoids UTC off-by-one from toISOString near midnight).
function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function RevenuePage() {
  const [transactionType, setTransactionType] = useState('all');
  const [country, setCountry] = useState('All countries');
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [page, setPage] = useState(1);

  // Plain clicks on an opacity:0 date input aren't always treated as a "control click" by the
  // browser, so open the native picker explicitly. showPicker() is the modern API; older
  // browsers fall back to just focusing the field (still keyboard-openable from there).
  const openDatePicker = (event) => {
    const el = event.currentTarget;
    if (el.showPicker) {
      try { el.showPicker(); } catch { el.focus(); }
    } else {
      el.focus();
    }
  };

  const filteredTransactions = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    if (to) to.setHours(23, 59, 59, 999); // include the whole "to" day
    return transactions.filter((item) => {
      const txDate = parseTxDate(item.date);
      return (
        (transactionType === 'all' || item.type === transactionType) &&
        (country === 'All countries' || item.country === country) &&
        (!from || (txDate && txDate >= from)) &&
        (!to || (txDate && txDate <= to)) &&
        `${item.id} ${item.customer} ${item.invoice}`.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [transactionType, country, search, dateFrom, dateTo]);
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / 10));
  const visibleTransactions = filteredTransactions.slice((page - 1) * 10, page * 10);
  const changeType = (value) => { setTransactionType(value); setPage(1); };
  const changeCountry = (value) => { setCountry(value); setPage(1); };
  const changeSearch = (value) => { setSearch(value); setPage(1); };
  const today = todayISO();
  const changeDateFrom = (value) => { setDateFrom(value > today ? today : value); setPage(1); };
  const changeDateTo = (value) => { setDateTo(value > today ? today : value); setPage(1); };
  const clearDates = () => { setDateFrom(''); setDateTo(''); setPage(1); };

  const cards = [
    { title: 'Total revenue', amount: '$89,410', detail: '+12.4% vs last month', icon: ChartNoAxesCombined, color: 'orange' },
    { title: 'Candidate memberships', amount: '$18,820', detail: '21.0% of revenue', icon: Users, color: 'mint' },
    { title: 'Recruiter memberships', amount: '$46,920', detail: '52.5% of revenue', icon: BriefcaseBusiness, color: 'blue' },
    { title: 'Recruiter credit plans', amount: '$23,670', detail: '26.5% of revenue', icon: Coins, color: 'purple' },
  ];

  const totals = countryRevenue.reduce((sum, item) => sum + item[timePeriod], 0);
  const openInvoice = (item) => setInvoice(item);

  return (
    <div className="revenue-page">
      <div className="box-heading revenue-heading">
        <div className="box-title"><h3 className="mb-5">Revenue</h3><p className="font-sm color-text-paragraph-2 mb-0">Track membership and credit plan revenue across every market.</p></div>
        <div className="box-breadcrumb"><div className="breadcrumbs" style={{ border: 'none', backgroundColor: 'revert' }}><ul><li><a className="icon-home" href="/admin/dashboard">Admin</a></li><li><span>Revenue</span></li></ul></div></div>
      </div>

      <section className="revenue-filter-bar">
        <div className="filter-title"><span>Revenue reporting</span><small>Filter totals and transactions by market</small></div>
        <div className="report-filters">
          <select value={country} onChange={(event) => changeCountry(event.target.value)} aria-label="Country filter"><option>All countries</option>{countries.map(([name]) => <option key={name}>{name}</option>)}</select>
          <div className="date-range" aria-label="Custom date range">
            <div className="date-field">
              <span className="date-field-icon"><CalendarDays size={14} /></span>
              <div className="date-field-body">
                <span className="date-range-label">From</span>
                <span className={`date-field-value${dateFrom ? '' : ' is-placeholder'}`}>{formatDisplayDate(dateFrom) || 'Select date'}</span>
              </div>
              <input type="date" value={dateFrom} onChange={(event) => changeDateFrom(event.target.value)} onClick={openDatePicker} onFocus={openDatePicker} max={dateTo && dateTo < today ? dateTo : today} aria-label="From date" />
            </div>
            <span className="date-range-sep">→</span>
            <div className="date-field">
              <span className="date-field-icon"><CalendarDays size={14} /></span>
              <div className="date-field-body">
                <span className="date-range-label">To</span>
                <span className={`date-field-value${dateTo ? '' : ' is-placeholder'}`}>{formatDisplayDate(dateTo) || 'Select date'}</span>
              </div>
              <input type="date" value={dateTo} onChange={(event) => changeDateTo(event.target.value)} onClick={openDatePicker} onFocus={openDatePicker} min={dateFrom || undefined} max={today} aria-label="To date" />
            </div>
            {(dateFrom || dateTo) && <button type="button" className="date-range-clear" onClick={clearDates} aria-label="Clear date range"><X size={14} /></button>}
          </div>
          <div className="period-switch" aria-label="Revenue period"><button className={timePeriod === 'monthly' ? 'active' : ''} onClick={() => setTimePeriod('monthly')}>Monthly</button><button className={timePeriod === 'yearly' ? 'active' : ''} onClick={() => setTimePeriod('yearly')}>Yearly</button></div>
        </div>
      </section>

      <div className="revenue-cards">
        {cards.map((card) => { const Icon = card.icon; return <article className="revenue-card" key={card.title}><span className={`revenue-icon ${card.color}`}><Icon size={21} /></span><div><p>{card.title}</p><h4>{card.amount}</h4><small>{card.detail}</small></div></article>; })}
      </div>

      <div className="revenue-insights">
        <section className="country-panel">
          <div className="panel-heading"><div><h4>Revenue by country</h4><p>{timePeriod === 'monthly' ? 'Current month' : 'Current year'} revenue performance</p></div><strong>${totals.toLocaleString()}</strong></div>
          <div className="country-list">
            {countryRevenue.filter((item) => country === 'All countries' || item.country === country).map((item) => <div className="country-row" key={item.country}><div><span className="country-dot">{item.code.slice(0, 2)}</span><b>{item.country}</b></div><div className="country-progress"><i style={{ width: `${Math.round((item[timePeriod] / totals) * 100)}%` }} /></div><strong>${item[timePeriod].toLocaleString()}</strong></div>)}
          </div>
        </section>
        <aside className="period-panel"><span>{timePeriod === 'monthly' ? 'Monthly revenue' : 'Yearly revenue'}</span><h3>${totals.toLocaleString()}</h3><p>Across {country === 'All countries' ? 'all active countries' : country}</p><div className="revenue-composition"><div><i className="candidate" />Candidate memberships <b>21%</b></div><div><i className="recruiter" />Recruiter memberships <b>52.5%</b></div><div><i className="credits" />Credit plans <b>26.5%</b></div></div></aside>
      </div>

      <section className="transactions-panel">
        <div className="transactions-top"><div><h4>Plan transactions</h4><p>{dateFrom || dateTo ? `Showing transactions ${dateFrom ? `from ${dateFrom}` : 'up to'}${dateFrom && dateTo ? ' to ' : ''}${dateTo ? dateTo : dateFrom ? ' onward' : ''}.` : 'Every completed membership and credit-plan payment.'}</p></div><label className="transaction-search"><Search size={16} /><input value={search} onChange={(event) => changeSearch(event.target.value)} placeholder="Search transaction or invoice" /></label></div>
        <div className="transaction-tabs">{Object.entries(typeLabels).map(([id, label]) => <button key={id} className={transactionType === id ? 'active' : ''} onClick={() => changeType(id)}>{label}</button>)}</div>
        <div className="table-responsive"><table className="revenue-table"><thead><tr><th>Customer</th><th>Plan</th><th>Country</th><th>Date</th><th>Amount</th><th>Transaction ID</th><th>Invoice</th></tr></thead><tbody>{visibleTransactions.map((item) => <tr key={item.id}><td>{item.customer}</td><td><span className={`plan-type ${typeStyles[item.type]}`}>{item.plan}</span></td><td><span className="country-code">{item.code}</span> {item.country}</td><td>{item.date}</td><td><b>${item.amount.toLocaleString()}</b></td><td><b>{item.id}</b></td><td><button className="invoice-button" onClick={() => openInvoice(item)}><FileText size={15} />{item.invoice}</button></td></tr>)}</tbody></table></div>
        {filteredTransactions.length > 0 && <div className="table-pagination"><span>Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, filteredTransactions.length)} of {filteredTransactions.length} transactions</span><div><button disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>{Array.from({ length: pageCount }, (_, index) => <button key={index} className={page === index + 1 ? 'active' : ''} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</button></div></div>}
        {filteredTransactions.length === 0 && <div className="empty-state">No transactions match the selected filters.</div>}
      </section>

      {invoice && <div className="invoice-overlay" role="dialog" aria-modal="true"><div className="invoice-modal"><button className="modal-close" onClick={() => setInvoice(null)}>×</button><span className="invoice-logo">JOBBOX</span><h3>Invoice {invoice.invoice}</h3><p>Payment received from <b>{invoice.customer}</b></p><div className="invoice-total"><span>{invoice.plan}</span><b>${invoice.amount.toLocaleString()}</b></div><div className="invoice-meta"><span>Date: {invoice.date}</span><span>Country: {invoice.country}</span><span>Payment: {invoice.method}</span></div><button className="download-invoice" onClick={() => window.print()}><Download size={16} />Download invoice</button></div></div>}

      <style jsx>{`
        .revenue-page { color: #172b60; padding-bottom: 35px; } .revenue-heading { margin-bottom: 23px; }
        .revenue-filter-bar { padding: 17px 22px; display: flex; align-items: center; justify-content: space-between; gap: 18px; border-radius: 12px; background: #fff; border: 1px solid #e3eaf4; box-shadow: 0 7px 20px rgba(34,59,115,.04); } .filter-title { display: grid; gap: 3px; } .filter-title span { font-size: 14px; font-weight: 800; } .filter-title small, .panel-heading p, .transactions-top p { color: #7382a1; font-size: 12px; margin: 0; } .report-filters { display: flex; align-items: center; gap: 11px; } .report-filters select { min-width: 190px; height: 39px; border: 1px solid #d6e0ee; background: #fff; border-radius: 7px; color: #344976; padding: 0 10px; font-size: 12px; font-weight: 700; outline: none; } .date-range { display: flex; align-items: center; gap: 6px; height: 44px; padding: 4px; border: 1px solid #e3eaf4; border-radius: 10px; background: #f7f9fc; box-sizing: border-box; flex-shrink: 0; position: relative; } .date-field { position: relative; display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 11px 0 4px; border-radius: 8px; background: #fff; border: 1px solid transparent; cursor: pointer; box-sizing: border-box; transition: border-color .15s ease, box-shadow .15s ease; } .date-field:hover, .date-field:focus-within { border-color: #ffcb80; box-shadow: 0 0 0 3px rgba(239,150,0,.1); } .date-field-icon { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; background: #fff1d7; color: #ed9600; flex-shrink: 0; pointer-events: none; } .date-field-body { display: flex; flex-direction: column; justify-content: center; gap: 1px; line-height: 1; pointer-events: none; min-width: 80px; } .date-range-label { color: #96a2ba; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; flex-shrink: 0; } .date-field-value { color: #344976; font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; line-height: 16px; } .date-field-value.is-placeholder { color: #adb8cc; font-weight: 600; } .date-field input[type="date"] { position: absolute; inset: 0; width: 100%; height: 100%; box-sizing: border-box; border: 0; outline: 0; margin: 0; padding: 0; opacity: 0; cursor: pointer; color-scheme: light; } .date-range-sep { color: #c3cce0; flex-shrink: 0; } .date-range-clear { display: grid; place-items: center; width: 26px; height: 26px; margin-left: 2px; border: 0; border-radius: 50%; background: #fff; color: #7382a1; cursor: pointer; flex-shrink: 0; } .date-range-clear:hover { background: #ffe9e9; color: #c62828; } .period-switch { padding: 3px; border-radius: 7px; background: #f2f5fa; display: flex; } .period-switch button { border: 0; background: transparent; padding: 7px 11px; color: #7786a4; border-radius: 5px; font-size: 12px; font-weight: 700; } .period-switch button.active { background: #fff; color: #ef9600; box-shadow: 0 2px 5px rgba(35,59,106,.1); }
        .revenue-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin: 19px 0; } .revenue-card { min-height: 132px; padding: 22px 19px; border: 1px solid #e3eaf4; border-radius: 12px; background: #fff; display: flex; gap: 14px; align-items: flex-start; box-shadow: 0 6px 18px rgba(34,59,115,.035); } .revenue-icon { width: 42px; height: 42px; border-radius: 9px; display: grid; place-items: center; } .revenue-icon.orange { background:#fff1d7; color:#ed9600; }.revenue-icon.mint { background:#e7f8f2; color:#2cad83; }.revenue-icon.blue { background:#e9f0ff; color:#5378cc; }.revenue-icon.purple { background:#f1eafa; color:#8a69c7; } .revenue-card p { margin: 0 0 4px; color:#71809f; font-size:12px; }.revenue-card h4 { margin:0 0 5px; font-size:23px; font-weight:800; }.revenue-card small { color:#2ba978; font-size:11px; font-weight:700; }
        .revenue-insights { display:grid; grid-template-columns: 1.65fr .8fr; gap:18px; }.country-panel,.period-panel,.transactions-panel { background:#fff; border:1px solid #e3eaf4; border-radius:12px; box-shadow:0 6px 18px rgba(34,59,115,.035); }.country-panel { padding:21px; }.panel-heading { display:flex; justify-content:space-between; align-items:start; padding-bottom:17px; border-bottom:1px solid #edf1f6; }.panel-heading h4,.transactions-top h4 { margin:0 0 5px; font-size:16px; font-weight:800; }.panel-heading > strong { color:#ef9700; font-size:18px; }.country-list { display:grid; gap:15px; padding-top:18px; }.country-row { display:grid; grid-template-columns:180px 1fr 92px; gap:13px; align-items:center; }.country-row > div:first-child { display:flex; align-items:center; gap:8px; font-size:12px; }.country-dot { background:#eaf0fa; color:#607498; padding:4px 5px; font-size:9px; font-weight:800; border-radius:4px; }.country-progress { height:7px; background:#edf1f7; border-radius:99px; overflow:hidden; }.country-progress i { height:100%; display:block; border-radius:inherit; background:linear-gradient(90deg,#ffb538,#ff9900); }.country-row > strong { text-align:right; font-size:12px; }.period-panel { padding:23px; background:linear-gradient(145deg,#233c78,#172b60); color:#fff; }.period-panel > span { color:#c9d5f1; font-size:12px; font-weight:700; }.period-panel h3 { margin:9px 0 4px; font-size:29px; color:#fff; }.period-panel p { color:#b9c8e7; font-size:12px; }.revenue-composition { margin-top:25px; border-top:1px solid rgba(255,255,255,.15); padding-top:14px; display:grid; gap:12px; }.revenue-composition div { display:flex; align-items:center; color:#e7edf9; font-size:11px; }.revenue-composition i { width:8px; height:8px; border-radius:50%; margin-right:7px; }.revenue-composition i.candidate{background:#49c3a2}.revenue-composition i.recruiter{background:#ffc151}.revenue-composition i.credits{background:#9b7bdd}.revenue-composition b{margin-left:auto;color:#fff;}
        .transactions-panel { margin-top:18px; overflow:hidden; }.transactions-top { padding:21px 21px 15px; display:flex; align-items:center; justify-content:space-between; gap:15px; }.transaction-search { width:260px; height:38px; display:flex; align-items:center; gap:8px; padding:0 10px; border:1px solid #d9e2ef; border-radius:7px; color:#8391aa; }.transaction-search input { width:100%; border:0; outline:0; font-size:12px; color:#263b70; }.transaction-tabs { border-top:1px solid #edf1f6; border-bottom:1px solid #edf1f6; padding:0 20px; display:flex; gap:24px; overflow:auto; }.transaction-tabs button { padding:13px 0 11px; white-space:nowrap; border:0; background:transparent; border-bottom:3px solid transparent; color:#71809f; font-size:12px; font-weight:700; }.transaction-tabs button.active { color:#f39b00; border-color:#f39b00; }.revenue-table { width:100%; min-width:920px; border-collapse:collapse; }.revenue-table th { padding:13px 20px; text-align:left; background:#fafbfd; color:#8592aa; font-size:10px; text-transform:uppercase; letter-spacing:.05em; }.revenue-table td { padding:15px 20px; color:#506486; font-size:12px; border-top:1px solid #edf1f6; white-space:nowrap; }.revenue-table td b { color:#24396b; }.revenue-table td small { display:block; color:#8491aa; margin-top:3px; }.plan-type { padding:5px 8px; border-radius:5px; font-size:10px; font-weight:800; }.plan-type.candidate{color:#168e70;background:#e8f8f2}.plan-type.recruiter{color:#c57d00;background:#fff3da}.plan-type.credits{color:#7351ae;background:#f1eafd}.country-code { font-size:9px; font-weight:800; color:#7485a6; background:#edf1f7; padding:4px 5px; border-radius:4px; }.invoice-button { border:0; background:#f3f6fb; color:#45659b; border-radius:5px; padding:6px 8px; font-size:11px; display:inline-flex; align-items:center; gap:5px; font-weight:700; }.table-pagination { padding:15px 20px; border-top:1px solid #edf1f6; display:flex; align-items:center; justify-content:space-between; gap:12px; color:#7b8aa5; font-size:12px; }.table-pagination div{display:flex;gap:5px}.table-pagination button{height:30px;min-width:30px;padding:0 9px;border:1px solid #dce4ef;border-radius:5px;background:#fff;color:#5f7194;font-size:11px;font-weight:700}.table-pagination button.active{color:#fff;background:#ffa300;border-color:#ffa300}.table-pagination button:disabled{opacity:.45;cursor:not-allowed}.empty-state { padding:30px; text-align:center; color:#7c8ba7; font-size:13px; }.invoice-overlay { position:fixed; inset:0; z-index:50; background:rgba(16,29,60,.48); display:grid; place-items:center; padding:20px; }.invoice-modal { width:min(430px,100%); background:#fff; padding:28px; border-radius:13px; position:relative; box-shadow:0 20px 65px rgba(0,0,0,.28); }.modal-close { position:absolute; top:12px; right:15px; border:0; background:transparent; color:#7d8ba6; font-size:26px; }.invoice-logo { color:#f39b00; letter-spacing:.1em; font-weight:900; font-size:11px; }.invoice-modal h3 { margin:8px 0; font-size:20px; }.invoice-modal p { font-size:13px; color:#667a9f; }.invoice-total { margin:22px 0 14px; padding:15px; display:flex; justify-content:space-between; border-radius:8px; background:#f3f6fb; font-size:13px; }.invoice-total b { font-size:21px; }.invoice-meta { display:grid; gap:7px; padding-bottom:20px; color:#71819e; font-size:12px; }.download-invoice { width:100%; padding:11px; border:0; border-radius:7px; background:#ffa300; color:white; font-weight:800; display:flex; justify-content:center; align-items:center; gap:7px; font-size:12px; }
        @media(max-width:1100px){.revenue-cards{grid-template-columns:repeat(2,1fr)}.revenue-insights{grid-template-columns:1fr}.country-row{grid-template-columns:150px 1fr 92px}}@media(max-width:620px){.revenue-filter-bar,.transactions-top{align-items:flex-start;flex-direction:column}.report-filters{width:100%;flex-wrap:wrap}.report-filters select{flex:1;min-width:0}.date-range{width:100%;flex-wrap:wrap;height:auto;padding:5px}.date-field{flex:1;min-width:132px}.date-range input[type="date"]{min-width:84px}.revenue-cards{grid-template-columns:1fr}.country-row{grid-template-columns:115px 1fr 72px;gap:7px}.country-row>div:first-child b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.transaction-search{width:100%}}
      `}</style>
    </div>
  );
}