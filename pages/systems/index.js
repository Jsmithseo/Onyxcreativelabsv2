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

export default function Planning() {
  return (
    <BaseLayout>
      <div className="jumbtron playbook">
        <center>
          <img
            src="/systems.png" // Replace with your image path
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
                    the importance of well-structured systems and processes
                    cannot be overstated. These foundations enable organizations
                    to achieve their missions while maintaining accountability,
                    efficiency, and compliance with various regulations and
                    standards.
                  </p>
                  <h3>Section 1: Designing Your Systems</h3>
                  <span className="callouttext2">
                    Assessing Organizational Needs
                  </span>
                  <ul>
                    <li>Conducting Needs Analysis</li>
                    <li>Identifying Stakeholders and Processes</li>
                    <li>Setting Up Priorities and Goals</li>
                  </ul>
                  <span className="callouttext2">Building the Framework</span>
                  <ul>
                    <li>Choosing the Right Tools and Software</li>
                    <li>Developing Standard Operating Procedures (SOPs)</li>
                    <li>Creating Documentation and Manuals</li>
                  </ul>
                  <h3>Section 2: Key Non-Profit Systems to Implement</h3>
                  <span className="callouttext2">
                    Financial Management System
                  </span>
                  <ul>
                    <li>Budgeting and Forecasting</li>
                    <li>Accounting Procedures</li>
                    <li>Grant and Donation Management</li>
                  </ul>
                  <span className="callouttext2">Donor Management System</span>
                  <ul>
                    <li>Tracking and Engaging Donors</li>
                    <li>Campaign Management</li>
                    <li>Donor Appreciation and Retention Strategies</li>
                  </ul>
                  <span className="callouttext2">
                    Volunteer Management System
                  </span>
                  <ul>
                    <li>Recruitment and Onboarding</li>
                    <li>Scheduling and Coordination</li>
                    <li>Tracking Contributions and Impact</li>
                  </ul>

                  <span className="callouttext2">
                    Program Management System
                  </span>
                  <ul>
                    <li>Planning and Implementation Framework</li>
                    <li>Monitoring and Evaluation Techniques</li>
                    <li>Reporting and Impact Assessment</li>
                  </ul>
                  <h3>Section 3: Ensuring Effective Processes</h3>
                  <span className="callouttext2">Process Optimization</span>
                  <ul>
                    <li>Streamlining for Efficiency</li>
                    <li>Automating Repetitive Tasks</li>
                    <li>Continuous Improvement Strategies</li>
                  </ul>
                  <span className="callouttext2">Change Management</span>
                  <ul>
                    <li>Introducing New Processes</li>
                    <li>Training and Development</li>
                    <li>Dealing with Resistance</li>
                  </ul>
                  <h3>Section 4: Monitoring and Evaluation</h3>
                  <span className="callouttext2">
                    Setting Up Key Performance Indicators (KPIs)
                  </span>
                  <ul>
                    <li>Identifying Relevant Metrics</li>
                    <li>Tools for Tracking and Analysis</li>
                  </ul>
                  <span className="callouttext2">Feedback Loops</span>
                  <ul>
                    <li>Creating Channels for Feedback</li>
                    <li>Incorporating Feedback into Improvement Plans</li>
                  </ul>
                  <h3>Section 5: Technology Integration</h3>
                  <span className="callouttext2">Leveraging Technology</span>
                  <ul>
                    <li>Software Solutions for Non-Profits</li>
                    <li>Integrating Systems for Seamless Operations</li>
                    <li>Data Security and Compliance</li>
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
