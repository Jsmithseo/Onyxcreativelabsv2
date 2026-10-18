import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardText, CardTitle, Col, Container, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';

export default function ProductsPage() {
  return (
    <BaseLayout>
      <div className="onyx-products-page">
        <Container className="text-center">
          <div className="onyx-products-intro">
            <p className="onyx-products-eyebrow">Onyx Products</p>
            <h1>Tools built from practical market insight.</h1>
            <p>
              Our products are crafted in the lab to solve practical customer problems. We use market research and real-world learning to turn recurring needs into clear, useful tools.
            </p>
          </div>
          <Row className="justify-content-center g-4">
            <Col md="6" lg="5" className="order-2">
              <Card className="onyx-product-card h-100 text-start">
                <CardBody className="d-flex flex-column p-4 p-md-5">
                  <CardTitle tag="h2">SuSu</CardTitle>
                  <CardText>
                    A community-rooted rotating savings circle that gives trusted groups a shared rhythm for saving, accountability, and working toward goals together.
                  </CardText>
                  <Link href="/susu" passHref legacyBehavior>
                    <Button color="primary" className="mt-auto align-self-start">
                      Explore SuSu
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
            <Col md="6" lg="5" className="order-1">
              <Card className="onyx-product-card h-100 text-start">
                <CardBody className="d-flex flex-column p-4 p-md-5">
                  <CardTitle tag="h2">Onyx Reviews</CardTitle>
                  <CardText>
                    An AI-assisted SMS platform that helps businesses make review requests easy, gather feedback, and manage their reputation with less manual follow-up.
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
