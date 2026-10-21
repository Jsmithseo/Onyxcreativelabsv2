import React from 'react';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import BaseLayout from './components/layouts/BaseLayouts.js';
import { Row, Col, Button } from 'reactstrap';
import Approach from "../pages/components/Approach"
import Results from "../pages/components/Results";
import FeaturedCaseStudies from './components/FeaturedCaseStudies';


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
