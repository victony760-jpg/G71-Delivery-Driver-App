import test from 'node:test';
import assert from 'node:assert/strict';
import {
  approximateCoordinates,
  maskTrackingLocation,
} from '../utils/publicTracking.js';

test('public tracking locations do not expose a street address', () => {
  assert.equal(maskTrackingLocation('12 Example Road, Ikeja, Lagos'), 'Lagos');
  assert.equal(
    maskTrackingLocation('12 Example Road'),
    'Location shared privately',
  );
});

test('public driver coordinates are rounded and invalid points omitted', () => {
  assert.deepEqual(approximateCoordinates({ lat: 6.524379, lng: 3.379206 }), {
    lat: 6.52,
    lng: 3.38,
  });
  assert.equal(approximateCoordinates({ lat: 'bad', lng: 3 }), null);
});
