import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function ThankYou() {
  return (
    <BaseLayout>
      <div style={{ backgroundColor: '#f8f9fa', padding: '5rem 0', textAlign: 'center' }}>
        <Container>
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <h1 className="fw-bold mb-4">Thanks for Reaching Out!</h1>
              <p className="lead mb-4">
                We’ve received your message and will be in touch shortly.
                In the meantime, feel free to explore more about what we do.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/case-studies" passHref>
                  <Button color="primary" size="lg">Explore Case Studies</Button>
                </Link>
                <Link href="/" passHref>
                  <Button color="secondary" size="lg">Back to Home</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    </BaseLayout>
  );
}
