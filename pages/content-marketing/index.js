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
    icon: <FaPenNib size={34} color="#2563eb" />,
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

const storyExamples = [
  {
    title: 'Storytelling in action',
    copy: 'An Onyx Reel selected as an example of how a clear story can help people connect with the work behind a product.',
    videoSrc: '/videos/storytelling-in-action.mp4',
  },
  {
    title: 'STLR Entertainment commercial',
    copy: 'A commercial example that pairs a focused message with a memorable point of view.',
    videoSrc: '/videos/stlr-entertainment-commercial.mp4',
  },
  {
    title: 'Vacation Bike Rentals story',
    copy: 'A Reel selected to show how a clear story can make an idea easier to recognize and remember.',
    videoSrc: '/videos/vacation-bike-rentals-story.mp4',
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
            style={{ color: '#2563eb', letterSpacing: '0.08em' }}
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

        <Row className="justify-content-center mb-5">
          <Col lg="10">
            <div className="text-center mb-4">
              <p
                className="text-uppercase fw-semibold mb-2"
                style={{ color: '#2563eb', letterSpacing: '0.08em' }}
              >
                Storytelling examples
              </p>
              <h2 className="fw-bold">See the story in motion.</h2>
              <p className="text-muted mx-auto mb-0" style={{ maxWidth: '680px' }}>
                Good content gives people a feeling for the people, purpose, and
                perspective behind the product. Here is one example of that work
                in action.
              </p>
            </div>

            <Row className="justify-content-center">
              {storyExamples.map((example) => (
                <Col md="6" lg="4" key={example.videoSrc}>
                  <div className="border rounded overflow-hidden bg-white">
                    <div className="bg-dark" style={{ aspectRatio: '16 / 9' }}>
                      <video
                        aria-label={example.title}
                        className="d-block w-100"
                        controls
                        playsInline
                        preload="metadata"
                        style={{ height: '100%', objectFit: 'contain' }}
                      >
                        <source src={example.videoSrc} type="video/mp4" />
                        Your browser does not support video playback.
                      </video>
                    </div>
                    <div className="p-4">
                      <h3 className="h5 fw-bold">{example.title}</h3>
                      <p className="mb-0">{example.copy}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg="9">
            <div
              className="rounded p-4 p-md-5 text-center"
              style={{ backgroundColor: '#eff6ff' }}
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
