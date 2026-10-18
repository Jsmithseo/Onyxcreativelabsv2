import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import BaseLayout from './layouts/BaseLayouts';
import Link from 'next/link';

const interventions = [
  ['Rapid Response and Timing', 'Warm leads were contacted within 30 minutes as they came in throughout the day, giving Parsity a chance to connect while interest was immediate. For West Coast B2C prospects, evening calls also created room for a more thoughtful conversation about a career change.'],
  ['Warm Lead Qualification', 'We worked warm leads across Parsity’s school, B2C, and B2B offerings, using direct conversations to understand interest and connect each prospect with the product or path that best fit their needs.'],
  ['Appointment Setting and Follow-Up', 'The operating model was simple and coordinated: Onyx nurtured the pipeline and set qualified appointments, Parsity mentors led the closer product conversations, and we followed up to help move opportunities toward a decision.'],
  ['Market Feedback', 'Every conversation created a signal. Reactions from prospective students helped the team understand how people were thinking about AI code schools, what questions they had, and where more clarity could improve the sales process.'],
];

export default function ParsityCaseStudy() {
  return (
    <BaseLayout>
      <section className="onyx-hero onyx-case-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Case Study / Enrollment</p>
          <h1 className="onyx-hero-title">Building Growth for Parsity.io</h1>
          <p className="onyx-hero-copy">How a warm-outbound and follow-up system helped turn student interest into more mentor conversations and closed enrollments.</p>
          <a href="https://parsity.io" target="_blank" rel="noopener noreferrer" className="onyx-case-study-site-link">Visit Parsity ↗</a>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The question</p>
            <h2>Can a consistent sales pipeline yield more sales?</h2>
          </Col>
          <Col lg="8">
            <p>Parsity had an engineering-led team and multiple offerings across school, B2C, and B2B audiences. The opportunity was to make sure interested people did not lose momentum between their first expression of interest and the detailed conversation that could help them decide whether Parsity was right for them.</p>
            <p className="mb-0">The work required a human sales-development layer: reach out at the right time, understand what each person was looking for, put qualified prospects in front of mentors, and stay engaged after the first conversation.</p>
          </Col>
        </Row>
      </Container>

      <section className="onyx-muted-section">
        <Container className="onyx-case-section">
          <Row className="g-5">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The approach</p>
              <h2>Build the bridge between initial interest and a confident decision.</h2>
            </Col>
            <Col lg="8">
              <p>Onyx Creative Labs supported Parsity as an extension of its sales-development process. We focused on rapid warm-lead response, appointment setting, nurture, and follow-up. This helped interested prospects reach the mentors who could speak directly to the program and guide a final decision.</p>
              <p className="mb-0">That work also created an active listening channel. Beyond moving deals forward, each conversation surfaced the language, questions, and hesitation shaping how people evaluate AI-focused technical education.</p>
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
            <h2>A more active pipeline and 10 to 15 additional deals per month.</h2>
          </Col>
          <Col lg="8">
            <p>Through warm calling, appointment setting, presentations, and steady follow-up, the partnership helps Parsity generate 10 to 15 additional deals each month. The team has a clearer way to connect interested students and buyers with the people who can close and support them.</p>
            <div className="onyx-case-learning">
              <h3>The key learning</h3>
              <p className="mb-0">For a technical education product, a sales pipeline is also a learning system. Conversations with interested people reveal how the market understands the offer and what the product, message, or sales process should answer next.</p>
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
