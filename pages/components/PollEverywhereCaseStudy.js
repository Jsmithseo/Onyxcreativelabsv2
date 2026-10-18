import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import BaseLayout from './layouts/BaseLayouts';
import Link from 'next/link';

const interventions = [
  ['Marketing-Engineering Bridge', 'We brought together marketing judgment and engineering fluency, working directly in the existing codebase while keeping every technical contribution connected to campaign, messaging, and conversion needs.'],
  ['Landing Page Development', 'We developed and updated marketing pages, landing pages, and supporting scripts so the marketing site could respond more quickly to new priorities.'],
  ['Brand-Aligned Component Library', 'We created a component library that met Poll Everywhere’s brand standards, giving the team reusable, predefined building blocks for common marketing-page patterns.'],
  ['Repeatable Publishing System', 'Those components made it possible to assemble new pages with more speed and consistency without treating every launch as a one-off engineering project.'],
];

export default function PollEverywhereCaseStudy() {
  return (
    <BaseLayout>
      <section className="onyx-hero onyx-case-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Case Study / Product Delivery</p>
          <h1 className="onyx-hero-title">Backlog Relief for Poll Everywhere</h1>
          <p className="onyx-hero-copy">How marketing-engineering support turned a constrained website workflow into a faster, more consistent system for building conversion-focused pages.</p>
          <a href="https://www.polleverywhere.com" target="_blank" rel="noopener noreferrer" className="onyx-case-study-site-link">Visit Poll Everywhere ↗</a>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The question</p>
            <h2>How can a marketing site move faster when engineering capacity is limited?</h2>
          </Col>
          <Col lg="8">
            <p>Poll Everywhere needed to update and extend its marketing site, but the work was competing for limited engineering resources. That made it harder to translate new marketing ideas, messaging, and campaign requirements into pages that could be launched quickly and correctly.</p>
            <p className="mb-0">The opportunity called for someone who could work comfortably in both worlds: understand the technical stack well enough to contribute directly, while making choices that served the marketing experience, brand system, and conversion path.</p>
          </Col>
        </Row>
      </Container>

      <section className="onyx-muted-section">
        <Container className="onyx-case-section">
          <Row className="g-5">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The approach</p>
              <h2>Build a system that lets marketing create without starting from zero.</h2>
            </Col>
            <Col lg="8">
              <p>Onyx Creative Labs contributed as both an engineer and a marketer, working in the codebase to develop pages and scripts while keeping the marketing team’s message, brand, and conversion goals in view.</p>
              <p className="mb-0">The centerpiece of the work was a reusable component library. By defining on-brand components that function like flexible building blocks, the team gained a more dependable way to compose new landing pages and marketing experiences without reinventing the interface each time.</p>
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
            <h2>A marketing website built for faster, more consistent iteration.</h2>
          </Col>
          <Col lg="8">
            <p>Poll Everywhere gained direct technical support for its marketing site and a component foundation that made new pages easier to produce. The system helped align speed with quality, allowing marketing needs, brand standards, and conversion requirements to be addressed together.</p>
            <div className="onyx-case-learning">
              <h3>The key learning</h3>
              <p className="mb-0">When marketing and engineering share a practical system, the website becomes easier to improve. Reusable components do more than save build time. They give a team a reliable way to turn strategy into a consistent digital experience.</p>
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
