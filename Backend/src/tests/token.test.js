import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken.js';

test('generated access tokens expire after the configured 12-hour default', () => {
  process.env.JWT_SECRET = 'test-secret-with-at-least-thirty-two-characters';
  delete process.env.JWT_EXPIRES_IN;
  const token = generateToken('test-user-id');
  const decoded = jwt.decode(token);

  assert.equal(decoded.id, 'test-user-id');
  assert.equal(decoded.exp - decoded.iat, 12 * 60 * 60);
});
