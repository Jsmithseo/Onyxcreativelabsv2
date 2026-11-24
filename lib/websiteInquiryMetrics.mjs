import { INQUIRY_TOPICS, PUBLIC_WEBSITE_HOSTS, inquiryTopic } from './websiteInquiryTopics.mjs';
import { incrementWorkspaceMetadata, listNewestWorkspaceMetadata } from './workspaceMetadata.mjs';

const METRICS_PREFIX = 'website-inquiry-metrics:';
const REPORT_DAYS = 30;
const topics = new Set(INQUIRY_TOPICS.map(([id]) => id));
const stages = ['viewed', 'started', 'accepted'];

function utcDay(date) {
  return date.toISOString().slice(0, 10);
}

export async function countInquiryStage(topic, stage, now = new Date()) {
  if (!topics.has(topic) || !stages.includes(stage)) throw new Error('Invalid inquiry metric');
  await incrementWorkspaceMetadata(`${METRICS_PREFIX}${utcDay(now)}`, `${topic}:${stage}`);
}

export async function countAcceptedInquiry(lead, req) {
  if (!PUBLIC_WEBSITE_HOSTS.includes(req.headers?.host) || lead.source !== 'Website contact inquiry') return;
  let page;
  try {
    page = new URL(lead.pageUri);
  } catch {
    return;
  }
  if (page.origin !== `https://${req.headers.host}` || !/^\/contact\/?$/.test(page.pathname)) return;
  const getSingleValue = (name) => {
    const values = page.searchParams.getAll(name);
    return values.length === 1 ? values[0] : undefined;
  };
  const topic = inquiryTopic({ product: getSingleValue('product'), service: getSingleValue('service') });
  await countInquiryStage(topic, 'accepted');
}

export async function getInquiryMetrics(now = new Date()) {
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - (REPORT_DAYS - 1));
  const from = utcDay(start);
  const through = utcDay(now);
  const records = (await listNewestWorkspaceMetadata(METRICS_PREFIX, REPORT_DAYS))
    .filter(({ key }) => {
      const day = key.slice(METRICS_PREFIX.length);
      return day >= from && day <= through;
    });
  const rows = INQUIRY_TOPICS.map(([id, name]) => {
    const sums = Object.fromEntries(stages.map((stage) => [
      stage,
      records.reduce((total, { value }) => total + (value[`${id}:${stage}`] || 0), 0),
    ]));
    return { id, name, ...sums };
  }).filter((row) => stages.some((stage) => row[stage] > 0));
  return { from, through, firstRecorded: records.at(-1)?.key.slice(METRICS_PREFIX.length) ?? null, rows };
}
