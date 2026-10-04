import test from 'node:test';
import assert from 'node:assert/strict';
import { getBusinessHoursStatus } from '../utils/businessHours.js';

test('business hours open at 8:00 AM and close at 6:00 PM WAT', () => {
  assert.equal(
    getBusinessHoursStatus(new Date('2026-10-05T07:00:00.000Z')).isOpen,
    true,
  );
  assert.equal(
    getBusinessHoursStatus(new Date('2026-10-05T16:59:00.000Z')).isOpen,
    true,
  );
  assert.equal(
    getBusinessHoursStatus(new Date('2026-10-05T17:00:00.000Z')).isOpen,
    false,
  );
});

test('closed hours tell customers whether to try today or tomorrow', () => {
  assert.match(
    getBusinessHoursStatus(new Date('2026-10-05T06:59:00.000Z')).message,
    /today from 8:00 AM WAT/,
  );
  assert.match(
    getBusinessHoursStatus(new Date('2026-10-05T17:00:00.000Z')).message,
    /tomorrow from 8:00 AM WAT/,
  );
});

test('business is closed on Sunday and reopens Monday at 8:00 AM WAT', () => {
  const status = getBusinessHoursStatus(new Date('2026-10-04T10:00:00.000Z'));

  assert.equal(status.isOpen, false);
  assert.match(status.message, /currently closed/);
  assert.match(status.message, /Monday from 8:00 AM WAT/);
  assert.deepEqual(status.closedDays, ['Sunday']);
});

test('Saturday after closing tells customers to try again Monday', () => {
  const status = getBusinessHoursStatus(new Date('2026-10-03T17:00:00.000Z'));

  assert.equal(status.isOpen, false);
  assert.match(status.message, /Monday from 8:00 AM WAT/);
});
