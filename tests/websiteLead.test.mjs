import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeWebsiteLead, createWebsiteLeadHandler } from '../lib/websiteLead.mjs';

function response() {
  return {
    statusCode: 200, headers: {}, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}
const inquiry = { name: 'Routing test', email: 'visitor@example.com', details: 'Please call me.', phone: '555-0100' };
const quiet = { error() {} };

test('the shared forms preserve inquiry details, consent notes, and source context', () => {
  for (const source of ['Website contact form', 'Feedback opt-in', 'Community request', 'Donation tax information request']) {
    const lead = normalizeWebsiteLead({ ...inquiry, source, pageUri: 'https://www.onyxcreativelabs.com/contact' });
    assert.equal(lead.email, inquiry.email);
    assert.equal(lead.source, source);
    assert.equal(lead.fields.find((f) => f.name === 'phone').value, inquiry.phone);
    assert.match(lead.fields.find((f) => f.name === 'message').value, /Please call me/);
    assert.equal(lead.pageUri, 'https://www.onyxcreativelabs.com/contact');
  }
});

test('legacy project, applicant, and donation forms retain every submitted field', () => {
  for (const source of ['Project inquiry', 'Apprenticeship application', 'Laptop donation inquiry', 'AI Closer early access']) {
    const fields = [
      { name: 'firstname', value: 'Test' }, { name: 'lastname', value: 'Visitor' },
      { name: 'email', value: inquiry.email }, { name: 'career_goals', value: 'Build useful software' },
      { name: 'laptop_1_model', value: 'MacBook Pro' }, { name: 'budget', value: 'Custom' },
    ];
    const lead = normalizeWebsiteLead({ source, fields, hubspotFormId: '952f60aa-30ae-4ba4-a588-cc20fbd06eb7', context: { pageName: 'Onyx' } });
    assert.equal(lead.name, 'Test Visitor');
    assert.deepEqual(lead.fields, fields);
    assert.equal(lead.pageName, 'Onyx');
    assert.equal(lead.hubspotFormId, '952f60aa-30ae-4ba4-a588-cc20fbd06eb7');
  }
});

test('a request cannot choose an arbitrary CRM destination or inject a reply-to header', () => {
  assert.equal(normalizeWebsiteLead({ ...inquiry, hubspotFormId: 'https://attacker.example' }).hubspotFormId, '79f2cfd0-1beb-4264-9f0f-d9b7d728cf95');
  for (const email of ['bad', 'a@example.com\r\nBcc: victim@example.com', 'a@example.com,b@example.com', '<a@example.com>']) {
    assert.throws(() => normalizeWebsiteLead({ ...inquiry, email }), /valid email/);
  }
});

test('a valid inquiry is emailed and copied to HubSpot with its original fields', async () => {
  const emails = [], crm = [];
  const handler = createWebsiteLeadHandler({ sendEmail: async (lead) => emails.push(lead), fetchImpl: async (url, options) => { crm.push({ url, body: JSON.parse(options.body) }); return { ok: true }; }, logger: quiet });
  const res = response();
  await handler({ method: 'POST', body: inquiry }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { done: true, emailed: true, queued: true });
  assert.equal(emails.length, 1);
  assert.equal(crm.length, 1);
  assert.deepEqual(crm[0].body.fields, emails[0].fields);
});

test('a CRM rejection never prevents the lead email', async () => {
  let emailed = false;
  const handler = createWebsiteLeadHandler({ sendEmail: async () => { emailed = true; }, fetchImpl: async () => ({ ok: false, status: 400 }), logger: quiet });
  const res = response();
  await handler({ method: 'POST', body: inquiry }, res);
  assert.equal(emailed, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.emailed, true);
  assert.equal(res.body.queued, false);
});

test('a successful HubSpot copy still accepts the inquiry when Gmail is down', async () => {
  const handler = createWebsiteLeadHandler({ sendEmail: async () => { throw new Error('Provider unavailable'); }, fetchImpl: async () => ({ ok: true }), logger: quiet });
  const res = response();
  await handler({ method: 'POST', body: inquiry }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { done: true, emailed: false, queued: true });
});

test('the private inbox receives the complete inquiry when both external destinations fail', async () => {
  const saved = [];
  const handler = createWebsiteLeadHandler({
    sendEmail: async () => { throw new Error('Provider unavailable'); },
    fetchImpl: async () => ({ ok: false, status: 400 }),
    saveUndeliveredInquiry: async (lead) => saved.push(lead),
    logger: quiet,
  });
  const res = response();
  await handler({ method: 'POST', body: inquiry }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { done: true, emailed: false, queued: false });
  assert.deepEqual(saved, [normalizeWebsiteLead(inquiry)]);
});

test('an inquiry is shown as a failure when email, CRM and the private inbox all fail', async () => {
  const handler = createWebsiteLeadHandler({
    sendEmail: async () => { throw new Error('Provider unavailable'); },
    fetchImpl: async () => ({ ok: false, status: 400 }),
    saveUndeliveredInquiry: async () => { throw new Error('Storage unavailable'); },
    logger: quiet,
  });
  const res = response();
  await handler({ method: 'POST', body: inquiry }, res);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.emailed, undefined);
  assert.match(res.body.error, /try again/);
});

