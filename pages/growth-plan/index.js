import React from 'react';
import Link from 'next/link';
import { Button, Col, Container, Row } from 'reactstrap';
import {
  FaBullseye,
  FaChartLine,
  FaPenNib,
  FaUsers,
} from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';

const growthSteps = [
  {
    icon: <FaBullseye size={34} color="#0d6efd" />,
    title: 'Find the right market',
    copy: 'Research, targeting, and direct outreach help you understand where demand is strongest and what buyers need to hear.',
  },
  {
    icon: <FaUsers size={34} color="#2563eb" />,
    title: 'Learn from real conversations',
    copy: 'The questions, objections, and signals you hear in the market become useful direction for your message and next move.',
  },
  {
    icon: <FaPenNib size={34} color="#fd7e14" />,
    title: 'Turn insight into a story',
    copy: 'We shape what you learn into content that makes your product easier to understand, remember, and trust.',
  },
  {
    icon: <FaChartLine size={34} color="#6f42c1" />,
    title: 'Build demand that compounds',
    copy: 'Outreach opens the conversation. Story-led content keeps your value clear as more people discover your business.',
  },
];

export default function GrowthPlanPage() {
  return (
    <BaseLayout>
      <section
        style={{
          backgroundColor: '#f8f9fa',
          padding: '4.5rem 0',
          textAlign: 'center',
        }}
      >
        <Container>
          <p
            className="text-uppercase fw-semibold mb-3"
            style={{ color: '#2563eb', letterSpacing: '0.08em' }}
          >
            Business Development + Content Marketing
          </p>
          <h1 className="fw-bold">Turn market insight into meaningful demand.</h1>
          <p
            className="text-muted mx-auto mt-3"
            style={{ fontSize: '1.15rem', maxWidth: '760px', textAlign: 'center' }}
          >
            The Growth Plan connects human-led business development with
            storytelling that makes your value easier to understand. Learn what
            the market responds to, then turn that insight into content people
            remember.
          </p>
          <div className="mt-4">
            <Link href="/contact" passHref legacyBehavior>
              <Button color="success" size="lg">
                Build Your Growth Plan
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col lg="9" className="text-center">
            <h2 className="fw-bold">One connected growth system.</h2>
            <p className="mb-0">
              Business development tells you where the opportunity is. Content
              marketing gives that opportunity a story people can connect with.
              Together, they create a clearer path from first conversation to
              lasting demand.
            </p>
          </Col>
        </Row>

        <Row className="text-center mb-5">
          {growthSteps.map((step) => (
            <Col md="6" lg="3" className="mb-4 mb-lg-0" key={step.title}>
              <div className="mb-3">{step.icon}</div>
              <h3 className="h5 fw-bold">{step.title}</h3>
              <p className="mb-0">{step.copy}</p>
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center">
          <Col lg="9">
            <div
              className="rounded p-4 p-md-5 text-center"
              style={{ backgroundColor: '#eff6ff' }}
            >
              <h2 className="fw-bold pt-0">For teams ready to connect the dots.</h2>
              <p className="mx-auto mb-4" style={{ maxWidth: '700px', textAlign: 'center' }}>
                Choose a Growth Plan when you need to test the market, start
                meaningful conversations, and turn what you learn into a story
                that keeps your product moving forward.
              </p>
              <Link href="/contact" passHref legacyBehavior>
                <Button color="success" size="lg">
                  Build Your Growth Plan
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
