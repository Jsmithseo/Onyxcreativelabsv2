import React from 'react';
import { Button, Card, CardBody, CardText, CardTitle, Col, Container, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';

const partners = [
  {
    name: 'Parsity',
    description: 'A coding school for career changers.',
    href: 'https://parsity.io',
  },
  {
    name: 'Silicon Island Vallejo',
    description: 'A Vallejo tech incubator focused on AI and sustainable energy.',
    href: 'https://siliconislandvallejo.com',
  },
];

export default function PartnersPage() {
  return (
    <BaseLayout>
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0' }}>
        <Container>
          <div className="text-center mb-5">
            <h1 className="fw-bold">Partners</h1>
            <p className="lead text-muted">Organizations we’re proud to work alongside.</p>
          </div>
          <Row className="justify-content-center g-4">
            {partners.map((partner) => (
              <Col key={partner.name} md="6" lg="5">
                <Card className="h-100 shadow-sm">
                  <CardBody className="d-flex flex-column">
                    <CardTitle tag="h2" className="h4 fw-bold">{partner.name}</CardTitle>
                    <CardText className="text-muted">{partner.description}</CardText>
                    <Button
                      color="primary"
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto align-self-start"
                    >
                      Visit {partner.name}
                    </Button>
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
