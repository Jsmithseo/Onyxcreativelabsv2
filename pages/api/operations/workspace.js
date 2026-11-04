import { allowedCampaignIds, currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { listCampaigns, listPipeline } from '../../../lib/operationsStore';

export default async function workspace(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal) {
      return res.status(401).json({ error: 'Sign in is required.' });
    }

    const allCampaigns = await listCampaigns();
    const campaignIds = allowedCampaignIds(principal, allCampaigns);
    const campaigns = allCampaigns.filter((campaign) => campaignIds.includes(campaign.id));
    const leads = await listPipeline(campaignIds);

    return res.status(200).json({
      principal: { email: principal.email, role: principal.role },
      campaigns,
      leads,
      readOnlyPipeline: principal.role === 'contractor',
    });
  } catch (error) {
    console.error('Unable to load shared operations workspace', error.message);
    return res.status(503).json({
      error: 'Shared campaign data is temporarily unavailable.',
    });
  }
}
