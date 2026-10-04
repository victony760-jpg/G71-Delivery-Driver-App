import test from 'node:test';
import assert from 'node:assert/strict';
import { buildShipmentDocument } from '../utils/shipmentFactory.js';

test('shipment creation ignores client-supplied privileged fields', () => {
  const shipment = buildShipmentDocument({
    input: {
      pickupAddress: '  1 Market Road  ',
      deliveryAddress: '  2 Broad Street  ',
      receiverName: '  Ada Customer  ',
      receiverPhone: '  08012345678  ',
      packageDescription: '  Documents  ',
      weight: 2,
      status: 'delivered',
      driver: 'attacker-controlled-driver',
      price: 1,
      driverEarning: 999999,
      currentLocation: 'attacker location',
      history: [{ status: 'delivered' }],
      client: 'another-client',
    },
    user: {
      _id: 'authenticated-client',
      name: 'Trusted Sender',
      email: 'sender@example.test',
    },
    pricing: { price: 2100, driverEarning: 500, rateId: 'active-rate' },
  });

  assert.equal(shipment.client, 'authenticated-client');
  assert.equal(shipment.senderName, 'Trusted Sender');
  assert.equal(shipment.status, 'pending');
  assert.equal(shipment.price, 2100);
  assert.equal(shipment.driverEarning, 500);
  assert.equal(shipment.driver, undefined);
  assert.equal(shipment.currentLocation, 'Warehouse - Lagos');
  assert.deepEqual(shipment.history, [
    {
      status: 'pending',
      location: 'Warehouse - Lagos',
      updatedBy: 'authenticated-client',
    },
  ]);
  assert.equal(shipment.pickupAddress, '1 Market Road');
  assert.equal(shipment.deliveryAddress, '2 Broad Street');
});
