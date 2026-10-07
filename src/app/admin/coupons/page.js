'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {

    Plus,

    Edit3,

    Power,

    Search,

    RefreshCw,

    X,

    Save,

    Tag,

    Users,

    Calendar,

    Percent,

    IndianRupee,

    AlertCircle,

    CheckCircle,

    ChevronDown,

} from 'lucide-react';



import { couponService } from '../../../services/couponService.js';

import { planService } from '../../../services/planService.js';
import Footer from '../../../components/Footer';

import './CouponsPage.css';



const regions = [

    { id: 'us', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },

    { id: 'in', name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹' },

    { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' },

    { id: 'au', name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },

    { id: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ' },

    { id: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', symbol: '﷼' },

    { id: 'qa', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', symbol: '﷼' },

    { id: 'kw', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD', symbol: 'د.ك' },

    { id: 'bh', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD', symbol: '.د.ب' },

    { id: 'om', name: 'Oman', flag: '🇴🇲', currency: 'OMR', symbol: '﷼' },

    { id: 'eg', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', symbol: 'E£' },

    { id: 'jo', name: 'Jordan', flag: '🇯🇴', currency: 'JOD', symbol: 'JD' },

    { id: 'lb', name: 'Lebanon', flag: '🇱🇧', currency: 'LBP', symbol: 'ل.ل' },

    { id: 'tr', name: 'Turkey', flag: '🇹🇷', currency: 'TRY', symbol: '₺' },

];



const emptyForm = {

    code: '',

    planType: 'Recruiter',

    region: 'in',

    planId: '',

    applyToSpecificPlan: false,

    discountType: 'Percentage',

    discountValue: '',

    minimumAmount: '',

    maximumDiscount: '',

    usageLimit: '',

    perUserLimit: '',

    startAt: '',

    expiresAt: '',

    isActive: true,

};



const getRegion = (regionId) =>

    regions.find((r) => r.id === String(regionId).toLowerCase()) || {

        id: regionId,

        name: regionId,

        flag: '🌐',

        currency: '',

        symbol: '',

    };





const getApiData = (response, fallback = []) => {

    if (!response) return fallback;



    if (Array.isArray(response)) {

        return response;

    }



    if (Array.isArray(response.data)) {

        return response.data;

    }



    if (response.data?.data && Array.isArray(response.data.data)) {

        return response.data.data;

    }



    if (response.data?.success && Array.isArray(response.data.data)) {

        return response.data.data;

    }



    return fallback;

};



const formatDate = (value) => {

    if (!value) return '—';



    const date = new Date(value);



    if (Number.isNaN(date.getTime())) return '—';



    return date.toLocaleDateString('en-IN', {

        day: '2-digit',

        month: 'short',

        year: 'numeric',

    });

};



const formatDateTimeLocal = (value) => {

    if (!value) return '';



    const date = new Date(value);



    if (Number.isNaN(date.getTime())) return '';



    const pad = (number) => String(number).padStart(2, '0');



    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(

        date.getDate()

    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

};



const toIsoOrNull = (value) => {

    if (!value) return null;



    const date = new Date(value);



    if (Number.isNaN(date.getTime())) return null;



    return date.toISOString();

};



const getErrorMessage = (error) => {

    if (!error) return 'Something went wrong.';



    if (typeof error === 'string') return error;



    const message =

        error?.response?.data?.message ||

        error?.response?.data?.error ||

        error?.message;



    if (message && message !== 'An error occurred') {

        return message;

    }



    if (error?.status) {

        return `Request failed (HTTP ${error.status}). Please check the API/server logs.`;

    }



    return message || 'Something went wrong.';

};



export default function CouponsPage() {

    const [coupons, setCoupons] = useState([]);



    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deactivatingId, setDeactivatingId] = useState(null);



    const [search, setSearch] = useState('');

    const [filterPlanType, setFilterPlanType] = useState('');

    const [filterRegion, setFilterRegion] = useState('');

    const [filterStatus, setFilterStatus] = useState('');



    const [showModal, setShowModal] = useState(false);

    const [editingCoupon, setEditingCoupon] = useState(null);



    const [form, setForm] = useState(emptyForm);

    const [plans, setPlans] = useState([]);

    const [plansLoading, setPlansLoading] = useState(false);



    const [message, setMessage] = useState({

        type: '',

        text: '',

    });



    const isEditMode = Boolean(editingCoupon);



    const selectedRegion = useMemo(

        () => getRegion(form.region),

        [form.region]

    );







    const fetchCoupons = async () => {

        try {

            setLoading(true);

            setMessage({ type: '', text: '' });



            const response = await couponService.getCoupons(

                filterPlanType || undefined,

                filterRegion || undefined,

                filterStatus === ''

                    ? undefined

                    : filterStatus === 'active'

            );



            const data = getApiData(response, []);



            setCoupons(data);

        } catch (error) {

            console.error('Failed to load coupons:', error);



            setMessage({

                type: 'error',

                text: getErrorMessage(error),

            });



            setCoupons([]);

        } finally {

            setLoading(false);

        }

    };






    const fetchPlansForForm = async () => {

        if (!form.applyToSpecificPlan) {

            setPlans([]);

            return;

        }



        if (!form.planType || !form.region) {

            setPlans([]);

            return;

        }



        try {

            setPlansLoading(true);



            const response = await planService.getActiveMembershipPlans(

                form.planType,

                selectedRegion.name.toLowerCase()

            );



            const data = getApiData(response, []);



            setPlans(data);





            if (

                form.planId &&

                !data.some(

                    (plan) =>

                        String(plan.planId || plan.PlanId) === String(form.planId)

                )

            ) {

                setForm((prev) => ({

                    ...prev,

                    planId: '',

                }));

            }

        } catch (error) {

            console.error('Failed to load membership plans:', error);



            setPlans([]);



            setMessage({

                type: 'error',

                text: getErrorMessage(error),

            });

        } finally {

            setPlansLoading(false);

        }

    };



    useEffect(() => {

        fetchCoupons();

    }, [filterPlanType, filterRegion, filterStatus]);



    useEffect(() => {

        if (showModal && form.applyToSpecificPlan) {

            fetchPlansForForm();

        }

    }, [

        showModal,

        form.applyToSpecificPlan,

        form.planType,

        form.region,

    ]);







    const filteredCoupons = useMemo(() => {

        const keyword = search.trim().toLowerCase();



        if (!keyword) return coupons;



        return coupons.filter((coupon) => {

            const code = String(coupon.code || '').toLowerCase();

            const planName = String(coupon.planName || '').toLowerCase();



            return (

                code.includes(keyword) ||

                planName.includes(keyword)

            );

        });

    }, [coupons, search]);







    const updateForm = (field, value) => {

        setForm((prev) => ({

            ...prev,

            [field]: value,

        }));

    };



    const handlePlanTypeChange = (value) => {

        setForm((prev) => ({

            ...prev,

            planType: value,

            planId: '',

        }));



        setPlans([]);

    };



    const handleRegionChange = (value) => {

        setForm((prev) => ({

            ...prev,

            region: value,

            planId: '',

        }));



        setPlans([]);

    };



    const handleSpecificPlanChange = (checked) => {

        setForm((prev) => ({

            ...prev,

            applyToSpecificPlan: checked,

            planId: checked ? prev.planId : '',

        }));



        if (!checked) {

            setPlans([]);

        }

    };






    const openCreateModal = () => {
        setEditingCoupon(null);

        const selectedFilterRegion = regions.find(
            (region) =>
                region.name.trim().toLowerCase() ===
                String(filterRegion || '').trim().toLowerCase()
        );

        setForm({
            ...emptyForm,
            region: selectedFilterRegion?.id || 'in',
            planType: filterPlanType || 'Recruiter',
        });

        setPlans([]);

        setMessage({
            type: '',
            text: '',
        });

        setShowModal(true);
    };






    const openEditModal = async (coupon) => {

        setEditingCoupon(coupon);

        const hasSpecificPlan = Boolean(coupon.planId);

        const couponRegionValue = String(
            coupon.region || ''
        ).trim().toLowerCase();

        const couponRegion = regions.find(
            (region) =>
                region.id.trim().toLowerCase() === couponRegionValue ||
                region.name.trim().toLowerCase() === couponRegionValue
        );

        setForm({

            code: coupon.code || '',

            planType: coupon.planType || 'Recruiter',

            region: couponRegion?.id || 'in',

            planId: coupon.planId || '',

            applyToSpecificPlan: hasSpecificPlan,

            discountType: coupon.discountType || 'Percentage',

            discountValue:
                coupon.discountValue !== null &&
                    coupon.discountValue !== undefined
                    ? String(coupon.discountValue)
                    : '',

            minimumAmount:
                coupon.minimumAmount !== null &&
                    coupon.minimumAmount !== undefined
                    ? String(coupon.minimumAmount)
                    : '',

            maximumDiscount:
                coupon.maximumDiscount !== null &&
                    coupon.maximumDiscount !== undefined
                    ? String(coupon.maximumDiscount)
                    : '',

            usageLimit:
                coupon.usageLimit !== null &&
                    coupon.usageLimit !== undefined
                    ? String(coupon.usageLimit)
                    : '',

            perUserLimit:
                coupon.perUserLimit !== null &&
                    coupon.perUserLimit !== undefined
                    ? String(coupon.perUserLimit)
                    : '',

            startAt: formatDateTimeLocal(coupon.startAt),

            expiresAt: formatDateTimeLocal(coupon.expiresAt),

            isActive: Boolean(coupon.isActive),

        });

        setPlans([]);

        setMessage({
            type: '',
            text: '',
        });

        setShowModal(true);
    };







    const closeModal = () => {

        if (saving) return;



        setShowModal(false);

        setEditingCoupon(null);

        setPlans([]);

    };







    // Lock background scroll + close popup on Escape while it is open
    useEffect(() => {
        if (!showModal) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event) => {
            if (event.key === 'Escape' && !saving) {
                setShowModal(false);
                setEditingCoupon(null);
                setPlans([]);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [showModal, saving]);



    const validateForm = () => {

        const code = form.code.trim();



        if (!code) {

            return 'Coupon code is required.';

        }



        if (!/^[A-Za-z0-9\_-]+$/.test(code)) {

            return 'Coupon code can contain only letters, numbers, hyphen and underscore.';

        }



        const discountValue = Number(form.discountValue);



        if (!Number.isFinite(discountValue) || discountValue <= 0) {

            return 'Discount value must be greater than 0.';

        }



        if (

            form.discountType === 'Percentage' &&

            discountValue > 100

        ) {

            return 'Percentage discount cannot be greater than 100%.';

        }



        if (

            form.minimumAmount !== '' &&

            (Number(form.minimumAmount) < 0 ||

                !Number.isFinite(Number(form.minimumAmount)))

        ) {

            return 'Minimum amount must be a valid non-negative number.';

        }



        if (

            form.maximumDiscount !== '' &&

            (Number(form.maximumDiscount) < 0 ||

                !Number.isFinite(Number(form.maximumDiscount)))

        ) {

            return 'Maximum discount must be a valid non-negative number.';

        }



        if (

            form.usageLimit !== '' &&

            (!Number.isInteger(Number(form.usageLimit)) ||

                Number(form.usageLimit) < 1)

        ) {

            return 'Usage limit must be a positive whole number.';

        }



        if (

            form.perUserLimit !== '' &&

            (!Number.isInteger(Number(form.perUserLimit)) ||

                Number(form.perUserLimit) < 1)

        ) {

            return 'Per-user limit must be a positive whole number.';

        }



        if (

            form.applyToSpecificPlan &&

            !form.planId

        ) {

            return 'Please select a membership plan.';

        }



        if (form.startAt && form.expiresAt) {

            const start = new Date(form.startAt);

            const expiry = new Date(form.expiresAt);



            if (expiry <= start) {

                return 'Expiry date must be after the start date.';

            }

        }



        return null;

    };






    const handleSave = async (event) => {

        event.preventDefault();



        if (saving) return;



        const validationError = validateForm();



        if (validationError) {

            setMessage({

                type: 'error',

                text: validationError,

            });



            return;

        }



        const payload = {

            code: form.code.trim().toUpperCase(),

            planType: form.planType,

            region: selectedRegion.name.toLowerCase(),

            planId: form.applyToSpecificPlan

                ? form.planId

                : null,

            discountType: form.discountType,

            discountValue: Number(form.discountValue),

            minimumAmount:

                form.minimumAmount === ''

                    ? null

                    : Number(form.minimumAmount),

            maximumDiscount:

                form.maximumDiscount === ''

                    ? null

                    : Number(form.maximumDiscount),

            usageLimit:

                form.usageLimit === ''

                    ? null

                    : Number(form.usageLimit),

            perUserLimit:

                form.perUserLimit === ''

                    ? null

                    : Number(form.perUserLimit),

            startAt: toIsoOrNull(form.startAt),

            expiresAt: toIsoOrNull(form.expiresAt),

            isActive: Boolean(form.isActive),

        };



        try {

            setSaving(true);



            setMessage({

                type: '',

                text: '',

            });



            if (isEditMode) {

                await couponService.updateCoupon(

                    editingCoupon.couponId,

                    payload

                );

            } else {

                await couponService.createCoupon(payload);

            }



            setMessage({

                type: 'success',

                text: isEditMode

                    ? 'Coupon updated successfully.'

                    : 'Coupon created successfully.',

            });



            setShowModal(false);

            setEditingCoupon(null);

            setPlans([]);



            await fetchCoupons();

        } catch (error) {

            console.error('Save coupon error:', error);



            setMessage({

                type: 'error',

                text: getErrorMessage(error),

            });

        } finally {

            setSaving(false);

        }

    };







    const handleDeactivate = async (coupon) => {

        if (deactivatingId || saving) return;



        const confirmed = window.confirm(

            `Are you sure you want to deactivate coupon "${coupon.code}"?`

        );



        if (!confirmed) return;



        try {

            setDeactivatingId(coupon.couponId);



            await couponService.deactivateCoupon(

                coupon.couponId

            );



            setMessage({

                type: 'success',

                text: 'Coupon deactivated successfully.',

            });



            await fetchCoupons();

        } catch (error) {

            console.error('Deactivate coupon error:', error);



            setMessage({

                type: 'error',

                text: getErrorMessage(error),

            });

        } finally {

            setDeactivatingId(null);

        }

    };







    const getDiscountDisplay = (coupon) => {
        if (coupon.discountType === 'Percentage') {
            return `${coupon.discountValue}%`;
        }

        const couponRegion = getRegion(coupon.region);

        return `${couponRegion.symbol || '₹'}${Number(
            coupon.discountValue || 0
        ).toLocaleString('en-IN')}`;
    };







    return (

        <>
            <div className="coupons-page">



                {/* PAGE HEADER - same structure as Plans */}
                <div className="box-heading coupons-heading">
                    <div className="box-title">
                        <h3 className="coupon-page-title">Coupons</h3>
                        <p className="coupon-page-subtitle">
                            Create and manage membership discount coupons.
                        </p>
                    </div>

                    <div className="box-breadcrumb">
                        <div
                            className="breadcrumbs"
                            style={{ border: 'none', backgroundColor: 'revert' }}
                        >
                            <ul>
                                <li>
                                    <a className="icon-home" href="/admin/dashboard">
                                        Admin
                                    </a>
                                </li>
                                <li>
                                    <span>Coupons</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ACTION BAR */}
                <div className="coupons-actions">
                    <div>
                        <p className="coupons-page-label">MEMBERSHIP DISCOUNTS</p>
                        <p className="coupons-helper">
                            Create, manage and deactivate discount coupons for recruiter
                            and candidate memberships.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={openCreateModal}
                        disabled={loading || saving}
                    >
                        <Plus size={18} />
                        Create Coupon
                    </button>
                </div>

                {/* MESSAGE */}

                {message.text && (

                    <div

                        className={`alert ${message.type === 'success'

                            ? 'alert-success'

                            : 'alert-error'

                            }`}

                    >

                        {message.type === 'success' ? (

                            <CheckCircle size={18} />

                        ) : (

                            <AlertCircle size={18} />

                        )}



                        <span>{message.text}</span>



                        <button

                            type="button"

                            onClick={() =>

                                setMessage({ type: '', text: '' })

                            }

                        >

                            <X size={16} />

                        </button>

                    </div>

                )}



                {/* FILTER CARD */}

                <div className="filter-card">



                    <div className="search-box">

                        <Search size={18} />



                        <input

                            type="text"

                            placeholder="Search coupon code or plan..."

                            value={search}

                            onChange={(e) => setSearch(e.target.value)}

                        />

                    </div>



                    <div className="filter-control">

                        <label>Plan Type</label>



                        <select

                            value={filterPlanType}

                            onChange={(e) =>

                                setFilterPlanType(e.target.value)

                            }

                        >

                            <option value="">All Types</option>

                            <option value="Recruiter">Recruiter</option>

                            <option value="Candidate">Candidate</option>

                        </select>

                    </div>



                    <div className="filter-control">

                        <label>Region</label>



                        <select

                            value={filterRegion}

                            onChange={(e) =>

                                setFilterRegion(e.target.value)

                            }

                        >

                            <option value="">All Regions</option>



                            {regions.map((region) => (
                                <option
                                    key={region.id}
                                    value={region.name}
                                >
                                    {region.flag} {region.name}
                                </option>
                            ))}

                        </select>

                    </div>



                    <div className="filter-control">

                        <label>Status</label>



                        <select

                            value={filterStatus}

                            onChange={(e) =>

                                setFilterStatus(e.target.value)

                            }

                        >

                            <option value="">All Status</option>

                            <option value="active">Active</option>

                            <option value="inactive">Inactive</option>

                        </select>

                    </div>



                    <button

                        type="button"

                        className="refresh-btn"

                        onClick={fetchCoupons}

                        disabled={loading}

                        title="Refresh"

                    >

                        <RefreshCw

                            size={18}

                            className={loading ? 'spin' : ''}

                        />

                    </button>

                </div>



                {/* TABLE */}

                <div className="table-card">



                    <div className="table-header">

                        <div>

                            <h2>Coupon List</h2>



                            <span>

                                {filteredCoupons.length}{' '}

                                {filteredCoupons.length === 1

                                    ? 'coupon'

                                    : 'coupons'}

                            </span>

                        </div>

                    </div>



                    {loading ? (

                        <div className="loading-state">

                            <div className="loader"></div>

                            <p>Loading coupons...</p>

                        </div>

                    ) : filteredCoupons.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">

                                <Tag size={28} />

                            </div>



                            <h3>No coupons found</h3>



                            <p>

                                Create your first coupon to offer discounts

                                on membership plans.

                            </p>



                            <button

                                type="button"

                                className="primary-btn"

                                onClick={openCreateModal}

                            >

                                <Plus size={17} />

                                Create Coupon

                            </button>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="coupon-table">

                                <thead>

                                    <tr>

                                        <th>Coupon</th>

                                        <th>Type</th>

                                        <th>Region</th>

                                        <th>Plan</th>

                                        <th>Discount</th>

                                        <th>Usage</th>

                                        <th>Validity</th>

                                        <th>Status</th>

                                        <th>Actions</th>

                                    </tr>

                                </thead>



                                <tbody>

                                    {filteredCoupons.map((coupon) => {

                                        const region = getRegion(coupon.region);



                                        const usageLimit =

                                            coupon.usageLimit === null ||

                                                coupon.usageLimit === undefined

                                                ? 'Unlimited'

                                                : coupon.usageLimit;



                                        return (

                                            <tr key={coupon.couponId}>



                                                {/* COUPON */}

                                                <td>

                                                    <div className="coupon-code">

                                                        <div className="coupon-code-icon">

                                                            <Tag size={15} />

                                                        </div>



                                                        <div>

                                                            <strong>

                                                                {coupon.code}

                                                            </strong>



                                                            {coupon.minimumAmount !== null &&

                                                                coupon.minimumAmount !==

                                                                undefined && (

                                                                    <small>

                                                                        Min. {region.symbol}

                                                                        {Number(

                                                                            coupon.minimumAmount

                                                                        ).toLocaleString(

                                                                            'en-IN'

                                                                        )}

                                                                    </small>

                                                                )}

                                                        </div>

                                                    </div>

                                                </td>



                                                {/* TYPE */}

                                                <td>

                                                    <span

                                                        className={`type-badge ${String(

                                                            coupon.planType

                                                        ).toLowerCase() ===

                                                            'recruiter'

                                                            ? 'recruiter'

                                                            : 'candidate'

                                                            }`}

                                                    >

                                                        {coupon.planType}

                                                    </span>

                                                </td>



                                                {/* REGION */}

                                                <td>

                                                    <div className="region-cell">

                                                        <span className="region-flag">

                                                            {region.flag}

                                                        </span>



                                                        <span>

                                                            {region.name}

                                                        </span>

                                                    </div>

                                                </td>



                                                {/* PLAN */}

                                                <td>

                                                    {coupon.planId ? (

                                                        <div className="plan-cell">

                                                            <strong>

                                                                {coupon.planName ||

                                                                    'Specific Plan'}

                                                            </strong>



                                                            <small>

                                                                Specific plan

                                                            </small>

                                                        </div>

                                                    ) : (

                                                        <span className="all-plans">

                                                            All plans

                                                        </span>

                                                    )}

                                                </td>



                                                {/* DISCOUNT */}

                                                <td>

                                                    <div className="discount-cell">

                                                        {coupon.discountType ===

                                                            'Percentage' ? (

                                                            <Percent size={16} />

                                                        ) : (

                                                            <IndianRupee size={16} />

                                                        )}



                                                        <strong>

                                                            {coupon.discountType ===

                                                                'Percentage'

                                                                ? `${coupon.discountValue}%`

                                                                : `${region.symbol}${Number(

                                                                    coupon.discountValue ||

                                                                    0

                                                                ).toLocaleString(

                                                                    'en-IN'

                                                                )}`}

                                                        </strong>

                                                    </div>



                                                    {coupon.maximumDiscount !==

                                                        null &&

                                                        coupon.maximumDiscount !==

                                                        undefined && (

                                                            <small className="sub-text">

                                                                Max {region.symbol}

                                                                {Number(

                                                                    coupon.maximumDiscount

                                                                ).toLocaleString('en-IN')}

                                                            </small>

                                                        )}

                                                </td>



                                                {/* USAGE */}

                                                <td>

                                                    <div className="usage-cell">

                                                        <div className="usage-main">

                                                            <Users size={15} />



                                                            <span>

                                                                {coupon.usedCount || 0}

                                                                {' / '}

                                                                {usageLimit}

                                                            </span>

                                                        </div>



                                                        {coupon.perUserLimit && (

                                                            <small>

                                                                {coupon.perUserLimit} per

                                                                user

                                                            </small>

                                                        )}

                                                    </div>

                                                </td>



                                                {/* VALIDITY */}

                                                <td>

                                                    <div className="validity-cell">

                                                        <Calendar size={15} />



                                                        <div>

                                                            <span>

                                                                {formatDate(

                                                                    coupon.startAt

                                                                )}

                                                            </span>



                                                            <small>

                                                                to{' '}

                                                                {formatDate(

                                                                    coupon.expiresAt

                                                                )}

                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>



                                                {/* STATUS */}

                                                <td>

                                                    {coupon.isActive ? (

                                                        <span className="status-badge active">

                                                            <span className="status-dot"></span>

                                                            Active

                                                        </span>

                                                    ) : (

                                                        <span className="status-badge inactive">

                                                            <span className="status-dot"></span>

                                                            Inactive

                                                        </span>

                                                    )}

                                                </td>



                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="action-buttons">



                                                        <button

                                                            type="button"

                                                            className="icon-btn edit"

                                                            onClick={() =>

                                                                openEditModal(coupon)

                                                            }

                                                            disabled={

                                                                saving ||

                                                                Boolean(deactivatingId)

                                                            }

                                                            title="Edit coupon"

                                                        >

                                                            <Edit3 size={16} />

                                                        </button>



                                                        {coupon.isActive && (

                                                            <button

                                                                type="button"

                                                                className="icon-btn deactivate"

                                                                onClick={() =>

                                                                    handleDeactivate(

                                                                        coupon

                                                                    )

                                                                }

                                                                disabled={

                                                                    saving ||

                                                                    deactivatingId ===

                                                                    coupon.couponId

                                                                }

                                                                title="Deactivate coupon"

                                                            >

                                                                {deactivatingId ===

                                                                    coupon.couponId ? (

                                                                    <span className="mini-loader"></span>

                                                                ) : (

                                                                    <Power size={16} />

                                                                )}

                                                            </button>

                                                        )}

                                                    </div>

                                                </td>



                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            {showModal && (
                <div
                    className="coupon-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !saving) {
                            closeModal();
                        }
                    }}
                >
                    <div
                        className="coupon-create-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="coupon-modal-title"
                    >

                        {/* =====================================================
                MODAL HEADER
            ====================================================== */}
                        <div className="coupon-create-modal-header">

                            <div className="coupon-create-modal-heading">

                                <div className="coupon-create-modal-icon">
                                    <Tag size={21} />
                                </div>

                                <div>
                                    <h2 id="coupon-modal-title">
                                        {isEditMode
                                            ? 'Edit Coupon'
                                            : 'Create Coupon'}
                                    </h2>

                                    <p>
                                        {isEditMode
                                            ? 'Update coupon configuration'
                                            : 'Create a discount coupon for membership plans'}
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                className="coupon-create-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* =====================================================
                FORM
            ====================================================== */}
                        <form onSubmit={handleSave}>

                            <div className="coupon-create-modal-body">

                                {/* =================================================
                        SECTION 1 - BASIC DETAILS
                    ================================================== */}
                                <section className="coupon-form-section">

                                    <div className="coupon-section-heading">

                                        <span className="coupon-section-number">
                                            1
                                        </span>

                                        <div>
                                            <h3>Basic Details</h3>

                                            <p>
                                                Define who can use this coupon.
                                            </p>
                                        </div>

                                    </div>


                                    <div className="coupon-form-grid">

                                        {/* COUPON CODE */}
                                        <div className="coupon-form-group">

                                            <label>
                                                Coupon Code
                                                <span>*</span>
                                            </label>

                                            <input
                                                type="text"
                                                value={form.code}
                                                onChange={(e) =>
                                                    updateForm(
                                                        'code',
                                                        e.target.value.toUpperCase()
                                                    )
                                                }
                                                placeholder="e.g. WELCOME20"
                                                maxLength={50}
                                                disabled={saving}
                                            />

                                            <small>
                                                Letters, numbers, hyphen and underscore only.
                                            </small>

                                        </div>


                                        {/* PLAN TYPE */}
                                        <div className="coupon-form-group">

                                            <label>
                                                Plan Type
                                                <span>*</span>
                                            </label>

                                            <div className="coupon-select-wrapper">

                                                <select
                                                    value={form.planType}
                                                    onChange={(e) =>
                                                        handlePlanTypeChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={saving}
                                                >
                                                    <option value="Recruiter">
                                                        Recruiter
                                                    </option>

                                                    <option value="Candidate">
                                                        Candidate
                                                    </option>
                                                </select>

                                                <ChevronDown size={17} />

                                            </div>

                                        </div>


                                        {/* REGION */}
                                        <div className="coupon-form-group">

                                            <label>
                                                Region
                                                <span>*</span>
                                            </label>

                                            <div className="coupon-select-wrapper">

                                                <select
                                                    value={form.region}
                                                    onChange={(e) =>
                                                        handleRegionChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={saving}
                                                >

                                                    {regions.map((region) => (
                                                        <option
                                                            key={region.id}
                                                            value={region.id}
                                                        >
                                                            {region.flag}{' '}
                                                            {region.name} (
                                                            {region.currency})
                                                        </option>
                                                    ))}

                                                </select>

                                                <ChevronDown size={17} />

                                            </div>

                                        </div>


                                        {/* APPLY TO */}
                                        <div className="coupon-form-group coupon-full-width">

                                            <label>
                                                Apply Coupon To
                                            </label>

                                            <div className="coupon-scope-options">

                                                {/* ALL PLANS */}
                                                <label
                                                    className={
                                                        !form.applyToSpecificPlan
                                                            ? 'selected'
                                                            : ''
                                                    }
                                                >

                                                    <input
                                                        type="radio"
                                                        checked={
                                                            !form.applyToSpecificPlan
                                                        }
                                                        onChange={() =>
                                                            handleSpecificPlanChange(false)
                                                        }
                                                        disabled={saving}
                                                    />

                                                    <div>
                                                        <strong>
                                                            All Plans
                                                        </strong>

                                                        <small>
                                                            Coupon can be used on any active{' '}
                                                            {form.planType.toLowerCase()}{' '}
                                                            membership plan in this region.
                                                        </small>
                                                    </div>

                                                </label>


                                                {/* SPECIFIC PLAN */}
                                                <label
                                                    className={
                                                        form.applyToSpecificPlan
                                                            ? 'selected'
                                                            : ''
                                                    }
                                                >

                                                    <input
                                                        type="radio"
                                                        checked={
                                                            form.applyToSpecificPlan
                                                        }
                                                        onChange={() =>
                                                            handleSpecificPlanChange(true)
                                                        }
                                                        disabled={saving}
                                                    />

                                                    <div>
                                                        <strong>
                                                            Specific Plan
                                                        </strong>

                                                        <small>
                                                            Restrict the coupon to one
                                                            membership plan.
                                                        </small>
                                                    </div>

                                                </label>

                                            </div>

                                        </div>


                                        {/* SPECIFIC PLAN */}
                                        {form.applyToSpecificPlan && (
                                            <div className="coupon-form-group coupon-full-width">

                                                <label>
                                                    Membership Plan
                                                    <span>*</span>
                                                </label>

                                                <div className="coupon-select-wrapper">

                                                    <select
                                                        value={form.planId}
                                                        onChange={(e) =>
                                                            updateForm(
                                                                'planId',
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            saving ||
                                                            plansLoading
                                                        }
                                                    >

                                                        <option value="">
                                                            {plansLoading
                                                                ? 'Loading plans...'
                                                                : 'Select membership plan'}
                                                        </option>

                                                        {plans.map((plan) => {

                                                            const planId =
                                                                plan.planId ||
                                                                plan.PlanId;

                                                            const planName =
                                                                plan.planName ||
                                                                plan.PlanName;

                                                            const price =
                                                                plan.price ??
                                                                plan.Price;

                                                            return (
                                                                <option
                                                                    key={planId}
                                                                    value={planId}
                                                                >
                                                                    {planName}

                                                                    {price !== undefined &&
                                                                        price !== null
                                                                        ? ` — ${selectedRegion.symbol}${Number(
                                                                            price
                                                                        ).toLocaleString(
                                                                            'en-IN'
                                                                        )}`
                                                                        : ''}
                                                                </option>
                                                            );
                                                        })}

                                                    </select>

                                                    <ChevronDown size={17} />

                                                </div>

                                                {!plansLoading &&
                                                    plans.length === 0 && (
                                                        <small className="coupon-warning">
                                                            No active membership plans found
                                                            for this plan type and region.
                                                        </small>
                                                    )}

                                            </div>
                                        )}

                                    </div>

                                </section>


                                {/* =================================================
                        SECTION 2 - DISCOUNT
                    ================================================== */}
                                <section className="coupon-form-section">

                                    <div className="coupon-section-heading">

                                        <span className="coupon-section-number">
                                            2
                                        </span>

                                        <div>
                                            <h3>Discount</h3>

                                            <p>
                                                Configure the discount amount and limits.
                                            </p>
                                        </div>

                                    </div>


                                    <div className="coupon-form-grid">

                                        {/* DISCOUNT TYPE */}
                                        <div className="coupon-form-group">

                                            <label>
                                                Discount Type
                                                <span>*</span>
                                            </label>

                                            <div className="coupon-discount-options">

                                                <label
                                                    className={
                                                        form.discountType === 'Percentage'
                                                            ? 'selected'
                                                            : ''
                                                    }
                                                >

                                                    <input
                                                        type="radio"
                                                        value="Percentage"
                                                        checked={
                                                            form.discountType ===
                                                            'Percentage'
                                                        }
                                                        onChange={(e) =>
                                                            updateForm(
                                                                'discountType',
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={saving}
                                                    />

                                                    <Percent size={16} />

                                                    <span>
                                                        Percentage
                                                    </span>

                                                </label>


                                                <label
                                                    className={
                                                        form.discountType === 'Fixed'
                                                            ? 'selected'
                                                            : ''
                                                    }
                                                >

                                                    <input
                                                        type="radio"
                                                        value="Fixed"
                                                        checked={
                                                            form.discountType === 'Fixed'
                                                        }
                                                        onChange={(e) =>
                                                            updateForm(
                                                                'discountType',
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={saving}
                                                    />

                                                    <IndianRupee size={16} />

                                                    <span>
                                                        Fixed Amount
                                                    </span>

                                                </label>

                                            </div>

                                        </div>


                                        {/* DISCOUNT VALUE */}
                                        <div className="coupon-form-group">

                                            <label>
                                                Discount Value
                                                <span>*</span>
                                            </label>

                                            <div className="coupon-input-suffix">

                                                <input
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    value={form.discountValue}
                                                    onChange={(e) =>
                                                        updateForm(
                                                            'discountValue',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={
                                                        form.discountType ===
                                                            'Percentage'
                                                            ? '20'
                                                            : '500'
                                                    }
                                                    disabled={saving}
                                                />

                                                <span>
                                                    {form.discountType ===
                                                        'Percentage'
                                                        ? '%'
                                                        : selectedRegion.symbol}
                                                </span>

                                            </div>

                                        </div>


                                        {/* MINIMUM AMOUNT */}
                                        {!form.applyToSpecificPlan && (
                                            <div className="coupon-form-group">

                                                <label>
                                                    Minimum Order Amount
                                                </label>

                                                <div className="coupon-input-prefix">

                                                    <span>
                                                        {selectedRegion.symbol}
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={form.minimumAmount}
                                                        onChange={(e) =>
                                                            updateForm(
                                                                'minimumAmount',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Optional"
                                                        disabled={saving}
                                                    />

                                                </div>

                                                <small>
                                                    Coupon will not apply below this amount.
                                                </small>

                                            </div>
                                        )}


                                        {/* MAXIMUM DISCOUNT
                                        <div className="coupon-form-group">

                                            <label>
                                                Maximum Discount
                                            </label>

                                            <div className="coupon-input-prefix">

                                                <span>
                                                    {selectedRegion.symbol}
                                                </span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={form.maximumDiscount}
                                                    onChange={(e) =>
                                                        updateForm(
                                                            'maximumDiscount',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Optional"
                                                    disabled={saving}
                                                />

                                            </div>

                                            <small>
                                                Useful for percentage coupons.
                                            </small>

                                        </div> */}

                                    </div>

                                </section>


                                {/* =================================================
                        SECTION 3 - USAGE LIMITS
                    ================================================== */}
                                <section className="coupon-form-section">

                                    <div className="coupon-section-heading">

                                        <span className="coupon-section-number">
                                            3
                                        </span>

                                        <div>
                                            <h3>Usage Limits</h3>

                                            <p>
                                                Control how many times the coupon can be
                                                redeemed.
                                            </p>
                                        </div>

                                    </div>


                                    <div className="coupon-form-grid">

                                        <div className="coupon-form-group">

                                            <label>
                                                Total Usage Limit
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={form.usageLimit}
                                                onChange={(e) =>
                                                    updateForm(
                                                        'usageLimit',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Unlimited"
                                                disabled={saving}
                                            />

                                            <small>
                                                Leave empty for unlimited usage.
                                            </small>

                                        </div>


                                        <div className="coupon-form-group">

                                            <label>
                                                Per User Limit
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={form.perUserLimit}
                                                onChange={(e) =>
                                                    updateForm(
                                                        'perUserLimit',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Unlimited"
                                                disabled={saving}
                                            />

                                            <small>
                                                Leave empty for unlimited usage per user.
                                            </small>

                                        </div>

                                    </div>

                                </section>


                                {/* =================================================
                        SECTION 4 - VALIDITY
                    ================================================== */}
                                <section className="coupon-form-section">

                                    <div className="coupon-section-heading">

                                        <span className="coupon-section-number">
                                            4
                                        </span>

                                        <div>
                                            <h3>Validity</h3>

                                            <p>
                                                Define when the coupon can be used.
                                            </p>
                                        </div>

                                    </div>


                                    <div className="coupon-form-grid">

                                        <div className="coupon-form-group">

                                            <label>
                                                Start Date & Time
                                            </label>

                                            <input
                                                type="datetime-local"
                                                value={form.startAt}
                                                onChange={(e) =>
                                                    updateForm(
                                                        'startAt',
                                                        e.target.value
                                                    )
                                                }
                                                disabled={saving}
                                            />

                                        </div>


                                        <div className="coupon-form-group">

                                            <label>
                                                Expiry Date & Time
                                            </label>

                                            <input
                                                type="datetime-local"
                                                value={form.expiresAt}
                                                onChange={(e) =>
                                                    updateForm(
                                                        'expiresAt',
                                                        e.target.value
                                                    )
                                                }
                                                disabled={saving}
                                            />

                                        </div>


                                        {/* ACTIVE */}
                                        <div className="coupon-form-group coupon-full-width">

                                            <label className="coupon-toggle-row">

                                                <span>
                                                    <strong>
                                                        Coupon Active
                                                    </strong>

                                                    <small>
                                                        Active coupons can be validated
                                                        and redeemed by users.
                                                    </small>
                                                </span>

                                                <button
                                                    type="button"
                                                    className={`coupon-toggle ${form.isActive ? 'on' : ''
                                                        }`}
                                                    onClick={() =>
                                                        updateForm(
                                                            'isActive',
                                                            !form.isActive
                                                        )
                                                    }
                                                    disabled={saving}
                                                    aria-label="Toggle coupon status"
                                                >
                                                    <span></span>
                                                </button>

                                            </label>

                                        </div>

                                    </div>

                                </section>


                                {/* =================================================
                        COUPON PREVIEW
                    ================================================== */}
                                <div className="coupon-preview-box">

                                    <div className="coupon-preview-left">

                                        <div className="coupon-preview-icon">
                                            <Tag size={18} />
                                        </div>

                                        <div>
                                            <small>
                                                Coupon Preview
                                            </small>

                                            <strong>
                                                {form.code.trim()
                                                    ? form.code
                                                        .trim()
                                                        .toUpperCase()
                                                    : 'COUPONCODE'}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="coupon-preview-right">

                                        <strong>

                                            {form.discountValue
                                                ? form.discountType ===
                                                    'Percentage'
                                                    ? `${form.discountValue}% OFF`
                                                    : `${selectedRegion.symbol}${Number(
                                                        form.discountValue
                                                    ).toLocaleString(
                                                        'en-IN'
                                                    )} OFF`
                                                : 'DISCOUNT'}

                                        </strong>

                                        <small>
                                            {form.applyToSpecificPlan
                                                ? 'Specific plan'
                                                : 'All plans'}
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* =====================================================
                    MODAL FOOTER
                ====================================================== */}
                            <div className="coupon-create-modal-footer">

                                <button
                                    type="button"
                                    className="coupon-secondary-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="coupon-primary-btn"
                                    disabled={saving}
                                >

                                    {saving ? (
                                        <>
                                            <span className="coupon-button-loader"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={17} />

                                            {isEditMode
                                                ? 'Update Coupon'
                                                : 'Create Coupon'}
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}