import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import twilio from 'twilio';
import { twilioCommunicationsSchema } from '../lib/twilioCommunicationsSchema.mjs';

const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const here = (path) => new URL(path, import.meta.url);
const replaceImports = (source, imports) => source.replace(/from '([^']+)'/g, (match, specifier) => imports[specifier] ? `from '${imports[specifier]}'` : match);
const storeSource = (await readFile(here('../lib/operationsStore.js'), 'utf8'))
  .replace("import { neon } from '@neondatabase/serverless';", "const neon = () => { throw new Error('Use the isolated database'); };")
  .replace("import { listContractors } from './contractorStore';", 'const listContractors = async () => [];')
  .replace(/from '\.\/([^']+\.mjs)'/g, (_, path) => `from '${here('../lib/' + path)}'`);
const operationsStore = moduleUrl(storeSource);
const communicationsStore = moduleUrl(replaceImports(
  await readFile(here('../lib/twilioCommunicationsStore.js'), 'utf8'),
  { './operationsStore': operationsStore }
));
const principalSource = `
  export async function currentOperationsPrincipal(req, { allowDevelopmentPreview }) {
    if (allowDevelopmentPreview !== false) throw new Error('Test routes must always require a session');
    return req.testPrincipal;
  }
`;
const twilioUrl = pathToFileURL(createRequire(import.meta.url).resolve('twilio')).href;
const communications = moduleUrl(replaceImports(
  (await readFile(here('../lib/twilioCommunications.js'), 'utf8')).replace(
    'return twilio(settings.accountSid, settings.authToken, { timeout: 8000, autoRetry: false });',
    'return { messages: { create: globalThis.twilioSendForTest } };'
  ),
  { twilio: twilioUrl, './operationsAccess': moduleUrl(principalSource), './operationsStore': operationsStore }
));

async function loadHandler(name) {
  const source = await readFile(here(`../pages/api/operations/twilio/${name}.js`), 'utf8');
  const module = await import(moduleUrl(replaceImports(source, {
    twilio: twilioUrl,
    '../../../../lib/twilioCommunications': communications,
    '../../../../lib/twilioCommunicationsStore': communicationsStore,
  })));
  return module.default;
}

async function run(handler, { method = 'POST', body, query = {}, testPrincipal, headers = {} }) {
  const res = {
    setHeader() {},
    status(code) { this.code = code; return this; },
    json(data) { this.data = data; return this; },
    send(data) { this.data = data; return this; },
    end() { return this; },
  };
  await handler({ method, body, query, testPrincipal, headers }, res);
  return res;
}

