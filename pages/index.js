import React from 'react';
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
    url: 'https://www.instagram.com/reel/Dc_5pKcBr4_/',
  },
  {
    title: 'STLR Entertainment commercial',
    url: 'https://www.instagram.com/reel/DCsM8xiSbi_/',
  },
  {
    title: 'Featured storytelling Reel',
    url: 'https://www.instagram.com/reel/C9xxO33y9JY/',
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
              <div className="onyx-live-logo" aria-label="Onyx Creative Labs">
                <div className="onyx-logo-mark" aria-hidden="true">
                  <img src="/logo.PNG" alt="" />
                  <span className="onyx-logo-water" />
                </div>
                <span>Onyx Creative Labs</span>
              </div>
            </div>
            <h1 className="onyx-hero-title">
              Validate Your AI Product with a 90-Day Pilot
            </h1>
            <p className="onyx-hero-copy">
              Don’t waste more time wondering whether your product has market fit. Our 90-Day Pilot puts it in front of real people and shows you what the market says.
            </p>
            <div className="onyx-hero-actions">
              <Link href="/90-day-pilot">
                <Button color="success" style={{ fontWeight: '600' }}>
                  Explore the 90-Day Pilot
                </Button>
              </Link>
            </div>
          </Container>
        </section>
        <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
          <Container maxWidth="lg">
            <Row className="justify-content-center text-center mb-4">
              <Col lg="9">
                <p
                  className="text-uppercase fw-semibold mb-2"
                  style={{ color: '#198754', letterSpacing: '0.08em' }}
                >
                  Content marketing through storytelling
                </p>
                <h2 className="fw-bold">Give people a reason to care.</h2>
                <p className="lead text-muted mb-0">
                  The story behind your product helps customers understand what
                  you do, why it matters, and why they should remember you. We
                  shape that story into content that feels real and resonates.
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              {storytellingReels.map((reel) => (
                <Col md="6" lg="4" className="mb-4" key={reel.url}>
                  <div className="border rounded overflow-hidden bg-white h-100 shadow-sm">
                    <div
                      className="bg-light"
                      style={{ aspectRatio: '9 / 16', minHeight: '440px' }}
                    >
                      <iframe
                        title={reel.title}
                        src={`${reel.url}embed/`}
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ border: 0, height: '100%', width: '100%' }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="h5 fw-bold mb-3">{reel.title}</h3>
                      <Button
                        tag="a"
                        color="outline-dark"
                        href={reel.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch on Instagram
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <div className="text-center mt-2">
              <Link href="/contact">
                <Button color="success" size="lg">
                  Start a Conversation
                </Button>
              </Link>
            </div>
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
