import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const storeSource = await readFile(new URL('../lib/operationsStore.js', import.meta.url), 'utf8');
const testableStoreSource = storeSource
  .replace("import crypto from 'crypto';", "import crypto from 'node:crypto';")
  .replace("import { neon } from '@neondatabase/serverless';", "const neon = () => { throw new Error('test database must be injected'); };")
  .replace("import { listContractors } from './contractorStore';", 'const listContractors = async () => [];')
  .replace("from './legacyAssignment.mjs';", `from '${pathToFileURL(new URL('../lib/legacyAssignment.mjs', import.meta.url).pathname).href}';`)
  .replace("from './contractorLeadImport.mjs';", `from '${pathToFileURL(new URL('../lib/contractorLeadImport.mjs', import.meta.url).pathname).href}';`);
const store = await import(`data:text/javascript;base64,${Buffer.from(testableStoreSource).toString('base64')}`);

test('activity update keeps SQL binds aligned while preserving the owner', async () => {
  let captured;
  store.setOperationsDatabaseForTests({
    async query(sql, values) {
      captured = { sql, values };
      return [{ lead: { id: 'lead_1' }, activity: { id: 'activity_1' } }];
    },
  });
  try {
    await store.recordLeadActivity({
      leadId: 'lead_1', actorEmail: 'owner@example.com', actorRole: 'contractor',
      activityType: 'note', disposition: '', note: 'Shared note', durationSeconds: 0,
      scheduledFor: null, nextStage: 'Contacted',
    });
    assert.match(captured.sql, /follow_up_owner_email = follow_up_owner_email/);
    assert.equal(captured.values.length, 11);
    assert.equal(captured.values[6], 'owner@example.com');
    assert.equal(captured.values[8], 'note');
    assert.deepEqual([...captured.sql.matchAll(/\$(\d+)/g)].map((match) => Number(match[1])).sort((a, b) => a - b), [1, 2, 2, 3, 3, 4, 4, 4, 4, 5, 6, 7, 8, 9, 9, 10, 11]);
  } finally {
    store.setOperationsDatabaseForTests(null);
  }
});

test('contractor lead queries are restricted to the assigned owner and expose Calendly status', async () => {
  let captured;
  store.setOperationsDatabaseForTests({
    async query(sql, values) {
      captured = { sql, values };
      return [];
    },
  });
  try {
    await store.listPipeline(['campaign_1'], 'jeremy@example.com', true);
    assert.match(captured.sql, /leads\.follow_up_owner_email = \$2/);
    assert.match(captured.sql, /AS calendly_appointment_count/);
    assert.deepEqual(captured.values, [['campaign_1'], 'jeremy@example.com', true]);
  } finally {
    store.setOperationsDatabaseForTests(null);
  }
});
