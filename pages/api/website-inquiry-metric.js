import { countInquiryStage } from '../../lib/websiteInquiryMetrics.mjs';
import { INQUIRY_TOPICS, PUBLIC_WEBSITE_HOSTS } from '../../lib/websiteInquiryTopics.mjs';

const topics = new Set(INQUIRY_TOPICS.map(([id]) => id));

export const config = { api: { bodyParser: { sizeLimit: '1kb' } } };

export default async function websiteInquiryMetric(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  if (!PUBLIC_WEBSITE_HOSTS.includes(req.headers.host)) return res.status(204).end();
  if (req.headers.origin !== `https://${req.headers.host}`) return res.status(403).end();

  const { topic, stage } = req.body || {};
  if (!topics.has(topic) || !['viewed', 'started'].includes(stage)) return res.status(400).end();

  try {
    await countInquiryStage(topic, stage);
    return res.status(204).end();
  } catch {
    console.error('Could not record a website inquiry metric.');
    return res.status(503).end();
  }
}
