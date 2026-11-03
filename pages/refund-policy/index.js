import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container } from "reactstrap";
import BaseLayout from "../components/layouts/BaseLayouts";

export default function RefundPolicy() {
  return (
    <>
      <Head>
        <title>Onyx Reviews Refund Policy</title>
        <meta name="description" content="Refund Policy for Onyx Reviews subscriptions and services." />
      </Head>
      <BaseLayout>
        <section style={{ background: "#101828", color: "#fff", padding: "4.5rem 0" }}>
          <Container>
            <p className="text-uppercase fw-bold mb-2" style={{ color: "#9ec5ff", fontSize: ".75rem", letterSpacing: ".08em" }}>Onyx Reviews</p>
            <h1 className="mb-0">Refund Policy</h1>
          </Container>
        </section>
        <Container className="py-5" style={{ maxWidth: "880px" }}>
          <p className="lead">Onyx Reviews is month-to-month. You can cancel at any time, without a long-term commitment. This policy explains how cancellations and refunds are handled unless a different written agreement applies to a custom engagement.</p>

          <h2 className="h4 mt-5">Free trials</h2>
          <p>If you enroll in a free-trial plan and cancel before the trial ends, no subscription charge is due for that trial. The specific trial length and first billing date appear at enrollment.</p>

          <h2 className="h4 mt-4">Monthly subscriptions and cancellations</h2>
          <p>You may cancel at any time. We will stop future recurring charges and refund the unused portion of the current monthly subscription on a pro-rated basis from the date your cancellation request is received.</p>

          <h2 className="h4 mt-4">How pro-rated refunds work</h2>
          <p>The refund is calculated from the date cancellation takes effect because message-delivery and related service costs are incurred as the service is used and cannot always be reversed. If a billing situation needs special attention, Onyx Reviews will take a flexible, good-faith approach to resolving it.</p>

          <h2 className="h4 mt-4">Custom and managed services</h2>
          <p>Custom campaign work, location rollouts, review stands, coaching, and other managed services may require a separate written scope. Any refund terms for those services will be stated in that agreement.</p>

          <h2 className="h4 mt-4">Billing questions</h2>
          <p>If you believe you were charged in error or have a billing question, contact Onyx Reviews promptly through the <Link href="/contact?product=reviews">contact form</Link>. We will review the account and applicable plan terms before responding.</p>

          <h2 className="h4 mt-4">Your plan terms</h2>
          <p>Before starting a plan, please review the <Link href="/terms-and-conditions">Terms &amp; Conditions</Link> and <Link href="/privacy-policy">Privacy Policy</Link> alongside the plan price, trial timing, and billing interval shown during enrollment.</p>
        </Container>
      </BaseLayout>
    </>
  );
}
