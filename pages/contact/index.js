import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert
} from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import { useRouter } from 'next/router';
import { findReviewPlan, REVIEW_STARTUP_FEE, REVIEW_TRIAL_DAYS } from '../../lib/reviewsPricing';
import { trackInquiryConversion } from '../../lib/websiteConversion';
import { INTEREST_OPTIONS, PUBLIC_WEBSITE_HOSTS, REVIEW_INTEREST, inquiryTopic } from '../../lib/websiteInquiryTopics.mjs';

const REVIEW_MESSAGE = 'I’d like to learn how Onyx Reviews can help us earn more customer feedback and grow our reputation.';
const GENERAL_INQUIRY_COPY = {
  heading: 'Let’s talk about your project',
  description: 'Send us your contact details and we’ll email you to discuss how we can help.',
};
const INQUIRY_COPY = {
  reviews: {
    heading: 'Request a review growth call',
    description: 'Share your contact details and we’ll email you to discuss a review plan for your business.',
  },
  'fractional-bdr': {
    heading: 'Talk to us about outbound',
    description: 'We’ll email you to discuss your sales goals and how Onyx can help you reach more qualified prospects.',
  },
  '90-day-pilot': {
    heading: 'Ask about the 90-Day Pilot',
    description: 'Send us your contact details and we’ll email you to discuss your product, target buyers, and pilot options.',
  },
};
function sendInquiryMetric(topic, stage) {
  if (!PUBLIC_WEBSITE_HOSTS.includes(window.location.hostname)) return;
  fetch('/api/website-inquiry-metric', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, stage }),
    credentials: 'omit',
    keepalive: true,
  }).catch(() => {});
}

function buildReviewMessage(plan, trial, locations) {
  const selectedPlan = findReviewPlan(plan);
  const parsedLocations = Number.parseInt(locations, 10);
  const locationText = Number.isInteger(parsedLocations) && parsedLocations > 0
    ? ` for ${parsedLocations} ${parsedLocations === 1 ? 'location' : 'locations'}`
    : '';

  if (!selectedPlan && trial !== String(REVIEW_TRIAL_DAYS) && trial !== 'now') return REVIEW_MESSAGE;

  const priceText = selectedPlan
    ? ` at $${selectedPlan.price} per location per month (please confirm whether the $${REVIEW_STARTUP_FEE} one-time setup fee applies or is waived)`
    : '';
  const trialText = trial === String(REVIEW_TRIAL_DAYS)
    ? ` with a ${REVIEW_TRIAL_DAYS}-day subscription trial (any setup fee is separate)`
    : trial === 'now' ? ' without a subscription trial' : '';
  return `${REVIEW_MESSAGE} I’m interested in the ${selectedPlan?.name || 'Onyx Reviews'} plan${locationText}${priceText}${trialText}.`;
}

