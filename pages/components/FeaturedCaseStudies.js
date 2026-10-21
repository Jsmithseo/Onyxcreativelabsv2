import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardText, CardTitle, Col, Container, Row } from 'reactstrap';

const featuredStudies = [
  {
    brand: 'Stretchy',
    highlight: 'Expanded from one golf club to new partner locations.',
    href: '/stretchy-case-study',
    color: '#3f3f46',
  },
  {
    brand: 'Parsity',
    highlight: 'Created outreach and conversion paths to grow enrollment.',
    href: '/parsity-case-study',
    color: '#2563eb',
  },
  {
    brand: 'SoHo Fit',
    highlight: 'Improved the conversion path and sign-up experience.',
    href: '/sohofit-case-study',
    color: '#71717a',
  },
];

export default function FeaturedCaseStudies() {
  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h2 className="onyx-section-heading">
          The Proof Is in the <span style={{ color: '#2563eb' }}>Results</span>
        </h2>
        <p className="onyx-section-copy">
          Here are results from some of our clients.
        </p>
      </div>
      <Row className="justify-content-center g-4">
        {featuredStudies.map((study) => (
          <Col key={study.brand} md="4">
            <Card className="h-100 shadow-sm">
              <div style={{ backgroundColor: study.color, height: '0.5rem' }} />
              <CardBody className="d-flex flex-column">
                <CardTitle tag="h3" className="h5 fw-bold">{study.brand}</CardTitle>
                <CardText className="text-muted">{study.highlight}</CardText>
                <Link href={study.href} className="mt-auto fw-semibold">
                  Read the case study →
                </Link>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Link href="/case-studies">
          <Button color="primary" outline>View All Case Studies</Button>
        </Link>
      </div>
    </Container>
  );
}
