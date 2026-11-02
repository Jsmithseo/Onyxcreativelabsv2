import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardText, CardTitle, Col, Container, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';

const products = [
  {
    title: 'Onyx AI Closer',
    eyebrow: 'Early Access',
    copy: 'An inbound AI appointment setter and human-in-the-loop BDR workflow, built to turn early interest into a more informed conversation for the real closer.',
    href: '/ai-closer',
    cta: 'Explore AI Closer',
  },
  {
    title: 'Onyx Reviews',
    copy: 'An AI-assisted SMS platform that helps businesses make review requests easy, gather feedback, and manage their reputation with less manual follow-up.',
    href: '/reviews',
    cta: 'Explore Onyx Reviews',
  },
  {
    title: 'SuSu',
    copy: 'A community-rooted rotating savings circle that gives trusted groups a shared rhythm for saving, accountability, and working toward goals together.',
    href: '/susu',
    cta: 'Explore SuSu',
  },
];

export default function ProductsPage() {
  return (
    <BaseLayout>
      <div className="onyx-products-page">
        <Container className="text-center">
          <div className="onyx-products-intro">
            <p className="onyx-products-eyebrow">Onyx Products</p>
            <h1>Products built to move real results.</h1>
            <p>
              Onyx products start with the problems that keep businesses and
              communities from moving forward. We build practical tools that create
              momentum, strengthen trust, and make it easier to take the next right step.
            </p>
          </div>
          <Row className="justify-content-center g-4">
            {products.map((product) => (
              <Col key={product.title} md="6" lg="4">
                <Card className="onyx-product-card h-100 text-start">
                  <CardBody className="d-flex flex-column p-4 p-md-5">
                    {product.eyebrow && (
                      <p className="onyx-products-eyebrow">{product.eyebrow}</p>
                    )}
                    <CardTitle tag="h2">{product.title}</CardTitle>
                    <CardText>{product.copy}</CardText>
                    <Link href={product.href} passHref legacyBehavior>
                      <Button color="primary" className="mt-auto align-self-start">
                        {product.cta}
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </BaseLayout>
  );
}
