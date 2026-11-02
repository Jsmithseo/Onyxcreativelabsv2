import React, { useState } from 'react';
import BaseLayout from '../components/layouts/BaseLayouts';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from 'reactstrap';

const CommunityPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          source: 'Community request',
          interest: 'Slack Community',
          details: 'Requested an invitation to the Onyx Creative Labs community.',
          pageUri: window.location.href,
          pageName: document.title,
        }),
      });

      if (!response.ok) throw new Error('Lead submission failed');
      setSubmitted(true);
    } catch (error) {
      setError('We could not queue that request. Please try again in a moment.');
    }
  };

  return (
    <BaseLayout>
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h1>Join Our Slack Community</h1>
            <p className="lead">
              Elevate your career by connecting with like-minded professionals
              in our Slack community. Whether you’re just starting out or
              looking to take your career to the next level, being part of a
              community can make all the difference.
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <h2>Why Join Our Slack Community?</h2>
            <ul className="list-unstyled">
              <li className="mb-3">
                <strong>Networking:</strong> Connect with professionals who
                share your interests and goals. Our channels make it easy to
                meet people who can help you advance your career.
              </li>
              <li className="mb-3">
                <strong>Tech News:</strong> Stay up-to-date with the latest in
                technology by joining our #tech-news channel, where members
                share news, articles, and discussions about current trends and
                innovations.
              </li>
              <li className="mb-3">
                <strong>Job and Side Work Opportunities:</strong> Looking for
                your next big project? Our #jobs-and-side-work channel is
                constantly updated with opportunities to work on exciting new
                projects, both big and small.
              </li>
              <li className="mb-3">
                <strong>Mentorship and Guidance:</strong> Gain access to
                experienced mentors who can guide you through your career
                challenges and help you grow professionally.
              </li>
              <li className="mb-3">
                <strong>Collaboration:</strong> Work together with community
                members on projects, share knowledge, and grow your skills in a
                supportive environment.
              </li>
              <li className="mb-3">
                <strong>Growth:</strong> Access to continuous learning through
                shared resources, workshops, and discussions that help you stay
                on top of your game.
              </li>
            </ul>
          </Col>

          <Col md="6">
            <h2>Ready to Get Started?</h2>
            <p>
              Fill out the form below to join our Slack community and start
              connecting with other professionals today.
            </p>
            {error && <Alert color="danger">{error}</Alert>}
            {submitted ? (
              <Alert color="success">
                Thanks—your community request is queued. We will follow up with
                the next step.
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="fullName">Full Name</Label>
                  <Input
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="email">Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <Button type="submit" color="primary" block>
                  Join the Slack Community
                </Button>
              </Form>
            )}
          </Col>
        </Row>

        <Row className="text-center mt-5">
          <Col>
            <p className="text-muted">
              Joining our Slack community is more than just signing up for
              another platform. It’s about becoming part of a network that is
              dedicated to your success. We look forward to seeing you in the
              channels!
            </p>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
};

export default CommunityPage;
