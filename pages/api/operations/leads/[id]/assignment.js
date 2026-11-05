import { currentOperationsPrincipal } from '../../../../../lib/operationsAccess';
import { assignLead, listCampaigns } from '../../../../../lib/operationsStore';
import { findContractor } from '../../../../../lib/contractorStore';

export default async function assignment(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal || principal.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator access required.' });
    }
    const contractor = await findContractor(req.body?.contractorEmail);
    const campaign = (await listCampaigns()).find((item) => item.id === req.body?.campaignId);
    if (!contractor || !contractor.campaigns.includes(campaign?.id)) {
      return res.status(400).json({ error: 'Assign the lead to an active contractor with campaign access.' });
    }
    const lead = await assignLead({
      leadId: req.query.id,
      contractorEmail: contractor.email,
      campaignId: campaign.id,
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    return res.status(200).json({ lead });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to assign lead.' });
  }
}
