import { allowedCampaignIds, currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { getContractorCallReport, listCampaigns } from '../../../lib/operationsStore';

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export default async function callReport(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error:'Method not allowed.' });
  }
  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal) return res.status(401).json({ error:'Sign in is required.' });
    if (principal.role !== 'admin') return res.status(403).json({ error:'Administrator access is required.' });
    const today = new Intl.DateTimeFormat('en-CA', { timeZone:'America/Los_Angeles', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
    const from = String(req.query.from || today);
    const to = String(req.query.to || from);
    if (!validDate(from) || !validDate(to) || from > to) return res.status(400).json({ error:'Choose a valid report date range.' });
    const available = allowedCampaignIds(principal, await listCampaigns());
    const campaign = String(req.query.campaign || '');
    if (campaign && !available.includes(campaign)) return res.status(403).json({ error:'Campaign access is required.' });
    return res.status(200).json(await getContractorCallReport({ campaignIds:campaign ? [campaign] : available, from, to }));
  } catch (error) {
    console.error('Unable to load contractor call report', error.message);
    return res.status(503).json({ error:'Contractor report is temporarily unavailable.' });
  }
}
