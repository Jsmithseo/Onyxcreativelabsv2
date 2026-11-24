import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { getInquiryMetrics } from '../../../lib/websiteInquiryMetrics.mjs';

export default async function websiteInquiryMetrics(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  try {
    const principal = await currentOperationsPrincipal(req);
    if (principal?.role !== 'admin') return res.status(401).end();
    return res.status(200).json(await getInquiryMetrics());
  } catch {
    console.error('Could not load website inquiry metrics.');
    return res.status(503).end();
  }
}
