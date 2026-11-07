import {
  allowedCampaignIds,
  currentOperationsPrincipal,
} from '../../../../lib/operationsAccess';
import { getLeadDetail, listCampaigns, updateLeadProfile } from '../../../../lib/operationsStore';

export default async function lead(req, res) {
  if (!['GET', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal) return res.status(401).json({ error: 'Sign in is required.' });
    if (req.method === 'PATCH' && principal.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator access required.' });
    }
    const allCampaigns = await listCampaigns();
    const detail = await getLeadDetail(
      req.query.id,
      allowedCampaignIds(principal, allCampaigns),
      principal.role === 'contractor' ? principal.email : ''
    );
    if (!detail) return res.status(404).json({ error: 'Lead not found.' });
    if (req.method === 'PATCH') {
      const { name, notes, previousName, previousNotes } = req.body || {};
      if (typeof name !== 'string' || !name.trim() || name.length > 240 || typeof notes !== 'string' || notes.length > 12000 || typeof previousName !== 'string' || previousName.length > 240 || typeof previousNotes !== 'string' || previousNotes.length > 12000) {
        return res.status(400).json({ error: 'Enter a lead name and notes within the supported limits.' });
      }
      const saved = await updateLeadProfile({ leadId: detail.lead.id, name, notes, previousName, previousNotes });
      if (!saved) return res.status(409).json({ error: 'This lead changed while you were editing. Refresh its details before saving again.' });
      return res.status(200).json({ lead: saved });
    }
    return res.status(200).json(detail);
  } catch (error) {
    console.error('Unable to load shared lead detail', error.message);
    return res.status(503).json({ error: 'Lead details are temporarily unavailable.' });
  }
}
