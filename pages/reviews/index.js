// pages/reviews.jsx

import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import BaseLayout from "../components/layouts/BaseLayouts";
import { Container, Row, Col, Button } from "reactstrap";

export default function Reviews() {
  return (
    <>
      <Head>
        <title>Why ask for your own reviews? Let AI do it. – Onyx Creative Labs</title>
      </Head>

      <BaseLayout>
        <Container className="py-5">
          {/* Hero */}
          <Row className="align-items-center mb-5">
            <Col md="6" className="text-center text-md-start">
              <h1 className="display-4 fw-bold">
                Why ask for your own reviews? Let AI do it.
              </h1>
              <p className="lead text-muted">
                Asking for your own reviews can be difficult—or even come across
                as annoying. Onyx Reviews automates the entire process so you
                can focus on running your business.
              </p>
              <Link href="/early-access" passHref>
                <Button color="primary" size="lg" className="mt-3">
                  Sign up for early access
                </Button>
              </Link>
            </Col>
            <Col md="6" className="text-center">
              <Image
                src="/images/reviews-hero.png"
                alt="Onyx Reviews App Preview"
                width={400}
                height={300}
                className="img-fluid rounded shadow-sm"
              />
            </Col>
          </Row>

          {/* Features Block 1 */}
          <Row className="align-items-center mb-5">
            <Col md="6">
              <h3 className="fw-bold">Automated Outreach</h3>
              <p className="text-muted mb-4">
                Our AI crafts personalized SMS and email messages on your
                behalf, removing the awkward “please leave us a review” ask.
              </p>

              <h3 className="fw-bold">Smart Scheduling</h3>
              <p className="text-muted">
                Specify your preferred windows, and the system will ping
                customers at optimal times to maximize response rates.
              </p>
            </Col>
            <Col md="6" className="text-center">
              <Image
                src="/images/reviews-outreach.png"
                alt="Automated outreach workflow"
                width={500}
                height={300}
                className="img-fluid rounded shadow-sm"
              />
            </Col>
          </Row>

          {/* Features Block 2 (staggered) */}
          <Row className="align-items-center mb-5">
            <Col
              md="6"
              className="order-2 order-md-1 text-center text-md-start"
            >
              <Image
                src="/images/reviews-analytics.png"
                alt="Real-time analytics dashboard"
                width={500}
                height={300}
                className="img-fluid rounded shadow-sm"
              />
            </Col>
            <Col md="6" className="order-1 order-md-2">
              <h3 className="fw-bold">Real-Time Analytics</h3>
              <p className="text-muted mb-4">
                Monitor open-rates, response rates, and review scores all from
                one intuitive dashboard.
              </p>

              <h3 className="fw-bold">Seamless Integrations</h3>
              <p className="text-muted">
                Connect with Google, Facebook, Yelp, and 100+ other platforms in
                under a minute.
              </p>
            </Col>
          </Row>

          {/* Final CTA */}
          <Row className="justify-content-center text-center">
            <Col lg="8">
              <h2 className="fw-bold mb-4">
                Ready to watch your reviews skyrocket?
              </h2>
              <Link href="/early-access" passHref>
                <Button color="primary" size="lg">
                  Sign up for early access
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
