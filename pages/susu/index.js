import React from 'react';
import Head from 'next/head';
import { Col, Container, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';

const circleSteps = [
  ['01', 'Bring your circle together', 'Create a trusted group of family, friends, a community organization, or another shared network that wants to build a savings habit together.'],
  ['02', 'Set a shared rhythm', 'Agree on contribution amounts and a rotation schedule that works for the group, making the goal and each member’s turn visible.'],
  ['03', 'Save, support, and move forward', 'Each contribution helps the next person in the circle while also keeping every member accountable to their own savings commitment.'],
];

const values = [
  ['Accountability through community', 'Saving can feel difficult alone. A shared circle gives every member a reason to stay consistent and a group that understands the goal.'],
  ['A tradition, made easier with technology', 'SuSu brings a long-standing community savings practice into a more organized digital experience, with clearer coordination and shared visibility.'],
  ['Financial literacy in practice', 'The product is designed to make saving feel concrete and participatory—especially for groups learning how to build stronger financial habits together.'],
  ['Built for trusted groups', 'SuSu is intended for small groups, families, churches, community programs, social groups, and nonprofit partners that want to strengthen saving habits together.'],
];

export default function SuSuPage() {
  return (
    <>
      <Head>
        <title>SuSu | Community savings circles</title>
        <meta name="description" content="SuSu is a modern, community-led way for trusted groups to build saving habits together through rotating savings circles." />
      </Head>

      <BaseLayout>
        <section className="onyx-hero onyx-reviews-hero">
          <Container>
            <p className="onyx-lab-eyebrow">SuSu / A time-honored community savings tradition</p>
            <h1 className="onyx-hero-title">An old tradition. A modern circle.</h1>
            <p className="onyx-hero-copy">SuSu brings the rotating savings circle into a more organized digital experience—a way for trusted groups to save together, support one another, and work toward real goals as a community.</p>
          </Container>
        </section>

        <section className="onyx-muted-section">
          <Container className="onyx-reviews-section">
            <div className="onyx-reviews-heading">
              <p className="onyx-lab-eyebrow">Why saving structure matters</p>
              <h2>A time-honored practice meets a modern savings challenge.</h2>
            </div>
            <Row className="g-4">
              <Col md="4"><article className="onyx-review-card h-100"><p>63%</p><h3>Could cover a $400 expense with cash</h3><span>In the Federal Reserve’s 2024 survey, 63% of adults said they would cover a $400 emergency expense using cash or its equivalent.</span></article></Col>
              <Col md="4"><article className="onyx-review-card h-100"><p>55%</p><h3>Had three months of emergency savings</h3><span>Just over half of adults reported having enough emergency or rainy-day savings to cover three months of expenses.</span></article></Col>
              <Col md="4"><article className="onyx-review-card h-100"><p>30%</p><h3>Could not cover three months by any means</h3><span>Thirty percent said they could not cover three months of expenses through savings, borrowing, or selling assets after a loss of income.</span></article></Col>
            </Row>
            <p className="onyx-data-source">Source: Federal Reserve Board, <em>Economic Well-Being of U.S. Households in 2024</em>, published 2025. These figures provide context for the savings challenge; SuSu does not guarantee financial outcomes.</p>
          </Container>
        </section>

        <Container className="onyx-reviews-section">
          <Row className="g-5 align-items-start">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">What is a SuSu?</p>
              <h2>A shared way to save, built on trust and follow-through.</h2>
            </Col>
            <Col lg="8">
              <p className="onyx-reviews-lead">A SuSu is a rotating savings circle: a practice used in communities for generations to make saving a shared responsibility rather than a solitary task.</p>
              <p className="mb-0">The idea for this product grew from seeing how difficult it can be to keep a consistent savings habit—especially when typical saving tools can feel passive or disconnected from community. In a SuSu circle, members contribute on a schedule and take turns receiving the pooled contribution, combining personal progress with the power of helping someone else reach their moment.</p>
            </Col>
          </Row>
        </Container>

        <section className="onyx-muted-section">
          <Container className="onyx-reviews-section">
            <div className="onyx-reviews-heading">
              <p className="onyx-lab-eyebrow">How the circle works</p>
              <h2>A community tradition, organized for modern life.</h2>
            </div>
            <Row className="g-4">
              {circleSteps.map(([number, title, copy]) => (
                <Col key={number} md="4">
                  <article className="onyx-review-card h-100">
                    <p>{number}</p>
                    <h3>{title}</h3>
                    <span>{copy}</span>
                  </article>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <Container className="onyx-reviews-section">
          <Row className="g-5">
            <Col lg="4">
              <p className="onyx-lab-eyebrow">Tradition meets technology</p>
              <h2>A different way to save, rooted in tradition.</h2>
            </Col>
            <Col lg="8">
              <Row className="g-4">
                {values.map(([title, copy]) => (
                  <Col key={title} md="6">
                    <article className="onyx-review-capability h-100">
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </article>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>

        <section className="onyx-reviews-sms">
          <Container>
            <Row className="g-5 align-items-center">
              <Col lg="9">
                <p className="onyx-lab-eyebrow">Built for communities</p>
                <h2>Bringing a trusted tradition into the next generation.</h2>
                <p>SuSu is being developed with community groups, families, churches, social organizations, and nonprofit partners in mind. Technology and AI can help make coordination, reminders, and program learning easier—while the heart of the experience stays human: people working together toward stronger financial habits.</p>
              </Col>
            </Row>
          </Container>
        </section>
      </BaseLayout>
    </>
  );
}
