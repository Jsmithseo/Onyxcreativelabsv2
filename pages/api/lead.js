const HUBSPOT_FORM_ENDPOINT =
  'https://api.hsforms.com/submissions/v3/integration/submit/46783071/79f2cfd0-1beb-4264-9f0f-d9b7d728cf95';

const text = (value, maxLength = 2000) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

export default async function leadHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = req.body || {};
  const email = text(body.email, 320);
  const name = text(body.name, 160);

  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const source = text(body.source, 120) || 'Website inquiry';
  const details = text(body.details, 4000);
  const fields = [
    { name: 'firstname', value: name },
    { name: 'email', value: email },
    { name: 'phone', value: text(body.phone, 80) },
    { name: 'company', value: text(body.company, 255) },
    { name: 'website', value: text(body.website, 500) },
    {
      name: 'message',
      value: [source, details].filter(Boolean).join('\n\n'),
    },
    { name: 'interest', value: text(body.interest, 500) },
  ].filter((field) => field.value);

  try {
    const response = await fetch(HUBSPOT_FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields,
        context: {
          pageUri: text(body.pageUri, 1000),
          pageName: text(body.pageName, 255),
        },
      }),
    });

    if (!response.ok) {
      const hubspotError = await response.text();
      console.error('HubSpot lead submission failed:', hubspotError);
      return res.status(502).json({ error: 'The lead queue is unavailable. Please try again.' });
    }

    return res.status(200).json({ queued: true });
  } catch (error) {
    console.error('HubSpot lead submission error:', error);
    return res.status(502).json({ error: 'The lead queue is unavailable. Please try again.' });
  }
}
