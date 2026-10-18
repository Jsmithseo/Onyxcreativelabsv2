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

export default function Tools() {
  return (
    <BaseLayout>
      <div className="jumbtron playbook">
        <center>
          <img
            src="/tools.png" // Replace with your image path
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
                <div>
                  <p>
                    <b>Slack: </b>Company chatroom and watercooler. Make sure
                    you install this on your phone and setup the alert levels to
                    the appropriate levels.{' '}
                  </p>
                </div>
                <div>
                  <p>
                    <b>Google Drive:</b> Most spreadsheets, word docs, and
                    presentations are created using Google Docs because its very
                    easy to share and collaborate with others on the team.{' '}
                  </p>
                </div>
                <div>
                  <p>
                    <b>Asana:</b> Project management tool the development team
                    uses to fix bugs, build features, and work on other chores.
                  </p>
                </div>
                <div>
                  <p>
                    <b>We Are For Good:</b> Open-source learning platform used
                    by many non-profits for education programs.
                  </p>
                </div>
                <div>
                  <p>
                    <b>GitHub:</b> Code versioning and collaboration tool the
                    dev team uses to work on our web apps, mobile apps, desktop
                    apps, and content.{' '}
                  </p>
                </div>
                <div>
                  <p>
                    {' '}
                    <b>Dropbox:</b> File sharing service that works over the LAN
                    and the web.{' '}
                  </p>
                </div>
                <div>
                  <p>
                    <b>Mailchimp:</b> Email marketing platform to manage mailing
                    lists and automate email campaigns.
                  </p>
                </div>
                <div>
                  <p>
                    <b>QuickBooks Nonprofit:</b> Accounting software with
                    features specific to non-profit financial management.
                  </p>
                </div>
                <div>
                  <p>
                    <b>Eventbrite:</b> A platform for creating and managing
                    event tickets and registration.
                  </p>
                </div>
                <div>
                  <p>
                    <b>Grants.gov Workspace:</b> A government resource for
                    finding and applying for federal grants.
                  </p>
                </div>
                <div>
                  <p>
                    <b>LegalZoom:</b> Provides access to various legal forms and
                    resources.
                  </p>
                </div>
                <div>
                  <p>
                    <b>Harbor Compliance:</b>Helps with non-profit formation,
                    compliance, and filing.
                  </p>
                </div>
                <div>
                  <p>
                    <b>SAS for Nonprofits:</b> Offers analytics to help
                    non-profits measure and report on their impact.
                  </p>
                </div>
                <div>
                  <p>
                    <b>LastPass:</b> Password management tool to maintain strong
                    and secure passwords.
                  </p>
                </div>
                <div>
                  <p>
                    <b>Bloomerang:</b> A donor management system focused on
                    donor retention and engagement.
                  </p>
                </div>
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
