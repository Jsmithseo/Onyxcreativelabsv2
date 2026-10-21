// pages/reviews.jsx

import React from "react";
import Head from "next/head";
import Link from "next/link";
import BaseLayout from "../components/layouts/BaseLayouts";
import { Container, Row, Col, Button } from "reactstrap";

export default function Reviews() {
  return (
    <>
      <Head>
        <title>Why ask for your own reviews? Let AI do it. Onyx Creative Labs</title>
      </Head>

      <BaseLayout>
        <section className="onyx-hero onyx-reviews-hero">
          <Container>
            <p className="onyx-lab-eyebrow">Onyx Reviews / AI-assisted reputation management</p>
            <h1 className="onyx-hero-title">More customer reviews. Less chasing.</h1>
            <p className="onyx-hero-copy">Onyx Reviews helps you send thoughtful text-message review requests, learn from real customer feedback, and build the trust that supports local visibility and repeat business.</p>
            <div className="onyx-hero-actions">
              <Link href="/contact"><Button color="primary" size="lg">Talk About Onyx Reviews</Button></Link>
            </div>
          </Container>
        </section>

        <Container className="onyx-reviews-section">
          <Row className="g-5 align-items-start">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The opportunity</p>
              <h2>Reviews turn good work into visible trust.</h2>
            </Col>
            <Col lg="8">
              <p className="onyx-reviews-lead">Your best customers are often willing to share their experience. They just need an easy moment to do it. Onyx Reviews creates that moment without putting your team in the uncomfortable position of repeatedly asking.</p>
              <p className="mb-0">The result is a more consistent review process that supports the way people evaluate local businesses online: through customer experiences, clear signals of trust, and a responsive reputation.</p>
              <div className="onyx-review-stats" aria-label="Consumer review statistics">
                <article>
                  <strong>96%</strong>
                  <span>of consumers are open to writing a business review.</span>
                </article>
                <article>
                  <strong>63%</strong>
                  <span>expect a review response within two to seven days.</span>
                </article>
              </div>
              <p className="onyx-review-stats-source">
                Source: <a href="https://www.brightlocal.com/research/local-consumer-review-survey-2025/" target="_blank" rel="noreferrer">BrightLocal Local Consumer Review Survey 2025</a>
              </p>
            </Col>
          </Row>
        </Container>

        <section className="onyx-muted-section">
          <Container className="onyx-reviews-section">
            <Row className="g-4 align-items-center mb-5">
              <Col lg="6">
                <div className="onyx-reviews-heading mb-0">
                  <p className="onyx-lab-eyebrow">How it works</p>
                  <h2>Turn completed business into a clear next step.</h2>
                </div>
              </Col>
              <Col lg="6">
                <div className="onyx-review-flow" aria-label="Onyx Reviews process: customer list, review request, feedback loop">
                  <div className="onyx-review-flow-step"><span>01</span><strong>Customer list</strong></div>
                  <div className="onyx-review-flow-line" aria-hidden="true" />
                  <div className="onyx-review-flow-step onyx-review-flow-step-active"><span>02</span><strong>Text request</strong></div>
                  <div className="onyx-review-flow-line" aria-hidden="true" />
                  <div className="onyx-review-flow-step"><span>03</span><strong>Feedback loop</strong></div>
                </div>
              </Col>
            </Row>
            <Row className="g-4">
              <Col md="4"><article className="onyx-review-card h-100"><p>01</p><h3>Load your customer list</h3><span>Upload the people you have already served. There is no awkward manual chase-down process for your team.</span></article></Col>
              <Col md="4"><article className="onyx-review-card h-100"><p>02</p><h3>Send a thoughtful request</h3><span>Onyx Reviews uses AI-assisted SMS outreach to create timely, personal review requests and make it simple for customers to respond.</span></article></Col>
              <Col md="4"><article className="onyx-review-card h-100"><p>03</p><h3>Learn and follow up</h3><span>See customer feedback in one place, respond to concerns promptly, and use the insight to keep improving the experience.</span></article></Col>
            </Row>
          </Container>
        </section>

        <Container className="onyx-reviews-section">
          <Row className="g-5">
            <Col lg="4"><p className="onyx-lab-eyebrow">Built for the full relationship</p><h2>More than a review link.</h2></Col>
            <Col lg="8">
              <Row className="g-4">
                <Col md="6"><article className="onyx-review-capability h-100"><h3>AI-assisted review requests</h3><p>Make review outreach easier to manage with text messages that feel timely and personal.</p></article></Col>
                <Col md="6"><article className="onyx-review-capability h-100"><h3>Reputation feedback loop</h3><p>Invite honest feedback, identify concerns early, and give your team an opportunity to respond and resolve issues directly.</p></article></Col>
                <Col md="6"><article className="onyx-review-capability h-100"><h3>Review performance dashboard</h3><p>Track requests, responses, and review activity so your team can see what is working.</p></article></Col>
                <Col md="6"><article className="onyx-review-capability h-100"><h3>Optional managed SMS campaigns</h3><p>Extend beyond reviews with seasonal offers, return-customer campaigns, and targeted text outreach managed with the Onyx team.</p></article></Col>
              </Row>
            </Col>
          </Row>
        </Container>

        <section className="onyx-reviews-sms">
          <Container>
            <Row className="g-5 align-items-center">
              <Col lg="7"><p className="onyx-lab-eyebrow">Optional managed service</p><h2>Keep the conversation going with managed SMS campaigns.</h2><p>Need more than reviews? The Onyx team can help you create and manage customer text campaigns for seasonal offers, return visits, and specific services. We handle the strategy and setup with consent and opt-out practices in mind, so you do not have to build the program alone.</p></Col>
              <Col lg="5" className="text-lg-end"><Link href="/contact"><Button color="primary" size="lg">Ask About Managed SMS</Button></Link></Col>
            </Row>
          </Container>
        </section>
      </BaseLayout>
    </>
  );
}
