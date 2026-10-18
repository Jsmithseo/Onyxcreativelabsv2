import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import BaseLayout from './layouts/BaseLayouts';
import Link from 'next/link';

const interventions = [
  ['Narrative and Message Design', 'We worked closely with the Pathway Humanity team to clarify how the organization talks about its work, connecting its services to a clearer story of the value clients and community members can expect.'],
  ['Website Redesign', 'The website was rebuilt around that clearer narrative, creating a more thoughtful digital experience that helps visitors understand the organization, its purpose, and the services already available to them.'],
  ['Content Strategy', 'We developed a content strategy and calendar to give the team a sustainable way to keep its story active, useful, and connected to the needs of the audiences it serves.'],
  ['Partnership Development', 'We helped identify and develop relationships with other organizations so Pathway Humanity could connect clients to a broader set of services and deepen the support available through its network.'],
];

export default function PathwayHumanityCaseStudy() {
  return (
    <BaseLayout>
      <section className="onyx-hero onyx-case-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Case Study / Audience Engagement</p>
          <h1 className="onyx-hero-title">Holistic Website Redesign & Content Engine for Pathway Humanity</h1>
          <p className="onyx-hero-copy">How we modernized a social purpose organization’s web presence and built a content program to support meaningful connection.</p>
          <a href="https://pathwayhumanity.com" target="_blank" rel="noopener noreferrer" className="onyx-case-study-site-link">Visit Pathway Humanity ↗</a>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The question</p>
            <h2>How do you make an important offering easier for people to understand?</h2>
          </Col>
          <Col lg="8">
            <p>Pathway Humanity was already doing meaningful work, but its website and public story did not fully convey the value of the organization or the range of support it could help clients access. The task was not to invent a new offer. It was to define the value already there and make it easier for people to see.</p>
            <p className="mb-0">That meant connecting the organization’s story, message, content, and partnership opportunities into one clearer experience—one that could build trust with visitors and better support the people looking for help.</p>
          </Col>
        </Row>
      </Container>

      <section className="onyx-muted-section">
        <Container className="onyx-case-section">
          <Row className="g-5">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The approach</p>
              <h2>Clarify the value, then give the story room to grow.</h2>
            </Col>
            <Col lg="8">
              <p>Onyx Creative Labs approached the work as a value-proposition exercise first. We collaborated with the Pathway Humanity team to identify what should be most visible to its audiences, then translated that understanding into website messaging and a more intentional digital presence.</p>
              <p className="mb-0">The resulting content strategy and partnership work made the website more than a static description. It became a foundation for communicating consistently, developing connections, and guiding people toward the support that fits their needs.</p>
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
            <h2>A clearer expression of the value Pathway Humanity already delivers.</h2>
          </Col>
          <Col lg="8">
            <p>Pathway Humanity left with a redesigned website, clearer messaging, and a content foundation built around its real strengths. The work helps the organization explain its role more confidently, keep audiences engaged over time, and strengthen relationships that expand the support available to its clients.</p>
            <div className="onyx-case-learning">
              <h3>The key learning</h3>
              <p className="mb-0">For mission-driven organizations, growth is not always about reaching more people first. It can begin by making the existing value unmistakable—so the right people can understand it, trust it, and connect with it.</p>
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
