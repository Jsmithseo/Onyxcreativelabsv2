import React, { useState } from 'react';
import { Button, ButtonGroup, Input, Form, FormGroup, Label } from 'reactstrap';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';

// Ensure the environment variable is accessed correctly
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const DonationForm = () => {
  const [amount, setAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleAmountChange = (amt) => {
    setAmount(amt);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setAmount(null);
    setCustomAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAmount = amount || customAmount;

    if (!stripe || !elements || !finalAmount) {
      return;
    }

    try {
      const { data } = await axios.post('/api/create-payment-intent', {
        amount: finalAmount,
        isMonthly,
      });

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          alert('Donation successful!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <Form onSubmit={handleSubmit} style={styles.form}>
        <FormGroup style={styles.formGroup}>
          <Label for="donationAmount">Choose an amount:</Label>
          <ButtonGroup style={styles.buttonGroup}>
            {[50, 100, 250, 500].map((amt) => (
              <Button
                key={amt}
                onClick={() => handleAmountChange(amt)}
                active={amount === amt}
                style={amount === amt ? styles.selectedButton : styles.button}
              >
                ${amt}
              </Button>
            ))}
            <Button
              onClick={() => handleAmountChange(null)}
              active={!amount && !customAmount}
              style={
                !amount && !customAmount ? styles.selectedButton : styles.button
              }
            >
              Custom
            </Button>
          </ButtonGroup>
          {!amount && (
            <Input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter custom amount"
              style={styles.customAmountInput}
            />
          )}
        </FormGroup>
        <FormGroup check style={styles.formGroup}>
          <Label check>
            <Input
              type="checkbox"
              checked={isMonthly}
              onChange={(e) => setIsMonthly(e.target.checked)}
              style={styles.checkbox}
            />{' '}
            Make this a monthly donation
          </Label>
        </FormGroup>
        <FormGroup style={styles.formGroup}>
          <Label for="cardDetails">Card Details:</Label>
          <div style={styles.cardElement}>
            <CardElement id="cardDetails" />
          </div>
        </FormGroup>
        <Button
          type="submit"
          color="primary"
          disabled={!stripe}
          style={styles.submitButton}
        >
          Donate
        </Button>
      </Form>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

const DonationFormWrapper = () => (
  <Elements stripe={stripePromise}>
    <DonationForm />
  </Elements>
);

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  button: {
    flex: 1,
    marginRight: '10px',
    backgroundColor: '#f8f9fa',
    color: '#000',
  },
  selectedButton: {
    flex: 1,
    marginRight: '10px',
    backgroundColor: 'var(--onyx-accent)',
    color: '#fff',
  },
  customAmountInput: {
    marginTop: '10px',
  },
  checkbox: {
    marginRight: '10px',
  },
  cardElement: {
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '0.25rem',
    backgroundColor: '#fff',
  },
  submitButton: {
    width: '100%',
  },
};

export default DonationFormWrapper;
