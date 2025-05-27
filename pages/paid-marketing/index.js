import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { FaGoogle, FaFacebookSquare, FaBullseye, FaChartBar } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function PaidMarketingPage() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0', textAlign: 'center' }}>
        <Container>
          <h1 className="fw-bold">Paid Media Marketing</h1>
          <p className="mt-3 text-muted">
            Drive targeted traffic and generate measurable results with paid media campaigns across Google and social platforms.
          </p>
        </Container>
      </div>

      {/* Services Overview */}
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md="6">
            <h3 className="fw-bold">Why Paid Media?</h3>
            <p>
              Paid marketing allows you to reach high-intent audiences and convert faster. With performance-driven campaigns on Google, Meta, and beyond — we help you get the most out of your ad spend.
            </p>
            <ul>
              <li>✓ Google Ads (Search, Display, YouTube)</li>
              <li>✓ Facebook & Instagram Ads</li>
              <li>✓ Retargeting Campaigns</li>
              <li>✓ Landing Page Optimization</li>
            </ul>
          </Col>
          <Col md="6">
            <img src="paid-dashboard.png" alt="Paid media dashboard" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
        </Row>

        {/* Channels We Use */}
        <Row className="text-center mb-5">
          <Col md="4">
            <FaGoogle size={40} color="#ea4335" />
            <h6 className="mt-3 fw-bold">Google Ads</h6>
            <p>Search, Display, Shopping, and YouTube ads to capture high-intent traffic.</p>
          </Col>
          <Col md="4">
            <FaFacebookSquare size={40} color="#1877f2" />
            <h6 className="mt-3 fw-bold">Social Ads</h6>
            <p>Facebook, Instagram, and Meta platforms for awareness, engagement, and retargeting.</p>
          </Col>
          <Col md="4">
            <FaBullseye size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Campaign Strategy</h6>
            <p>Messaging, segmentation, and offer design tailored to your audience and goals.</p>
          </Col>
        </Row>

        {/* Results Section
        <Row className="text-center mb-5">
          <Col md="6">
            <img src="results.png" alt="Ad performance results" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">2.5x return on ad spend within 90 days</p>
          </Col>
          <Col md="6">
            <img src="leads.png" alt="Leads dashboard" style={{width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">300+ qualified leads from a single campaign</p>
          </Col>
        </Row> */}

        {/* CTA Section */}
        <Row className="text-center">
          <Col>
          <Link href="/contact" passHref>
            <Button color="primary" size="lg">
              Start Your Campaign Today
            </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
