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
              <h1 className="fw-bold">Built at the Intersection of Product, People, and Market</h1>
              <p className="lead text-muted">
                Onyx Creative Labs was built to help ambitious businesses turn strong ideas into meaningful market momentum.
              </p>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <h3 className="fw-bold">A Founder’s Perspective</h3>
              <p>
                Onyx Creative Labs grew from nearly 15 years of experience working where technical understanding,
                market reality, and human connection meet. Its founder has spent that time helping organizations
                improve how their products are understood, how their teams work together, and how opportunities
                become measurable business progress.
              </p>
              <p>
                That experience has never been limited to a single function. It has involved understanding the
                technical details behind a product, listening to customers and partners in real conversations,
                leading teams, and serving as a liaison between the people building the work and the people who
                need to believe in it. That perspective shapes how Onyx approaches every engagement.
              </p>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <h3 className="fw-bold">Growth Starts With Understanding</h3>
              <p>
                We believe growth is not a collection of disconnected activities. It begins with understanding
                what a business truly offers, who it serves, and what people need to hear before they are ready
                to engage. From there, the work is to create a clearer connection between the value of the
                business and the real people it is built to help.
              </p>
              <p>
                Onyx brings business development, market learning, communication, and execution into one focused
                effort. We help teams find where opportunity exists, build stronger customer relationships, and
                develop the practical insight leaders need to make better next decisions.
              </p>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <h3 className="fw-bold">The Onyx Commitment</h3>
              <p>
                The Onyx commitment is to do work that is thoughtful, grounded, and useful. We stay close to the
                market, listen carefully to the people who matter, and translate what we learn into forward motion.
                That may mean opening new conversations, clarifying a message, strengthening a process, or helping
                a team align around what comes next.
              </p>
              <p>
                The goal is always bigger than activity for its own sake. It is to help businesses improve their
                bottom line, build confidence in their direction, and move forward with a stronger understanding
                of the market they are here to serve.
              </p>
            </Col>
          </Row>

          <Row className="text-center">
            <Col>
              <Link href="/contact" passHref>
                <Button color="primary" size="lg">Start a Conversation</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </BaseLayout>
  );
}
