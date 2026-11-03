import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import BaseLayout from "../components/layouts/BaseLayouts";
import { Container, Row, Col, Button } from "reactstrap";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    eyebrow: "One location",
    description: "A practical Google review workflow for a business that is ready to build consistency.",
    features: [
      "Automated SMS review requests",
      "Google-focused reputation monitoring",
      "Google Business Profile connection and review moments",
      "Review requests, feedback, and activity in one dashboard",
      "Customer-list workflow and basic reporting",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 299,
    eyebrow: "One location · guided",
    description: "For teams that want a more hands-on launch and support for ongoing outreach.",
    featured: true,
    features: [
      "Everything in Starter",
      "Custom email and SMS campaign planning",
      "Guided launch and hands-on Onyx support",
      "QR or NFC review-stand strategy for your location",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 499,
    eyebrow: "One location · white-glove",
    description: "A white-glove reputation and campaign partnership for businesses ready to make reviews part of growth.",
    features: [
      "Everything in Growth",
      "Individual marketing-campaign planning",
      "One-on-one coaching and performance reviews",
      "A QR review stand for each location",
      "Group visibility for multi-location review activity",
      "Custom campaign strategy and lead-generation planning when appropriate",
    ],
  },
];

const trialOptions = [
  {
    id: "7",
    label: "7-day free trial",
    summary: "Start free for 7 days. Monthly billing begins after the trial.",
  },
  {
    id: "now",
    label: "Start today",
    summary: "No trial. Your monthly subscription starts today.",
  },
];

const blue = "var(--onyx-accent)";
const ink = "#101828";
const reviewCallHref = "/contact?product=reviews";

function inquiryHref(plan, trial, locations) {
  const params = new URLSearchParams({
    product: "reviews",
    plan,
    trial,
    locations: String(locations),
  });
  return `/contact?${params.toString()}`;
}

function PriceCard({ plan, trialId, termsAccepted }) {
  const trial = trialOptions.find((option) => option.id === trialId);
  const href = inquiryHref(plan.id, trialId, 1);

  return (
    <article
      className="h-100 p-4 rounded-4 border"
      style={{
        background: plan.featured ? ink : "#fff",
        color: plan.featured ? "#fff" : ink,
        borderColor: plan.featured ? ink : "#d0d5dd",
        boxShadow: plan.featured ? "0 20px 48px rgba(16, 24, 40, .18)" : "0 12px 32px rgba(16, 24, 40, .06)",
      }}
    >
      {plan.featured && (
        <p className="mb-3 text-uppercase fw-bold" style={{ color: "var(--onyx-accent)", fontSize: ".75rem", letterSpacing: ".08em" }}>
          Most hands-on
        </p>
      )}
      <p className="text-uppercase fw-bold mb-2" style={{ color: plan.featured ? "#cbd5e1" : "#667085", fontSize: ".75rem", letterSpacing: ".08em" }}>
        {plan.eyebrow}
      </p>
      <h3 className="mb-1">{plan.name}</h3>
      <p className="mb-3" style={{ minHeight: "3rem", color: plan.featured ? "#e2e8f0" : "#475467" }}>{plan.description}</p>
      <div className="d-flex align-items-end gap-1 mb-2">
        <strong style={{ fontSize: "2.65rem", lineHeight: 1 }}>${plan.price}</strong>
        <span style={{ color: plan.featured ? "#cbd5e1" : "#667085" }}>/ location / month</span>
      </div>
      <p className="fw-semibold mb-4" style={{ color: plan.featured ? "var(--onyx-accent)" : blue }}>{trial.label}</p>
      <ul className="ps-3 mb-4" style={{ minHeight: "10.5rem", color: plan.featured ? "#f8fafc" : "#344054" }}>
        {plan.features.map((feature) => <li key={feature} className="mb-2">{feature}</li>)}
      </ul>
      {termsAccepted ? (
        <Link href={href}>
          <Button
            size="lg"
            block
            style={{
              background: plan.featured ? blue : ink,
              borderColor: plan.featured ? blue : ink,
              color: "#fff",
            }}
          >
            Continue with {plan.name}
          </Button>
        </Link>
      ) : (
        <Button size="lg" block disabled>
          Review terms to continue
        </Button>
      )}
    </article>
  );
}

