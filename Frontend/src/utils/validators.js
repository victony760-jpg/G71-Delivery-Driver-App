const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NG_PHONE_RE = /^(?:\+234|0)(?:7|8|9)[0-1]\d{8}$/;
export const isValidEmail = (v) =>
  EMAIL_RE.test(String(v).trim().toLowerCase());
export const isValidPhone = (v) =>
  NG_PHONE_RE.test(String(v).replace(/\s|-/g, ''));
export const isRequired = (v) =>
  v !== null && v !== undefined && String(v).trim().length > 0;
export const isStrongPassword = (v) => String(v).length >= 8;
