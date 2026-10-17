import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/logo.PNG';
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
              <Image
                src={Logo}
                alt="Onyx Creative Labs Logo"
                width={300}
                height={75}
              />
            </div>
            <h1 className="onyx-hero-title">
              Validate Your AI Product with a 90-Day Pilot
            </h1>
            <p className="onyx-hero-copy">
              Stress-test your product with targeted market outreach, cold calling, inbound lead follow-up, and content to discover whether it has viable market fit.
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
                  <h2>Build a Growth Engine, Not a Patchwork.</h2>
                  <p className="onyx-intro-copy">
                  We connect strategy, outreach, and execution to help businesses create demand, strengthen their sales pipeline, and make informed growth decisions.
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
          <Approach/>
        </section>
      </div>
    </BaseLayout>
  );
}
