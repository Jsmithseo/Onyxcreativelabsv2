import {
  allowedCampaignIds,
  currentOperationsPrincipal,
} from '../../../lib/operationsAccess';
import {
  listAppointments,
  listCampaigns,
} from '../../../lib/operationsStore';

export default async function appointments(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal) return res.status(401).json({ error: 'Sign in is required.' });
    const campaigns = await listCampaigns();
    const campaignIds = allowedCampaignIds(principal, campaigns);
    const appointments = await listAppointments(campaignIds, principal.role === 'contractor' ? principal.email : '');
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error('Unable to load shared appointments', error.message);
    return res.status(503).json({ error: 'Shared appointments are temporarily unavailable.' });
  }
}
