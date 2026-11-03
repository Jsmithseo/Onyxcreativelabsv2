import React from 'react';
import { Container, Row, Col, Button, Card, CardBody } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

const method = [
  {
    number: '01',
    title: 'Listen',
    copy: 'Start close to the people who matter: customers, prospects, operators, and owners. Their questions and objections tell us where the real problem lives.'
  },
  {
    number: '02',
    title: 'Test',
    copy: 'Put messaging, positioning, outreach, and offers into the market. We look for signals that show what is worth building and what needs a better angle.'
  },
  {
    number: '03',
    title: 'Build',
    copy: 'Turn what proves useful into practical services, systems, and products that make a business easier to find, understand, and choose.'
  },
  {
    number: '04',
    title: 'Improve',
    copy: 'Keep learning from the response. We use outcomes and human feedback to make the next decision clearer and the work more effective.'
  }
];

const expressions = [
  {
    title: '90-Day Pilot',
    copy: 'Market research, outreach, and business-development testing designed to expose demand and create a clearer path forward.',
    href: '/90-day-pilot'
  },
  {
    title: 'Content Marketing',
    copy: 'Story-led content that helps people understand the purpose, perspective, and value behind what a business offers.',
    href: '/content-marketing'
  },
  {
    title: 'Growth Plans',
    copy: 'A connected way to turn market insight into focused next moves, stronger messaging, and better execution.',
    href: '/growth-plan'
  },
  {
    title: 'Onyx Reviews',
    copy: 'A practical reputation workflow that helps completed work become public proof and useful customer feedback.',
    href: '/reviews'
  }
];

const signals = [
  {
    number: '01',
    label: 'Market evidence',
    copy: 'Live outreach, buying signals, and behavior—not assumptions.'
  },
  {
    number: '02',
    label: 'Human feedback',
    copy: 'What people actually say when they see the offer or use the product.'
  },
  {
    number: '03',
    label: 'Technical execution',
    copy: 'Systems and content that make the insight usable in the real world.'
  }
];

export default function OurStoryPage() {
  return (
    <BaseLayout>
      <section className="onyx-story-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Onyx Creative Labs / Market Lab</p>
          <h1>Built in the market. Designed to move business forward.</h1>
          <p className="onyx-story-hero-copy">
            Onyx Creative Labs turns real market signals, human feedback, and hands-on execution into practical
            products that help small businesses create demand and make stronger decisions.
          </p>
          <div className="onyx-story-hero-actions">
            <Link href="/contact" passHref>
              <Button className="onyx-lab-cta" size="lg">Bring Us the Problem</Button>
            </Link>
            <span>Research · Build · Iterate</span>
          </div>
        </Container>
      </section>

      <section className="onyx-story-founder">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="5">
              <p className="onyx-lab-eyebrow">A founder&apos;s perspective</p>
              <h2>From the sales floor to the source code.</h2>
              <p>
                Onyx is shaped by years spent directly in the market: selling, marketing, listening to customers,
                and seeing what makes people say yes, hesitate, or walk away.
              </p>
              <p className="mb-0">
                That experience sits alongside a lifelong relationship with technology and software, beginning with
                coding at twelve years old. It is the mix that makes Onyx different: technical enough to build the
                system and close enough to the conversation to know why it needs to exist.
              </p>
            </Col>
            <Col lg="7">
              <aside className="onyx-story-signal-card">
                <div className="onyx-story-signal-card-header">
                  <span>Field note</span>
                  <strong>How an Onyx idea gets its shape</strong>
                </div>
                {signals.map((signal) => (
                  <div className="onyx-story-signal-item" key={signal.number}>
                    <span>{signal.number}</span>
                    <div>
                      <strong>{signal.label}</strong>
                      <p>{signal.copy}</p>
                    </div>
                  </div>
                ))}
                <div className="onyx-story-signal-result">
                  <span>Result</span>
                  <p>Practical products and services built around what the market is already telling us.</p>
                </div>
              </aside>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-story-gap">
        <Container>
          <Row className="g-5 align-items-center">
            <Col lg="7">
              <p className="onyx-lab-eyebrow">The small-business gap</p>
              <h2>Small businesses deserve product-level thinking.</h2>
              <p className="mb-0">
                Most owners are asked to wear every hat without an in-house research team, senior growth operator,
                creative department, and technical builder behind them. Onyx brings that kind of insight and
                execution into practical reach: focused enough to solve the problem in front of you and grounded
                enough to work in the real world.
              </p>
            </Col>
            <Col lg="5">
              <div className="onyx-story-quote">
                <p className="onyx-lab-eyebrow">Our north star</p>
                <h3>Make the next decision clearer.</h3>
                <p>
                  Help owners put more opportunity on the books by making demand, customer feedback, and execution
                  more deliberate.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-story-loop">
        <Container>
          <div className="text-center mb-5">
            <p className="onyx-lab-eyebrow mb-3">The Onyx loop</p>
            <h2>Research the market. Build what moves it.</h2>
            <p className="onyx-section-copy mt-3">
              We do not build from a whiteboard alone. The work starts with real people and stays accountable to
              the response it earns.
            </p>
          </div>
          <Row className="g-4">
            {method.map((step) => (
              <Col md="6" lg="3" key={step.number}>
                <article className="onyx-story-loop-step h-100">
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="onyx-story-offerings">
        <Container>
          <div className="mb-5">
            <p className="onyx-lab-eyebrow">What that creates</p>
            <h2>One way of working. Different ways to use it.</h2>
            <p className="onyx-lab-index-copy">
              Every Onyx offering is an expression of the same approach: find the signal, make the idea clearer,
              and build the next move around what the market is telling us.
            </p>
          </div>
          <Row className="g-4">
            {expressions.map((item, index) => (
              <Col md="6" key={item.title}>
                <Card className="onyx-story-offering-card h-100">
                  <CardBody className="p-4 d-flex flex-column">
                    <p className="onyx-lab-eyebrow mb-3">0{index + 1} / Onyx offering</p>
                    <h3>{item.title}</h3>
                    <p className="mb-4">{item.copy}</p>
                    <Link href={item.href} className="onyx-lab-card-link mt-auto">
                      Explore the work <span>→</span>
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="onyx-story-closing">
        <Container>
          <p className="onyx-lab-eyebrow">The reason we do it</p>
          <h2>More signal. Better execution. More opportunity.</h2>
          <p>
            Onyx exists to help business owners turn lived market experience into practical momentum—without
            requiring them to build a full internal growth department first.
          </p>
          <Link href="/contact" passHref>
            <Button className="onyx-lab-cta" size="lg">Start a Conversation</Button>
          </Link>
        </Container>
      </section>
    </BaseLayout>
  );
}
