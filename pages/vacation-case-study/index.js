import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import { FaBicycle, FaChartLine, FaMobileAlt, FaBullhorn } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function VacationBikeCaseStudy() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '4rem 0',
        textAlign: 'center',
      }}>
        <Container>
          <h1 className="fw-bold">Seasonal Conversion Optimization for Vacation Bike Rentals</h1>
          <p className="mt-3 text-muted">
            How we helped a local rental company stay booked in the off-season and scale for summer.
          </p>
          <a href="https://www.vacationbikerentals.com" target="_blank" rel="noopener noreferrer">
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
              Vacation Bike Rentals was struggling with a drop in bookings during the colder months. Their website traffic remained steady, but conversions were falling off — especially during weekdays and off-peak hours.
            </p>
          </Col>
          <Col md="6">
            <h3 className="fw-bold">The Opportunity</h3>
            <p>
              We identified opportunities in their booking flow, value messaging, and seasonal strategy. There was untapped potential in bundling experiences, retargeting campaigns, and optimizing CTAs.
            </p>
          </Col>
        </Row>

        {/* Placeholder Images Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <img src="vacation-redesign.png" alt="Homepage screenshot" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Homepage Redesign</p>
          </Col>
          <Col md="4">
            <img src="vacation-booking.png" alt="Booking flow screenshot" style={{ width: '100%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Booking Flow Optimization</p>
          </Col>
          <Col md="4">
            <img src="vacation-mobile.png" alt="Mobile view screenshot" style={{height:'300px', width: '40%', borderRadius: '8px' }} />
            <p className="mt-2 text-muted">Mobile Experience Enhancements</p>
          </Col>
        </Row>

        {/* Solution Section */}
        <Row className="mb-5 text-center">
          <Col md="3">
            <FaBicycle size={40} color="#28a745" />
            <h6 className="mt-3 fw-bold">Seasonal Offers</h6>
            <p>Redesigned homepage to feature limited-time packages and seasonal group bundles.</p>
          </Col>
          <Col md="3">
            <FaChartLine size={40} color="#17a2b8" />
            <h6 className="mt-3 fw-bold">Performance CTAs</h6>
            <p>Improved booking clarity and added urgency messaging across the site.</p>
          </Col>
          <Col md="3">
            <FaMobileAlt size={40} color="#ffc107" />
            <h6 className="mt-3 fw-bold">Mobile Booking</h6>
            <p>Streamlined the mobile booking process to reduce friction and drop-offs.</p>
          </Col>
          <Col md="3">
            <FaBullhorn size={40} color="#6f42c1" />
            <h6 className="mt-3 fw-bold">Ad Strategy</h6>
            <p>Launched retargeting ads and newsletter promos for repeat and off-season visitors.</p>
          </Col>
        </Row>

        {/* Results Section */}
        <Row className="mb-5 text-center">
          <Col md="4">
            <h2 className="fw-bold text-primary">+28%</h2>
            <p>Increase in off-season conversion rate</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">+40%</h2>
            <p>Growth in email list via rental confirmations</p>
          </Col>
          <Col md="4">
            <h2 className="fw-bold text-primary">+22%</h2>
            <p>More repeat bookings within 60 days</p>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
          <Link href="/contact" passHref>
            <Button color="primary" size="lg">
              Start Your Optimization Journey
            </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