test('invalid submissions and unsupported methods cannot send email or create CRM records', async () => {
  let effects = 0;
  const handler = createWebsiteLeadHandler({ sendEmail: async () => { effects++; }, fetchImpl: async () => { effects++; }, logger: quiet });
  const invalid = response();
  await handler({ method: 'POST', body: { name: 'Missing email' } }, invalid);
  assert.equal(invalid.statusCode, 400);
  const get = response();
  await handler({ method: 'GET' }, get);
  assert.equal(get.statusCode, 405);
  assert.equal(get.headers.Allow, 'POST');
  assert.equal(effects, 0);
});

test('only Onyx admins can read the private inquiry inbox', async () => {
  const source = (await readFile(new URL('../pages/api/admin/website-inquiries.js', import.meta.url), 'utf8'))
    .replace("import { currentOperationsPrincipal } from '../../../lib/operationsAccess';", 'const currentOperationsPrincipal = async (request) => request.principal;')
    .replace("import { listUndeliveredInquiries } from '../../../lib/websiteLeadInbox.mjs';", 'const listUndeliveredInquiries = async () => ({ inquiries: [{ name: "Private lead" }], next: null });');
  const { default: handler } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  for (const principal of [null, { role: 'contractor' }]) {
    const denied = response();
    await handler({ method: 'GET', principal, query: {} }, denied);
    assert.equal(denied.statusCode, 401);
    assert.equal(denied.headers['Cache-Control'], 'private, no-store');
    assert.equal(denied.body.inquiries, undefined);
  }
  const admin = response();
  await handler({ method: 'GET', principal: { role: 'admin' }, query: {} }, admin);
  assert.equal(admin.statusCode, 200);
  assert.equal(admin.body.inquiries[0].name, 'Private lead');
});

test('the actual Gmail message goes to Jeremy, keeps Reply-To, and safely includes all details', async () => {
  const names = ['BDR_EMAIL_FROM', 'LEAD_NOTIFICATION_EMAIL', 'GOOGLE_GMAIL_CLIENT_ID', 'GOOGLE_GMAIL_CLIENT_SECRET', 'GOOGLE_GMAIL_REFRESH_TOKEN'];
  const previous = Object.fromEntries(names.map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  let raw;
  try {
    for (const key of names) process.env[key] = 'test-only';
    process.env.BDR_EMAIL_FROM = 'website-sender@example.com';
    process.env.LEAD_NOTIFICATION_EMAIL = 'Jeremysmithseo@gmail.com';
    globalThis.fetch = async (url, options) => {
      if (url.includes('oauth2.googleapis.com')) return { ok: true, json: async () => ({ access_token: 'test-token' }) };
      raw = Buffer.from(JSON.parse(options.body).raw, 'base64url').toString('utf8');
      return { ok: true, json: async () => ({ id: 'test-message' }) };
    };
    const source = await readFile(new URL('../lib/bdrMail.js', import.meta.url), 'utf8');
    const mailer = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
    await mailer.sendContactEmail({ email: inquiry.email, name: '<script>test</script>', source: 'Website inquiry', fields: [{ name: 'laptop_1_model', value: '<b>MacBook</b>\nSecond line' }], pageUri: 'https://www.onyxcreativelabs.com/laptop-donation', to: 'attacker@example.com' });
    assert.match(raw, /^To: Jeremysmithseo@gmail.com\r$/m);
    assert.match(raw, /^Reply-To: visitor@example.com\r$/m);
    assert.doesNotMatch(raw, /^To: attacker@example.com/m);
    const html = raw.slice(raw.indexOf('Content-Type: text/html'));
    assert.match(html, /&lt;script&gt;test&lt;\/script&gt;/);
    assert.match(html, /laptop 1 model/);
    assert.match(html, /&lt;b&gt;MacBook&lt;\/b&gt;<br>Second line/);
    assert.match(html, /https:\/\/www.onyxcreativelabs.com\/laptop-donation/);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