export default function ContactFormPage() {
  const router = useRouter();
  const isReviewsInquiry = router.query.product === 'reviews';
  const [serviceId, serviceName] = INTEREST_OPTIONS.find(([id]) => id === router.query.service) || [];
  const selectedInterest = isReviewsInquiry ? REVIEW_INTEREST : serviceName;
  const selectedPlan = typeof router.query.plan === 'string' ? router.query.plan : '';
  const selectedTrial = typeof router.query.trial === 'string' ? router.query.trial : '';
  const selectedLocations = typeof router.query.locations === 'string' ? router.query.locations : '';

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    message: '',
  });
  const [interestOverride, setInterestOverride] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submissionInProgress = useRef(false);
  const measuredForm = useRef({ topic: null, started: false });
  const metricTopic = inquiryTopic(router.query);
  const interest = interestOverride ?? (selectedInterest ? [selectedInterest] : []);
  const reviewPlan = isReviewsInquiry ? findReviewPlan(selectedPlan) : null;
  const serviceLabel = [selectedInterest, reviewPlan?.name].filter(Boolean).join(' · ');
  const { heading, description } = INQUIRY_COPY[isReviewsInquiry ? 'reviews' : serviceId] || GENERAL_INQUIRY_COPY;

  useEffect(() => {
    if (!router.isReady || measuredForm.current.topic === metricTopic) return;
    measuredForm.current = { topic: metricTopic, started: false };
    sendInquiryMetric(metricTopic, 'viewed');
  }, [router.isReady, metricTopic]);

  const recordFormStart = () => {
    if (!router.isReady || measuredForm.current.started) return;
    measuredForm.current.started = true;
    sendInquiryMetric(metricTopic, 'started');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.trim()) recordFormStart();
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    recordFormStart();
    setInterestOverride(checked ? [...interest, value] : interest.filter((service) => service !== value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submissionInProgress.current) return;

    const fullName = formData.full_name.trim();
    if (!fullName) {
      setErrors({ full_name: 'Enter your name.' });
      e.currentTarget.elements.full_name.focus();
      return;
    }

    submissionInProgress.current = true;
    recordFormStart();
    setSubmitting(true);
    setErrors({});

    const reviewMessage = isReviewsInquiry
      ? buildReviewMessage(selectedPlan, selectedTrial, selectedLocations)
      : '';
    const message = [reviewMessage, formData.message.trim()].filter(Boolean).join('\n\n')
      || 'Requested a follow-up from Onyx Creative Labs.';

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Website contact inquiry',
          context: { pageUri: window.location.href, pageName: document.title },
          fields: [
            { name: 'firstname', value: fullName },
            { name: 'email', value: formData.email.trim() },
            { name: 'phone', value: formData.phone },
            { name: 'company', value: formData.company },
            { name: 'website', value: formData.website },
            { name: 'message', value: message },
            { name: 'interest', value: interest.join(', ') },
          ],
        }),
      });

      if (!response.ok) throw new Error('Inquiry submission failed');
    } catch {
      submissionInProgress.current = false;
      setSubmitting(false);
      setErrors({ submit: 'We could not submit your inquiry. Please try again in a moment.' });
      return;
    }

    setSubmitted(true);
    trackInquiryConversion();
    router.push('/thankyou').catch(() => {
      // The confirmation remains visible if client-side navigation fails.
    });
  };

  return (
    <BaseLayout>
      <Head><title>Contact Onyx Creative Labs</title></Head>
      <Container className="py-4 py-md-5">
        <Row className="justify-content-center">
          <Col md="9" lg="7">
            <h1 className="fw-bold">{heading}</h1>
            <p className="text-muted mb-4">{description}</p>
            {submitted ? (
              <Alert color="success" role="status">
                Your inquiry was sent. <Link href="/thankyou" className="alert-link">Continue</Link>
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit} aria-busy={submitting}>
                <fieldset disabled={submitting}>
                  <FormGroup>
                    <Label for="name">Full name</Label>
                    <Input type="text" name="full_name" id="name" autoComplete="name" maxLength={160} required value={formData.full_name} onChange={handleChange} invalid={!!errors.full_name} aria-describedby={errors.full_name ? 'contact-name-error' : undefined} />
                    {errors.full_name && <FormFeedback id="contact-name-error">{errors.full_name}</FormFeedback>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email address</Label>
                    <Input type="email" name="email" id="email" autoComplete="email" maxLength={320} required value={formData.email} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone">Phone <span className="text-muted">(optional)</span></Label>
                    <Input type="tel" name="phone" id="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} />
                  </FormGroup>
                  <details className="mb-4">
                    <summary className="fw-semibold">Add details <span className="text-muted fw-normal">(optional)</span></summary>
                    <div className="pt-3">
                      <FormGroup>
                        <Label for="message">What would you like help with?</Label>
                        <Input type="textarea" name="message" id="message" rows="3" maxLength={3500} value={formData.message} onChange={handleChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label for="company">Company</Label>
                        <Input type="text" name="company" id="company" autoComplete="organization" value={formData.company} onChange={handleChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label for="website">Website</Label>
                        <Input type="text" name="website" id="website" autoComplete="url" inputMode="url" value={formData.website} onChange={handleChange} />
                      </FormGroup>
                      <FormGroup tag="fieldset" aria-describedby="contact-interest-help" className="mb-0">
                        <legend className="fs-6 mb-1">Which services are you interested in?</legend>
                        <p id="contact-interest-help" className="text-muted mb-2">Select all that apply.</p>
                        <Row className="gy-2">
                          {INTEREST_OPTIONS.map(([id, service]) => (
                            <Col sm="6" key={id}>
                              <div className="form-check">
                                <Input type="checkbox" name="interest" id={`contact-interest-${id}`} value={service} checked={interest.includes(service)} onChange={handleInterestChange} />
                                <Label className="form-check-label" htmlFor={`contact-interest-${id}`}>{service}</Label>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </FormGroup>
                    </div>
                  </details>
                  {selectedInterest && interest.includes(selectedInterest) && (
                    <p className="small text-muted mb-2">Inquiry for {serviceLabel}</p>
                  )}
                  {errors.submit && (
                    <Alert color="danger">
                      {errors.submit}{' '}
                      <a className="alert-link" href="https://calendly.com/softwaresmitty/discovery" target="_blank" rel="noopener noreferrer">
                        Schedule a discovery call instead
                      </a>
                    </Alert>
                  )}
                  <Button color="primary" size="lg" type="submit">
                    {submitting ? 'Sending…' : isReviewsInquiry ? 'Request my review growth call' : 'Send my inquiry'}
                  </Button>
                </fieldset>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
