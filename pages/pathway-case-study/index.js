import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import {
  FaSitemap,
  FaBolt,
  FaAccessibleIcon,
  FaRegNewspaper,
  FaEnvelopeOpenText,
  FaShieldAlt,
  FaChartLine,
  FaHandsHelping
} from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function PathwayHumanityCaseStudy() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '4rem 0',
          textAlign: 'center',
        }}
      >
        <Container>
          <h1 className="fw-bold">Holistic Website Redesign & Content Engine for Pathway Humanity</h1>
          <p className="mt-3 text-muted">
            How we modernized a social purpose organization’s web presence and set up an ongoing content program
            to drive inquiries and community engagement.
          </p>
          <a href="https://pathwayhumanity.com" target="_blank" rel="noopener noreferrer">
            Visit Website ↗
          </a>
        </Container>
      </div>

      <Container className="py-5">
        {/* Challenge / Opportunity */}
        <Row className="mb-5">
          <Col md="6">
            <h3 className="fw-bold">The Challenge</h3>
            <p>
              Pathway Humanity offers mental health and addiction recovery, transitional housing, and job support—
              but the website didn’t reflect the full scope of services. Navigation was unclear, content was dated,
              and there wasn’t a consistent cadence for updates or newsletters. As a result, qualified visitors weren’t
              converting into inquiries.
            </p>
          </Col>
          <Col md="6">
            <h3 className="fw-bold">The Opportunity</h3>
            <p>
              Redesign the site around clear service pathways, improve performance and accessibility, and launch an
              ongoing content engine—blog maintenance, monthly newsletters, and regular website updates—to keep the
              brand current and conversion-ready.
            </p>
          </Col>
        </Row>



        {/* Solution */}
        <Row className="mb-5 text-center">
          <Col md="3">
            <FaSitemap size={40} color="#0d6efd" />
            <h6 className="mt-3 fw-bold">Website Redesign</h6>
            <p>
              Rebuilt IA and page templates to spotlight core services—Recovery, Transitional Housing, and Job Support—
              with clear CTAs on every page.
            </p>
          </Col>
          <Col md="3">
            <FaBolt size={40} color="#198754" />
            <h6 className="mt-3 fw-bold">Performance & Accessibility</h6>
            <p>
              Optimized assets, improved Lighthouse scores, and tightened color contrast and semantics for WCAG-friendly UX.
            </p>
          </Col>
          <Col md="3">
            <FaRegNewspaper size={40} color="#fd7e14" />
            <h6 className="mt-3 fw-bold">Blog Maintenance</h6>
            <p>
              Editorial calendar, post production, and publishing to keep stories, resources, and updates flowing.
            </p>
          </Col>
          <Col md="3">
            <FaEnvelopeOpenText size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Newsletter Program</h6>
            <p>
              Monthly newsletter setup and sends, with audience growth via in-page forms and contextual signup prompts.
            </p>
          </Col>
        </Row>

        <Row className="mb-5 text-center">
          <Col md="4">
            <FaShieldAlt size={36} />
            <h6 className="mt-3 fw-bold">Trusted Intake</h6>
            <p>
              HubSpot forms hardened with reCAPTCHA and field validation to reduce spam and protect staff time.
            </p>
          </Col>
          <Col md="4">
            <FaChartLine size={36} />
            <h6 className="mt-3 fw-bold">Measurement</h6>
            <p>
              Tracked form starts/completions and newsletter signups to guide content and CTA iterations.
            </p>
          </Col>
          <Col md="4">
            <FaHandsHelping size={36} />
            <h6 className="mt-3 fw-bold">Ongoing Updates</h6>
            <p>
              Routine copy, image, and feature tweaks to keep the site current and aligned with program needs.
            </p>
          </Col>
        </Row>

        {/* Results (use your actual analytics; numbers below are placeholders) */}
        {/* TODO: Replace with real data from GA/HubSpot */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <h2 className="fw-bold text-primary">+32%</h2>
            <p>Increase in inquiry form submissions (first 60 days)</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">+45%</h2>
            <p>Growth in newsletter signups after launch</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">-38%</h2>
            <p>Reduction in page load time on key pages</p>
          </Col>
        </Row>

        {/* CTA */}
        <Row className="text-center">
          <Col>
            <Link href="/contact" passHref legacyBehavior>
              <Button color="primary" size="lg">
                Let’s Improve Your Site
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
