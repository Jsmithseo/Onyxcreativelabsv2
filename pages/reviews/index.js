import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BaseLayout from '../components/layouts/BaseLayouts';
import styles from '../styles/reviews.module.css';
import {
  REVIEW_PLANS as plans,
  REVIEW_STARTUP_FEE,
  REVIEW_TRIAL_DAYS,
} from '../../lib/reviewsPricing';

const reviewCallHref = '/contact?product=reviews';
const essentials = [
  'Automated SMS review requests',
  'Helpful customer review-writing suggestions',
  'Google Business Profile connection',
  'Google-focused reputation monitoring',
  'Requests, feedback, and activity in one dashboard',
];
const capabilities = [
  {
    icon: 'check',
    title: 'Give new customers confidence',
    copy: 'Real customer experiences show people what it is like to work with you. A strong review presence gives them more reasons to choose your business.',
  },
  {
    icon: 'message',
    title: 'Onyx does the asking',
    copy: 'Automated SMS requests go out on your behalf after a customer interaction. You and your staff can focus on serving customers instead of remembering to ask.',
  },
  {
    icon: 'reply',
    title: 'Make reviews easier to write',
    copy: 'Helpful suggestions give customers a starting point for what to say about their experience. They can personalize the wording and share an honest review in their own voice.',
  },
  {
    icon: 'dashboard',
    title: 'Keep your reputation in view',
    copy: 'Follow review requests, feedback, and Google review activity in one dashboard. See what customers are sharing and keep the conversation going with thoughtful replies.',
  },
  {
    icon: 'qr',
    title: 'QR & NFC review moments',
    copy: 'Give customers a simple way to share their experience in person. Ask Onyx about QR and NFC review-stand options during setup.',
  },
  {
    icon: 'support',
    title: 'Support as your business grows',
    copy: 'Start with one location or plan a rollout across several. Premium Location adds guided onboarding and campaign planning, and Onyx can help you map a larger rollout.',
  },
];
const faqs = [
  {
    question: 'How can reviews help me win more business?',
    answer:
      'Reviews help prospective customers understand what to expect before they contact you. Specific, honest experiences from people you have served can build trust, answer common questions, and give someone more confidence to choose your business.',
  },
  {
    question: 'Do I or my staff have to keep asking for reviews?',
    answer:
      'Onyx sends automated SMS review requests on your behalf. We help you choose when to ask after a customer interaction, so review outreach becomes part of your process while your team focuses on serving customers.',
  },
  {
    question: 'How do suggestions make leaving a review easier?',
    answer:
      'A customer may want to leave a review but be unsure what to write. Onyx offers helpful starting points about the service they used and their experience. Customers can personalize the suggestions and share their own honest feedback.',
  },
  {
    question: 'How does the 7-day subscription trial work?',
    answer: `An enrolled trial includes ${REVIEW_TRIAL_DAYS} days of subscription access before monthly billing begins. The $${REVIEW_STARTUP_FEE} one-time startup fee is separate from the subscription trial. Onyx will confirm your trial dates, fee timing, and billing details before enrollment. Sending an inquiry does not start a subscription or collect payment.`,
  },
  {
    question: 'Is the $50 startup fee a monthly charge?',
    answer: `No. The $${REVIEW_STARTUP_FEE} startup fee applies once per new account. It is separate from the recurring monthly plan price and is not multiplied by the number of locations. Onyx will confirm the fee and when it is due before enrollment.`,
  },
  {
    question: 'What happens after my trial?',
    answer: `After an enrolled trial, your selected plan is $${plans[0].price} or $${plans[1].price} per location, per month unless you cancel before the trial ends. Onyx will confirm your first monthly billing date and recurring-charge authorization before enrollment. The startup fee is charged once per account.`,
  },
  {
    question: 'Which plan is right for my business?',
    answer: `Single Location is $${plans[0].price} per month for the review essentials. Premium Location is $${plans[1].price} per month and adds a guided launch, team onboarding, campaign planning, and review-stand strategy. Both prices are per location, plus a $${REVIEW_STARTUP_FEE} one-time startup fee per account.`,
  },
  {
    question: 'Does Onyx Reviews focus on Google?',
    answer:
      'Yes. The published plans focus on your Google Business Profile, Google review activity, customer feedback, and reputation monitoring. Ask Onyx about your specific business setup before choosing a plan.',
  },
  {
    question: 'How are customer reviews collected?',
    answer:
      'Onyx sends timely SMS review requests on your behalf after a completed service. Customers receive an easy path to share feedback, with helpful suggestions for writing their review. QR or NFC moments can also support in-person requests. Your business is responsible for customer contact permissions and opt-out requests.',
  },
  {
    question: 'Can I use it for multiple locations?',
    answer: `Yes. The calculator shows the monthly subscription for one to five locations on the same plan. A $${REVIEW_STARTUP_FEE} startup fee applies once per account, regardless of the location count. Onyx will confirm your rollout details; contact the team for more than five locations.`,
  },
  {
    question: 'Can I cancel my subscription?',
    answer: (
      <>
        Onyx Reviews is month-to-month. You can cancel at any time. The{' '}
        <Link href="/refund-policy">Refund Policy</Link> explains pro-rated
        refunds for monthly subscriptions and separate terms for custom
        services. Your cancellation route will be provided before enrollment.
      </>
    ),
  },
  {
    question: 'Will I get a guaranteed rating or number of reviews?',
    answer:
      'Onyx helps you build a consistent process for honest customer feedback. Review counts, star ratings, search placement, and revenue are not guaranteed. Customers choose what to write, and Google controls its own platform and policies.',
  },
];

