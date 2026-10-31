import React from 'react';
import Image from 'next/image';
import Logo from '../public/logo.PNG';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import BaseLayout from './components/layouts/BaseLayouts.js';
import { Row, Col, Button } from 'reactstrap';
import Approach from "../pages/components/Approach"
import Results from "../pages/components/Results";
import FeaturedCaseStudies from './components/FeaturedCaseStudies';

const storytellingReels = [
  {
    title: 'Storytelling in action',
    videoSrc: '/videos/storytelling-in-action.mp4',
  },
  {
    title: 'STLR Entertainment commercial',
    videoSrc: '/videos/stlr-entertainment-commercial.mp4',
  },
  {
    title: 'Vacation Bike Rentals story',
    videoSrc: '/videos/vacation-bike-rentals-story.mp4',
  },
];

export default function Index() {
  const styles = {
    main: {
      overflowX: 'hidden',
    },
  };

  return (
    <BaseLayout>
      <div style={styles.main}>
        <CssBaseline />
        <section className="onyx-hero">
          <Container>
            <div className="onyx-hero-logo">
              <Image
              src={Logo}
              alt="Onyx Creative Labs Logo"
              width={300}
              height={75}
            />
            </div>
            <h1 className="onyx-hero-title">
              Find your market. Tell your story. Grow with confidence.
            </h1>
            <p className="onyx-hero-copy">
              Onyx helps you create demand in two ways: test the market with
              human-led business development, or turn your value into
              story-led content that gives people a reason to care.
            </p>
            <div className="onyx-hero-actions" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <Link href="/90-day-pilot">
                <Button color="success" style={{ fontWeight: '600' }}>
                  Test Your Market
                </Button>
              </Link>
              <Link href="/content-marketing">
                <Button color="outline-dark" style={{ fontWeight: '600' }}>
                  Tell Your Story
                </Button>
              </Link>
            </div>
            <p className="mt-3 mb-0 text-center">
              Need both?{' '}
              <Link href="/growth-plan" style={{ color: '#2563eb', fontWeight: '600' }}>
                See how a Growth Plan brings them together.
              </Link>
            </p>
          </Container>
        </section>
        <Container maxWidth="lg">
          <section className="onyx-intro">
            <Row>
              <Col md={{ size: 12 }}>
                  <h2>The Onyx Creative Labs Way.</h2>
                  <p className="onyx-intro-copy">
                  We help businesses understand their market, build momentum, and grow with confidence.
                  </p>
              </Col>
            </Row>
          </section>
        </Container>
        <section className="onyx-muted-section">
          <Results/>
        </section>
        <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
          <Container maxWidth="lg">
            <Row className="justify-content-center text-center mb-4">
              <Col lg="9">
                <p
                  className="text-uppercase fw-semibold mb-2"
                  style={{ color: '#2563eb', letterSpacing: '0.08em' }}
                >
                  Content marketing through storytelling
                </p>
                <h2 className="fw-bold">Content is King.</h2>
                <p className="lead text-muted mb-0">
                  The story behind your product helps customers understand what
                  you do, why it matters, and why they should remember you. We
                  shape that story into content that feels real and resonates.
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              {storytellingReels.map((reel) => (
                <Col md="6" lg="4" className="mb-4" key={reel.videoSrc}>
                  <div className="border rounded overflow-hidden bg-white shadow-sm">
                    <div className="bg-dark" style={{ aspectRatio: '16 / 9' }}>
                      <video
                        aria-label={reel.title}
                        className="d-block w-100"
                        controls
                        playsInline
                        preload="metadata"
                        style={{ height: '100%', objectFit: 'contain' }}
                      >
                        <source src={reel.videoSrc} type="video/mp4" />
                        Your browser does not support video playback.
                      </video>
                    </div>
                    <div className="p-3">
                      <h3 className="h5 fw-bold mb-0">{reel.title}</h3>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <div className="text-center mt-2">
              <Link href="/content-marketing">
                <Button color="success" size="lg">
                  Tell Your Story
                </Button>
              </Link>
            </div>
          </Container>
        </section>
        <section className="onyx-content-section">
          <FeaturedCaseStudies/>
        </section>
        <section className="onyx-muted-section">
          <Approach/>
        </section>
      </div>
    </BaseLayout>
  );
}
