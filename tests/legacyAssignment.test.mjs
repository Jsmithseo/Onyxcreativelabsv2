import test from 'node:test';
import assert from 'node:assert/strict';
import {
  invalidLegacyAssignments,
  legacyAssignment,
} from '../lib/legacyAssignment.mjs';

test('missing, null, empty, and whitespace assignments preserve the server owner', () => {
  for (const lead of [{}, { assignedTo: null }, { assignedTo: '' }, { assignedTo: '   ' }]) {
    assert.deepEqual(legacyAssignment(lead), { action: 'none', email: null });
  }
});

test('a real non-empty assignee is an assignment update', () => {
  assert.deepEqual(legacyAssignment({ assignedTo: ' Sierra@example.com ' }), {
    action: 'assign',
    email: 'sierra@example.com',
  });
});

test('an explicit clear flag is the only legacy instruction to clear an owner', () => {
  assert.deepEqual(legacyAssignment({ assignedTo: null, clearAssignment: true }), {
    action: 'clear',
    email: null,
  });
});

test('a non-empty assignee must map to a contractor with campaign access', () => {
  const contractors = [{ email: 'sierra@example.com', campaigns: ['reviews'] }];
  const valid = [{ campaign_id: 'reviews', assignment_action: 'assign', follow_up_owner_email: 'sierra@example.com' }];
  const invalid = [
    { campaign_id: 'school', assignment_action: 'assign', follow_up_owner_email: 'sierra@example.com' },
    { campaign_id: 'reviews', assignment_action: 'assign', follow_up_owner_email: 'unknown@example.com' },
  ];
  assert.deepEqual(invalidLegacyAssignments(valid, contractors), []);
  assert.equal(invalidLegacyAssignments(invalid, contractors).length, 2);
});
