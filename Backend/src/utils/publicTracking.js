export const maskTrackingLocation = (location) => {
  if (!location || typeof location !== 'string') return '';
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts.at(-1) : 'Location shared privately';
};

export const approximateCoordinates = (location) => {
  if (!location) return null;
  const lat = Number(location.lat);
  const lng = Number(location.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    lat: Math.round(lat * 100) / 100,
    lng: Math.round(lng * 100) / 100,
  };
};
