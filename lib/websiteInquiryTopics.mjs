export const REVIEW_INTEREST = 'Onyx Reviews';

export const INTEREST_OPTIONS = [
  ['fractional-bdr', 'Fractional BDR'],
  ['90-day-pilot', '90-Day Pilot'],
  ['content-marketing', 'Content Marketing'],
  ['growth-plan', 'Growth Plan'],
  ['onyx-reviews', REVIEW_INTEREST],
  ['cro', 'CRO'],
  ['web-development', 'Web Development'],
  ['email-marketing', 'Email Marketing'],
  ['research-strategy', 'Research & Strategy'],
  ['paid-marketing', 'Paid Marketing'],
];

export const INQUIRY_TOPICS = [['general', 'General inquiry'], ...INTEREST_OPTIONS];
export const PUBLIC_WEBSITE_HOSTS = ['www.onyxcreativelabs.com', 'onyxcreativelabs.com'];

export function inquiryTopic({ product, service }) {
  if (product === 'reviews') return 'onyx-reviews';
  return INTEREST_OPTIONS.find(([id]) => id === service)?.[0] || 'general';
}
