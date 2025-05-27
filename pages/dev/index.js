import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FaPaintBrush, FaMobileAlt, FaCode, FaRocket } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function WebDesignPage() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0', textAlign: 'center' }}>
        <Container>
          <h1 className="fw-bold">Web Design & Development</h1>
          <p className="mt-3 text-muted">
            From idea to launch — we build beautiful, high-performing websites that grow with your business.
          </p>
        </Container>
      </div>

      {/* Overview Section */}
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md="6">
            <h3 className="fw-bold">Why Design Matters</h3>
            <p>
              Your website is often the first impression of your brand. We combine strategy, design, and development to create an experience that earns trust, drives action, and performs across devices.
            </p>
            <ul>
              <li>✓ Responsive Design</li>
              <li>✓ Fast Load Times</li>
              <li>✓ SEO Best Practices</li>
              <li>✓ Easy-to-Manage CMS</li>
            </ul>
          </Col>
          <Col md="6">
            <img src="dev.png" alt="Responsive mockup" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
        </Row>

        {/* Features Icons */}
        <Row className="text-center mb-5">
          <Col md="3">
            <FaPaintBrush size={40} color="#007bff" />
            <h6 className="mt-3 fw-bold">Custom Design</h6>
            <p>Tailored aesthetics and brand voice that resonate with your audience.</p>
          </Col>
          <Col md="3">
            <FaMobileAlt size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Mobile-First</h6>
            <p>Built to look and perform flawlessly on smartphones and tablets.</p>
          </Col>
          <Col md="3">
            <FaCode size={40} color="#ffc107" />
            <h6 className="mt-3 fw-bold">Modern Development</h6>
            <p>Fast, accessible, SEO-optimized code using modern frameworks and tech.</p>
          </Col>
          <Col md="3">
            <FaRocket size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Launch & Support</h6>
            <p>From DNS to hosting — we handle setup, testing, and post-launch success.</p>
          </Col>
        </Row>

        {/* Results Section */}
        {/* <Row className="text-center mb-5">
          <Col md="6">
            <img src="https://placehold.co/600x400?text=Before+%26+After+UX" alt="Before and after UX" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Redesigned site increased engagement by 78%</p>
          </Col>
          <Col md="6">
            <img src="https://placehold.co/600x400?text=Speed+and+SEO+Score" alt="Site speed improvement" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Boosted Core Web Vitals and search rankings</p>
          </Col>
        </Row> */}

        {/* CTA Section */}
        <Row className="text-center">
          <Col>
          <Link href="/contact" passHref>
            <Button color="primary" size="lg">
              Let’s Build Something Great
            </Button>
</Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}