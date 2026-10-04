import test from 'node:test';
import assert from 'node:assert/strict';
import { createCorsOriginValidator } from '../utils/corsOrigin.js';

const validateOrigin = (validator, origin) =>
  new Promise((resolve, reject) => {
    validator(origin, (error, allowed) => {
      if (error) reject(error);
      else resolve(allowed);
    });
  });

test('CORS allows configured origins and non-browser requests only', async () => {
  const validator = createCorsOriginValidator(
    new Set(['https://app.example.test']),
  );
  assert.equal(
    await validateOrigin(validator, 'https://app.example.test'),
    true,
  );
  assert.equal(await validateOrigin(validator, undefined), true);
});

test('CORS rejects unconfigured origins', async () => {
  const validator = createCorsOriginValidator(
    new Set(['https://app.example.test']),
  );
  assert.equal(
    await validateOrigin(validator, 'https://untrusted.example.test'),
    false,
  );
});
