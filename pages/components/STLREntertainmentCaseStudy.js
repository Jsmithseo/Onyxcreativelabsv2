import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import BaseLayout from './layouts/BaseLayouts';
import Link from 'next/link';

const interventions = [
  ['Website and Message Refresh', 'We updated the website and its messaging so venues and artists could more clearly understand the value of working with STLR Entertainment and the kind of live experience it could help create.'],
  ['Content and Artist Promotion', 'We built a content engine and supported artists with promotional work, testing how content and audience-building could create more visibility around performances.'],
  ['Channel Testing', 'Digital ads and other outreach tactics were part of the process. They provided useful signals, but they did not become the primary source of dependable booking conversations.'],
  ['Venue Outreach Pipeline', 'The strongest motion was direct outreach: calling local bars, clubs, and venues, asking about interest in hosting artists, following up by email, and keeping those conversations organized in a practical booking pipeline.'],
];

export default function STLREntertainmentCaseStudy() {
  return (
    <BaseLayout>
      <section className="onyx-hero onyx-case-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Case Study / Revenue Systems</p>
          <h1 className="onyx-hero-title">Driving Bookings for STLR Entertainment</h1>
          <p className="onyx-hero-copy">How a long-term experimentation process revealed the direct outreach system that created the most dependable venue conversations.</p>
          <a href="https://stlrentertainment.com" target="_blank" rel="noopener noreferrer" className="onyx-case-study-site-link">Visit STLR Entertainment ↗</a>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The question</p>
            <h2>What is the most reliable way to create more live-performance opportunities?</h2>
          </Col>
          <Col lg="8">
            <p>STLR Entertainment had an established history and a roster of artists to represent, but the work of consistently creating new venue opportunities required a more focused business-development system. The team needed more than visibility—it needed a repeatable way to start and advance booking conversations.</p>
            <p className="mb-0">Getting there took time. We explored content, website messaging, artist promotion, advertising, and other channels before the pattern became clear: the strongest path was speaking directly with the local venues that could host the artists.</p>
          </Col>
        </Row>
      </Container>

      <section className="onyx-muted-section">
        <Container className="onyx-case-section">
          <Row className="g-5">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The approach</p>
              <h2>Test broadly, then commit to the channel that opens doors.</h2>
            </Col>
            <Col lg="8">
              <p>Onyx Creative Labs began with the foundational work: sharpen the website story, build a consistent content presence, and test ways of promoting artists and their performances. Those efforts improved the overall platform, but the partnership kept looking for the work that could most directly create venue relationships.</p>
              <p className="mb-0">That led to a dedicated calling and follow-up pipeline. We contacted local bars, clubs, and venues, introduced the artists and service, learned what each venue needed, and followed up by email. We also created an internship path that gave college students business experience while expanding the team’s capacity for outreach.</p>
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
            <h2>A practical booking system built around real venue conversations.</h2>
          </Col>
          <Col lg="8">
            <p>STLR Entertainment left with a clearer message, a more consistent content foundation, and—most importantly—a direct venue-outreach pipeline. The team could systematically identify local opportunities, start real conversations, and follow up in a way that supported ongoing booking development.</p>
            <div className="onyx-case-learning">
              <h3>The key learning</h3>
              <p className="mb-0">The best channel is not always the most polished or automated one. For STLR Entertainment, direct human conversations with venues created the clearest path to understanding demand and developing new performance opportunities.</p>
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
