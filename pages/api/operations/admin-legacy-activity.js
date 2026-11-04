import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { recordLegacyWorkspaceActivity } from '../../../lib/operationsStore';

export default async function adminLegacyActivity(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal || principal.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator access required.' });
    }

    const result = await recordLegacyWorkspaceActivity({
      legacyLead: req.body?.lead,
      actorEmail: principal.email,
      actorRole: 'admin',
      activityType: req.body?.activityType,
      disposition: req.body?.disposition,
      note: req.body?.note,
      durationSeconds: req.body?.durationSeconds,
      scheduledFor: req.body?.scheduledFor,
      nextStage: req.body?.nextStage,
    });
    return res.status(201).json(result);
  } catch (error) {
    console.error('Unable to record shared admin activity', error.message);
    return res.status(400).json({ error: error.message || 'Unable to record activity.' });
  }
}
