import { twilioConfig } from '../../../../lib/twilioCommunications';

export default function status(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const { voice, sms, recordings } = twilioConfig();
  return res.status(200).json({ voice, sms, recordings });
}
