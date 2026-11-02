import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const MaterialContactform = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          source: 'Website contact form',
          interest: 'General Inquiry',
          details: formData.message,
          pageUri: window.location.href,
          pageName: document.title,
        }),
      });

      if (!response.ok) throw new Error('Lead submission failed');
      window.location.href = '/thankyou';
    } catch (error) {
      window.alert('We could not submit your message. Please try again in a moment.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        name="name"
        id="name"
        placeholder="Your name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        name="email"
        id="email"
        placeholder="Your email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Message"
        variant="outlined"
        fullWidth
        margin="normal"
        name="message"
        id="message"
        placeholder="Your message"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default MaterialContactform;
