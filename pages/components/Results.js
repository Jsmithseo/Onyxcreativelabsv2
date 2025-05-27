import { LibraryAdd } from '@mui/icons-material';
import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';

export default function EarlyResultsSection() {
  const metrics = [
    {
      value: '100%',
      label: 'delivery rate on all client projects',
      color: '#28a745',
    },
    {
      value: '5+',
      label: 'platforms actively supported',
      color: '#f0ad4e',
    },
    {
      value: 'Weekly',
      label: 'collaboration touchpoints',
      color: '#007bff',
    },
    {
      value: 'Built-In',
      label: 'strategy with every project',
      color: '#6c63ff',
    },
  ];

  return (
    <Container className="text-center py-5">
      <h2 style={{ fontWeight: '700' }}>
        <span style={{ color: '#007bff' }}>Early Wins</span> That Build Trust
      </h2>
      <Row className="mt-5 justify-content-center">
        {metrics.map((item, idx) => (
          <Col key={idx} xs="6" md="3" className="mb-4">
            <h3 style={{ color: item.color, fontWeight: '700', fontSize: '2rem' }}>{item.value}</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#343a40' }}>{item.label}</p>
          </Col>
        ))}
      </Row>
      <Link href="/case-studies">
      <Button color="primary" size="lg" style={{ marginTop: '2rem', fontWeight: '600' }}>
        See What We're Building
      </Button>
      </Link>
    </Container>
  );
}
