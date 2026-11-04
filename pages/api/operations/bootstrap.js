import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { importLegacyWorkspace } from '../../../lib/operationsStore';

export const config = {
  api: { bodyParser: { sizeLimit: '8mb' } },
};

export default async function bootstrap(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal || principal.role !== 'admin') {
      return res.status(401).json({ error: 'Administrator access required.' });
    }

    const result = await importLegacyWorkspace({
      campaigns: req.body?.campaigns,
      leads: req.body?.leads,
    });
    return res.status(200).json({ synced: true, ...result });
  } catch (error) {
    console.error('Unable to import legacy operations data', error.message);
    return res.status(503).json({ error: 'Unable to sync the existing call queue.' });
  }
}
