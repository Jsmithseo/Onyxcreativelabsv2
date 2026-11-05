import { put } from '@vercel/blob';
import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { previewAdminCampaignSync, syncAdminCampaigns } from '../../../lib/operationsStore';

export const config = { api:{ bodyParser:{ sizeLimit:'8mb' } }, maxDuration:60 };

export default async function adminCampaignSync(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({error:'Method not allowed.'}); }
  try {
    const principal = await currentOperationsPrincipal(req);
    if (principal?.role !== 'admin') return res.status(403).json({error:'Administrator access is required.'});
    const snapshot = { campaigns:req.body?.campaigns, leads:req.body?.leads };
    if (!Array.isArray(snapshot.campaigns) || !Array.isArray(snapshot.leads)) return res.status(400).json({error:'An Admin campaign snapshot is required.'});
    const preview = await previewAdminCampaignSync(snapshot);
    if (req.body.preview === true) return res.status(200).json(preview);
    if (!preview.ready || req.body.previewHash !== preview.preview_hash) return res.status(409).json({error:'Preview the current queues and resolve conflicts before syncing.',...preview});
    // Keep the exact Admin input private and recoverable before any DB write.
    await put(`operations-migrations/admin-master/${preview.preview_hash}.json`, JSON.stringify({actor:principal.email,createdAt:new Date().toISOString(),...snapshot}), {
      access:'private', addRandomSuffix:false, allowOverwrite:true, contentType:'application/json',
    });
    const result = await syncAdminCampaigns(snapshot, preview.preview_hash);
    return res.status(200).json({synced:true,...result});
  } catch (error) {
    console.error('Admin campaign sync failed', error.message);
    return res.status(503).json({error:error.message || 'Admin campaign sync is unavailable.'});
  }
}
