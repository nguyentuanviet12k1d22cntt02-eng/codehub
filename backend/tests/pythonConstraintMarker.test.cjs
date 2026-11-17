// Harness Python báo vi phạm cấu trúc qua marker __LEARNER_CONSTRAINT__; runner chỉ nhận marker hợp lệ.
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path');
process.env.TS_NODE_PROJECT = path.resolve(__dirname, '../tsconfig.json');
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://unused@127.0.0.1:1/unused';
require('ts-node/register/transpile-only');
const { pythonConstraintViolations } = require('../src/modules/adaptive/adaptiveRunner');

test('đọc đúng danh sách vi phạm từ marker', () => {
  assert.deepEqual(pythonConstraintViolations('__LEARNER_CONSTRAINT__["CONSTRAINT_REQUIRED:while","CONSTRAINT_FORBIDDEN:for"]\n'),
    ['CONSTRAINT_REQUIRED:while', 'CONSTRAINT_FORBIDDEN:for']);
});

test('không có marker hoặc marker hỏng thì coi như lỗi runtime thường', () => {
  for (const stderr of ['', 'Traceback ...\nZeroDivisionError: division by zero', '__LEARNER_CONSTRAINT__not-json',
    '__LEARNER_CONSTRAINT__[]', '__LEARNER_CONSTRAINT__["rm -rf /"]', 'x __LEARNER_CONSTRAINT__["CONSTRAINT_REQUIRED:while"]', undefined])
    assert.equal(pythonConstraintViolations(stderr), null, String(stderr));
});

test('bỏ mục lạ, giữ mục hợp lệ', () => {
  assert.deepEqual(pythonConstraintViolations('__LEARNER_CONSTRAINT__["CONSTRAINT_REQUIRED:while",42,"<b>"]'), ['CONSTRAINT_REQUIRED:while']);
});
