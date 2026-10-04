export const ROLES = Object.freeze({
  ADMIN: 'admin',
  DRIVER: 'driver',
});

export const DELIVERY_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
});

export const STATUS_COLORS = Object.freeze({
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-blue-100 text-blue-800 border-blue-200',
  assigned: 'bg-purple-100 text-purple-800 border-purple-200',
  in_transit: 'bg-orange-100 text-orange-800 border-orange-200',
  out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  declined: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
});

export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'g71_token',
  USER: 'g71_user',
  TOKEN_EXP: 'g71_token_exp',
});
export const TOKEN_TTL_HOURS = 12;
