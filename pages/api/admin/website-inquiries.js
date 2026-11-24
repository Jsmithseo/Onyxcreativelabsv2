import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { listUndeliveredInquiries } from '../../../lib/websiteLeadInbox.mjs';

export default async function websiteInquiries(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (principal?.role !== 'admin') {
      return res.status(401).json({ error: 'Administrator access required.' });
    }
    return res.status(200).json(await listUndeliveredInquiries(req.query.before));
  } catch {
    console.error('Could not read the website inquiry inbox.');
    return res.status(503).json({ error: 'The inbox is temporarily unavailable.' });
  }
}
