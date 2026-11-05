import {
  allowedCampaignIds,
  currentOperationsPrincipal,
} from '../../../../lib/operationsAccess';
import { getLeadDetail, listCampaigns } from '../../../../lib/operationsStore';

export default async function lead(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal) return res.status(401).json({ error: 'Sign in is required.' });
    const allCampaigns = await listCampaigns();
    const detail = await getLeadDetail(
      req.query.id,
      allowedCampaignIds(principal, allCampaigns),
      principal.role === 'contractor' ? principal.email : ''
    );
    if (!detail) return res.status(404).json({ error: 'Lead not found.' });
    return res.status(200).json(detail);
  } catch (error) {
    console.error('Unable to load shared lead detail', error.message);
    return res.status(503).json({ error: 'Lead details are temporarily unavailable.' });
  }
}
