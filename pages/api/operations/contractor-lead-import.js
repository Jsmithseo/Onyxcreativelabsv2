import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { allowedContractorImport, previewContractorCsv } from '../../../lib/contractorLeadImport.mjs';
import { importContractorLeads, listCampaigns } from '../../../lib/operationsStore';

export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
};

export default async function contractorLeadImport(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  try {
    const principal = await currentOperationsPrincipal(req);
    const campaignId = String(req.body?.campaignId || '').trim();
    if (!allowedContractorImport(principal, campaignId)) {
      return res.status(403).json({ error: 'You can import only to a campaign assigned to your contractor account.' });
    }
    const campaign = (await listCampaigns()).find((item) => item.id === campaignId);
    if (!campaign?.is_active) return res.status(400).json({ error: 'This campaign is unavailable for import.' });

    const preview = previewContractorCsv(String(req.body?.csv || ''));
    if (!preview.rows.length) return res.status(400).json({ error: preview.rejected[0]?.errors?.[0] || 'No lead rows found.' });
    const result = await importContractorLeads({
      campaignId: campaign.id,
      ownerEmail: principal.email,
      leads: preview.accepted,
    });
    return res.status(201).json({
      campaignId: campaign.id,
      ownerEmail: principal.email,
      preview: {
        accepted: preview.accepted.length,
        rejected: preview.rejected.length,
      },
      imported: result.imported,
      skipped: result.skipped,
      rejected: result.rejected + preview.rejected.length,
    });
  } catch (error) {
    console.error('Unable to import contractor leads', error.message);
    return res.status(400).json({ error: error.message || 'Unable to import leads.' });
  }
}
