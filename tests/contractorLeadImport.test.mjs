import test from 'node:test';
import assert from 'node:assert/strict';
import {
  allowedContractorImport,
  importIdentity,
  normaliseContractorImportRow,
  previewContractorCsv,
} from '../lib/contractorLeadImport.mjs';

test('CSV preview accepts supported contact/company/industry fields and rejects invalid rows', () => {
  const preview = previewContractorCsv([
    'First Name,Last Name,Company,Phone,Email,Industry',
    'Avery,Lee,Acme,415-555-1212,avery@example.com,Construction',
    'Missing Contact,,,,,',
  ].join('\n'));
  assert.equal(preview.accepted.length, 1);
  assert.equal(preview.rejected.length, 1);
  assert.equal(preview.accepted[0].company, 'Acme');
  assert.match(preview.accepted[0].notes, /Industry: Construction/);
});

test('CSV preview rejects duplicate contacts in the same file', () => {
  const preview = previewContractorCsv([
    'Name,Email',
    'Avery Lee,avery@example.com',
    'Avery Duplicate,avery@example.com',
  ].join('\n'));
  assert.equal(preview.accepted.length, 1);
  assert.equal(preview.rejected.length, 1);
  assert.match(preview.rejected[0].errors.join(' '), /Duplicate contact/);
});

test('only the authenticated contractor may import to an assigned campaign', () => {
  const principal = { role: 'contractor', email: 'owner@example.com', campaignIds: ['reviews'] };
  assert.equal(allowedContractorImport(principal, 'reviews'), true);
  assert.equal(allowedContractorImport(principal, 'school'), false);
  assert.equal(allowedContractorImport({ ...principal, role: 'admin' }, 'reviews'), false);
});

test('import identity is owner and campaign scoped, so a forged client assignee cannot collide', () => {
  const lead = { name: 'Avery Lee', company: 'Acme', email: 'avery@example.com', phone: '' };
  assert.notEqual(
    importIdentity({ campaignId: 'reviews', ownerEmail: 'a@example.com', lead }),
    importIdentity({ campaignId: 'reviews', ownerEmail: 'b@example.com', lead })
  );
  assert.notEqual(
    importIdentity({ campaignId: 'reviews', ownerEmail: 'a@example.com', lead }),
    importIdentity({ campaignId: 'school', ownerEmail: 'a@example.com', lead })
  );
});

test('normalizing an accepted row again preserves notes and industry metadata exactly once', () => {
  const once = normaliseContractorImportRow({
    name: 'Avery Lee', company: 'Acme', email: 'avery@example.com',
    industry: 'Construction', notes: 'Met at conference.',
  });
  const twice = normaliseContractorImportRow(once);
  assert.equal(twice.notes, once.notes);
  assert.equal((twice.notes.match(/Industry: Construction/g) || []).length, 1);
});
