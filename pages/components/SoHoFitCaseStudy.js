import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import BaseLayout from './layouts/BaseLayouts';
import Link from 'next/link';

const interventions = [
  ['Audience Segmentation', 'We looked more closely at the people considering SoHo Fit, including the needs and expectations of prospects evaluating a higher-end training investment.'],
  ['Offer and Message Clarity', 'We refined the language around the offer so visitors could more quickly understand the value of the training experience and why it was worth choosing.'],
  ['Conversion Experiments', 'We tested key pages, calls to action, and conversion paths to learn which combinations made it easier for the right prospects to take the next step.'],
  ['Ongoing Measurement', 'Each change was evaluated against engagement and conversion behavior, creating a feedback loop for what to keep, improve, or test next.'],
];

export default function SoHoFitCaseStudy() {
  return (
    <BaseLayout>
      <section className="onyx-hero onyx-case-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Case Study / Conversion Research</p>
          <h1 className="onyx-hero-title">Improving Conversion Efficiency for a Premium Fitness Brand</h1>
          <p className="onyx-hero-copy">How SoHo Fit Tampa shifted the focus from spending more to making its existing demand work harder.</p>
          <a href="https://sohofittampa.com/" target="_blank" rel="noopener noreferrer" className="onyx-case-study-site-link">Visit SoHo Fit Tampa ↗</a>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The question</p>
            <h2>How could SoHo Fit grow without simply buying more demand?</h2>
          </Col>
          <Col lg="8">
            <p>SoHo Fit Tampa already had two locations, a healthy business, and ad campaigns that were producing conversions. The problem was efficiency: growth depended on putting more money into advertising. If they wanted more revenue, the default answer was to spend more.</p>
            <p className="mb-0">For a premium fitness brand with higher-priced training packages, that was an opportunity to look beyond ad volume. The better question was whether the existing offer, message, and conversion experience were helping the right people understand the value well enough to act.</p>
          </Col>
        </Row>
      </Container>

      <section className="onyx-muted-section">
        <Container className="onyx-case-section">
          <Row className="g-5">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The approach</p>
              <h2>Improve the system before increasing the spend.</h2>
            </Col>
            <Col lg="8">
              <p>Onyx Creative Labs built a conversion-rate optimization program around learning what made the offer more compelling to the people most likely to become clients. Instead of treating every visitor the same, we dug into audience segments and the considerations behind a higher-end training decision.</p>
              <p className="mb-0">The work combined clearer positioning, more intentional page language, and structured testing. Each iteration was designed to reduce friction, sharpen the value proposition, and create a more confident path from interest to inquiry.</p>
            </Col>
          </Row>
          <Row className="g-4 mt-2">
            {interventions.map(([title, copy], index) => (
              <Col key={title} md="6">
                <article className="onyx-case-method h-100">
                  <p>Method {String(index + 1).padStart(2, '0')}</p>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The result</p>
            <h2>More value from the attention they had already earned.</h2>
          </Col>
          <Col lg="8">
            <p>The program improved the conversion experience and gave SoHo Fit a clearer understanding of how to speak to its best-fit prospects. Better page language, more relevant offers, and ongoing experiments helped the team improve conversion performance without relying only on additional ad spend.</p>
            <div className="onyx-case-learning">
              <h3>The key learning</h3>
              <p className="mb-0">For premium services, growth does not always start with reaching more people. It can start with helping the right people see the value, understand the offer, and feel ready to take the next step.</p>
            </div>
          </Col>
        </Row>
        <div className="text-center mt-5">
          <Link href="/contact"><Button color="primary" size="lg">Start a Conversation</Button></Link>
        </div>
      </Container>
    </BaseLayout>
  );
}
