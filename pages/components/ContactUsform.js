import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    description: '',
    budget: '',
    serviceType: '', // New field for service type
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hubspotEndpoint =
      'https://api.hsforms.com/submissions/v3/integration/submit/46783071/952f60aa-30ae-4ba4-a588-cc20fbd06eb7';

    const payload = {
      fields: [
        { name: 'firstname', value: formData.firstName },
        { name: 'lastname', value: formData.lastName },
        { name: 'email', value: formData.email },
        { name: 'company', value: formData.companyName },
        { name: 'description', value: formData.description },
        { name: 'budget', value: formData.budget },
        { name: 'service_type', value: formData.serviceType }, // Added service type to payload
      ],
    };

    try {
      await axios.post(hubspotEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('There was an error submitting the form!', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <div
      style={{
        background: '#f8f9fa', // Light gray background to match the page
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        color: '#000', // Black text color for readability
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ flex: '1', marginRight: '10px' }}>
            <input
              type="text"
              id="firstName"
              name="firstName"
              style={styles.input}
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: '1' }}>
            <input
              type="text"
              id="lastName"
              name="lastName"
              style={styles.input}
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            id="email"
            name="email"
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            id="companyName"
            name="companyName"
            style={styles.input}
            placeholder="Company or Business Name (Optional)"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="serviceType"
            style={{
              color: '#000',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            What Service Are You Interested In?
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={styles.radioOption}>
              <input
                type="radio"
                id="website"
                name="serviceType"
                value="Website"
                checked={formData.serviceType === 'Website'}
                onChange={handleChange}
                required
              />
              <label htmlFor="website" style={styles.radioLabel}>
                Website
              </label>
            </div>
            <div style={styles.radioOption}>
              <input
                type="radio"
                id="webApp"
                name="serviceType"
                value="Web App"
                checked={formData.serviceType === 'Web App'}
                onChange={handleChange}
                required
              />
              <label htmlFor="webApp" style={styles.radioLabel}>
                Web App
              </label>
            </div>
            <div style={styles.radioOption}>
              <input
                type="radio"
                id="marketingServices"
                name="serviceType"
                value="Marketing Services"
                checked={formData.serviceType === 'Marketing Services'}
                onChange={handleChange}
                required
              />
              <label htmlFor="marketingServices" style={styles.radioLabel}>
                Marketing Services
              </label>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <textarea
            id="description"
            name="description"
            style={styles.textarea}
            placeholder="Enter any project specific details..."
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="budget"
            style={{
              color: '#000',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Budget Range
          </label>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={styles.radioOption}>
              <input
                type="radio"
                id="budget-2500-5000"
                name="budget"
                value="2500-5000"
                checked={formData.budget === '2500-5000'}
                onChange={handleChange}
                required
              />
              <label htmlFor="budget-2500-5000" style={styles.radioLabel}>
                $2,500 - $5,000
              </label>
            </div>
            <div style={styles.radioOption}>
              <input
                type="radio"
                id="budget-10000-30000"
                name="budget"
                value="10000-30000"
                checked={formData.budget === '10000-30000'}
                onChange={handleChange}
                required
              />
              <label htmlFor="budget-10000-30000" style={styles.radioLabel}>
                $10,000 - $30,000
              </label>
            </div>
            <div style={styles.radioOption}>
              <input
                type="radio"
                id="budget-30000plus"
                name="budget"
                value="30000plus"
                checked={formData.budget === '30000plus'}
                onChange={handleChange}
                required
              />
              <label htmlFor="budget-30000plus" style={styles.radioLabel}>
                $30,000+
              </label>
            </div>
            <div style={styles.radioOption}>
              <input
                type="radio"
                id="budget-custom"
                name="budget"
                value="Custom"
                checked={formData.budget === 'Custom'}
                onChange={handleChange}
                required
              />
              <label htmlFor="budget-custom" style={styles.radioLabel}>
                Custom Amount
              </label>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '12px 20px',
              backgroundColor: 'var(--onyx-accent)',
              color: '#18181b',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              textAlign: 'center',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              fontWeight: '600',
            }}
          >
            Enter
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: '#fff', // White background for inputs
    color: '#000', // Black text for readability
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: '#fff', // White background for textarea
    color: '#000', // Black text for readability
    height: '120px',
    resize: 'vertical',
  },
  radioOption: {
    flex: '1',
    backgroundColor: '#e9ecef', // Light gray background for radio buttons
    color: '#000', // Black text for readability
    borderRadius: '20px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
  },
  radioLabel: {
    marginLeft: '10px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default ContactForm;
