import React from 'react';
import { Container, Card, CardBody } from 'reactstrap';
import {
  FaChartBar,
  FaMoneyBillWave,
  FaEnvelopeOpenText,
  FaLaptopCode,
  FaSearch,
} from 'react-icons/fa';

const services = [
  {
    icon: <FaChartBar size={32} color="#007bff" />,
    title: 'Conversion Rate Optimization',
    description: 'Increase conversion metrics and make a bigger impact.',
  },
  {
    icon: <FaMoneyBillWave size={32} color="#6c757d" />,
    title: 'Paid Media Management',
    description: 'Maximize your return on ad spend with continuous testing, refined targeting. ',
  },
  {
    icon: <FaEnvelopeOpenText size={32} color="#f0ad4e" />,
    title: 'Lifecycle Marketing',
    description: 'Develop high-performing emails, SMS, Chatbot, and retention campaigns.',
  },
  {
    icon: <FaLaptopCode size={32} color="#5cb85c" />,
    title: 'Website Design & Build',
    description: 'Redesign and optimize your site with expert creative and development support.',
  },
  {
    icon: <FaSearch size={32} color="#6c757d" />,
    title: 'Research & Analytics',
    description: 'Uncover valuable customer insights, and capitalize on data-driven strategies.',
  },
];

export default function ServicesSection() {
  return (
    <Container className="py-5">
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          justifyContent: 'center',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        {services.map((service, index) => (
          <Card
            key={index}
            style={{
              textAlign: 'center',
              height: '100%',
              maxWidth: '100%',
              boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.05)',
              border: 'none',
            }}
          >
            <CardBody>
              <div style={{ marginBottom: '1rem' }}>{service.icon}</div>
              <h5 style={{ fontWeight: '600' }}>{service.title}</h5>
              <p style={{ color: '#6c757d' }}>{service.description}</p>
              <a href="#!" style={{ color: '#007bff', fontWeight: '500' }}>
                Learn More
              </a>
            </CardBody>
          </Card>
        ))}
      </div>
    </Container>
  );
}
