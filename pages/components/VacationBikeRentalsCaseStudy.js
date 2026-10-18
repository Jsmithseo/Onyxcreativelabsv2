import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import BaseLayout from './layouts/BaseLayouts';
import Link from 'next/link';

const interventions = [
  ['Group Rental Segments', 'We identified audiences with a clear reason to book multiple bikes at once: startups planning off-site activities and Airbnb property owners looking to offer electric-bike experiences to their guests.'],
  ['Targeted Messaging', 'Each audience received more relevant website and campaign language, connecting Vacation Bike Rentals to the occasions and outcomes that mattered most to that particular customer.'],
  ['Search-Intent Research', 'Analytics and search behavior pointed to a strong San Francisco opportunity around bike routes to the Golden Gate Bridge. We developed messaging around that experience across the website and marketing.'],
  ['Friction Reduction', 'We looked at page-visit behavior and streamlined the waiver process, moving from paper forms to a more digital experience that made the rental journey easier to complete.'],
];

export default function VacationBikeRentalsCaseStudy() {
  return (
    <BaseLayout>
      <section className="onyx-hero onyx-case-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Case Study / Demand Generation</p>
          <h1 className="onyx-hero-title">Seasonal Conversion Optimization for Vacation Bike Rentals</h1>
          <p className="onyx-hero-copy">How a more focused audience strategy helped shift demand from mostly one-off rentals toward higher-value group bookings.</p>
          <a href="https://www.vacationbikerentals.com" target="_blank" rel="noopener noreferrer" className="onyx-case-study-site-link">Visit Vacation Bike Rentals ↗</a>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The question</p>
            <h2>How do you make bike rentals more efficient without losing the demand already working?</h2>
          </Col>
          <Col lg="8">
            <p>Vacation Bike Rentals had healthy interest in one-off rentals, but individual bookings alone were not the most efficient way to grow the business. The opportunity was to attract more rentals at a time, especially group bookings, while continuing to serve the individual customers already choosing the experience.</p>
            <p className="mb-0">The work began with market and analytics findings: which groups could benefit from the service, what they were looking for, and how the website could more directly reflect the occasions that lead to larger bookings.</p>
          </Col>
        </Row>
      </Container>

      <section className="onyx-muted-section">
        <Container className="onyx-case-section">
          <Row className="g-5">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">The approach</p>
              <h2>Build for higher-value group demand without losing the individual rider.</h2>
            </Col>
            <Col lg="8">
              <p>Onyx Creative Labs created a content and campaign strategy built around defined customer segments. Instead of speaking to every potential renter in the same way, we developed messaging for startup teams planning off-sites, Airbnb hosts looking to enrich guest stays, and visitors searching for iconic San Francisco riding routes.</p>
              <p className="mb-0">That message work was supported by a closer look at page activity and the rental process itself. The goal was to make the journey from interest to booking feel more direct, useful, and convenient.</p>
            </Col>
          </Row>
          <Row className="g-4 mt-2">
            {interventions.map(([title, copy], index) => (
              <Col key={title} md="6">
                <article className="onyx-case-method h-100">
                  <p>Method {String(index + 1).padStart(2, '0')}</p>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Container className="onyx-case-section">
        <Row className="g-5">
          <Col lg="4">
            <p className="onyx-lab-eyebrow">The result</p>
            <h2>A more focused mix of individual demand and group-rental opportunity.</h2>
          </Col>
          <Col lg="8">
            <p>Vacation Bike Rentals gained a more intentional content strategy, campaigns tailored to group-booking audiences, and website messaging rooted in the San Francisco experiences people were actively seeking. The digital waiver process also reduced a practical barrier in the rental flow.</p>
            <div className="onyx-case-learning">
              <h3>The key learning</h3>
              <p className="mb-0">Efficiency is not only about attracting more attention. It is about matching the offer to the occasions that create more value per booking, while keeping a strong experience for the customers already coming through the door.</p>
            </div>
          </Col>
        </Row>
        <div className="text-center mt-5">
          <Link href="/contact"><Button color="primary" size="lg">Start a Conversation</Button></Link>
        </div>
      </Container>
    </BaseLayout>
  );
}
