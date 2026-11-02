import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';

const launchCapabilities = [
  {
    number: '01',
    title: 'Inbound appointment setting',
    copy: 'Meet inbound interest quickly, capture the context behind the request, and guide qualified prospects toward the right next step.',
  },
  {
    number: '02',
    title: 'Human-ready handoff',
    copy: 'Give the human closer the conversation context, stated needs, and appointment details—so the next conversation starts informed.',
  },
  {
    number: '03',
    title: 'BDR support',
    copy: 'Give business-development reps a repeatable way to organize inquiries, prepare follow-up, and keep the human touch where it matters.',
  },
];

const principles = [
  ['Built from real closing craft', 'The research program is being shaped by more than two decades of human closing experience: listening for what buyers mean, what they still need, and when a person should take the conversation.'],
  ['AI works with people', 'The goal is not a black-box replacement for the people who build trust. It is a better division of work: AI handles the repeatable first steps, while experienced people guide the moments that need judgment.'],
  ['Learn in the market', 'Every pilot is designed to improve the workflow. We study the questions, handoffs, and outcomes that make an inbound sales conversation clearer and more useful.'],
];

const steps = [
  ['Share the workflow', 'Tell us how inbound interest reaches your team today and where conversations slow down.'],
  ['Shape the handoff', 'We map the questions, qualification signals, and context a human closer needs before a meeting.'],
  ['Pilot with oversight', 'Start with an inbound, human-in-the-loop workflow and learn from real conversations before expanding the scope.'],
];

const initialForm = {
  name: '',
  email: '',
  company: '',
  inboundVolume: '',
  message: '',
};

export default function AiCloserPage() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required.';
    if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch(
        'https://api.hsforms.com/submissions/v3/integration/submit/46783071/79f2cfd0-1beb-4264-9f0f-d9b7d728cf95',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: formData.name },
              { name: 'email', value: formData.email },
              { name: 'company', value: formData.company },
              { name: 'message', value: `AI Closer early access | Inbound volume: ${formData.inboundVolume || 'Not specified'} | ${formData.message}` },
              { name: 'interest', value: 'AI Closer Early Access' },
            ],
          }),
        }
      );

      if (!response.ok) throw new Error('Submission failed.');

      setStatus('success');
      setErrors({});
      setFormData(initialForm);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <BaseLayout>
      <section className="onyx-lab-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Early access / Inbound AI appointment setter</p>
          <h1>Turn inbound interest into meetings worth taking.</h1>
          <p>
            Onyx AI Closer is an early-access, human-informed appointment-setting
            agent built to meet inbound inquiries, understand the context, and
            prepare the right handoff to a real closer.
          </p>
          <div className="onyx-hero-actions" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <Button className="onyx-lab-cta" href="#early-access">
              Join Early Access
            </Button>
            <Button outline color="light" href="#workflow">
              Explore the Workflow
            </Button>
          </div>
          <div className="mt-4 d-flex flex-wrap justify-content-center gap-2">
            <Badge pill color="light" className="text-dark px-3 py-2">Inbound first</Badge>
            <Badge pill color="light" className="text-dark px-3 py-2">Human in the loop</Badge>
            <Badge pill color="light" className="text-dark px-3 py-2">Built for real closers</Badge>
          </div>
        </Container>
      </section>

      <section className="onyx-content-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg="9" className="text-center">
              <p className="onyx-products-eyebrow">The idea</p>
              <h2 className="onyx-section-heading">Closing is human. The workflow around it can be smarter.</h2>
              <p className="onyx-section-copy">
                The first version focuses on inbound appointment setting. It gives
                prospects a responsive first conversation, gives your BDRs more
                structure, and gives the human closer the context needed to move
                forward with confidence.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-reviews-sms">
        <Container>
          <div className="text-center mb-5">
            <p className="onyx-products-eyebrow">Launch scope</p>
            <h2>What early access is built to do.</h2>
          </div>
          <Row className="g-4">
            {launchCapabilities.map((capability) => (
              <Col md="4" key={capability.number}>
                <article className="onyx-review-card h-100">
                  <p>{capability.number}</p>
                  <h3>{capability.title}</h3>
                  <span>{capability.copy}</span>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="onyx-content-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="5">
              <p className="onyx-products-eyebrow">The Onyx difference</p>
              <h2 className="onyx-section-heading">Built from the behaviors behind a strong close.</h2>
              <p className="mb-0 text-muted">
                The agent is not positioned as a replacement for seasoned sales
                judgment. It is being developed as a disciplined first layer:
                responsive, consistent, and designed to make the human closer
                more prepared for the conversation that matters.
              </p>
            </Col>
            <Col lg="7">
              <Row className="g-3">
                {principles.map(([title, copy]) => (
                  <Col md="6" key={title}>
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
      </section>

      <section id="workflow" className="onyx-muted-section">
        <Container className="onyx-pilot-section">
          <div className="text-center mb-5">
            <p className="onyx-products-eyebrow">Early-access workflow</p>
            <h2 className="onyx-section-heading">Start with the conversation you already earn.</h2>
            <p className="onyx-section-copy">
              We begin with inbound demand and build toward a stronger, more
              informed sales handoff—without removing human accountability.
            </p>
          </div>
          <Row className="g-4">
            {steps.map(([title, copy], index) => (
              <Col md="4" key={title}>
                <article className="onyx-process-step h-100">
                  <p className="onyx-products-eyebrow mb-3">Step {index + 1}</p>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="early-access" className="onyx-content-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg="8">
              <div className="onyx-review-capability">
                <div className="text-center mb-4">
                  <p className="onyx-products-eyebrow">Join early access</p>
                  <h2 className="onyx-section-heading">Bring your inbound sales workflow into the lab.</h2>
                  <p className="text-muted mb-0">
                    Tell us where inbound conversations are getting stuck. We will
                    follow up about fit, scope, and a human-in-the-loop pilot.
                  </p>
                </div>

                {status === 'success' && (
                  <Alert color="success">
                    You are on the early-access list. We will be in touch about the next step.
                  </Alert>
                )}
                {status === 'error' && (
                  <Alert color="danger">
                    We could not submit that request. Please try again or use the contact page.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="ai-closer-name">Full name *</Label>
                        <Input
                          id="ai-closer-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          invalid={Boolean(errors.name)}
                        />
                        <FormFeedback>{errors.name}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="ai-closer-email">Work email *</Label>
                        <Input
                          id="ai-closer-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          invalid={Boolean(errors.email)}
                        />
                        <FormFeedback>{errors.email}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="ai-closer-company">Company</Label>
                        <Input
                          id="ai-closer-company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="ai-closer-volume">Monthly inbound conversations</Label>
                        <Input
                          id="ai-closer-volume"
                          type="select"
                          name="inboundVolume"
                          value={formData.inboundVolume}
                          onChange={handleChange}
                        >
                          <option value="">Select one</option>
                          <option value="1-25">1–25</option>
                          <option value="26-100">26–100</option>
                          <option value="101-500">101–500</option>
                          <option value="500+">500+</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="ai-closer-message">What should the first handoff improve?</Label>
                    <Input
                      id="ai-closer-message"
                      type="textarea"
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="For example: faster response time, better qualification, or more context for closers."
                    />
                  </FormGroup>
                  <Button color="primary" type="submit" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Submitting…' : 'Request Early Access'}
                  </Button>
                  <p className="text-muted small mt-3 mb-0">
                    Please do not submit confidential customer information through this form.
                  </p>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </BaseLayout>
  );
}
