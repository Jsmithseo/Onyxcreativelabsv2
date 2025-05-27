import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { FaGlobe, FaBullhorn, FaPhoneAlt, FaMusic } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';

export default function STLRCaseStudy() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '4rem 0',
        textAlign: 'center',
      }}>
        <Container>
          <h1 className="fw-bold">Driving Bookings for STLR Entertainment</h1>
          <p className="mt-3 text-muted">
            Helping a talent agency scale bookings with digital marketing and direct outreach.
          </p>
          <a href="https://stlrentertainment.com" target="_blank" rel="noopener noreferrer">
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
              STLR Entertainment wanted to increase their booking volume and improve their digital footprint. With no cold outreach system and a dated website, they were missing out on key opportunities.
            </p>
          </Col>
          <Col md="6">
            <h3 className="fw-bold">The Opportunity</h3>
            <p>
              We saw the chance to build a professional website, establish consistent lead-gen outreach through cold calling, and launch targeted Google Ads to reach event planners and venues.
            </p>
          </Col>
        </Row>

        {/* Placeholder Images Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <img src="stlr1.png" alt="Homepage screenshot" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
          <Col md="4">
            <img src="stlr-2.png" alt="Call strategy screenshot" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
          <Col md="4">
            <img src="stlr-3.png" alt="Google ads screenshot" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
        </Row>

        {/* Solution Icons */}
        <Row className="mb-5 text-center">
          <Col md="3">
            <FaGlobe size={40} color="#007bff" />
            <h6 className="mt-3 fw-bold">Website Redesign</h6>
            <p>Refreshed the online presence with booking forms, artist showcases, and mobile-friendly design.</p>
          </Col>
          <Col md="3">
            <FaPhoneAlt size={40} color="#17a2b8" />
            <h6 className="mt-3 fw-bold">Cold Calling Strategy</h6>
            <p>Developed scripts, contact lists, and a process for ongoing lead generation.</p>
          </Col>
          <Col md="3">
            <FaBullhorn size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Google Ads Campaign</h6>
            <p>Targeted campaigns to attract event bookings for artists and DJs.</p>
          </Col>
          <Col md="3">
            <FaMusic size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Booking Growth</h6>
            <p>More inquiries and deals closed through coordinated digital and direct outreach.</p>
          </Col>
        </Row>

        {/* Results Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <h2 className="fw-bold text-primary">+65%</h2>
            <p>Increase in qualified booking leads</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">+3x</h2>
            <p>Website traffic within 60 days of launch</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">10+</h2>
            <p>New venues reached via cold outreach</p>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
            <Button color="primary" size="lg">
              Let’s Book More Together
            </Button>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
