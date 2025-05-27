import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { FaTools, FaBug, FaClipboardList, FaSync } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function PollEverywhereCaseStudy() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '4rem 0',
        textAlign: 'center',
      }}>
        <Container>
          <h1 className="fw-bold">Backlog Relief for Poll Everywhere</h1>
          <p className="mt-3 text-muted">
            Contract engineering support to maintain product momentum during dev shortages.
          </p>
          <a href="https://www.polleverywhere.com" target="_blank" rel="noopener noreferrer">
            Visit Website ↗
          </a>
        </Container>
      </div>

      {/* Challenge & Opportunity Section */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col md="6">
            <h3 className="fw-bold">The Challenge</h3>
            <p>
              Poll Everywhere was experiencing development slowdowns due to limited engineering bandwidth.
              With an increasing number of support tickets and backlogged tasks, product velocity was at risk.
            </p>
          </Col>
          <Col md="6">
            <h3 className="fw-bold">The Opportunity</h3>
            <p>
              As a contracted dev partner, we joined their team to quickly ramp up and tackle backlog items,
              bugs, and ticket resolution — giving the internal team breathing room to focus on long-term initiatives.
            </p>
          </Col>
        </Row>

        {/* Icons Section */}
        <Row className="mb-5 text-center">
          <Col md="3">
            <FaClipboardList size={40} color="#007bff" />
            <h6 className="mt-3 fw-bold">Backlog Reduction</h6>
            <p>Worked through delayed internal tasks and low-priority fixes.</p>
          </Col>
          <Col md="3">
            <FaBug size={40} color="#dc3545" />
            <h6 className="mt-3 fw-bold">Bug Fixing</h6>
            <p>Addressed both critical and minor platform issues.</p>
          </Col>
          <Col md="3">
            <FaTools size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Support Coverage</h6>
            <p>Helped support teams resolve user-impacting issues faster.</p>
          </Col>
          <Col md="3">
            <FaSync size={40} color="#ffc107" />
            <h6 className="mt-3 fw-bold">Seamless Integration</h6>
            <p>Worked inside their dev ecosystem with minimal ramp-up time.</p>
          </Col>
        </Row>

        {/* Results Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <h2 className="fw-bold text-primary">✓</h2>
            <p>Unblocked product initiatives and support tickets</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">✓</h2>
            <p>Maintained delivery cadence during critical resource gap</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">✓</h2>
            <p>Helped internal team refocus on strategic features</p>
          </Col>
        </Row>

        {/* CTA */}
        <Row className="text-center">
          <Col>
            <Link href="/contact" passHref>
              <Button color="primary" size="lg">
                Need Dev Support? Let’s Talk
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
} 
