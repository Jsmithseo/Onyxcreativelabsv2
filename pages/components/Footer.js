import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md="4">
            <h5>About Onyx Creative Labs</h5>
            <p>
            Onyx Creative Labs is a full-service digital marketing and development agency focused on delivering customized solutions for businesses of all sizes. We specialize in web development, SEO, content marketing, and more.
            </p>
          </Col>
          <Col md="4">
            <h5>Social</h5>
            <ul className="list-unstyled">
              <li><a href="https://www.linkedin.com/in/jeremy-smith-120115266/" className="text-white">Linkedin</a></li>
              <li><a href="/" className="text-white">Facebook</a></li>
              <li><a href="https://www.instagram.com/onyxcreativelabs/?locale=de&hl=am-et" className="text-white">Instagram</a></li>
            </ul>
          </Col>
          <Col md="4">
            <h5>Contact Us</h5>
            <p>
              Onyx Creative Labs Inc<br />
              Phone: 510-925-7174<br />
              Email: Jeremy@onyxcreativelabs.com
            </p>
            <p>
              Onyx Creative Labs is a 501(c)(3) nonprofit organization.<br />
              Tax ID: 99-4403186
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-4">
            <p>&copy; {new Date().getFullYear()} Onyx Creative Labs. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;