import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardText,
  Badge
} from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

const caseStudies = [
  {
    brand: 'Poll Everywhere',
    title: 'Poll Company',
    excerpt:
      'Stepping in to clear development backlog, we supported Poll Everywhere through a critical period of limited dev availability—keeping product momentum alive and internal teams unblocked',
    link: '/poll-case-study',
    bgColor: '#007acc'
  },
  {
    brand: 'Vacation Bike Rentals',
    title: 'Seasonal Bike Rental Company',
    excerpt:
      'Vacation Bike Rentals needed to boost conversions during the off-season and ramp up visibility ahead of the warmer months. We helped them optimize their site and strategy to stay booked year-round.',
    link: '/vacation-case-study',
    bgColor: '#3f3c56'
  },
  {
    brand: 'Cordelia',
    title: "Adult Residetial Care",
    excerpt:
      'Cordelia ARC relied entirely on county referrals—until we helped them launch their first public-facing website and Google Ads campaign to drive private market inquiries',
    link: "/cordelia-case-study",
    bgColor: '#1eaf5e'
  },
  {
    brand: 'STLR Entertainment',
    title: 'Live Entertainment Booking',
    excerpt:
      'STLR Entertainment needed to grow their bookings. We rebuilt their website, implemented CRO strategies, launched Google Ads, and executed a cold calling plan to drive qualified leads and close new deals',
    link: '/stlr-case-study',
    bgColor: '#2c68cf'
  },
  {
    brand: 'Parsity',
    title: 'Online Code School',
    excerpt:
      'Parsity.io needed to increase student enrollment. We enhanced their CRO, redesigned landing pages, launched Google Ads, and built a cold outreach strategy to attract qualified applicants.',
    link: '/parsity-case-study',
    bgColor: '#234d9b'
  }
];

export default function CaseStudyPage() {
  return (
    <BaseLayout>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(to right, #2f3b66, #232843)',
          color: 'white',
          padding: '4rem 0',
          textAlign: 'center'
        }}
      >
        <Container>
          <h1>
            <span style={{ color: '#33a1fd' }}>Impact</span> speaks louder than words
          </h1>
          <p className="mt-3">
          </p>
          <Link href="https://calendly.com/jeremy-onyxcreativelabs/client-discovery">
          <Button color="primary" size="lg" className="mt-4">
            Start A Conversation
          </Button>
          </Link>
          
        </Container>
      </div>

      {/* Case Study Cards */}
      <Container className="py-5">
        <Row>
          {caseStudies.map((study, idx) => (
            <Col md="6" lg="3" className="mb-4" key={idx}>
              <Card style={{ borderRadius: '8px', overflow: 'hidden', height: '100%' }}>
                <div style={{ backgroundColor: study.bgColor, padding: '1.25rem', color: 'white' }}>
                  <h5 className="mb-0">{study.brand}</h5>
                </div>
                <CardBody>
                  <Badge color="light" className="text-uppercase mb-2">
                    {study.tag}
                  </Badge>
                  <h6 className="fw-bold">{study.title}</h6>
                  <CardText>{study.excerpt}</CardText>
                  <a href={study.link} className="text-primary fw-semibold">
                    Read More →
                  </a>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </BaseLayout>
  );
} 