export const REVIEW_STARTUP_FEE = 50;
export const REVIEW_TRIAL_DAYS = 7;

export const REVIEW_PLANS = [
  {
    id: 'single',
    name: 'Essential',
    price: 99,
    checkoutHref: 'https://square.link/u/dnDU8rrc',
    label: 'Review essentials',
    description:
      'Automated requests and helpful suggestions that make it easier for customers to share an honest review.',
    support: ['Customer-list workflow', 'Basic reporting'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 139,
    checkoutHref: 'https://square.link/u/EJgfP9Nb',
    label: 'Extra Onyx support',
    description:
      'The same review essentials, with a guided launch and extra support for your customer outreach.',
    featured: true,
    support: [
      'Everything in Essential',
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
