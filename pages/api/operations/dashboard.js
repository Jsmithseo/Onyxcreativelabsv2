import {
  allowedCampaignIds,
  currentOperationsPrincipal,
  hasCampaignAccess,
} from '../../../lib/operationsAccess';
import {
  getContractorDailyDashboard,
  listCampaigns,
} from '../../../lib/operationsStore';

export default async function dashboard(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal) return res.status(401).json({ error: 'Sign in is required.' });
    const campaigns = await listCampaigns();
    const availableIds = allowedCampaignIds(principal, campaigns);
    const campaignId = String(req.query.campaign || availableIds[0] || '');
    if (!hasCampaignAccess(principal, campaignId)) {
      return res.status(403).json({ error: 'Campaign access is required.' });
    }
    const dashboard = await getContractorDailyDashboard({
      campaignId,
      actorEmail: principal.email,
      viewerEmail: principal.role === 'contractor' ? principal.email : '',
    });
    return res.status(200).json({ campaignId, ...dashboard });
  } catch (error) {
    console.error('Unable to load contractor dashboard', error.message);
    return res.status(503).json({ error: 'Daily calling data is temporarily unavailable.' });
  }
}
