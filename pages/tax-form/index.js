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
  Alert,
  Collapse,
} from 'reactstrap';

import BaseLayout from '../components/layouts/BaseLayouts';

const TaxInfoRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    organizationName: '',
    email: '',
    donationDate: '',
    donationAmount: '',
    donatedLaptops: false,
    laptopDetails: '',
    numberOfLaptops: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const details = [
      `Donation date: ${formData.donationDate}`,
      `Donation amount: ${formData.donationAmount}`,
      `Donated laptops: ${formData.donatedLaptops ? 'Yes' : 'No'}`,
      formData.numberOfLaptops && `Number of laptops: ${formData.numberOfLaptops}`,
      formData.laptopDetails && `Laptop details: ${formData.laptopDetails}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.organizationName,
          source: 'Donation tax information request',
          interest: 'Donation Tax Information',
          details,
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
      <div style={styles.headerSection}>
        <Container>
          <Row>
            <Col md={{ size: 12 }}>
              <h2 style={styles.header}>
                Request Your Donation Tax Information
              </h2>
              <p style={styles.introText}>
                Thank you for your generous donation to Onyx Creative Labs! To
                assist you with your tax filing, we will email you a detailed
                receipt and all the necessary documentation. Here’s what you can
                expect to receive:
              </p>
              <ul style={styles.benefitsList}>
                <li>
                  <strong>Donation Receipt:</strong> Includes the donation
                  amount, date of donation, our organization’s name, and a
                  statement confirming whether any goods or services were
                  provided in exchange for your donation.
                </li>
                <li>
                  <strong>Tax-Exempt Status Information:</strong> Our Employer
                  Identification Number (EIN) and a statement confirming our
                  501(c)(3) tax-exempt status.
                </li>
                <li>
                  <strong>Organization’s Address:</strong> Our physical address
                  for your records, which may be needed for your tax filing.
                </li>
                <li>
                  <strong>Purpose of Donation:</strong> Documentation specifying
                  how your donation will be used, particularly for restricted
                  gifts.
                </li>
                <li>
                  <strong>IRS Determination Letter:</strong> Available upon
                  request, this letter confirms our organization’s 501(c)(3)
                  tax-exempt status.
                </li>
                <li>
                  <strong>Donation Documentation Requirements:</strong>{' '}
                  Information on what documentation is needed for cash and
                  non-cash donations, including IRS Form 8283 if applicable.
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>

      <div style={styles.formSection}>
        <Container>
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              {error && <Alert color="danger" style={styles.alert}>{error}</Alert>}
              {submitted ? (
                <Alert color="success" style={styles.alert}>
                  Your request has been submitted. We will send you the
                  information shortly.
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit} style={styles.form}>
                  <FormGroup>
                    <Label for="name" style={styles.label}>
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="organizationName" style={styles.label}>
                      Organization or Business Name (Optional)
                    </Label>
                    <Input
                      type="text"
                      name="organizationName"
                      id="organizationName"
                      placeholder="Enter the organization or business name"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email" style={styles.label}>
                      Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="donationDate" style={styles.label}>
                      Date of Donation
                    </Label>
                    <Input
                      type="date"
                      name="donationDate"
                      id="donationDate"
                      placeholder="Enter the date of your donation"
                      value={formData.donationDate}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="donationAmount" style={styles.label}>
                      Donation Amount
                    </Label>
                    <Input
                      type="number"
                      name="donationAmount"
                      id="donationAmount"
                      placeholder="Enter the amount you donated"
                      value={formData.donationAmount}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </FormGroup>

                  <div style={styles.checkboxSection}>
                    <FormGroup check style={styles.checkboxGroup}>
                      <Label check style={styles.checkboxLabel}>
                        <Input
                          type="checkbox"
                          name="donatedLaptops"
                          checked={formData.donatedLaptops}
                          onChange={handleInputChange}
                          style={styles.checkbox}
                        />{' '}
                        Did you donate laptops?
                      </Label>
                    </FormGroup>
                  </div>

                  <Collapse isOpen={formData.donatedLaptops}>
                    <FormGroup>
                      <Label for="numberOfLaptops" style={styles.label}>
                        Number of Laptops Donated
                      </Label>
                      <Input
                        type="number"
                        name="numberOfLaptops"
                        id="numberOfLaptops"
                        placeholder="Enter the number of laptops you donated"
                        value={formData.numberOfLaptops}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="laptopDetails" style={styles.label}>
                        Laptop Details
                      </Label>
                      <Input
                        type="textarea"
                        name="laptopDetails"
                        id="laptopDetails"
                        placeholder="Provide details about the laptops (e.g., models, conditions)"
                        value={formData.laptopDetails}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </FormGroup>
                  </Collapse>

                  <Button
                    type="submit"
                    color="primary"
                    block
                    style={styles.button}
                  >
                    Request Information
                  </Button>
                </Form>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </BaseLayout>
  );
};

const styles = {
  headerSection: {
    backgroundColor: '#f8f9fa',
    padding: '60px 0',
  },
  header: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '20px',
  },
  introText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginBottom: '30px',
  },
  benefitsList: {
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 15px',
  },
  formSection: {
    backgroundColor: '#ffffff',
    padding: '60px 0',
  },
  form: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  label: {
    fontWeight: '600',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
  },
  checkboxSection: {
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  checkboxGroup: {
    marginBottom: '0',
  },
  checkboxLabel: {
    fontWeight: '600',
  },
  checkbox: {
    marginRight: '10px',
  },
  button: {
    padding: '12px',
    fontSize: '1rem',
    fontWeight: '600',
  },
  alert: {
    marginTop: '20px',
  },
};

export default TaxInfoRequestForm;
