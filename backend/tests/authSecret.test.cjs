// Middleware xác thực không được chấp nhận token ký bằng khóa dự phòng đoán được khi thiếu JWT_SECRET.
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path'), crypto = require('node:crypto');
process.env.TS_NODE_PROJECT = path.resolve(__dirname, '../tsconfig.json');
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://unused@127.0.0.1:1/unused'; // prisma chỉ được nạp, không kết nối
require('ts-node/register/transpile-only');
const jwt = require('jsonwebtoken');
const { authenticateToken, optionalAuthenticateToken } = require('../src/shared/middleware/auth');
const { authenticateAdmin } = require('../src/shared/middleware/adminAuth');

function call(middleware, token) {
  return new Promise(resolve => {
    const req = { headers: token ? { authorization: 'Bearer ' + token } : {} };
    const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { resolve({ status: this.statusCode, body, req }); return this; } };
    Promise.resolve(middleware(req, res, () => resolve({ status: 'next', req }))).catch(error => resolve({ status: 'throw', error }));
  });
}
function withSecret(value, fn) {
  const saved = process.env.JWT_SECRET;
  if (value === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = value;
  return Promise.resolve(fn()).finally(() => { if (saved === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = saved; });
}
const payload = { id: crypto.randomUUID(), username: 'x', role: 'ADMIN' };

test('thiếu JWT_SECRET: token ký bằng "secret" hay "mykey" đều bị từ chối, không lọt vào route', () => withSecret(undefined, async () => {
  for (const guess of ['secret', 'mykey', '']) {
    const token = jwt.sign(payload, guess || 'x');
    const strict = await call(authenticateToken, token);
    assert.equal(strict.status, 503, guess);
    assert.equal(strict.body.error, 'AUTH_NOT_CONFIGURED');
    const admin = await call(authenticateAdmin, token);
    assert.equal(admin.status, 503, 'admin ' + guess);
    const optional = await call(optionalAuthenticateToken, token);
    assert.equal(optional.status, 'next');
    assert.equal(optional.req.user, undefined, 'optional auth không được gán user từ token không kiểm được');
  }
}));

test('JWT_SECRET rỗng cũng bị coi là chưa cấu hình', () => withSecret('', async () => {
  assert.equal((await call(authenticateToken, jwt.sign(payload, 'secret'))).status, 503);
}));

test('có JWT_SECRET: token đúng khóa được nhận, token khóa khác bị từ chối như trước', () => withSecret(crypto.randomBytes(32).toString('hex'), async () => {
  const good = await call(authenticateToken, jwt.sign(payload, process.env.JWT_SECRET));
  assert.equal(good.status, 'next');
  assert.equal(good.req.user.id, payload.id);
  assert.equal((await call(authenticateToken, jwt.sign(payload, 'secret'))).status, 403);
  assert.equal((await call(authenticateToken, null)).status, 401);
  const optional = await call(optionalAuthenticateToken, jwt.sign(payload, 'secret'));
  assert.equal(optional.req.user, undefined);
}));
