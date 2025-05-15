import React from 'react';
import Image from 'next/image';
import Logo from '../public/logo.PNG';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Link from 'next/link';
import BaseLayout from './components/layouts/BaseLayouts.js';
import { Row, Col, Button } from 'reactstrap';

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
              We’re a full-service digital marketing agency dedicated to delivering innovative technology solutions for small businesses and nonprofits. We specialize in web development, SEO, and content marketing, all while nurturing the next generation of tech talent through hands-on experience and mentorship.
            </p>
            <div style={styles.buttonContainer}>
              <Link href="/contact">
                <Button variant="contained" color="success" type="submit">
                  Start Project
                </Button>
              </Link>
              {/* <Link href="https://calendly.com/jeremy-onyxcreativelabs/client-discovery">
                <Button variant="contained" color="primary" type="submit">
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
                  <h1 style={styles.header}>How It Works</h1>
                  <p style={styles.text}>
                    At Onyx Creative Labs, we provide high-quality marketing and web development services by leveraging the skills of our students who are eager to gain real-world experience. Our unique approach ensures your project is handled with care, expertise, and a fresh perspective.
                  </p>
                  <Button
                    color="success"
                    size="lg"
                    style={styles.button}
                    href="/how-it-works"
                  >
                    Learn More
                  </Button>
                </Col>
              </Row>
            </Container>
            <div style={styles.backgroundSection}>
              <Container>
                <Row>
                  <Col
                    md={{ size: 12 }}
                    className="text-center"
                    style={styles.content}
                  >
                    <h1 style={styles.header}>
                      Empower the Next Generation of Tech Talent
                    </h1>
                    <p style={styles.text}>
                      What sets us apart is our unique approach to talent development. Your projects will be handled by our talented students, who work under the guidance of an experienced senior developer acting as a mentor. This ensures that your website or app is not only expertly crafted but also continually maintained with the latest industry practices.
                    </p>
                    <Button
                      color="success"
                      size="lg"
                      style={styles.button}
                      href="/contact"
                    >
                      Start Project
                    </Button>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </Container>
      </div>
    </BaseLayout>
  );
}
