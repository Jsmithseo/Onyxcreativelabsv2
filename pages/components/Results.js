import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';

export default function EarlyResultsSection() {
  const metrics = [
    {
      value: '90 Days',
      label: 'to test real market demand',
      color: '#18181b',
    },
    {
      value: 'Targeted Outreach',
      label: 'outreach, follow-up, and curated content',
      color: '#3f3f46',
    },
    {
      value: 'Market Signals',
      label: 'learn what prospective customers respond to',
      color: 'var(--onyx-accent)',
    },
    {
      value: 'Clear Next Steps',
      label: 'use learnings to guide informed decisions',
      color: '#3f3f46',
    },
  ];

  return (
    <Container className="text-center py-5">
      <h2 className="onyx-section-heading">
        Our 90-Day Pilot <span style={{ color: 'var(--onyx-accent)' }}>in Action</span>
      </h2>
      <Row className="mt-5 justify-content-center">
        {metrics.map((item, idx) => (
          <Col key={idx} xs="6" md="3" className="mb-4 d-flex flex-column align-items-center">
            <h3 className="onyx-metric-title" style={{ color: item.color }}>
              {item.value}
            </h3>
            <p className="onyx-metric-copy">{item.label}</p>
          </Col>
        ))}
      </Row>
      <Link href="/90-day-pilot">
      <Button color="primary" size="lg" style={{ marginTop: '2rem', fontWeight: '600' }}>
        Test Your Market
      </Button>
      </Link>
    </Container>
  );
}
