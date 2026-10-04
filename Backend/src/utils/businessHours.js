export const BUSINESS_TIME_ZONE = 'Africa/Lagos';
export const BUSINESS_OPEN_MINUTES = 8 * 60;
export const BUSINESS_CLOSE_MINUTES = 18 * 60;
export const BUSINESS_OPERATING_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const getLocalDateTime = (date) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type) => Number(parts.find((item) => item.type === type).value);
  return {
    weekday: parts.find((item) => item.type === 'weekday').value,
    hour: part('hour'),
    minute: part('minute'),
  };
};

export const getBusinessHoursStatus = (date = new Date()) => {
  const { weekday, hour, minute } = getLocalDateTime(date);
  const currentMinutes = hour * 60 + minute;
  const isOperatingDay = BUSINESS_OPERATING_DAYS.includes(weekday);
  const isOpen =
    isOperatingDay &&
    currentMinutes >= BUSINESS_OPEN_MINUTES &&
    currentMinutes < BUSINESS_CLOSE_MINUTES;
  const nextOpeningMessage = isOpen
    ? ''
    : isOperatingDay && currentMinutes < BUSINESS_OPEN_MINUTES
      ? 'Please try again today from 8:00 AM WAT.'
      : weekday === 'Saturday' || weekday === 'Sunday'
        ? 'Please try again Monday from 8:00 AM WAT.'
      : 'Please try again tomorrow from 8:00 AM WAT.';

  return {
    isOpen,
    operatingDays: 'Monday–Saturday',
    closedDays: ['Sunday'],
    timeZone: BUSINESS_TIME_ZONE,
    openingTime: '8:00 AM',
    closingTime: '6:00 PM',
    message: isOpen
      ? 'We are open for delivery requests.'
      : `We are currently closed. ${nextOpeningMessage}`,
  };
};

export const isWithinBusinessHours = (date = new Date()) =>
  getBusinessHoursStatus(date).isOpen;
