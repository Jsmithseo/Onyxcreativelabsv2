import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { FaGlobe, FaBullhorn, FaChartLine, FaHandshake } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function CordeliaCaseStudy() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '4rem 0',
        textAlign: 'center',
      }}>
        <Container>
          <h1 className="fw-bold">Bringing Cordelia ARC to the Public Market</h1>
          <p className="mt-3 text-muted">
            From county referrals to public visibility — a digital launch for growth.
          </p>
          <a href="https://cordeliaarc.com" target="_blank" rel="noopener noreferrer">
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
              Cordelia ARC had been operating solely on county referrals. They wanted to break into the public market and attract private clients, but lacked a digital presence and outreach strategy.
            </p>
          </Col>
          <Col md="6">
            <h3 className="fw-bold">The Opportunity</h3>
            <p>
              With no existing public-facing brand or website, Cordelia had a clean slate to create a digital presence built for trust, visibility, and conversion. The goal was to quickly attract inquiries while establishing credibility online.
            </p>
          </Col>
        </Row>

        {/* Placeholder Images Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <img src="Cordelia1.jpg" alt="Homepage screenshot" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
          <Col md="4">
            <img src="Cordelia2.jpg" alt="Google Ads dashboard screenshot" style={{ width: '100%', borderRadius: '8px' }} />

          </Col>
          <Col md="4">
            <img src="Cordelia3.jpg" alt="Lead tracking screenshot" style={{ width: '100%', borderRadius: '8px' }} />

          </Col>
        </Row>

        {/* Solution Icons */}
        <Row className="mb-5 text-center">
          <Col md="3">
            <FaGlobe size={40} color="#007bff" />
            <h6 className="mt-3 fw-bold">Website Build</h6>
            <p>Designed and developed a clean, responsive site with service info and contact forms.</p>
          </Col>
          <Col md="3">
            <FaBullhorn size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Google Ads Campaign</h6>
            <p>Launched targeted campaigns focused on local families and private referrals.</p>
          </Col>
          <Col md="3">
            <FaChartLine size={40} color="#ffc107" />
            <h6 className="mt-3 fw-bold">Lead Tracking</h6>
            <p>Setup analytics and conversion tracking to refine the campaign and site content.</p>
          </Col>
          <Col md="3">
            <FaHandshake size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Brand Presence</h6>
            <p>Created messaging and visuals to reflect professionalism, care, and trust.</p>
          </Col>
        </Row>

        {/* Results Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <h2 className="fw-bold text-primary">+3x</h2>
            <p>Website inquiries in the first 30 days</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">+120%</h2>
            <p>Increase in site traffic from Google Ads</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">0 → 1</h2>
            <p>First public-facing brand presence launched</p>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
          <Link href="/contact" passHref>
            <Button color="primary" size="lg">
              See What We Can Build Together
            </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
