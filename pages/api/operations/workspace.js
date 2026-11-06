import { allowedCampaignIds, currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { gzipSync } from 'node:zlib';
import { SALES_PIPELINE_LANES } from '../../../lib/salesPipeline.mjs';
import {
  listCampaigns,
  listCampaignSummaries,
  listPipeline,
  listQueueResumePositions,
  isAdminMasterSynced,
} from '../../../lib/operationsStore';

export default async function workspace(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
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
    const [leads, campaignSummaries, adminMasterSynced, queueResumePositions] = await Promise.all([
      listPipeline(campaignIds),
      listCampaignSummaries(campaignIds, principal.role === 'admin' ? '' : principal.email),
      isAdminMasterSynced(),
      principal.role === 'contractor' ? listQueueResumePositions(campaignIds, principal.email) : [],
    ]);

    const payload = {
      principal: { email: principal.email, role: principal.role },
      campaigns,
      campaignSummaries,
      leads,
      queueResumePositions,
      goals: principal.goals || null,
      readOnlyPipeline: principal.role === 'contractor',
      adminMasterSynced,
      pipelineColumns:SALES_PIPELINE_LANES,
    };
    const json = JSON.stringify(payload);
    if (/\bgzip\b/.test(req.headers?.['accept-encoding'] || '') && Buffer.byteLength(json) > 1000000) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      return res.status(200).end(gzipSync(json));
    }
    return res.status(200).json(payload);
  } catch (error) {
    console.error('Unable to load shared operations workspace', error.message);
    return res.status(503).json({
      error: 'Shared campaign data is temporarily unavailable.',
    });
  }
}
