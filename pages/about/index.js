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

export default function OurStoryPage() {
  return (
    <BaseLayout>
      <section className="onyx-lab-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Onyx Creative Labs / Market Lab</p>
          <h1>Built in the market. Designed to move business forward.</h1>
          <p>
            Onyx Creative Labs turns real market signals, human feedback, and hands-on execution into practical
            products that help small businesses create demand and make stronger decisions.
          </p>
          <Link href="/contact" passHref>
            <Button className="onyx-lab-cta" size="lg">Bring Us the Problem</Button>
          </Link>
        </Container>
      </section>

      <section className="onyx-case-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="5">
              <p className="onyx-lab-eyebrow">A founder&apos;s perspective</p>
              <h2>From the sales floor to the source code.</h2>
            </Col>
            <Col lg="7">
              <p>
                Onyx is shaped by years spent directly in the market: selling, marketing, listening to customers,
                and seeing what makes people say yes, hesitate, or walk away. That experience sits alongside a
                lifelong relationship with technology and software, beginning with coding at twelve years old.
              </p>
              <p className="mb-0">
                The result is a point of view that connects the technical side of a product with the human side of
                a decision. We can look at the system, hear the objection in a live conversation, and turn both
                into a more useful next move for the business.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-muted-section">
        <Container className="py-5">
          <Row className="g-5 align-items-center">
            <Col lg="7">
              <p className="onyx-lab-eyebrow">The small-business gap</p>
              <h2 className="onyx-section-heading">Small businesses deserve product-level thinking.</h2>
              <p className="mb-0 text-muted">
                Most owners are asked to wear every hat without an in-house research team, senior growth operator,
                creative department, and technical builder behind them. Onyx brings that kind of insight and
                execution into practical reach: focused enough to solve the problem in front of you and grounded
                enough to work in the real world.
              </p>
            </Col>
            <Col lg="5">
              <div className="onyx-case-learning mt-0">
                <h3>Our north star</h3>
                <p className="mb-0">
                  Help owners put more opportunity on the books by making demand, customer feedback, and execution
                  more deliberate.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-case-section">
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
                <article className="onyx-case-method h-100">
                  <p>{step.number}</p>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="onyx-muted-section">
        <Container className="py-5">
          <div className="mb-4">
            <p className="onyx-lab-eyebrow">What that creates</p>
            <h2 className="onyx-section-heading">One way of working. Different ways to use it.</h2>
            <p className="onyx-lab-index-copy">
              Every Onyx offering is an expression of the same approach: find the signal, make the idea clearer,
              and build the next move around what the market is telling us.
            </p>
          </div>
          <Row className="g-4">
            {expressions.map((item, index) => (
              <Col md="6" key={item.title}>
                <Card className="onyx-lab-card h-100">
                  <CardBody className="p-4 d-flex flex-column">
                    <p className="onyx-lab-eyebrow mb-3">0{index + 1} / Onyx offering</p>
                    <h3>{item.title}</h3>
                    <p className="text-muted mb-4">{item.copy}</p>
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

      <section className="onyx-lab-hero" style={{ padding: '4.75rem 0' }}>
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
