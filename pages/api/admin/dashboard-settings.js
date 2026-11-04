import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import {
  getAdminDashboardSettings,
  normaliseDashboardSettings,
  saveAdminDashboardSettings,
} from '../../../lib/adminDashboardSettings';

export default async function dashboardSettings(req, res) {
  const principal = await currentOperationsPrincipal(req);
  if (!principal || principal.role !== 'admin') {
    return res.status(401).json({ error: 'Administrator access required.' });
  }

  if (req.method === 'GET') {
    try {
      return res.status(200).json({ settings: await getAdminDashboardSettings() });
    } catch (error) {
      console.error('Unable to load admin dashboard settings', error.message);
      return res.status(503).json({ error: 'Admin dashboard settings are unavailable.' });
    }
  }

  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const settings = await saveAdminDashboardSettings(
      normaliseDashboardSettings(req.body)
    );
    return res.status(200).json({ settings });
  } catch (error) {
    console.error('Unable to save admin dashboard settings', error.message);
    return res.status(503).json({ error: 'Unable to save admin dashboard settings.' });
  }
}
