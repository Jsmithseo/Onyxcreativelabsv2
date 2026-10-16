import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardText, CardTitle, Col, Container, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';

export default function ProductsPage() {
  return (
    <BaseLayout>
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0' }}>
        <Container className="text-center">
          <h1 className="fw-bold">Products</h1>
          <Row className="justify-content-center g-4 mt-1">
            <Col md="6" lg="5" className="order-2">
              <Card className="h-100 shadow-sm text-start">
                <CardBody className="d-flex flex-column">
                  <CardTitle tag="h2" className="h4 fw-bold">SuSu</CardTitle>
                  <CardText className="text-muted">
                    Explore rotating savings circles and reach your financial goals together today.
                  </CardText>
                  <Button
                    color="primary"
                    href="https://susuapp.vercel.app/"
                    className="mt-auto align-self-start"
                  >
                    Explore SuSu
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col md="6" lg="5" className="order-1">
              <Card className="h-100 shadow-sm text-start">
                <CardBody className="d-flex flex-column">
                  <CardTitle tag="h2" className="h4 fw-bold">Onyx Reviews</CardTitle>
                  <CardText className="text-muted">
                    Automate review requests so you can focus on running your business.
                  </CardText>
                  <Link href="/reviews" passHref legacyBehavior>
                    <Button color="primary" className="mt-auto align-self-start">
                      Explore Onyx Reviews
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </BaseLayout>
  );
}
