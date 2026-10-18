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

export default function Meetings() {
  return (
    <BaseLayout>
      <div className="jumbtron playbook">
        <center>
          <img
            src="/meetings.png" // Replace with your image path
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
                    Adopting the Scrum framework can help non-profit
                    organizations enhance collaboration, increase transparency,
                    and improve the delivery of projects. Central to Scrum are
                    regular and structured meetings that foster communication
                    and facilitate the agile process. Here's how a non-profit
                    organization can set a productive meeting cadence.
                  </p>
                  <h3>Section 1: The Scrum Framework: An Overview</h3>
                  <ul>
                    <li>Scrum Basics: Sprints, Roles, and Artifacts</li>
                    <li>Adapting Scrum to Non-Profit Projects</li>
                    <li>The Importance of Regular and Effective Meetings</li>
                  </ul>
                  <h3>Section 2: Sprint Planning Meeting</h3>
                  <ul>
                    <li>
                      Frequency: At the start of each sprint (typically every
                      2-4 weeks)
                    </li>
                    <li>
                      Participants: Scrum Team (including the Product Owner and
                      Scrum Master)
                    </li>
                    <li>
                      Duration: Proportional to sprint length (e.g., 2 hours for
                      a 2-week sprint)
                    </li>
                  </ul>

                  <h3>Section 3: Daily Scrum</h3>
                  <ul>
                    <li>Frequency: Daily, at a consistent time</li>
                    <li>Participants: Scrum Team members</li>
                    <li>
                      Focus: Quick check-in to synchronize activities and create
                      a plan for the next 24 hours
                    </li>
                    <li>Duration: 15 minutes, strictly time-boxed</li>
                  </ul>
                  <h3>Section 4: Sprint Review</h3>
                  <ul>
                    <li>Frequency: At the end of each sprint</li>
                    <li>
                      Participants: Scrum Team, stakeholders, and optionally,
                      donors or beneficiaries
                    </li>
                    <li>
                      Focus: Present completed work; gather feedback to adjust
                      the backlog
                    </li>
                    <li>Duration: Typically 1 hour for a 2-week sprint</li>
                  </ul>
                  <h3>Section 5: Sprint Retrospective</h3>
                  <ul>
                    <li>
                      Frequency: After the Sprint Review and before the next
                      Sprint Planning
                    </li>
                    <li>Participants: Scrum Team</li>
                    <li>
                      Focus: Reflect on the sprint; identify and plan
                      improvements
                    </li>
                    <li>
                      Duration: Typically 45 minutes to 1 hour for a 2-week
                      sprint
                    </li>
                  </ul>
                  <h3>Section 6: Backlog Refinement (Grooming)</h3>
                  <ul>
                    <li>Frequency: Mid-sprint or as needed</li>
                    <li>
                      Participants: Product Owner, Scrum Master, and relevant
                      Scrum Team members
                    </li>
                    <li>
                      Focus: Review and refine the product backlog for future
                      sprints
                    </li>
                    <li>
                      Duration: No more than 10% of the team's capacity during
                      the sprint
                    </li>
                  </ul>
                  <h3>Section 7: Additional Considerations for Non-Profits</h3>

                  <ul>
                    <li>
                      Aligning Meeting Schedules with Volunteer Availability
                    </li>
                    <li>Remote Meeting Best Practices for Distributed Teams</li>
                    <li>Minimizing Meeting Times While Maximizing Value</li>
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
