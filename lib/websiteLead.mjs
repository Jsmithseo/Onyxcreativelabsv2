const DEFAULT_FORM_ID = '79f2cfd0-1beb-4264-9f0f-d9b7d728cf95';
const LEGACY_FORM_ID = '952f60aa-30ae-4ba4-a588-cc20fbd06eb7';
const FORM_IDS = new Set([DEFAULT_FORM_ID, LEGACY_FORM_ID]);

const text = (value, limit = 4000) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';

export function normalizeWebsiteLead(body = {}) {
  const source = text(body.source, 120) || 'Website inquiry';
  const context = {
    pageUri: text(body.pageUri || body.context?.pageUri, 1000),
    pageName: text(body.pageName || body.context?.pageName, 255),
  };
  const fields = Array.isArray(body.fields)
    ? body.fields.slice(0, 120).map((field) => ({
        name: text(field?.name, 100),
        value: text(field?.value),
      })).filter((field) => /^[a-zA-Z0-9_]+$/.test(field.name) && field.value)
    : [
        { name: 'firstname', value: text(body.name, 160) },
        { name: 'email', value: text(body.email, 320) },
        { name: 'phone', value: text(body.phone, 80) },
        { name: 'company', value: text(body.company, 255) },
        { name: 'website', value: text(body.website, 500) },
        { name: 'message', value: [source, text(body.details || body.message)].filter(Boolean).join('\n\n') },
        { name: 'interest', value: text(body.interest, 500) },
      ].filter((field) => field.value);
  const values = Object.fromEntries(fields.map((field) => [field.name, field.value]));
  const email = text(values.email, 320);
  const name = text(values.name || [values.firstname, values.lastname].filter(Boolean).join(' '), 320);

  if (!name || !/^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/.test(email)) {
    throw new Error('A name and valid email address are required.');
  }

  return {
    email, name, source, fields, ...context,
    hubspotFormId: FORM_IDS.has(body.hubspotFormId) ? body.hubspotFormId : DEFAULT_FORM_ID,
  };
}

export function createWebsiteLeadHandler({ sendEmail, saveUndeliveredInquiry, fetchImpl = globalThis.fetch, logger = console }) {
  return async function leadHandler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    let lead;
    try {
      lead = normalizeWebsiteLead(req.body || {});
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Email delivery must not depend on HubSpot accepting its form fields.
    const [emailResult, crmResult] = await Promise.allSettled([
      Promise.resolve().then(() => sendEmail(lead)),
      Promise.resolve().then(async () => {
        const response = await fetchImpl(
          `https://api.hsforms.com/submissions/v3/integration/submit/46783071/${lead.hubspotFormId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: lead.fields,
              context: { pageUri: lead.pageUri, pageName: lead.pageName },
            }),
            signal: AbortSignal.timeout(8000),
          }
        );
        if (!response.ok) throw new Error(`HubSpot returned ${response.status}`);
      }),
    ]);

    const emailed = emailResult.status === 'fulfilled';
    const queued = crmResult.status === 'fulfilled';
    if (!queued) {
      logger.error('Website lead CRM copy failed:', crmResult.reason?.message);
    }
    if (!emailed) {
      logger.error('Website lead email failed:', emailResult.reason?.message);
      let saved = false;
      if (saveUndeliveredInquiry) {
        try {
          await saveUndeliveredInquiry(lead);
          saved = true;
        } catch {
          logger.error('Website lead could not be saved to the admin inbox.');
        }
      }
      if (!queued && !saved) {
        return res.status(502).json({ error: 'We could not submit your inquiry. Please try again.' });
      }
    }

    return res.status(200).json({ done: true, emailed, queued });
  };
}
