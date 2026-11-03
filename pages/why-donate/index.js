import React from 'react';
import BaseLayout from '../components/layouts/BaseLayouts';
import { Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';

const WhyDonate = () => {
  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
      }}
    >
      <BaseLayout>
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <br></br>
              <br></br>
              <h1>Why Donate?</h1>
              <p className="lead">
                Your generosity directly impacts the lives of our students,
                providing them with the tools and opportunities they need to
                succeed.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md="4" className="mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Software Seats</h3>
                <p>
                  Donations help us purchase software licenses, ensuring that
                  our students have access to the industry-standard tools they
                  need for their education and projects.
                </p>
              </div>
            </Col>
            <Col md="4" className="mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Laptops for Students</h3>
                <p>
                  Many of our students do not have access to reliable
                  technology. Your donations allow us to provide laptops,
                  ensuring every student can learn and work effectively.
                  <Link
                    href="/laptop-donation"
                    passHref
                    style={{ color: 'var(--onyx-accent)', textDecoration: 'underline' }}
                  >
                    Learn more about our laptop donation program.
                  </Link>
                </p>
              </div>
            </Col>
            <Col md="4" className="mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Stipends for Employees & Mentors</h3>
                <p>
                  We provide stipends to our dedicated employees and mentors who
                  guide our students through their learning journey. Your
                  contributions help us support these crucial roles.
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="4" className="mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Learning Resources & Materials</h3>
                <p>
                  Donations also go towards purchasing books, online courses,
                  and other learning materials that are essential for our
                  students' education and growth.
                </p>
              </div>
            </Col>
            <Col md="4" className="mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Workshops & Training Sessions</h3>
                <p>
                  We organize workshops and training sessions that provide our
                  students with hands-on experience and networking
                  opportunities. Your donations make these events possible.
                </p>
              </div>
            </Col>
            <Col md="4" className="mb-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Community Outreach & Support</h3>
                <p>
                  Part of the funds go towards community outreach programs that
                  help spread the word about our mission and bring in new
                  students, mentors, and supporters.
                </p>
              </div>
            </Col>
          </Row>
          <Row className="my-5">
            <Col className="text-center">
              <h2>Invest in a Student's Future</h2>
              <p className="lead">
                By donating, you're investing in the future of a student,
                helping them gain real-life work experience that will ultimately
                lead to employment. Your support makes a lasting difference.
              </p>
              <p>
                All donations are tax-deductible. If you're in the spirit of
                giving and need a web project done, please consider starting a
                project with us. The funds from these projects are also
                tax-deductible.
              </p>
              <div className="d-flex justify-content-center">
                <Link href="/contact" passHref>
                  <Button color="primary" size="lg" className="mt-3 mx-2">
                    Start a Project
                  </Button>
                </Link>
                <Link href="/donate" passHref>
                  <Button color="success" size="lg" className="mt-3 mx-2">
                    Donate
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </div>
  );
};

export default WhyDonate;
