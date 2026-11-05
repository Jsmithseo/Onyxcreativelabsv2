import {
  allowedCampaignIds,
  currentOperationsPrincipal,
} from '../../../lib/operationsAccess';
import {
  getLeadDetail,
  listCampaigns,
  recordLeadActivity,
} from '../../../lib/operationsStore';

export default async function activities(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal) return res.status(401).json({ error: 'Sign in is required.' });

    const allCampaigns = await listCampaigns();
    const campaignIds = allowedCampaignIds(principal, allCampaigns);
    const lead = await getLeadDetail(
      req.body?.leadId,
      campaignIds
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });

    const result = await recordLeadActivity({
      leadId: lead.lead.id,
      actorEmail: principal.email,
      actorRole: principal.role,
      activityType: req.body?.activityType,
      disposition: req.body?.disposition,
      note: req.body?.note,
      durationSeconds: req.body?.durationSeconds,
      scheduledFor: req.body?.scheduledFor,
      nextStage: req.body?.nextStage,
    });
    return res.status(201).json(result);
  } catch (error) {
    console.error('Unable to save shared lead activity', error.message);
    return res.status(400).json({ error: error.message || 'Unable to save activity.' });
  }
}
