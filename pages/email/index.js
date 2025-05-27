import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { FaEnvelope, FaUserClock, FaPaperPlane, FaMailBulk } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';


export default function LifecycleEmailsPage() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0', textAlign: 'center' }}>
        <Container>
          <h1 className="fw-bold">Lifecycle Email Marketing</h1>
          <p className="mt-3 text-muted">
            Turn your email list into a conversion engine. From onboarding to retention, we design email flows that guide your customers every step of the way.
          </p>
        </Container>
      </div>

      {/* Overview Section */}
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md="6">
            <h3 className="fw-bold">What Are Lifecycle Emails?</h3>
            <p>
              Lifecycle emails are automated email sequences tailored to where a customer is in their journey — welcoming new users, nudging repeat purchases, re-engaging dormant contacts, or rewarding loyalty.
            </p>
            <ul>
              <li>✓ Welcome Series</li>
              <li>✓ Abandoned Cart Recovery</li>
              <li>✓ Winback Campaigns</li>
              <li>✓ Post-Purchase Nurture</li>
            </ul>
          </Col>
          <Col md="6">
            <img src="email.png" alt="Lifecycle email flow" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
        </Row>

        {/* Solutions Icons */}
        <Row className="text-center mb-5">
          <Col md="3">
            <FaEnvelope size={40} color="#007bff" />
            <h6 className="mt-3 fw-bold">Email Strategy</h6>
            <p>We design a full-funnel lifecycle framework based on your customer journey and KPIs.</p>
          </Col>
          <Col md="3">
            <FaUserClock size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Automated Timing</h6>
            <p>Emails are triggered by behavior and time — not guesses — to increase open and conversion rates.</p>
          </Col>
          <Col md="3">
            <FaPaperPlane size={40} color="#ffc107" />
            <h6 className="mt-3 fw-bold">High-Impact Content</h6>
            <p>We write compelling, branded copy that educates, excites, and converts across the lifecycle.</p>
          </Col>
          <Col md="3">
            <FaMailBulk size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">ESP Implementation</h6>
            <p>We configure your platform (e.g., Mailchimp, hubspot, Constant Contact) for scalable automation.</p>
          </Col>
        </Row>

        {/* Results Section */}
        {/* <Row className="text-center mb-5">
          <Col md="6">
            <img src="https://placehold.co/600x400?text=Email+Open+Rates" alt="Open rate increase" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">+42% average increase in open rates</p>
          </Col>
          <Col md="6">
            <img src="https://placehold.co/600x400?text=Revenue+from+Emails" alt="Revenue from automation" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">30% of revenue generated from lifecycle campaigns</p>
          </Col>
        </Row> */}

        {/* CTA Section */}
        <Row className="text-center">
          <Col>
          <Link href="/contact" passHref>
            <Button color="primary" size="lg">
              Let’s Build Your Lifecycle Program
            </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
