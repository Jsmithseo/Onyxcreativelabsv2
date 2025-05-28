import React from 'react';
import Image from 'next/image';
import Logo from '../public/logo.PNG';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Link from 'next/link';
import BaseLayout from './components/layouts/BaseLayouts.js';
import { Row, Col, Button } from 'reactstrap';
import Approach from "../pages/components/Approach"
import Services from "../pages/components/Services";
import Results from "../pages/components/Results";


export default function Index() {
  const styles = {
    main: {
      overflowX: 'hidden',
    },
    headerBackground: {
      backgroundColor: '#f0f0f0', 
      padding: '50px 0',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
    },
    backgroundSection: {
      backgroundColor: '#f0f0f0',
      padding: '50px 0',
      width: '100vw', // Ensures the background spans full width
      marginLeft: 'calc(-50vw + 50%)', // Centers the full-width background
    },
    content: {
      padding: '30px',
      borderRadius: '8px',
    },
    header: {
      fontSize: '2.5rem',
      marginBottom: '20px',
      fontWeight: '400',
    },
    text: {
      fontSize: '1.5rem',
      marginBottom: '30px',
      textAlign: 'center',
      fontFamily: 'avenir',
    },
    button: {
      padding: '10px 20px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '20px',
    },
    logoContainer: {
      marginTop: '40px',
      textAlign: 'center',
    },
  };

  return (
    <BaseLayout>
      <div style={styles.main}>
        <CssBaseline />
        <div style={styles.headerBackground}>
          <Container>
            <div style={styles.logoContainer}>
              <Image
                src={Logo}
                alt="Onyx Creative Labs Logo"
                width={300}
                height={75}
              />
            </div>
            <p style={{ ...styles.text, padding: '0 20px', margin: '20px 0' }}>
            We help businesses scale through experimentation, performance design, and precision PPC campaigns. Backed by data. Built by a smart, flexible team.
            </p>
            <div style={styles.buttonContainer}>
              <Link href="/contact">
                <Button variant="contained" color="success" type="submit" style={{ fontWeight: '600' }}>
                  Start Project
                </Button>
              </Link>
              <Link href="https://calendly.com/jeremy-onyxcreativelabs/client-discovery">
                <Button variant="contained" color="primary" type="submit" style={{ fontWeight: '600' }}>
                  30 Min Free Consult
                </Button>
              </Link>
            </div>
          </Container>
        </div>
        <Container maxWidth="lg">
          <div style={{ marginTop: '60px' }}>
            <Container>
              <Row>
                <Col
                  md={{ size: 12 }}
                  className="text-center"
                  style={styles.content}
                >
                  <h1 style={styles.header}>No Gaps. No Silos. Just Momentum.</h1>
                  <p style={styles.text}>
                  We bring the same expert strategies and powerful tools used by the fastest-growing companies to your business. Our integrated ecosystem connects strategy, data, and execution—helping you move faster, collaborate more effectively, and create lasting, measurable impact.
                  </p>
                  <Services/>
                </Col>
              </Row>
            </Container>
            <div style={styles.backgroundSection}>
              <Container>
                <Row>
                  <Results/>
                </Row>
              </Container>
            </div>
            <Container>
              <Row>
                <Approach/>
              </Row>
            </Container>
          </div>
        </Container>
      </div>
    </BaseLayout>
  );
}
