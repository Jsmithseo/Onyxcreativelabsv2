import React from 'react';
import Image from 'next/image';
import Logo from '../public/logo.PNG';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import BaseLayout from './components/layouts/BaseLayouts.js';
import { Row, Col, Button } from 'reactstrap';
import Approach from "../pages/components/Approach"
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
            <p style={{ ...styles.text, padding: '0 20px', margin: '20px 0' , fontSize: "40px"}}>
              <b>Validate Your AI Product with a 90-Day Pilot</b>
            </p>
            <p style={{ ...styles.text, padding: '0 20px', margin: '20px 0' }}>
              Stress-test your product with targeted market outreach, cold calling, inbound lead follow-up, and content to discover whether it has viable market fit.
            </p>
            <div style={styles.buttonContainer}>
              <Button
                color="success"
                href="https://calendly.com/softwaresmitty/discovery"
                style={{ fontWeight: '600' }}
              >
                Book Time to Talk
              </Button>
              {/* <Link href="https://calendly.com/jeremy-onyxcreativelabs/client-discovery">
                <Button variant="contained" color="primary" type="submit" style={{ fontWeight: '600' }}>
                  30 Min Free Consult
                </Button>
              </Link> */}
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
                  <h1 style={styles.header}>Build a Growth Engine, Not a Patchwork.</h1>
                  <p style={styles.text}>
                  We connect strategy, outreach, and execution to help businesses create demand, strengthen their sales pipeline, and make informed growth decisions.
                  </p>
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
