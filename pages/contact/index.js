import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback
} from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import { useRouter } from 'next/router';

export default function ContactFormPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    message: '',
    interest: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => {
        const newServices = checked
          ? [...prev.services, value]
          : prev.services.filter((s) => s !== value);
        return { ...prev, services: newServices };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
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
        const res = await fetch('https://api.hsforms.com/submissions/v3/integration/submit/46783071/79f2cfd0-1beb-4264-9f0f-d9b7d728cf95', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: formData.full_name },
              { name: 'email', value: formData.email },
              { name: 'company', value: formData.company },
              { name: 'website', value: formData.website },
              { name: 'message', value: formData.message },
              { name: 'services', value: formData.interest.join(', ') }
            ]
          })
        });

        if (res.ok) {
          setFormData({ full_name: '', email: '', company: '', website: '', message: '', interest: [] });
          setErrors({});
          router.push('/thankyou');
        } else {
          console.error('HubSpot submission failed');
        }
      } catch (error) {
        console.error('Error submitting to HubSpot:', error);
      }
    }
  };

  return (
    <BaseLayout>
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0', textAlign: 'center' }}>
        <Container>
          <h1 className="fw-bold">Let’s Talk</h1>
          <p className="mt-3 text-muted">
            Ready to grow? Tell us more about your project and goals.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md="8">
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">Full Name *</Label>
                <Input
                  type="text"
                  name="full_name"
                  id="name"
                  value={formData.full_name}
                  onChange={handleChange}
                  invalid={!!errors.full_name}
                />
                <FormFeedback>{errors.full_name}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="email">Email *</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  invalid={!!errors.email}
                />
                <FormFeedback>{errors.email}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="company">Company</Label>
                <Input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="website">Website(if applicatiable)</Label>
                <Input
                  type="text"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Which solutions are you interested in?</Label>
                <div>
                  {['CRO', 'Web Development', 'Email Marketing', 'Research & Strategy', 'Paid Marketing'].map((interest) => (
                    <div key={interest} className="form-check">
                      <Input
                        type="checkbox"
                        id={interest}
                        value={interest}
                        checked={formData.interest.includes(interest)}
                        onChange={handleChange}
                      />
                      <Label className="form-check-label" htmlFor={interest}>{interest}</Label>
                    </div>
                  ))}
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="message">Message *</Label>
                <Input
                  type="textarea"
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  invalid={!!errors.message}
                />
                <FormFeedback>{errors.message}</FormFeedback>
              </FormGroup>
              <div className="text-center mt-4">
                <Button color="primary" size="lg" type="submit">
                  Submit Inquiry
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
