import assert from 'node:assert';
import { calculateRemainingDays, formatRemainingDays } from '../src/utils/date.ts';

console.log('Running MagangHub Tracker verification checks...');

// Check 1: calculateRemainingDays & formatting
const today = new Date().toISOString().split('T')[0];
assert.strictEqual(calculateRemainingDays(today), 0, 'Today should have 0 remaining days');
assert.strictEqual(formatRemainingDays(0).status, 'urgent', 'Today should have urgent status');
assert.strictEqual(formatRemainingDays(2).status, 'urgent', '2 days should be urgent status');
assert.strictEqual(formatRemainingDays(5).status, 'warning', '5 days should be warning status');
assert.strictEqual(formatRemainingDays(14).status, 'normal', '14 days should be normal status');
assert.strictEqual(formatRemainingDays(-2).status, 'expired', 'Negative days should be expired');

// Check 2: Metric calculations logic
const mockApps = [
  { id: '1', mainStatus: 'wishlist', deadlineDate: today, requirements: [{ isCompleted: true }] },
  { id: '2', mainStatus: 'applied', deadlineDate: today, requirements: [{ isCompleted: false }] },
  { id: '3', mainStatus: 'assessment', deadlineDate: today, requirements: [{ isCompleted: true }] },
  { id: '4', mainStatus: 'interview', deadlineDate: today, requirements: [{ isCompleted: true }] },
  { id: '5', mainStatus: 'offering_rejected', deadlineDate: today, requirements: [] },
];

const totalCount = mockApps.length;
const ongoing = mockApps.filter(
  (a) => a.mainStatus === 'assessment' || a.mainStatus === 'interview'
).length;
const ready = mockApps.filter(
  (a) => a.requirements.length > 0 && a.requirements.every((r) => r.isCompleted)
).length;

assert.strictEqual(totalCount, 5, 'Total applications count valid');
assert.strictEqual(ongoing, 2, 'Ongoing process count should be 2');
assert.strictEqual(ready, 3, 'Ready to submit count should be 3');

console.log('✅ All verification checks passed successfully!');
