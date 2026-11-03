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
              <h1 className="fw-bold">The Story Behind Onyx Creative Labs</h1>
              <p className="lead text-muted">
                Helping good businesses find their market, tell their story, and
                grow with confidence.
              </p>
            </Col>
          </Row>

          <Row className="mb-5 justify-content-center">
            <Col lg="9">
              <p className="lead">
                I built Onyx Creative Labs after nearly 15 years working where
                strong products, real people, and the market meet. Along the
                way, I kept seeing the same thing: businesses with real value
                were struggling to explain it in a way people could understand,
                trust, and act on. The problem was rarely that they had nothing
                to offer. More often, the connection between what they did and
                what their customers needed to hear was not clear enough.
              </p>
              <p>
                My work has never lived inside one job title. I have spent time
                learning the technical side of a product, listening to customers
                and partners in real conversations, leading teams, and helping
                bridge the gap between the people building the work and the
                people who need to believe in it. That experience taught me
                that growth is not a collection of disconnected tactics. It
                starts with understanding what makes a business matter, who it
                is here to serve, and how to make that value easy to recognize.
              </p>
              <p>
                That is why I started Onyx. I wanted to bring business
                development, market learning, clear communication, and practical
                execution into one focused effort. Whether we are testing a
                market, opening new conversations, clarifying a message, or
                turning a business's value into a story people remember, the
                goal is the same: create real momentum built on a clearer view of
                the market.
              </p>
              <p className="mb-0">
                I believe good growth feels grounded. It comes from staying
                close to the people who matter, paying attention to what the
                market is telling you, and using what you learn to make stronger
                next decisions. Onyx is here to help businesses do exactly that:
                improve the bottom line, build confidence in their direction, and
                move forward with a story that is true to who they are.
              </p>
            </Col>
          </Row>

          <Row className="text-center">
            <Col>
              <Link href="/contact" passHref>
                <Button color="primary" size="lg">
                  Start a Conversation
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </BaseLayout>
  );
}