export default function Reviews() {
  const [trialId, setTrialId] = useState("7");
  const [calculatorPlanId, setCalculatorPlanId] = useState("starter");
  const [locationCount, setLocationCount] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const trial = trialOptions.find((option) => option.id === trialId);
  const calculatorPlan = plans.find((plan) => plan.id === calculatorPlanId);
  const monthlyTotal = useMemo(
    () => calculatorPlan.price * locationCount,
    [calculatorPlan, locationCount],
  );

  return (
    <>
      <Head>
        <title>Onyx Reviews | Review growth for service businesses</title>
        <meta
          name="description"
          content="Onyx Reviews gives service businesses a practical, Google-focused review-growth workflow, from timely requests and customer feedback to multi-location visibility."
        />
      </Head>

      <BaseLayout>
        <section className="onyx-hero onyx-reviews-hero">
          <Container>
            <p className="onyx-lab-eyebrow">Onyx Reviews / Google reputation growth</p>
            <h1 className="onyx-hero-title">Turn completed work into public proof.</h1>
            <p className="onyx-hero-copy">
              Build a repeatable, Google-focused review workflow with timely customer
              requests, a clear feedback loop, and support that can grow with your locations.
            </p>
            <div className="onyx-hero-actions" style={{ flexWrap: "wrap", gap: "1rem" }}>
              <Link href="#plans">
                <Button color="primary" size="lg">See 7-Day Trial Plans</Button>
              </Link>
              <Link href={reviewCallHref}>
                <Button color="outline-dark" size="lg">Book a Review Growth Call</Button>
              </Link>
            </div>
            <p className="mt-3 mb-0">
              Start with one location today. Scale to five locations online, then talk with
              Onyx for a custom rollout.
            </p>
          </Container>
        </section>

        <Container className="onyx-reviews-section">
          <Row className="g-5 align-items-start">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The opportunity</p>
              <h2>Good work deserves to be easy to find.</h2>
            </Col>
            <Col lg="8">
              <p className="onyx-reviews-lead">
                Your best customers are often willing to share their experience. They just
                need an easy moment to do it. Onyx Reviews creates that moment without
                putting your team in the uncomfortable position of repeatedly asking.
              </p>
              <p className="mb-0">
                The result is a more consistent review process that supports how people
                evaluate local businesses online: through customer experiences, clear signals
                of trust, and a responsive Google reputation.
              </p>
              <div className="onyx-review-stats" aria-label="Consumer review statistics">
                <article><strong>96%</strong><span>of consumers are open to writing a business review.</span></article>
                <article><strong>63%</strong><span>expect a review response within two to seven days.</span></article>
              </div>
              <p className="onyx-review-stats-source">
                Source: <a href="https://www.brightlocal.com/research/local-consumer-review-survey-2025/" target="_blank" rel="noreferrer">BrightLocal Local Consumer Review Survey 2025</a>
              </p>
            </Col>
          </Row>
        </Container>

        <section id="plans" style={{ background: "#f8fafc", padding: "5rem 0" }}>
          <Container>
            <Row className="justify-content-center text-center mb-4">
              <Col lg="8">
                <p className="onyx-lab-eyebrow">Simple, scalable pricing</p>
                <h2>Start with the plan that matches your team.</h2>
                <p className="mb-0 text-muted">
                  The 7-day trial is selected by default. Choose Start today if you prefer no trial;
                  the plan and monthly price stay the same.
                </p>
              </Col>
            </Row>

            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5" role="group" aria-label="Enrollment timing">
              {trialOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTrialId(option.id)}
                  className="btn rounded-pill px-4 py-2"
                  style={{
                    background: trialId === option.id ? ink : "#fff",
                    border: `1px solid ${trialId === option.id ? ink : "#d0d5dd"}`,
                    color: trialId === option.id ? "#fff" : ink,
                    fontWeight: 700,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Row className="g-4">
              {plans.map((plan) => <Col lg="4" key={plan.id}><PriceCard plan={plan} trialId={trialId} termsAccepted={termsAccepted} /></Col>)}
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <label className="d-flex align-items-start gap-2 text-muted" style={{ maxWidth: "46rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                />
                <span>
                  I have reviewed the <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>, <Link href="/refund-policy">Refund Policy</Link>, and <Link href="/privacy-policy">Privacy Policy</Link> for my selected Onyx Reviews plan.
                </span>
              </label>
            </div>
            <p className="text-center mt-4 mb-0 text-muted">
              {trial.summary} This inquiry does not enroll you or collect payment. Before direct checkout is activated, Onyx Reviews will show the selected plan, monthly price, trial timing, cancellation route, and a separate required recurring-charge authorization.
            </p>
          </Container>
        </section>

        <Container className="onyx-reviews-section">
          <Row className="g-5 align-items-center">
            <Col lg="6">
              <p className="onyx-lab-eyebrow">How Onyx Reviews works</p>
              <h2>One workflow for requests, reputation, and repeatable growth.</h2>
              <p>
                Onyx Reviews helps you manage customer feedback and Google review activity in
                one place. Onyx helps you choose the right moment to ask, shape the outreach,
                and turn the system into a customer-growth habit.
              </p>
              <div className="d-grid gap-3">
                <div className="p-3 rounded-3 border"><strong>Guided requests and replies</strong><br /><span className="text-muted">Create thoughtful prompts for customer feedback and responses without starting from a blank screen.</span></div>
                <div className="p-3 rounded-3 border"><strong>QR and NFC review moments</strong><br /><span className="text-muted">Give happy customers an easy in-store path to leave a Google review after the interaction.</span></div>
                <div className="p-3 rounded-3 border"><strong>Google reputation visibility</strong><br /><span className="text-muted">Track review activity and feedback trends so your team knows what is working and what needs attention.</span></div>
              </div>
            </Col>
            <Col lg="6">
              <div className="rounded-4 p-4 p-lg-5" style={{ background: ink, color: "#fff" }}>
                <p className="text-uppercase fw-bold mb-2" style={{ color: "var(--onyx-accent)", fontSize: ".75rem", letterSpacing: ".08em" }}>Multi-location plan</p>
                <h3 className="mb-2">See your price and track review growth through five locations.</h3>
                <p className="mb-4" style={{ color: "#cbd5e1" }}>
                  Every location receives the plan you select. Choose a plan and location count;
                  the price below is transparent, per location, per month. We will configure the
                  right reporting and access for your location setup.
                </p>

                <label className="fw-semibold mb-2" htmlFor="calculatorPlan">Plan</label>
                <select
                  id="calculatorPlan"
                  className="form-select mb-4"
                  value={calculatorPlanId}
                  onChange={(event) => setCalculatorPlanId(event.target.value)}
                >
                  {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} — ${plan.price}/location/month</option>)}
                </select>

                <span className="fw-semibold d-block mb-2">Locations</span>
                <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Location count">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setLocationCount(count)}
                      className="btn rounded-circle"
                      style={{
                        width: "2.75rem",
                        height: "2.75rem",
                        padding: 0,
                        background: locationCount === count ? blue : "transparent",
                        border: `1px solid ${locationCount === count ? blue : "#98a2b3"}`,
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      {count}
                    </button>
                  ))}
                </div>

                <div className="rounded-3 p-4 mb-4" style={{ background: "#1d2939" }}>
                  <span className="d-block" style={{ color: "#cbd5e1" }}>{calculatorPlan.name} · {locationCount} {locationCount === 1 ? "location" : "locations"}</span>
                  <strong style={{ fontSize: "2.5rem" }}>${monthlyTotal}/mo</strong>
                  <span className="d-block mt-1" style={{ color: "#cbd5e1" }}>
                    {trialId === "now" ? "Billed today" : `${trial.label}, then billed monthly`}
                  </span>
                </div>

                {termsAccepted ? (
                  <Link href={inquiryHref(calculatorPlan.id, trialId, locationCount)}>
                    <Button size="lg" block style={{ background: blue, borderColor: blue }}>Build My Location Plan</Button>
                  </Link>
                ) : (
                  <Button size="lg" block disabled>Review terms to continue</Button>
                )}
                <Link href={reviewCallHref}>
                  <Button size="lg" block color="link" className="mt-3 text-white">More than five locations? Talk to Onyx</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>

        <section id="how-it-works" className="onyx-muted-section">
          <Container className="onyx-reviews-section">
            <Row className="g-4 align-items-center mb-5">
              <Col lg="6">
                <div className="onyx-reviews-heading mb-0"><p className="onyx-lab-eyebrow">Your launch path</p><h2>Turn completed business into a clear next step.</h2></div>
              </Col>
              <Col lg="6">
                <div className="onyx-review-flow" aria-label="Onyx Reviews process: customer list, review request, feedback loop">
                  <div className="onyx-review-flow-step"><span>01</span><strong>Customer list</strong></div><div className="onyx-review-flow-line" aria-hidden="true" />
                  <div className="onyx-review-flow-step onyx-review-flow-step-active"><span>02</span><strong>Review request</strong></div><div className="onyx-review-flow-line" aria-hidden="true" />
                  <div className="onyx-review-flow-step"><span>03</span><strong>Feedback loop</strong></div>
                </div>
              </Col>
            </Row>
            <Row className="g-4">
              <Col md="4"><article className="onyx-review-card h-100"><p>01</p><h3>Start with customers you have served</h3><span>Build a clean customer list and decide where review requests belong in your completed-service workflow.</span></article></Col>
              <Col md="4"><article className="onyx-review-card h-100"><p>02</p><h3>Send a timely request</h3><span>Use clear, timely messaging and a simple QR or NFC moment to make feedback easy while the experience is fresh.</span></article></Col>
              <Col md="4"><article className="onyx-review-card h-100"><p>03</p><h3>Learn, respond, improve</h3><span>Review feedback and Google reputation activity with your team, then improve the customer experience over time.</span></article></Col>
            </Row>
          </Container>
        </section>

        <section className="onyx-reviews-sms">
          <Container>
            <Row className="g-5 align-items-center">
              <Col lg="7">
                <p className="onyx-lab-eyebrow">Start with a practical plan</p>
                <h2>Build a review process your team can actually keep up.</h2>
                <p>
                  We will look at your customer journey, the right moment to ask, and the
                  launch steps needed for a clear feedback workflow. If managed campaigns make
                  sense, we can also map return visits, seasonal offers, and targeted outreach.
                </p>
              </Col>
              <Col lg="5" className="text-lg-end">
                <Link href={reviewCallHref}><Button color="primary" size="lg">Book a Review Growth Call</Button></Link>
              </Col>
            </Row>
          </Container>
        </section>
      </BaseLayout>
    </>
  );
}
