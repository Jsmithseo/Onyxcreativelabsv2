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

export default function Work() {
  return (
    <BaseLayout>
      <div className="jumbtron playbook">
        <center>
          <img
            src="/work.png" // Replace with your image path
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
                    n non-profit organizations, where resources are often
                    limited and the passion for the mission is high, cultivating
                    a work session culture that is both effective and respectful
                    of participants' time is critical. Work sessions are key
                    opportunities to collaborate, strategize, and drive
                    progress.
                  </p>
                  <h3>Section 1: Understanding Work Sessions</h3>
                  <ul>
                    <li>Definition and Purpose of Work Sessions</li>
                    <li>
                      The Role of Work Sessions in Advancing Non-Profit Goals
                    </li>
                    <li>
                      Differentiating Between Work Sessions and Regular Meetings
                    </li>
                  </ul>
                  <h3>Section 2: Preparing for Work Sessions</h3>

                  <ul>
                    <li>Setting Clear Objectives</li>
                    <li>Preparing Agendas with Input from All Participants</li>
                    <li>
                      Allocating Roles: Facilitator, Note-Taker, Time-Keeper
                    </li>
                  </ul>

                  <h3>Section 3: Creating an Inclusive Environment</h3>
                  <ul>
                    <li>Ensuring Diverse Voices Are Heard</li>
                    <li>Building a Culture of Open Communication</li>
                    <li>Encouraging Constructive Feedback and Debate</li>
                  </ul>

                  <h3>Section 4: Effective Time Management</h3>

                  <ul>
                    <li>Adhering to a Strict Start and End Time</li>
                    <li>Managing the Pace of the Session</li>
                    <li>Using Time Boxing for Different Discussion Points</li>
                  </ul>

                  <h3>
                    Section 5: Tools and Techniques for Productive Work Sessions
                  </h3>

                  <ul>
                    <li>Leveraging Technology for Better Collaboration</li>
                    <li>Implementing Brainstorming and Ideation Techniques</li>
                    <li>Utilizing Breakout Sessions for Focused Discussions</li>
                  </ul>
                  <h3>Section 6: Follow-Through and Accountability</h3>
                  <ul>
                    <li>
                      Summarizing Action Items and Assigning Responsibility
                    </li>
                    <li>Setting Deadlines and Expectations for Follow-Up</li>
                    <li>Tracking Progress and Maintaining Momentum</li>
                  </ul>
                  <h3>Section 7: Cultivating Continuous Improvement</h3>
                  <ul>
                    <li>
                      Regularly Soliciting Feedback on Work Session
                      Effectiveness
                    </li>
                    <li>Adapting and Refining Practices Over Time</li>
                    <li>Celebrating Successes and Learning from Challenges</li>
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
