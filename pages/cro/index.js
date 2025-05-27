import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { FaCheckCircle, FaChartLine, FaFlask, FaUserCheck } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';


export default function CROServicesPage() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0', textAlign: 'center' }}>
        <Container>
          <h1 className="fw-bold">Conversion Rate Optimization (CRO)</h1>
          <p className="mt-3 text-muted">
            Turn more visitors into customers. We optimize every stage of your digital experience to increase conversion and deliver real business growth.
          </p>
        </Container>
      </div>

      {/* Overview Section */}
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md="6">
            <h3 className="fw-bold">What is CRO?</h3>
            <p>
              Conversion Rate Optimization is the practice of using data, testing, and insights to continuously improve how your website converts traffic. Whether you're looking for more signups, purchases, or inquiries — our CRO strategies are tailored to your goals.
            </p>
            <ul>
              <li><FaCheckCircle className="me-2 text-success" /> Increase conversions without increasing ad spend</li>
              <li><FaCheckCircle className="me-2 text-success" /> Improve user experience and trust</li>
              <li><FaCheckCircle className="me-2 text-success" /> Gain insights that fuel marketing and product teams</li>
            </ul>
          </Col>
          <Col md="6">
            <img src="cro.png" alt="CRO Overview" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
        </Row>

        {/* How We Do It */}
        <Row className="text-center mb-5">
          <Col md="3">
            <FaFlask size={40} color="#007bff" />
            <h6 className="mt-3 fw-bold">Experimentation</h6>
            <p>We run A/B tests, multivariate tests, and user flows to identify performance opportunities.</p>
          </Col>
          <Col md="3">
            <FaChartLine size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Data-Driven Design</h6>
            <p>We redesign elements based on analytics and heatmaps to drive better engagement.</p>
          </Col>
          <Col md="3">
            <FaUserCheck size={40} color="#ffc107" />
            <h6 className="mt-3 fw-bold">User Insights</h6>
            <p>We collect qualitative feedback from real users to guide UX and content improvements.</p>
          </Col>
          <Col md="3">
            <FaChartLine size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Ongoing Optimization</h6>
            <p>CRO is never done — we help your team stay ahead with iterative wins month over month.</p>
          </Col>
        </Row>

        {/* Sample Results Section */}
        <Row className="text-center mb-5">
          <Col md="4">
            <img src="test.png" alt="Test result graph" style={{ height: '400px',width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">50% lift in form completions after redesign</p>
          </Col>
          <Col md="4">
            <img src="heat-map.png" alt="Heatmap insights" style={{ height: '400px',width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Discovered drop-off via heatmap data</p>
          </Col>
          <Col md="4">
            <img src="ab-test.png" alt="A/B testing" style={{ height: '400px',width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Improved conversion through targeted A/B testing</p>
          </Col>
        </Row>

        {/* CTA Section */}
        <Row className="text-center">
          <Col>
          <Link href="/contact" passHref>

            <Button color="primary" size="lg">
              Let’s Optimize Your Conversions
            </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
