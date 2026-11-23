import React, { useEffect, useState } from 'react';
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

const REVIEW_INTEREST = 'Onyx Reviews';
const REVIEW_MESSAGE = 'I’d like to learn how Onyx Reviews can help us earn more customer feedback and grow our reputation.';
const INTEREST_OPTIONS = [
  ['fractional-bdr', 'Fractional BDR'],
  ['90-day-pilot', '90-Day Pilot'],
  ['content-marketing', 'Content Marketing'],
  ['growth-plan', 'Growth Plan'],
  ['onyx-reviews', REVIEW_INTEREST],
  ['cro', 'CRO'],
  ['web-development', 'Web Development'],
  ['email-marketing', 'Email Marketing'],
  ['research-strategy', 'Research & Strategy'],
  ['paid-marketing', 'Paid Marketing'],
];

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
  const product = router.query.product;
  const isReviewsInquiry = router.isReady && product === 'reviews';
  const selectedInterest = isReviewsInquiry
    ? REVIEW_INTEREST
    : INTEREST_OPTIONS.find(([id]) => id === router.query.service)?.[1];
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
    interest: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!router.isReady || !selectedInterest) return;

    setFormData((prev) => ({
      ...prev,
      interest: prev.interest.includes(selectedInterest)
        ? prev.interest
        : [...prev.interest, selectedInterest],
      message: isReviewsInquiry && !prev.message
        ? buildReviewMessage(selectedPlan, selectedTrial, selectedLocations)
        : prev.message,
    }));
  }, [router.isReady, selectedInterest, isReviewsInquiry, selectedPlan, selectedTrial, selectedLocations]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => {
        const newInterest = checked
          ? [...prev.interest, value]
          : prev.interest.filter((s) => s !== value);
        return { ...prev, interest: newInterest };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source: 'Website contact inquiry',
            context: { pageUri: window.location.href, pageName: document.title },
            fields: [
              { name: 'firstname', value: formData.full_name },
              { name: 'email', value: formData.email },
              { name: 'phone', value: formData.phone },
              { name: 'company', value: formData.company },
              { name: 'website', value: formData.website },
              { name: 'message', value: formData.message },
              { name: 'interest', value: formData.interest.join(', ') }
            ]
          })
        });

        if (res.ok) {
          setFormData({ full_name: '', email: '', phone: '', company: '', website: '', message: '', interest: [] });
          setErrors({});
          router.push('/thankyou');
        } else {
          setErrors({ submit: 'We could not submit your inquiry. Please try again in a moment.' });
        }
      } catch (error) {
        setErrors({ submit: 'We could not submit your inquiry. Please try again in a moment.' });
      }
    }
  };

  return (
    <BaseLayout>
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0', textAlign: 'center' }}>
        <Container>
          <h1 className="fw-bold">{isReviewsInquiry ? 'Book Your Review Growth Call' : 'Let’s Talk'}</h1>
          <p className="mt-3 text-muted">
            {isReviewsInquiry
              ? 'Tell us a little about your business and we will map a practical review-growth plan.'
              : 'Ready to grow? Tell us more about your project and goals.'}
          </p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md="8">
            {errors.submit && <Alert color="danger">{errors.submit}</Alert>}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">Full Name *</Label>
                <Input type="text" name="full_name" id="name" value={formData.full_name} onChange={handleChange} invalid={!!errors.full_name} />
                <FormFeedback>{errors.full_name}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="email">Email *</Label>
                <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} invalid={!!errors.email} />
                <FormFeedback>{errors.email}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="company">Company</Label>
                <Input type="text" name="company" id="company" value={formData.company} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="website">Website (if applicable)</Label>
                <Input type="text" name="website" id="website" value={formData.website} onChange={handleChange} />
              </FormGroup>
              <FormGroup tag="fieldset" aria-describedby="contact-interest-help">
                <legend className="fs-6 mb-1">Which services are you interested in?</legend>
                <p id="contact-interest-help" className="text-body-secondary mb-2">Select all that apply.</p>
                <div className="row gy-2">
                  {INTEREST_OPTIONS.map(([id, interest]) => (
                    <Col sm="6" key={id}>
                      <div className="form-check">
                        <Input type="checkbox" name="interest" id={`contact-interest-${id}`} value={interest} checked={formData.interest.includes(interest)} onChange={handleChange} />
                        <Label className="form-check-label" htmlFor={`contact-interest-${id}`}>{interest}</Label>
                      </div>
                    </Col>
                  ))}
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="message">Message *</Label>
                <Input type="textarea" name="message" id="message" rows="5" value={formData.message} onChange={handleChange} invalid={!!errors.message} />
                <FormFeedback>{errors.message}</FormFeedback>
              </FormGroup>
              <div className="text-center mt-4">
                <Button color="primary" size="lg" type="submit">
                  {isReviewsInquiry ? 'Request My Review Growth Call' : 'Submit Inquiry'}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
