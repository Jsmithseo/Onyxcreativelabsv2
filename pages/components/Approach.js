import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';

export default function ExperimentationApproachSection() {
  return (
    <Container className="py-5">
      <Row className="align-items-center justify-content-center">
        <Col md="6" className="text-center text-md-start mb-4 mb-md-0">
          <p className="onyx-products-eyebrow">Featured Product</p>
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
          <div className="onyx-review-thread mx-auto text-start" aria-label="Example Onyx Reviews text message request">
            <div className="onyx-review-thread-header">
              <span className="onyx-review-thread-mark" aria-hidden="true">O</span>
              <div>
                <p>Onyx Reviews</p>
                <span>Review request ready</span>
              </div>
              <span className="onyx-review-thread-status">Sent</span>
            </div>
            <div className="onyx-review-thread-body">
              <p className="onyx-review-thread-date">Today, 10:24 AM</p>
              <div className="onyx-review-thread-bubble onyx-review-thread-bubble-incoming">
                Hi Maya, thanks for visiting. Would you take a moment to share your feedback?
              </div>
              <div className="onyx-review-thread-bubble onyx-review-thread-bubble-outgoing">
                Absolutely. I had a great experience.
              </div>
              <p className="onyx-review-thread-note">AI-assisted request, delivered by text</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
