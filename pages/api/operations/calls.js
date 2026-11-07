import { allowedCampaignIds, currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { listCallHistory, listCampaigns } from '../../../lib/operationsStore';

export default async function calls(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error:'Method not allowed.' });
  }
  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal) return res.status(401).json({ error:'Sign in is required.' });
    const available = allowedCampaignIds(principal, await listCampaigns());
    const campaign = String(req.query.campaign || '');
    if (campaign && !available.includes(campaign)) return res.status(403).json({ error:'Campaign access is required.' });
    const result = await listCallHistory({
      campaignIds:campaign ? [campaign] : available,
      // Campaign access is the sharing boundary. Callers can see the team's
      // history while personal dashboards and queue checkpoints remain scoped.
      actorEmail:'',
      viewerEmail:principal.role === 'contractor' ? principal.email : '',
      contractorsOnly:principal.role === 'admin' && req.query.contractorsOnly === 'true',
      offset:Math.max(0, parseInt(req.query.offset, 10) || 0),
      limit:Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 50)),
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Unable to load shared call history', error.message);
    return res.status(503).json({ error:'Call history is temporarily unavailable.' });
  }
}
