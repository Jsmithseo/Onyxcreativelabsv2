import { currentOperationsPrincipal } from '../../../../lib/operationsAccess';
import { setCampaignCommission } from '../../../../lib/operationsStore';

export default async function campaign(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal || principal.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator access required.' });
    }
    const updated = await setCampaignCommission(
      req.query.id,
      req.body?.defaultCommissionCents
    );
    if (!updated) return res.status(404).json({ error: 'Campaign not found.' });
    return res.status(200).json({ campaign: updated });
  } catch (error) {
    console.error('Unable to update campaign commission', error.message);
    return res.status(400).json({ error: error.message || 'Unable to update campaign.' });
  }
}