test('Twilio routes enforce prospect access, authorize one call and preserve idempotent delivery history', async () => {
  const sid = (prefix, digit) => prefix + digit.repeat(32);
  const settings = {
    TWILIO_ACCOUNT_SID: sid('AC', '1'),
    TWILIO_AUTH_TOKEN: 'fixture-auth-token',
    TWILIO_API_KEY_SID: sid('SK', '2'),
    TWILIO_API_KEY_SECRET: 'fixture-key-secret',
    TWILIO_TWIML_APP_SID: sid('AP', '3'),
    TWILIO_VOICE_NUMBER: '+12025550101',
    TWILIO_MESSAGING_SERVICE_SID: sid('MG', '4'),
    TWILIO_WEBHOOK_ORIGIN: 'https://onyx.example',
  };
  const previous = Object.fromEntries(Object.keys(settings).map((name) => [name, process.env[name]]));
  Object.assign(process.env, settings);
  const db = new PGlite();
  const store = await import(operationsStore);
  store.setOperationsDatabaseForTests(db);

  try {
    const migration = await readFile(here('../scripts/migrate-shared-operations.mjs'), 'utf8');
    const schema = migration.slice(migration.indexOf('const statements = ['), migration.indexOf('for (const statement'));
    const { statements } = await import(moduleUrl(schema + '\nexport { statements };'));
    for (const statement of [...statements, ...twilioCommunicationsSchema]) await db.exec(statement);
    await db.exec(`
      INSERT INTO campaigns (id, name) VALUES ('reviews', 'Reviews'), ('private', 'Private');
      INSERT INTO leads (id, campaign_id, source_key, name, phone, stage, booked_at) VALUES
        ('lead', 'reviews', 'lead', 'Example contact', '(202) 555-0100', 'Contacted', NULL),
        ('dnc', 'reviews', 'dnc', 'Example opt-out', '(202) 555-0102', 'Do Not Call', NULL),
        ('qualified', 'reviews', 'qualified', 'Example booked', '(202) 555-0103', 'Appointment Set', NOW()),
        ('private', 'private', 'private', 'Unassigned', '(202) 555-0104', 'New', NULL);
    `);
    const contractor = { role: 'contractor', email: 'rep@example.test', campaignIds: ['reviews'] };
    const admin = { role: 'admin', email: 'admin@example.test' };
    const recipient = '+12025550100';
    const sendVoiceSession = await loadHandler('voice-session');
    const voice = await loadHandler('voice');
    const sms = await loadHandler('texts');
    const smsStatus = await loadHandler('sms-status');
    const grantResponse = await run(sendVoiceSession, { testPrincipal: contractor, body: { leadId: 'lead', expectedPhone: recipient } });
    assert.equal(grantResponse.code, 200);
    const claims = JSON.parse(Buffer.from(grantResponse.data.token.split('.')[1], 'base64url'));
    assert.equal(claims.grants.voice.outgoing.application_sid, settings.TWILIO_TWIML_APP_SID);
    assert.equal(claims.grants.voice.incoming, undefined);
    assert.equal((await run(sendVoiceSession, { body: { leadId: 'lead' } })).code, 401);
    assert.equal((await run(sendVoiceSession, { testPrincipal: contractor, body: { leadId: 'private' } })).code, 404);
    assert.equal((await run(sendVoiceSession, { testPrincipal: admin, body: { leadId: 'dnc' } })).code, 409);
    assert.equal((await run(sendVoiceSession, { testPrincipal: admin, body: { leadId: 'lead', expectedPhone: '+12025550104' } })).code, 409);

    function signed(body, path) {
      return { 'x-twilio-signature': twilio.getExpectedTwilioSignature(
        settings.TWILIO_AUTH_TOKEN, `${settings.TWILIO_WEBHOOK_ORIGIN}/api/operations/twilio/${path}`, body
      ) };
    }
    const call = {
      From: `client:${claims.grants.identity}`,
      CallSid: sid('CA', '5'),
      AccountSid: settings.TWILIO_ACCOUNT_SID,
      GrantId: grantResponse.data.grantId,
      To: '+12025550104',
    };
    assert.equal((await run(voice, { body: call })).code, 403);
    const routed = await run(voice, { body: call, headers: signed(call, 'voice') });
    assert.equal(routed.code, 200);
    assert.match(routed.data, /<Number>\+12025550100<\/Number>/);
    assert.doesNotMatch(routed.data, /12025550104/);
    const replay = { ...call, CallSid: sid('CA', '6') };
    assert.equal((await run(voice, { body: replay, headers: signed(replay, 'voice') })).code, 403);
    assert.equal((await run(voice, { body: call, headers: signed(call, 'voice') })).code, 200);

    const messageSid = sid('SM', '7');
    let submissions = 0;
    globalThis.twilioSendForTest = async (message) => {
      submissions++;
      assert.equal(message.to, recipient);
      assert.match(message.body, /^Onyx Creative Labs: Test message\nReply STOP to unsubscribe\.$/);
      assert.equal(message.messagingServiceSid, settings.TWILIO_MESSAGING_SERVICE_SID);
      return { sid: messageSid, status: 'accepted' };
    };
    const outbound = { id: randomUUID(), leadId: 'lead', expectedPhone: recipient, text: 'Test message',
      consentReference: 'Fixture opt-in form', consentConfirmed: true };
    assert.equal((await run(sms, {
      testPrincipal: contractor, body: { ...outbound, consentConfirmed: false },
    })).code, 400);
    const results = await Promise.all([1, 2].map(() => run(sms, { testPrincipal: contractor, body: outbound })));
    assert.deepEqual(results.map((result) => result.code).sort(), [200, 201]);
    assert.equal(submissions, 1);
    assert.equal((await run(sms, { testPrincipal: admin, body: { ...outbound, leadId: 'dnc' } })).code, 409);
    assert.equal((await run(sms, { testPrincipal: contractor, body: { ...outbound, leadId: 'private' } })).code, 404);

    const callback = { AccountSid: settings.TWILIO_ACCOUNT_SID, MessageSid: messageSid, MessageStatus: 'delivered' };
    const query = { id: outbound.id };
    const callbackPath = `sms-status?id=${outbound.id}`;
    assert.equal((await run(smsStatus, { body: callback, query, headers: signed(callback, 'voice') })).code, 403);
    assert.equal((await run(smsStatus, { body: callback, query, headers: signed(callback, callbackPath) })).code, 204);
    const stale = { ...callback, MessageStatus: 'sent' };
    assert.equal((await run(smsStatus, { body: stale, query, headers: signed(stale, callbackPath) })).code, 204);
    const history = await run(sms, { method: 'GET', testPrincipal: admin, query: { leadId: 'lead' } });
    assert.equal(history.data.recipient, recipient);
    assert.equal(history.data.messages.length, 1);
    assert.equal(history.data.messages[0].status, 'delivered');
    const proof = await db.query('SELECT consent_reference, actor_email FROM prospect_sms WHERE id = $1', [outbound.id]);
    assert.deepEqual(proof.rows[0], { consent_reference: outbound.consentReference, actor_email: contractor.email });
  } finally {
    delete globalThis.twilioSendForTest;
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
    store.setOperationsDatabaseForTests(null);
    await db.close();
  }
});
