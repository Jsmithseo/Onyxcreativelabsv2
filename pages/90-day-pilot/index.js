import React from 'react';
import Link from 'next/link';
import { Badge, Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';

const pilotTiers = [
  {
    name: 'Focused Validation',
    volume: '4,000',
    label: 'outreach activities each month',
    description: 'For AI teams that need focused market feedback and a clear view of where to refine their offer.',
    features: [
      'Human-led cold calling and tailored warm-email outreach to qualified prospects or partners',
      'Inbound lead follow-up from your existing campaigns',
      'Social network response management',
      'Shared activity dashboard and weekly reporting',
      'Market feedback on pricing, positioning, and requested features',
    ],
  },
  {
    name: 'Expanded Validation',
    volume: '8,000',
    label: 'outreach activities each month',
    description: 'For AI teams that need a broader market test, higher activity volume, and faster learning loops.',
    featured: true,
    features: [
      'Everything in Focused Validation at expanded weekly activity volume',
      'More human-led calls, tailored warm emails, and social-network follow-up',
      'Inbound lead follow-up and response management',
      'Shared dashboard, weekly reporting, and OKR tracking',
      'Deeper market analysis across objections, feature demand, and pricing signals',
    ],
  },
];

const deliverables = [
  ['Cold calling', 'Real people make structured calls that create live product conversations with qualified prospects and partners.'],
  ['Warm outreach', 'Real people use tailored email and social-network response management to keep each conversation moving before and after the call.'],
  ['Inbound follow-up', 'Fast, thoughtful follow-up for the leads your own campaigns generate.'],
  ['Dashboard and reporting', 'A shared view of activity, responses, outcomes, and progress against OKRs.'],
];

const processSteps = [
  ['1. Build the list', 'We can source qualified prospects with a lead-sourcing tool, work from the leads you provide, or use a combination of both.'],
  ['2. Start the conversation', 'Real people make calls in structured calling windows, introduce the product in a thoughtful, non-aggressive way, and use tailored warm email and social-network response management to continue the conversation.'],
  ['3. Create the next step', 'Qualified interest becomes an appointment, product presentation, or sales conversation. This is where your product enters a real buyer’s decision process.'],
  ['4. Capture the evidence', 'A yes can lead to onboarding and user feedback. A no reveals objections, gaps, pricing signals, and feature needs. Either outcome gives the team useful data.'],
];

function PilotTiersSection() {
  return (
    <section className="onyx-muted-section">
      <Container className="onyx-pilot-section onyx-pilot-programs-section">
        <div className="text-center mb-4">
          <h1 className="onyx-section-heading">Choose Your Pilot</h1>
          <p className="onyx-section-copy">
            Stress-test your AI product with disciplined, human-led business development. Each 90-day program puts your product in front of real people, creates live market conversations, and returns the feedback you need to build better.
          </p>
        </div>
        <Row className="justify-content-center g-4">
          {pilotTiers.map((tier) => (
            <Col key={tier.name} lg="5">
              <Card className={`onyx-pilot-card h-100 ${tier.featured ? 'onyx-pilot-card-featured' : ''}`}>
                <CardBody className="d-flex flex-column p-4 p-md-5">
                  {tier.featured && <Badge className="onyx-pilot-badge align-self-start mb-3">Higher-volume pilot</Badge>}
                  <h3>{tier.name}</h3>
                  <div className="onyx-pilot-volume">{tier.volume}</div>
                  <p className="onyx-pilot-volume-label">{tier.label}</p>
                  <p className="text-muted">{tier.description}</p>
                  <ul className="onyx-feature-list">
                    {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <Link href="https://calendly.com/softwaresmitty/discovery">
                    <Button color="primary" block>Schedule Discovery Call</Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        <p className="onyx-pilot-compensation text-center mb-0">
          <strong>Compensation:</strong> Retainer plus commission on overall sales. Your terms are locked for the full 90-day pilot.
        </p>
      </Container>
    </section>
  );
}

export default function NinetyDayPilotPage() {
  return (
    <BaseLayout>
      <PilotTiersSection />

      <Container className="onyx-pilot-section">
        <div className="text-center mb-5">
          <h2 className="onyx-section-heading">More Than a Sales Motion</h2>
          <p className="onyx-section-copy">
            Sales outcomes matter, but they are only one signal. The pilot gives you real-world data about what buyers want, what they will pay for, and what your product needs next.
          </p>
        </div>
        <Row className="g-4">
          {deliverables.map(([title, copy]) => (
            <Col key={title} md="6" lg="3">
              <div className="onyx-deliverable h-100">
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <section className="onyx-pilot-process-section">
        <Container className="onyx-pilot-section">
          <div className="text-center mb-5">
            <h2 className="onyx-section-heading">The Call Starts the Learning Loop</h2>
            <p className="onyx-section-copy">
              Cold calling is not just a volume exercise. It opens the sales, feedback, and engagement cycle that turns real buyer reactions into useful product intelligence.
            </p>
          </div>
          <Row className="g-4">
            {processSteps.map(([step, copy]) => (
              <Col key={step} md="6">
                <div className="onyx-process-step h-100">
                  <h3>{step}</h3>
                  <p>{copy}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Container className="onyx-pilot-section">
        <div className="text-center mb-5">
          <h2 className="onyx-section-heading">Choose How Opportunities Are Handled</h2>
          <p className="onyx-section-copy">We can set the meeting for your team, or stay involved through the presentation and close.</p>
        </div>
        <Row className="justify-content-center g-4">
          <Col md="6" lg="5">
            <div className="onyx-closing-option h-100">
              <h3>Appointment Setting</h3>
              <p>We qualify interest, schedule the sales appointment, share the conversation context, and hand the opportunity to your team to close.</p>
            </div>
          </Col>
          <Col md="6" lg="5">
            <div className="onyx-closing-option h-100">
              <h3>Closing Support</h3>
              <p>We can stay involved through the presentation and closing conversation, helping move qualified prospects forward while documenting what they need to decide.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="onyx-pilot-section text-center">
        <h2 className="onyx-section-heading">What You Leave With</h2>
        <p className="onyx-section-copy">
          A clearer understanding of your market, the feedback behind it, and a practical direction for your product. You will see the objections, pricing questions, feature requests, and engagement patterns that show what to improve next.
        </p>
      </Container>
    </BaseLayout>
  );
}
