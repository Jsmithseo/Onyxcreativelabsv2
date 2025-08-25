import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import {
  FaPhone,
  FaEnvelopeOpenText,
  FaHandshake,
  FaMapMarkerAlt,
  FaBuilding,
  FaSchool,
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaBolt
} from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function StretchyCaseStudy() {
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
          <h1 className="fw-bold">Business Development Scale-Up for Stretchy</h1>
          <p className="mt-3 text-muted">
            How Onyx Creative Labs is expanding Stretchy’s footprint from a single golf club to
            multi-location partnerships—while building the staffing engine to support growth.
          </p>
          <a href="https://stretchy.us" target="_blank" rel="noopener noreferrer">
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
              After five years in business, Stretchy had a strong proof-of-concept running at one golf
              course. The team wanted to expand into additional golf clubs and new verticals (residential
              and education) but needed a repeatable outbound motion, clear partner offers, and a
              staffing model that could scale as deals closed.
            </p>
          </Col>
          <Col md="6">
            <h3 className="fw-bold">The Opportunity</h3>
            <p>
              Build a simple but powerful business development engine—target lists, phone + email
              outreach, partner proposals, fast pilots—and pair it with a staffing playbook so new
              locations could launch quickly without straining operations.
            </p>
          </Col>
        </Row>

        {/* Go-To-Market Approach */}
        <Row className="mb-4 text-center">
          <Col md="3" className="mb-4">
            <FaPhone size={40} color="#0d6efd" />
            <h6 className="mt-3 fw-bold">Outbound Calling</h6>
            <p className="mb-0">
              Daily call blocks to GMs and wellness directors with concise value props and
              calendar-first asks.
            </p>
          </Col>
          <Col md="3" className="mb-4">
            <FaEnvelopeOpenText size={40} color="#198754" />
            <h6 className="mt-3 fw-bold">Email Sequences</h6>
            <p className="mb-0">
              Brief, benefits-led emails with optional pilot offers and clear next steps.
            </p>
          </Col>
          <Col md="3" className="mb-4">
            <FaHandshake size={40} color="#fd7e14" />
            <h6 className="mt-3 fw-bold">Partner Offers</h6>
            <p className="mb-0">
              Flexible models: revenue share or flat fee, with light promotion requirements.
            </p>
          </Col>
          <Col md="3" className="mb-4">
            <FaClipboardList size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Pilot → Rollout</h6>
            <p className="mb-0">
              Fast on-site pilots to prove engagement, then standardized rollout checklists.
            </p>
          </Col>
        </Row>

        {/* Expansion Wins */}
        <Row className="mb-5 text-center">
          <Col md="4" className="mb-4">
            <FaMapMarkerAlt size={36} />
            <h6 className="mt-3 fw-bold">Golf Clubs</h6>
            <p className="mb-0">
              Added <strong>two additional golf courses</strong> to the original flagship location.
            </p>
          </Col>
          <Col md="4" className="mb-4">
            <FaBuilding size={36} />
            <h6 className="mt-3 fw-bold">Residential</h6>
            <p className="mb-0">
              Secured a partnership with a <strong>high-end apartment building</strong> to offer
              services to tenants.
            </p>
          </Col>
          <Col md="4" className="mb-4">
            <FaSchool size={36} />
            <h6 className="mt-3 fw-bold">Education</h6>
            <p className="mb-0">
              Closed a district deal, <strong>potentially serving 1,200 staff</strong> with on-site
              stretch sessions.
            </p>
          </Col>
        </Row>

        {/* Operations & Staffing */}
        <Row className="mb-5 text-center">
          <Col md="4" className="mb-4">
            <FaUsers size={36} />
            <h6 className="mt-3 fw-bold">Staffing Playbook</h6>
            <p className="mb-0">
              Recruiting pipeline, onboarding SOPs, and coverage schedules that scale with each new site.
            </p>
          </Col>
          <Col md="4" className="mb-4">
            <FaBolt size={36} />
            <h6 className="mt-3 fw-bold">Launch Checklist</h6>
            <p className="mb-0">
              Standardized open-day kit (signage, scripts, QR check-in, minutes logging) for fast launches.
            </p>
          </Col>
          <Col md="4" className="mb-4">
            <FaChartLine size={36} />
            <h6 className="mt-3 fw-bold">Reporting</h6>
            <p className="mb-0">
              Simple dashboards for attendance and minutes by location, plus monthly summaries for partners.
            </p>
          </Col>
        </Row>

        {/* Results (replace or expand with hard metrics when ready) */}
        <Row className="mb-5 text-center">
          <Col md="4" className="mb-4">
            <h2 className="fw-bold text-primary">+2</h2>
            <p>Additional Golf Courses Signed</p>
          </Col>
          <Col md="4" className="mb-4">
            <h2 className="fw-bold text-primary">+1</h2>
            <p>High-End Apartment Partner</p>
          </Col>
          {/* <Col md="3" className="mb-4">
            <h2 className="fw-bold text-primary">1.2K</h2>
            <p>District Staff Eligible</p>
          </Col> */}
          <Col md="4" className="mb-4">
            <h2 className="fw-bold text-primary">Ready</h2>
            <p>Staffing Engine to Support Scale</p>
          </Col>
        </Row>

        {/* CTA */}
        <Row className="text-center">
          <Col>
            <Link href="/contact" passHref legacyBehavior>
              <Button color="primary" size="lg">
                Let’s Grow Your Pipeline
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
