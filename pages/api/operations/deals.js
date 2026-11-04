import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { setDeal } from '../../../lib/operationsStore';

export default async function deals(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal || principal.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can close a deal.' });
    }

    const result = await setDeal({
      leadId: req.body?.leadId,
      status: req.body?.status,
      potentialCommissionCents: req.body?.potentialCommissionCents,
      closedBy: principal.email,
      reopenStage: req.body?.reopenStage,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Unable to update deal status', error.message);
    return res.status(400).json({ error: error.message || 'Unable to update deal.' });
  }
}
