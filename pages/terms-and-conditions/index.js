import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container } from "reactstrap";
import BaseLayout from "../components/layouts/BaseLayouts";

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Onyx Reviews Terms & Conditions</title>
        <meta name="description" content="Terms and Conditions for Onyx Reviews subscriptions and services." />
      </Head>
      <BaseLayout>
        <section style={{ background: "#101828", color: "#fff", padding: "4.5rem 0" }}>
          <Container>
            <p className="text-uppercase fw-bold mb-2" style={{ color: "var(--onyx-accent)", fontSize: ".75rem", letterSpacing: ".08em" }}>Onyx Reviews</p>
            <h1 className="mb-0">Terms &amp; Conditions</h1>
          </Container>
        </section>
        <Container className="py-5" style={{ maxWidth: "880px" }}>
          <p className="lead">These Terms &amp; Conditions describe the general rules for using Onyx Reviews. Plan-specific pricing, trial timing, billing interval, and any custom scope will be shown clearly before enrollment.</p>

          <h2 className="h4 mt-5">1. Subscription service</h2>
          <p>Onyx Reviews provides customer-feedback, Google review-growth, reputation-monitoring, campaign-planning, and related support services according to the plan selected. Some capabilities depend on the connected business profile, customer permissions, and third-party platforms.</p>

          <h2 className="h4 mt-4">2. Trials, billing, and renewal</h2>
          <p>If a plan includes a free trial, the trial period, first paid billing date, monthly price, and recurring billing interval will be shown before you enroll. Paid plans renew on the billing interval shown at enrollment unless cancelled before the next renewal. Custom or multi-location arrangements may have separate written terms.</p>

          <h2 className="h4 mt-4">3. Customer data and permissions</h2>
          <p>You are responsible for having the authority and required consent to provide customer contact information and request feedback. You agree to use Onyx Reviews in a lawful, respectful manner and to honor customer opt-out requests.</p>

          <h2 className="h4 mt-4">4. Results and third-party platforms</h2>
          <p>Onyx Reviews helps create a consistent process; it does not guarantee a number of reviews, a rating, search placement, revenue, or any particular business result. Google and other third-party platforms control their own policies, listings, and availability.</p>

          <h2 className="h4 mt-4">5. Support and custom work</h2>
          <p>Support level, campaign planning, review stands, and custom services vary by plan. Any work outside the published plan will be scoped and agreed separately before it begins.</p>

          <h2 className="h4 mt-4">6. Cancellation</h2>
          <p>Before direct online enrollment is activated, Onyx Reviews will provide a clear online cancellation route in the enrollment confirmation. Cancellation stops future recurring charges but does not automatically create a refund for a completed billing period. See the <Link href="/refund-policy">Refund Policy</Link> for details.</p>

          <h2 className="h4 mt-4">7. Privacy</h2>
          <p>Our <Link href="/privacy-policy">Privacy Policy</Link> explains how Onyx Reviews collects and uses contact, account, and service information.</p>

          <h2 className="h4 mt-4">8. Questions</h2>
          <p>For questions about a plan, billing, or these terms, please use the <Link href="/contact?product=reviews">Onyx Reviews contact form</Link> before enrolling.</p>
        </Container>
      </BaseLayout>
    </>
  );
}
