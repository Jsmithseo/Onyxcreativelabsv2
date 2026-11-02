import React, { useState } from 'react';
import Link from 'next/link';
import BaseLayout from '../components/layouts/BaseLayouts';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';

const OptIn = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consent) {
      setError('Please agree to receive the requested messages before submitting.');
      return;
    }

    setError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          source: 'Feedback opt-in',
          interest: 'Feedback Opt-In',
          details:
            'SMS consent recorded for feedback and review-request messages. No promotional-message consent was requested.',
          pageUri: window.location.href,
          pageName: document.title,
        }),
      });

      if (!response.ok) throw new Error('Lead submission failed');
      setSubmitted(true);
    } catch (submissionError) {
      setError('We could not record that opt-in. Please try again in a moment.');
    }
  };

  return (
    <BaseLayout>
      <Container className="my-5">
        <Row className="mb-4">
          <Col>
            <h1>Feedback Opt-In</h1>
            <p>
              Sign up to receive feedback or review requests from Onyx Creative Labs. We never send promotional messages, and your information is handled with care.
            </p>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col>
            <Card>
              <CardBody>
                <CardTitle tag="h3">Opt-In Form</CardTitle>
                <CardText>
                  Please provide your phone number and agree to receive feedback or review requests via text. Message and data rates may apply. Message frequency may vary.
                </CardText>

                {submitted ? (
                  <Alert color="success">Thanks—your opt-in is queued.</Alert>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    {error && <Alert color="danger">{error}</Alert>}
                    <FormGroup>
                      <Label for="optin-name">Full Name</Label>
                      <Input
                        type="text"
                        id="optin-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="optin-email">Email Address</Label>
                      <Input
                        type="email"
                        id="optin-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="phone">Phone Number</Label>
                      <Input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </FormGroup>
                    <FormGroup check className="mb-3">
                      <Input
                        type="checkbox"
                        id="consent"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <Label for="consent" check>
                        I agree to receive feedback and review request messages from Onyx Creative Labs. Message frequency may vary. Msg & data rates may apply. Reply STOP to unsubscribe. HELP for help. No marketing messages will be sent.
                      </Label>
                    </FormGroup>
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
            <h2>Need More Info?</h2>
            <p>
              Visit our <Link href="/privacy">Privacy Policy</Link> to learn how your data is handled.
            </p>
            <Link href="/contact">
              <Button color="primary" size="lg">
                Contact Us
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
};

export default OptIn;
