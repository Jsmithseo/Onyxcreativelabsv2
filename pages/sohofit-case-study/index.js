import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import {
  FaBolt,
  FaChartLine,
  FaClipboardList,
  FaTachometerAlt,
  FaImages,
  FaMobileAlt,
  FaVial,
  FaUserCheck,
  FaSyncAlt,
} from "react-icons/fa";
import BaseLayout from "../components/layouts/BaseLayouts";
import Link from "next/link";

export default function SoHoFitTampaCaseStudy() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "4rem 0",
          textAlign: "center",
        }}
      >
        <Container>
          <h1 className="fw-bold">CRO + Speed Optimization for SoHo Fit Tampa</h1>
          <p className="mt-3 text-muted">
            How Onyx Creative Labs launched a sprint-based experiment program for SoHo Fit Tampa—
            improving site speed, tightening the conversion path, and driving measurable lifts in sign-ups.
          </p>
          <a
            href="https://sohofittampa.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
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
              SoHo Fit Tampa was generating interest, but the website had performance drag that
              could hurt mobile experience and conversion—especially for first-time visitors.
              The brand wanted to improve sign-ups and build a repeatable system to continuously
              improve the website over time.
            </p>
          </Col>
          <Col md="6">
            <h3 className="fw-bold">The Opportunity</h3>
            <p>
              Pair technical performance improvements (speed + stability) with a structured CRO
              experimentation program. Meet sprint-style, review metrics, ship improvements, measure lift,
              and repeat—so results compound month over month.
            </p>
          </Col>
        </Row>

        {/* Program Overview */}
        <Row className="mb-4 text-center">
          <Col md="3" className="mb-4">
            <FaTachometerAlt size={40} color="#0d6efd" />
            <h6 className="mt-3 fw-bold">Speed Optimization</h6>
            <p className="mb-0">
              Cleaned up unnecessary JS/CSS, reduced payload, and improved load performance—especially on mobile.
            </p>
          </Col>

          <Col md="3" className="mb-4">
            <FaImages size={40} color="#198754" />
            <h6 className="mt-3 fw-bold">Image Optimization</h6>
            <p className="mb-0">
              Compressed + resized assets, improved delivery strategy, and reduced layout shifts across key pages.
            </p>
          </Col>

          <Col md="3" className="mb-4">
            <FaVial size={40} color="#fd7e14" />
            <h6 className="mt-3 fw-bold">Experiment Program</h6>
            <p className="mb-0">
              A steady cadence of tests to improve sign-ups: copy, CTAs, page structure, and conversion flow.
            </p>
          </Col>

          <Col md="3" className="mb-4">
            <FaClipboardList size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Sprint Meetings</h6>
            <p className="mb-0">
              Regular sprint-style check-ins to review metrics, prioritize backlog, and ship improvements fast.
            </p>
          </Col>
        </Row>

        {/* What We Changed (Technical + CRO) */}
        <Row className="mb-5 text-center">
          <Col md="4" className="mb-4">
            <FaBolt size={36} />
            <h6 className="mt-3 fw-bold">Lean Front-End</h6>
            <p className="mb-0">
              Removed unused scripts/styles and simplified page assets to improve load times and responsiveness.
            </p>
          </Col>
          <Col md="4" className="mb-4">
            <FaMobileAlt size={36} />
            <h6 className="mt-3 fw-bold">Mobile-First Flow</h6>
            <p className="mb-0">
              Tightened the path from landing → offer → sign-up with clearer CTAs and less friction for mobile users.
            </p>
          </Col>
          <Col md="4" className="mb-4">
            <FaUserCheck size={36} />
            <h6 className="mt-3 fw-bold">Conversion Clarity</h6>
            <p className="mb-0">
              Improved above-the-fold messaging and added trust cues so visitors quickly understand the offer.
            </p>
          </Col>
        </Row>

        {/* Reporting + Iteration */}
        <Row className="mb-5 text-center">
          <Col md="4" className="mb-4">
            <FaChartLine size={36} />
            <h6 className="mt-3 fw-bold">Metrics-Driven</h6>
            <p className="mb-0">
              Reviewed sign-ups, conversion rates, and page performance to identify drop-off points and opportunities.
            </p>
          </Col>
          <Col md="4" className="mb-4">
            <FaSyncAlt size={36} />
            <h6 className="mt-3 fw-bold">Continuous Iteration</h6>
            <p className="mb-0">
              Changes ship in cycles—measure impact, keep what works, and build the next sprint backlog.
            </p>
          </Col>
          <Col md="4" className="mb-4">
            <FaClipboardList size={36} />
            <h6 className="mt-3 fw-bold">Experiment Backlog</h6>
            <p className="mb-0">
              Organized tests by expected impact and effort, keeping the team focused on compounding gains.
            </p>
          </Col>
        </Row>

        {/* Results */}
        <Row className="mb-5 text-center">
          <Col md="4" className="mb-4">
            <h2 className="fw-bold text-primary">Faster</h2>
            <p>Lean JS/CSS + optimized assets improved performance</p>
          </Col>
          <Col md="4" className="mb-4">
            <h2 className="fw-bold text-primary">+Lift</h2>
            <p>Positive conversion lifts and more sign-ups from experiments</p>
          </Col>
          <Col md="4" className="mb-4">
            <h2 className="fw-bold text-primary">Ongoing</h2>
            <p>Sprint-based CRO program with regular metric reviews</p>
          </Col>
        </Row>

        {/* CTA */}
        <Row className="text-center">
          <Col>
            <Link href="/contact" passHref legacyBehavior>
              <Button color="primary" size="lg">
                Let’s Improve Your Conversions
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
