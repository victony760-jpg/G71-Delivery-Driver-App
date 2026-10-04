const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(result.message || 'Delivery request failed');
  return result;
}

export function createDeliveryRequest(payload) {
  return request('/public/requests', {
    method: 'POST',
    body: JSON.stringify({
      senderName: payload.guestName,
      senderPhone: payload.guestPhone,
      senderEmail: payload.guestEmail,
      pickup: payload.pickupAddress,
      dropoff: payload.dropoffAddress,
      receiverName: payload.receiverName,
      receiverPhone: payload.receiverPhone,
      packageType: payload.packageType,
      weight: payload.packageWeight,
      note: payload.description,
    }),
  });
}

export function getBusinessHours() {
  return request('/public/business-hours', { method: 'GET' });
}

// FIXED: use correct backend route /shipments/track
export function trackDelivery(code) {
  const cleanCode = code.toUpperCase().trim();
  return request(`/shipments/track/${encodeURIComponent(cleanCode)}`, {
    method: 'GET',
  });
}
