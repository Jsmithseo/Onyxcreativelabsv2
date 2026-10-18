import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import BaseLayout from './layouts/BaseLayouts';
import Link from 'next/link';

const interventions = [
  ['Client Follow-Up Engine', 'We created a consistent follow-up motion for people who had tried Stretchy: calls, warm emails, and text outreach designed to bring prospective clients back into the conversation.'],
  ['Partner Development', 'We opened a second golf-course location, developed a relationship with Greystar for high-end apartment communities, and secured a San Mateo School District contract with a model that could extend to future districts.'],
  ['Sales and Membership Path', 'The team clarified a simple progression: trials lead to introductory stretches, introductory stretches lead to memberships, and memberships can be supported with additional individual-minute packages.'],
  ['Operating Foundation', 'We built software and dashboards for client, contractor, and performance management, then paired them with a structured contractor onboarding and training process to protect service quality as the business grew.'],
];

export default function StretchyCaseStudy() {
  return (
    <BaseLayout>
      <section className="onyx-hero onyx-case-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Case Study / Market Expansion</p>
          <h1 className="onyx-hero-title">Building a Repeatable Growth Engine for Stretchy</h1>
          <p className="onyx-hero-copy">How Stretchy moved beyond organic demand by connecting client follow-up, partner development, and operational systems.</p>
          <a href="https://stretchy.us" target="_blank" rel="noopener noreferrer" className="onyx-case-study-site-link">Visit Stretchy ↗</a>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The question</p>
            <h2>How could a one-location business create growth it could repeat?</h2>
          </Col>
          <Col lg="8">
            <p>When Onyx began working with Stretchy, the business had one golf-course location and most customer growth was happening organically. The service had momentum, but the business needed a more deliberate way to bring people back after a trial, develop new partners, and support a larger client base without sacrificing the experience.</p>
            <p className="mb-0">The opportunity was not simply to find more leads. It was to build the commercial and operational foundation that could support recurring revenue, new locations, and a future franchise-ready model.</p>
          </Col>
        </Row>
      </Container>

      <section className="onyx-muted-section">
        <Container className="onyx-case-section">
          <Row className="g-5">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The approach</p>
              <h2>Connect demand generation to a system that can deliver.</h2>
            </Col>
            <Col lg="8">
              <p>Onyx Creative Labs developed Stretchy’s growth model across the whole customer journey. We combined direct client follow-up with warm email and text outreach, then expanded the business-development effort to create new partnership opportunities.</p>
              <p className="mb-0">At the same time, we put the internal systems in place to make the growth sustainable: data visibility, contractor management, onboarding, and hands-on training that kept quality control central as the team took on more business.</p>
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
            <h2>A stronger business, built to support the next location.</h2>
          </Col>
          <Col lg="8">
            <p>Stretchy expanded beyond its original golf-course location, developed new high-value partnership channels, and established a more intentional sales path for trials, memberships, and individual packages. The work increased monthly recurring revenue and helped improve the company’s long-term value.</p>
            <div className="onyx-case-learning">
              <h3>The key learning</h3>
              <p className="mb-0">Expansion works best when sales, service delivery, and quality control grow together. By building the outreach engine and the operating model at the same time, Stretchy gained a foundation designed for repeatability rather than one-off growth.</p>
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
