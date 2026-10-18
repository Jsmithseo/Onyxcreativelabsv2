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

export default function Playbook() {
  return (
    <BaseLayout>
    
      {/* <div className="jumbtron playbook">
        <center>
          <img
            src="/playbookbanner.png" // Replace with your image path
            alt="Image"
            className="img-fluid playbook"
          />
        </center>
      </div> */}
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
          <Col md="12">
            <div className="bio-content">
              <center>
                <h2>systems and processes foster growth</h2>
              </center>
            </div>
          </Col>
        </Row>
        <center>
          <b></b>
          <Row>
            <Col md="6">
              <h2>Big picture</h2>
              <ul className="ul">
                <Link href="/planning">
                  <span>Planning and Prioritization</span>
                </Link>
                <br></br>
                <Link href="/systems">
                  <span>Systems and Processes</span>
                </Link>
                <br></br>
                <Link href="/security">
                  <span>Security</span>
                </Link>
              </ul>
            </Col>
            <Col md="6">
              <h2>Day to day</h2>
              <ul className="ul">
                <Link href="/meetings">
                  <span>Meetings</span>
                </Link>
                <br></br>
                <Link href="/work">
                  <span>Work session culture</span>
                </Link>
                <br></br>
                <Link href="tools">
                  <span>Tools</span>
                </Link>
              </ul>
            </Col>
          </Row>
        </center>
      </div>
      <div>
        {/* <Container>
        <HubSpotContactForm
      id="HubSpotContactForm"

                />
        </Container> */}
      </div>
      <br></br>
      <br></br>   <br></br>
      <br></br>   <br></br>
      <br></br>   <br></br>
      <br></br>   <br></br>
      <br></br>   <br></br>
      <br></br>   <br></br>
      <br></br>   <br></br>
      <br></br>   <br></br>
      <br></br>
    </BaseLayout>
  );
}
