import { apiRequest } from './api.js';

export const couponService = {

  // ============================================================
  // GET ALL COUPONS
  // GET /api/admin/coupons
  // ============================================================

  getCoupons: async (planType, region, isActive) => {
    const params = new URLSearchParams();

    if (planType) {
      params.append('planType', planType);
    }

    if (region) {
      params.append('region', region);
    }

    if (isActive !== undefined && isActive !== null) {
      params.append('isActive', isActive);
    }

    const query = params.toString();

    const url = query
      ? `/api/admin/coupons?${query}`
      : '/api/admin/coupons';

    return await apiRequest(url, {
      method: 'GET',
    });
  },

  // ============================================================
  // GET COUPON BY ID
  // GET /api/admin/coupons/{couponId}
  // ============================================================

  getCouponById: async (couponId) => {
    return await apiRequest(
      `/api/admin/coupons/${couponId}`,
      {
        method: 'GET',
      }
    );
  },

  // ============================================================
  // CREATE COUPON
  // POST /api/admin/coupons
  // ============================================================

  createCoupon: async (data) => {
    return await apiRequest('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ============================================================
  // UPDATE COUPON
  // PUT /api/admin/coupons/{couponId}
  // ============================================================

  updateCoupon: async (couponId, data) => {
    return await apiRequest(
      `/api/admin/coupons/${couponId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  // ============================================================
  // DEACTIVATE COUPON
  // PATCH /api/admin/coupons/{couponId}/deactivate
  // ============================================================

  deactivateCoupon: async (couponId) => {
    return await apiRequest(
      `/api/admin/coupons/${couponId}/deactivate`,
      {
        method: 'PATCH',
      }
    );
  },
};