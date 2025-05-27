import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function OurStoryPage() {
  return (
    <BaseLayout>
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0' }}>
        <Container>
          <Row className="mb-5 text-center">
            <Col>
              <h1 className="fw-bold">Our Story</h1>
              <p className="lead text-muted">
                Empowering small businesses through modern digital strategy and design.
              </p>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <h3 className="fw-bold">A Journey Rooted in Experience</h3>
              <p>
                After nearly 15 years in the market as a web developer and marketer, I’ve had the privilege
                of working with some of the best companies in the world. Through optimizing websites and
                apps for conversion and user experience, I’ve helped businesses achieve growth of up to 3–4x.
              </p>
              <p>
                But while I was scaling success for industry giants, my heart was always with small businesses
                and nonprofits — those with big dreams but limited resources. I wanted to bring the same
                strategies, tools, and insights used by global companies to the grassroots level.
              </p>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <h3 className="fw-bold">The Birth of Onyx Creative Labs</h3>
              <p>
                I founded Onyx Creative Labs on the idea that advanced strategies and technologies shouldn’t
                be exclusive to large enterprises. If they work for Fortune 500s, they can — and should — work
                for local businesses, too.
              </p>
              <p>
                Our goal is to help small businesses grow through conversion-focused design, A/B testing,
                and progressive web app development. We want to help the "little guys" become the leaders
                of their local markets.
              </p>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <h3 className="fw-bold">Commitment to Excellence</h3>
              <p>
                At Onyx Creative Labs, we pride ourselves on delivering exceptional results and creating a
                meaningful impact. Our clients trust us to bring modern digital solutions that are grounded in
                real performance and strategic insight.
              </p>
            </Col>
          </Row>

          <Row className="text-center">
            <Col>
              <Link href="/contact" passHref>
                <Button color="primary" size="lg">Contact Us</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </BaseLayout>
  );
}
