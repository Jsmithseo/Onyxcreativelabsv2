import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

const MainStyle = {
  overflowX: 'hidden',
};

const copyStyle = {
  fontSize: '22px',
  fontFamily: 'inherit',
  textAlign: 'center',
};

export default function Security() {
  return (
    <BaseLayout>
      <div className="jumbtron playbook">
        <center>
          <img
            src="/security.png" // Replace with your image path
            alt="Image"
            className="img-fluid playbook"
          />
        </center>
      </div>
      <br></br>
      <br></br>
      <div className="container about">
        <Row>
          {/* <Col md="6">
            <img
              src="/headshot.png" // Replace with your image path
              alt="Image"
              className="img-fluid"
            />
          </Col> */}
          <Container className="planningcontainer">
            <Col md="12">
              <div className="bio-content">
                <center>
                  <p>
                    information and physical safety are paramount, non-profit
                    organizations must prioritize security. With limited
                    resources and often handling sensitive data, non-profits are
                    uniquely vulnerable to security risks, which makes robust
                    security measures an essential aspect of their operations.
                  </p>
                  <h3>Section 1: Security Landscape for Non-Profits</h3>
                  <span className="callouttext2">
                    The Unique Vulnerabilities of Non-Profits
                  </span>
                  <ul>
                    <li>Cyber Threats: The Risks of Data Breaches</li>
                    <li>Physical Security: Protecting People and Assets</li>
                    <li>
                      Compliance: Understanding Legal and Ethical Obligations
                    </li>
                  </ul>
                  <h3>Section 2: Cyber Security for Non-Profits</h3>
                  <span className="callouttext2">Securing Sensitive Data</span>
                  <ul>
                    <li>Importance of Data Encryption</li>
                    <li>Best Practices for Data Storage and Management</li>
                    <li>
                      Risk Management: Assessing and Mitigating Cyber Risks
                    </li>
                  </ul>
                  <span className="callouttext2">
                    Crafting a Cyber Security Policy
                  </span>
                  <ul>
                    <li>Developing a Comprehensive Cyber Security Framework</li>
                    <li>Training Employees and Volunteers on Cyber Hygiene</li>
                    <li>Responding to Security Incidents</li>
                  </ul>
                  <span className="callouttext2">Tools and Resources</span>
                  <ul>
                    <li>Affordable Cyber Security Tools for Non-Profits</li>
                    <li>Utilizing Cloud Services Securely</li>
                    <li>Partnerships for Enhanced Cyber Protection</li>
                  </ul>

                  <h3>Section 3: Physical Security Measures</h3>
                  <span className="callouttext2">
                    Safeguarding Non-Profit Facilities
                  </span>
                  <ul>
                    <li>Access Control Systems and Protocols</li>
                    <li>Surveillance and Monitoring Solutions</li>
                    <li>Planning for Emergencies and Evacuations</li>
                  </ul>
                  <span className="callouttext2">
                    Securing Events and Gatherings
                  </span>
                  <ul>
                    <li>Risk Assessment for Non-Profit Events</li>
                    <li>Collaboration with Local Law Enforcement</li>
                    <li>Crowd Management and Safety Procedures</li>
                  </ul>
                  <h3>Section 4: Data Privacy and Compliance</h3>
                  <span className="callouttext2">
                    Understanding Data Protection Laws
                  </span>
                  <ul>
                    <li>GDPR, CCPA, and Other Relevant Regulations</li>
                    <li>The Role of a Data Protection Officer</li>
                  </ul>
                  <span className="callouttext2">
                    Implementing Compliance Measures
                  </span>
                  <ul>
                    <li>Conducting Privacy Impact Assessments</li>
                    <li>Creating a Culture of Privacy and Compliance</li>
                    <li>
                      Handling Donor and Beneficiary Information with Care
                    </li>
                  </ul>
                  <h3>Section 5: Building a Security-Minded Culture</h3>
                  <span className="callouttext2">Training and Awareness</span>
                  <ul>
                    <li>Regular Security Training Sessions</li>
                    <li>Creating Security Ambassadors</li>
                    <li>
                      Encouraging a Speak-Up Culture for Reporting Anomalies
                    </li>
                  </ul>
                  <span className="callouttext2">Continual Improvement</span>
                  <ul>
                    <li>Regular Security Audits and Assessments</li>
                    <li>Staying Updated on Security Trends</li>
                    <li>Learning from Past Security Incidents</li>
                  </ul>
                </center>
              </div>
            </Col>
          </Container>
        </Row>
      </div>
      <div>
        {/* <Container>
        <HubSpotContactForm
      id="HubSpotContactForm"

                />
        </Container> */}
      </div>
    </BaseLayout>
  );
}
