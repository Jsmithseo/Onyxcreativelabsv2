import React from 'react';
import Link from 'next/link';
import { Button, Col, Container, Row } from 'reactstrap';
import {
  FaBookOpen,
  FaBullhorn,
  FaPenNib,
  FaVideo,
} from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';

const focusAreas = [
  {
    icon: <FaBookOpen size={34} color="#0d6efd" />,
    title: 'Find the story',
    copy: 'We get clear on why your product exists, who it is for, and what makes it worth paying attention to.',
  },
  {
    icon: <FaPenNib size={34} color="#198754" />,
    title: 'Shape the message',
    copy: 'We turn that insight into a focused narrative that sounds like your brand and speaks to the people you want to reach.',
  },
  {
    icon: <FaVideo size={34} color="#fd7e14" />,
    title: 'Create the content',
    copy: 'From video and photography to website copy and social content, we make the story feel real and easy to understand.',
  },
  {
    icon: <FaBullhorn size={34} color="#6f42c1" />,
    title: 'Keep it moving',
    copy: 'We help you use the story consistently so every touchpoint builds recognition, trust, and demand over time.',
  },
];

export default function ContentMarketingPage() {
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
            style={{ color: '#198754', letterSpacing: '0.08em' }}
          >
            Content Marketing
          </p>
          <h1 className="fw-bold">Your product has a story. Let&apos;s make it resonate.</h1>
          <p
            className="text-muted mx-auto mt-3"
            style={{ fontSize: '1.15rem', maxWidth: '720px', textAlign: 'center' }}
          >
            At Onyx Creative Labs, content marketing is storytelling with a
            purpose. We help you turn the reason your product exists into
            content that customers can understand, connect with, and remember.
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md="7">
            <h2 className="fw-bold">Make the product feel human.</h2>
            <p>
              People do not just buy products. They buy into the reason a
              product exists, the problem it solves, and the feeling it creates.
              A clear story gives people a way to see themselves in what you
              are building.
            </p>
            <p className="mb-0">
              We work with you to uncover the moments worth sharing: why you
              started, what you believe, the people you serve, and the change
              your product makes possible. Then we shape those moments into
              content that helps the right customers get to know your product
              before they are ready to buy.
            </p>
          </Col>
          <Col md="5" className="mt-4 mt-md-0">
            <div
              className="rounded p-4 h-100"
              style={{ backgroundColor: '#212529', color: '#fff' }}
            >
              <h3 className="h4 fw-bold">What we can create</h3>
              <ul className="mb-0 ps-3">
                <li>Founder and brand stories</li>
                <li>Product videos and photo content</li>
                <li>Customer stories and testimonials</li>
                <li>Website messaging and landing-page copy</li>
                <li>Social campaigns and ongoing content series</li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className="text-center mb-5">
          {focusAreas.map((area) => (
            <Col md="3" className="mb-4 mb-md-0" key={area.title}>
              <div className="mb-3">{area.icon}</div>
              <h3 className="h5 fw-bold">{area.title}</h3>
              <p className="mb-0">{area.copy}</p>
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center">
          <Col lg="9">
            <div
              className="rounded p-4 p-md-5 text-center"
              style={{ backgroundColor: '#e9f7ef' }}
            >
              <h2 className="fw-bold pt-0">Content that builds connection.</h2>
              <p
                className="mx-auto mb-4"
                style={{ maxWidth: '700px', textAlign: 'center' }}
              >
                Every piece of content should do more than fill a feed. It
                should make your product easier to know, remember, and trust.
                Let&apos;s tell the story behind what you&apos;re building and give
                people a reason to care.
              </p>
              <Link href="/contact" passHref legacyBehavior>
                <Button color="success" size="lg">
                  Start a Conversation
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
