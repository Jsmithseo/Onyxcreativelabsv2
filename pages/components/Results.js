import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const discoveryTracking = new URLSearchParams({
  utm_source: 'onyx_website',
  utm_medium: 'website',
  utm_campaign: 'fractional_bdr',
  utm_content: 'homepage_service_overview',
});
const discoveryHref = `https://calendly.com/softwaresmitty/discovery?${discoveryTracking}`;

const responsibilities = [
  {
    title: 'Prospecting',
    description: 'Build a list of companies and decision-makers that fit your offer.',
  },
  {
    title: 'Outreach and follow-up',
    description: 'Make cold calls, send tailored emails, and follow up with prospects and inbound leads.',
  },
  {
    title: 'Qualified meetings',
    description: 'Confirm fit, book the meeting, and brief your team. We can also help with presentations and closing.',
  },
  {
    title: 'Weekly reporting',
    description: 'See outreach activity, buyer questions, and objections so you can refine who you target and what you say.',
  },
];

export default function FractionalBdrOverview() {
  return (
    <section id="fractional-bdr" className="onyx-muted-section" aria-labelledby="fractional-bdr-heading">
      <Container className="py-5">
        <h2 id="fractional-bdr-heading" className="onyx-section-heading text-center">What your fractional BDR handles</h2>
        <Row className="g-4 mt-3">
          {responsibilities.map(({ title, description }) => (
            <Col key={title} sm="6" lg="3">
              <div className="onyx-deliverable h-100">
                <h3>{title}</h3>
                <p className="text-body-secondary">{description}</p>
              </div>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <a href={discoveryHref} className="btn btn-lg">
            Book a 30-minute discovery call
          </a>
        </div>
      </Container>
    </section>
  );
}