function inquiryHref(plan, locations = 1) {
  return `/contact?${new URLSearchParams({
    product: 'reviews',
    plan,
    trial: String(REVIEW_TRIAL_DAYS),
    locations: String(locations),
  }).toString()}`;
}

function Icon({ name, className = '' }) {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 9v12M13 13h4M13 17h4" />
      </>
    ),
    message: (
      <>
        <path d="M21 11a8 8 0 0 1-8 8H7l-4 3V5a2 2 0 0 1 2-2h8a8 8 0 0 1 8 8Z" />
        <path d="M7 8h10M7 12h7" />
      </>
    ),
    locations: (
      <>
        <path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="9" r="2" />
      </>
    ),
    reply: <path d="m9 5-6 6 6 6M3 11h10a8 8 0 0 1 8 8" />,
    qr: (
      <>
        <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6zM21 12v3M12 3v3M12 12h3M3 12h3M12 18v3" />
      </>
    ),
    support: (
      <>
        <path d="M4 13V10a8 8 0 0 1 16 0v3M20 17v2a2 2 0 0 1-2 2h-4" />
        <rect x="2" y="11" width="4" height="7" rx="2" />
        <rect x="18" y="11" width="4" height="7" rx="2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  };
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function FeatureList({ items }) {
  return (
    <ul className={styles.featureList}>
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PriceCard({ plan, termsAccepted }) {
  return (
    <article
      className={`${styles.planCard} ${
        plan.featured ? styles.featuredPlan : ''
      }`}
    >
      <div className={styles.planTopline}>{plan.label}</div>
      <div className={styles.planBody}>
        <h3>{plan.name}</h3>
        <p className={styles.planDescription}>{plan.description}</p>
        <p className={styles.price}>
          <strong>${plan.price}</strong>
          <span>/ month</span>
        </p>
        <p className={styles.priceUnit}>Per location · billed monthly</p>
        <p className={styles.startupFee}>
          + ${REVIEW_STARTUP_FEE} one-time startup fee per account
        </p>
        <p className={styles.trialNote}>
          {REVIEW_TRIAL_DAYS}-day subscription trial available
        </p>
        <h4>Review essentials</h4>
        <FeatureList items={essentials} />
        <h4>{plan.featured ? 'Premium support' : 'Included in your plan'}</h4>
        <FeatureList items={plan.support} />
        <div className={styles.planAction}>
          {termsAccepted ? (
            <Link
              className={`${styles.button} ${
                plan.featured ? styles.primaryButton : styles.outlineButton
              }`}
              href={inquiryHref(plan.id)}
            >
              Choose {plan.name}
              <Icon name="arrow" />
            </Link>
          ) : (
            <a
              className={`${styles.button} ${styles.outlineButton}`}
              href="#review-plan-terms"
            >
              Review terms to continue
              <Icon name="arrow" />
            </a>
          )}
          <span>One location. Add more below.</span>
        </div>
      </div>
    </article>
  );
}

export default function Reviews() {
  const [calculatorPlanId, setCalculatorPlanId] = useState(plans[0].id);
  const [locationCount, setLocationCount] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const calculatorPlan = plans.find((plan) => plan.id === calculatorPlanId);
  const monthlyTotal = calculatorPlan.price * locationCount;

  return (
    <>
      <Head>
        <title>Onyx Reviews | Help More Customers Choose Your Business</title>
        <meta
          name="description"
          content="Build trust and help more customers choose your business. Onyx asks for Google reviews on your behalf and gives customers suggestions that make reviews easier to write."
        />
        <link rel="canonical" href="https://www.onyxcreativelabs.com/reviews" />
      </Head>
      <BaseLayout className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eyebrow}>
              Onyx Reviews · Turn customer trust into opportunity
            </p>
            <h1>
              Help more customers
              <br />
              <span>choose your business.</span>
            </h1>
            <p className={styles.heroCopy}>
              Reviews give new customers the confidence to choose you. Onyx asks
              for reviews on your behalf, so you and your staff can focus on
              serving customers. Helpful suggestions make it easier for
              customers to write an honest review.
            </p>
            <div className={styles.heroLinks}>
              <a href="#plans">
                Explore plans from $99 / month
                <Icon name="arrow" />
              </a>
              <span>${REVIEW_STARTUP_FEE} one-time startup fee</span>
            </div>
            <div className={styles.videoFrame}>
              <video
                className={styles.video}
                controls
                playsInline
                preload="metadata"
                poster="/videos/onyx-reviews-explainer.jpg"
                aria-label="Onyx Reviews: build trust, let Onyx ask, and make reviews easier"
              >
                <source
                  src="/videos/onyx-reviews-explainer.mp4"
                  type="video/mp4"
                />
                <track
                  kind="captions"
                  src="/videos/onyx-reviews-explainer.vtt"
                  srcLang="en"
                  label="English"
                  default
                />
                Your browser does not support embedded video.{' '}
                <a href="/videos/onyx-reviews-explainer.mp4">
                  Download the Onyx Reviews explainer.
                </a>
              </video>
              <div className={styles.videoCaption}>
                <span>Meet Onyx Reviews</span>
                <span>More trust. Less asking. Easier reviews.</span>
              </div>
            </div>
            <Link
              className={`${styles.button} ${styles.primaryButton}`}
              href={reviewCallHref}
            >
              Book a personalized review growth call
              <Icon name="arrow" />
            </Link>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="features-heading">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>
                Make your reputation part of your growth
              </p>
              <h2 id="features-heading">
                Let today’s customers
                <br className={styles.desktopBreak} /> help you reach
                tomorrow’s.
              </h2>
              <p>
                Give people more reasons to choose you. Onyx handles the asking
                and helps customers find the words to share their experience.
              </p>
            </div>
            <div className={styles.capabilityGrid}>
              {capabilities.map((feature) => (
                <article key={feature.title} className={styles.capability}>
                  <span className={styles.iconTile}>
                    <Icon name={feature.icon} />
                  </span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="plans"
          className={`${styles.section} ${styles.pricingSection}`}
          aria-labelledby="plans-heading"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Simple monthly pricing</p>
              <h2 id="plans-heading">Two plans. Room to grow.</h2>
              <p>
                Choose ${plans[0].price} or ${plans[1].price} per location, per
                month.
                <br className={styles.desktopBreak} /> Both plans include
                automated review requests and helpful customer review
                suggestions.
              </p>
            </div>
            <p className={styles.enrollmentSummary}>
              A ${REVIEW_STARTUP_FEE} startup fee applies once per new account.{' '}
              {REVIEW_TRIAL_DAYS}-day subscription trial available; the startup
              fee is separate.
            </p>
            <div className={styles.planGrid}>
              {plans.map((plan) => (
                <PriceCard
                  key={plan.id}
                  plan={plan}
                  termsAccepted={termsAccepted}
                />
              ))}
            </div>
            <div className={styles.policyBox} id="review-plan-terms">
              <label className={styles.policyLabel}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                />
                <span>
                  I have reviewed the{' '}
                  <Link href="/terms-and-conditions">
                    Terms &amp; Conditions
                  </Link>
                  , <Link href="/refund-policy">Refund Policy</Link>, and{' '}
                  <Link href="/privacy-policy">Privacy Policy</Link> for my
                  selected Onyx Reviews plan.
                </span>
              </label>
              <p>
                Choosing a plan opens an inquiry. No payment is collected and no
                subscription begins here. Onyx will confirm your monthly price,
                one-time startup fee, trial dates, and cancellation details
                before enrollment.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="requests-heading">
          <div className={`${styles.container} ${styles.splitSection}`}>
            <div className={styles.editorialCopy}>
              <p className={styles.eyebrow}>Less asking. Easier reviews.</p>
              <h2 id="requests-heading">
                Keep serving.
                <br /> We’ll do the asking.
              </h2>
              <p>
                You and your staff have customers to look after. Onyx sends a
                timely review request on your behalf after a customer
                interaction, so asking becomes part of the process.
              </p>
              <p>
                Customers get helpful suggestions about what to mention, such as
                the service they used and what stood out. They have a starting
                point for an honest review and can make the words their own.
              </p>
              <Link className={styles.textLink} href={reviewCallHref}>
                Put review requests to work for you
                <Icon name="arrow" />
              </Link>
            </div>
            <div
              className={styles.conversation}
              aria-label="Illustrative automated review request and customer review-writing suggestions"
            >
              <div className={styles.conversationHeader}>
                <span className={styles.brandMark}>O</span>
                <div>
                  <strong>Your business</strong>
                  <span>Illustrative automated conversation</span>
                </div>
                <Icon name="message" />
              </div>
              <div className={styles.conversationBody}>
                <span className={styles.conversationDate}>
                  After a completed service
                </span>
                <p>
                  Thanks for choosing us today! Would you share your experience
                  in a Google review?
                </p>
                <p className={styles.customerReply}>
                  I’d love to. I’m not sure what to write.
                </p>
                <p>
                  Here are a few ideas: Which service did you use? What stood
                  out? What would you tell someone considering us?
                </p>
              </div>
              <div className={styles.conversationFooter}>
                <Icon name="check" /> Onyx asks. Customers use their own words.
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.locationSection}`}
          aria-labelledby="locations-heading"
        >
          <div className={`${styles.container} ${styles.splitSection}`}>
            <div className={styles.editorialCopy}>
              <p className={styles.eyebrow}>Build trust at every location</p>
              <h2 id="locations-heading">
                More locations.
                <br />
                The same easy ask.
              </h2>
              <p>
                Give every location a consistent way to request reviews while
                your staff focuses on customers. Choose a plan and see your
                monthly estimate for up to five locations.
              </p>
              <p>
                Monthly pricing scales with your location count. The $
                {REVIEW_STARTUP_FEE} startup fee is charged once per account.
                Onyx will confirm the reporting, access, and rollout that fit
                your setup.
              </p>
              <Link className={styles.textLink} href={reviewCallHref}>
                More than five locations? Talk to Onyx
                <Icon name="arrow" />
              </Link>
            </div>
            <div className={styles.calculator}>
              <p className={styles.calculatorTitle}>Build your location plan</p>
              <label htmlFor="calculatorPlan">Choose your plan</label>
              <select
                id="calculatorPlan"
                value={calculatorPlanId}
                onChange={(event) => setCalculatorPlanId(event.target.value)}
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — ${plan.price}/location/month
                  </option>
                ))}
              </select>
              <span className={styles.controlLabel}>Number of locations</span>
              <div
                className={styles.locationButtons}
                role="group"
                aria-label="Location count"
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    aria-pressed={locationCount === count}
                    aria-label={`${count} ${
                      count === 1 ? 'location' : 'locations'
                    }`}
                    onClick={() => setLocationCount(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <div
                className={styles.total}
                aria-live="polite"
                aria-atomic="true"
              >
                <span>
                  {calculatorPlan.name} · {locationCount}{' '}
                  {locationCount === 1 ? 'location' : 'locations'}
                </span>
                <p>
                  <strong>${monthlyTotal.toLocaleString('en-US')}</strong>
                  <span>/ month</span>
                </p>
                <span>
                  ${calculatorPlan.price} × {locationCount}{' '}
                  {locationCount === 1 ? 'location' : 'locations'} · billed
                  monthly
                </span>
                <span className={styles.calculatorStartup}>
                  + ${REVIEW_STARTUP_FEE} one-time startup fee per account
                </span>
                <span>
                  {REVIEW_TRIAL_DAYS}-day subscription trial available
                </span>
              </div>
              {termsAccepted ? (
                <Link
                  className={`${styles.button} ${styles.primaryButton}`}
                  href={inquiryHref(calculatorPlan.id, locationCount)}
                >
                  Build my location plan
                  <Icon name="arrow" />
                </Link>
              ) : (
                <a
                  className={`${styles.button} ${styles.outlineButton}`}
                  href="#review-plan-terms"
                >
                  Review terms to continue
                  <Icon name="arrow" />
                </a>
              )}
              <p className={styles.calculatorNote}>
                An estimate for your inquiry. Enrollment is confirmed with Onyx.
              </p>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className={styles.section}
          aria-labelledby="setup-heading"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>A practical path to more reviews</p>
              <h2 id="setup-heading">
                Great service. A timely ask. An easier review.
              </h2>
              <p>
                Make it easier for customers to share the experiences that help
                your next customer choose you.
              </p>
            </div>
            <ol className={styles.setupSteps}>
              <li>
                <span>01</span>
                <h3>Connect your business</h3>
                <p>
                  Connect your Google Business Profile and choose when Onyx
                  should ask after a completed service or customer interaction.
                </p>
              </li>
              <li>
                <span>02</span>
                <h3>Let Onyx send the request</h3>
                <p>
                  Automated SMS messages ask on your behalf, taking recurring
                  review outreach off your team’s daily to-do list.
                </p>
              </li>
              <li>
                <span>03</span>
                <h3>Give customers a starting point</h3>
                <p>
                  Helpful suggestions make it easier for customers to describe
                  their experience. Follow new reviews and respond thoughtfully
                  as your reputation grows.
                </p>
              </li>
            </ol>
            <div className={styles.setupAction}>
              <Link
                className={`${styles.button} ${styles.outlineButton}`}
                href={reviewCallHref}
              >
                Plan your launch with Onyx
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.faqSection}`}
          aria-labelledby="faq-heading"
        >
          <div className={`${styles.container} ${styles.faqLayout}`}>
            <div className={styles.editorialCopy}>
              <p className={styles.eyebrow}>A few things to know</p>
              <h2 id="faq-heading">
                Your questions,
                <br /> answered.
              </h2>
              <p>
                Need help choosing a plan or mapping your setup? We’re happy to
                walk through it with you.
              </p>
              <Link className={styles.textLink} href={reviewCallHref}>
                Talk to the Onyx team
                <Icon name="arrow" />
              </Link>
            </div>
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <details key={faq.question} className={styles.faqItem}>
                  <summary>
                    {faq.question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div>{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.closing}>
          <div className={styles.container}>
            <p className={styles.eyebrow}>
              Give your next customer a reason to choose you
            </p>
            <h2>
              Let your reviews
              <br /> help win your next customer.
            </h2>
            <p>
              Onyx handles the asking and helps customers share their
              experience. Build the trust that makes it easier for new customers
              to choose your business.
            </p>
            <div className={styles.closingActions}>
              <Link
                className={`${styles.button} ${styles.primaryButton}`}
                href={reviewCallHref}
              >
                Book a review growth call
                <Icon name="arrow" />
              </Link>
              <a
                className={`${styles.button} ${styles.lightButton}`}
                href="#plans"
              >
                Compare plans
              </a>
            </div>
          </div>
        </section>
      </BaseLayout>
    </>
  );
}
