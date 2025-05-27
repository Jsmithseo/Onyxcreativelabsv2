import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { FaGlobe, FaUserGraduate, FaChartLine, FaBullhorn } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';

export default function ParsityCaseStudy() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '4rem 0',
        textAlign: 'center',
      }}>
        <Container>
          <h1 className="fw-bold">Building Growth for Parsity.io</h1>
          <p className="mt-3 text-muted">
            A strategy to increase enrollment and elevate digital visibility for a modern coding school.
          </p>
          <a href="https://parsity.io" target="_blank" rel="noopener noreferrer">
            Visit Website ↗
          </a>
        </Container>
      </div>

      {/* Challenge Section */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col md="6">
            <h3 className="fw-bold">The Challenge</h3>
            <p>
              Parsity.io, a coding school for career changers, wanted to increase student enrollment. They needed better lead generation, a stronger online presence, and a strategy for consistent outreach.
            </p>
          </Col>
          <Col md="6">
            <h3 className="fw-bold">The Opportunity</h3>
            <p>
              With a solid program and alumni success stories, Parsity had the foundation to grow. We worked with them to improve CRO, design landing pages, and drive leads through outreach and digital ads.
            </p>
          </Col>
        </Row>

        {/* Placeholder Images Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <img src="parsity.png" alt="Landing page screenshot" style={{ width: '100%', borderRadius: '8px' }} />

          </Col>
          <Col md="4">
            <img src="parsity1.png" alt="Outreach strategy screenshot" style={{ width: '100%', borderRadius: '8px' }} />

          </Col>
          <Col md="4">
            <img src="parsity2.png" alt="Google ads screenshot" style={{ width: '100%', borderRadius: '8px' }} />

          </Col>
        </Row>

        {/* Solution Icons */}
        <Row className="mb-5 text-center">
          <Col md="3">
            <FaGlobe size={40} color="#007bff" />
            <h6 className="mt-3 fw-bold">Landing Page Design</h6>
            <p>Optimized for conversion with a focus on value props, testimonials, and CTAs.</p>
          </Col>
          <Col md="3">
            <FaUserGraduate size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Enrollment Strategy</h6>
            <p>Built a top-of-funnel plan using cold outreach and follow-up flows.</p>
          </Col>
          <Col md="3">
            <FaChartLine size={40} color="#ffc107" />
            <h6 className="mt-3 fw-bold">CRO Improvements</h6>
            <p>Refined form flows and messaging for better sign-up rates.</p>
          </Col>
          <Col md="3">
            <FaBullhorn size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Google Ads</h6>
            <p>Used intent-based ads to reach motivated prospective students.</p>
          </Col>
        </Row>

        {/* Results Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <h2 className="fw-bold text-primary">+45%</h2>
            <p>Improvement in lead-to-application rate</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">+200%</h2>
            <p>Increase in landing page traffic</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">3x</h2>
            <p>More outreach responses from target personas</p>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
            <Button color="primary" size="lg">
              Boost Your Enrollment Strategy
            </Button>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
