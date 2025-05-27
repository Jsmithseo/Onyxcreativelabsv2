import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FaSearch, FaChartPie, FaBrain, FaLightbulb } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function ResearchAnalyticsPage() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0', textAlign: 'center' }}>
        <Container>
          <h1 className="fw-bold">Research, Analytics & Strategy</h1>
          <p className="mt-3 text-muted">
            Make smarter decisions with data. We uncover insights, define strategy, and deliver growth.
          </p>
        </Container>
      </div>

      {/* Overview Section */}
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md="6">
            <h3 className="fw-bold">Why It Matters</h3>
            <p>
              Great outcomes start with clarity. Our team helps you uncover trends, understand your audience, and build a strategy that drives results. From market research to funnel analysis — we guide you from insight to impact.
            </p>
            <ul>
              <li>✓ Customer & Market Research</li>
              <li>✓ Funnel & Performance Analytics</li>
              <li>✓ Competitive Landscape</li>
              <li>✓ Actionable Growth Strategy</li>
            </ul>
          </Col>
          <Col md="6">
            <img src="research.png" alt="Analytics dashboard" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
        </Row>

        {/* Icon-Based Features */}
        <Row className="text-center mb-5">
          <Col md="3">
            <FaSearch size={40} color="#007bff" />
            <h6 className="mt-3 fw-bold">User Research</h6>
            <p>Surveys, interviews, and feedback loops that inform experience design and messaging.</p>
          </Col>
          <Col md="3">
            <FaChartPie size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Analytics Setup</h6>
            <p>Google Analytics, GA4, Tag Manager, and dashboards that track what matters most.</p>
          </Col>
          <Col md="3">
            <FaBrain size={40} color="#ffc107" />
            <h6 className="mt-3 fw-bold">Strategic Insight</h6>
            <p>We translate raw data into clear recommendations you can act on immediately.</p>
          </Col>
          <Col md="3">
            <FaLightbulb size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Growth Planning</h6>
            <p>We help prioritize initiatives and align teams toward your next major win.</p>
          </Col>
        </Row>

        {/* Results Section */}
        {/* <Row className="text-center mb-5">
          <Col md="6">
            <img src="https://placehold.co/600x400?text=Insight+Report" alt="Insight report" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Monthly reports driving product and marketing priorities</p>
          </Col>
          <Col md="6">
            <img src="https://placehold.co/600x400?text=Strategy+Session" alt="Strategy session screenshot" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Strategic workshops aligned cross-functional goals</p>
          </Col>
        </Row> */}

        {/* CTA */}
        <Row className="text-center">
          <Col>
          <Link href="/contact" passHref>
            <Button color="primary" size="lg">
              Start with a Strategy Session
            </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
