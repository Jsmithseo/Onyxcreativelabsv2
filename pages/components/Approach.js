import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';

export default function ExperimentationApproachSection() {
  return (
    <Container className="py-5">
      <Row className="align-items-center justify-content-center">
        <Col md="6" className="text-center text-md-start mb-4 mb-md-0">
          <h2 className="onyx-section-heading">
            More Reviews, <span style={{ color: '#2563eb' }}>Less Chasing</span>
          </h2>
          <p className="mt-3 text-muted" style={{ fontSize: '1.1rem', maxWidth: '34rem' }}>
            Onyx Reviews uses AI to automate thoughtful review requests, so you can keep your focus on your customers and your business.
          </p>
          <Link href="/reviews">
            <Button color="primary" size="lg" style={{ marginTop: '1rem', fontWeight: '600' }}>
              Explore Onyx Reviews
            </Button>
          </Link>
        </Col>
        <Col md="6" className="text-center">
          <div
            className="rounded shadow-sm text-start p-4 mx-auto"
            style={{ backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7', maxWidth: '400px' }}
          >
            <p className="text-uppercase mb-2" style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.08em' }}>
              Onyx Reviews
            </p>
            <h3 className="h4 fw-bold">A better way to ask</h3>
            <p className="text-muted mb-0">
              Automated review requests, thoughtful follow-up, and clear response insights in one place.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
