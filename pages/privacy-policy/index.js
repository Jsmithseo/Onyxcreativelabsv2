import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container } from "reactstrap";
import BaseLayout from "../components/layouts/BaseLayouts";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Onyx Reviews Privacy Policy</title>
        <meta name="description" content="Privacy Policy for Onyx Reviews." />
      </Head>
      <BaseLayout>
        <section style={{ background: "#101828", color: "#fff", padding: "4.5rem 0" }}>
          <Container>
            <p className="text-uppercase fw-bold mb-2" style={{ color: "#9ec5ff", fontSize: ".75rem", letterSpacing: ".08em" }}>Onyx Reviews</p>
            <h1 className="mb-0">Privacy Policy</h1>
          </Container>
        </section>
        <Container className="py-5" style={{ maxWidth: "880px" }}>
          <p className="lead">This policy explains how Onyx Creative Labs uses information collected through Onyx Reviews and related inquiries.</p>

          <h2 className="h4 mt-5">Information we collect</h2>
          <p>We may collect business and contact information you provide, such as your name, company, email address, phone number, location details, plan selection, and messages. We may also receive service information needed to provide account setup, support, customer-feedback workflows, and billing.</p>

          <h2 className="h4 mt-4">How we use information</h2>
          <p>We use information to respond to inquiries, set up and support services, process authorized transactions, communicate about an account, improve the service, and meet legal or operational obligations.</p>

          <h2 className="h4 mt-4">Service providers</h2>
          <p>We may use service providers to host, support, process payments, deliver communications, and operate the services. We share information with them only as needed to provide those services or meet legal obligations.</p>

          <h2 className="h4 mt-4">Business customer responsibilities</h2>
          <p>If you provide customer contact information for review requests or feedback outreach, you are responsible for having the required authority and consent, honoring opt-out requests, and using the service lawfully.</p>

          <h2 className="h4 mt-4">Your choices and questions</h2>
          <p>You may contact Onyx Reviews through the <Link href="/contact?product=reviews">contact form</Link> to ask about your information, your account, or a privacy request. You can also review the <Link href="/terms-and-conditions">Terms &amp; Conditions</Link> and <Link href="/refund-policy">Refund Policy</Link>.</p>
        </Container>
      </BaseLayout>
    </>
  );
}
