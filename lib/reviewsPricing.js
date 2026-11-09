export const REVIEW_STARTUP_FEE = 50;
export const REVIEW_TRIAL_DAYS = 7;

export const REVIEW_PLANS = [
  {
    id: 'single',
    name: 'Single Location',
    price: 99,
    label: 'Review essentials',
    description:
      'Automated requests and helpful suggestions that make it easier for customers to share an honest review.',
    support: ['Customer-list workflow', 'Basic reporting'],
  },
  {
    id: 'premium',
    name: 'Premium Location',
    price: 139,
    label: 'Extra Onyx support',
    description:
      'The same review essentials, with a guided launch and extra support for your customer outreach.',
    featured: true,
    support: [
      'Everything in Single Location',
      'Guided launch and team onboarding',
      'Email and SMS campaign planning',
      'QR or NFC review-stand strategy',
    ],
  },
];

export function findReviewPlan(id) {
  const aliases = { starter: 'single', growth: 'premium' };
  return REVIEW_PLANS.find((plan) => plan.id === (aliases[id] || id));
}
