import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FaTools, FaLightbulb, FaFlask } from 'react-icons/fa';
import Link from 'next/link';

export default function ExperimentationApproachSection() {
  return (
    <Container className="text-center py-5">
      <h2 style={{ fontWeight: '700' }}>
        We Don’t Guess, <span style={{ color: '#007bff' }}>We Test</span>
      </h2>
      <p className="mt-3 text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
        It’s our scientific approach to growth marketing that keeps clients coming back. 
        Because we’re not here to keep doing what’s worked before — we’re going to find 
        out what can work, and what will work better.
      </p>

      <Row className="mt-5 justify-content-center">
        <Col xs="12" md="4" className="mb-4">
          <FaTools size={40} color="#28a745" />
          <h5 className="mt-3 fw-bold">Build</h5>
          <p className="text-muted">
            See what a strong culture of experimentation can do to evolve the impact of your marketing.
          </p>
        </Col>
        <Col xs="12" md="4" className="mb-4">
          <FaLightbulb size={40} color="#f0ad4e" />
          <h5 className="mt-3 fw-bold">Try</h5>
          <p className="text-muted">
            We launch, measure, and analyze real-world tests across all channels and audiences.
          </p>
        </Col>
        <Col xs="12" md="4" className="mb-4">
          <FaFlask size={40} color="#007bff" />
          <h5 className="mt-3 fw-bold">Optimize</h5>
          <p className="text-muted">
            Insights from testing guide us toward scalable, lasting results—based on proof, not opinion.
          </p>
        </Col>
      </Row>
      <Link href="https://calendly.com/jeremy-onyxcreativelabs/client-discovery">
      <Button color="primary" size="lg" style={{ marginTop: '2rem', fontWeight: '600' }}>
        Get A Free Consultation
      </Button>
      </Link>
    </Container>
  );
}
