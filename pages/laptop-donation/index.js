import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
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
import BaseLayout from '../components/layouts/BaseLayouts';
import axios from 'axios';

const LaptopDonationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    numberOfLaptops: '',
    laptopDetails: [],
    address: '',
    comments: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLaptopDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const newLaptopDetails = [...formData.laptopDetails];
    newLaptopDetails[index][name] = value;
    setFormData({ ...formData, laptopDetails: newLaptopDetails });
  };

  const handleLaptopCountChange = (e) => {
    const { value } = e.target;
    const laptopCount = parseInt(value, 10);
    const newLaptopDetails = Array.from({ length: laptopCount }, () => ({
      laptopModel: '',
      laptopYear: '',
      laptopCondition: '',
    }));
    setFormData({
      ...formData,
      numberOfLaptops: value,
      laptopDetails: newLaptopDetails,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hubspotFormData = {
      context: { pageUri: window.location.href, pageName: document.title },
      source: 'Laptop donation inquiry',
      hubspotFormId: '952f60aa-30ae-4ba4-a588-cc20fbd06eb7',
      fields: [
        { name: 'name', value: formData.name },
        { name: 'email', value: formData.email },
        { name: 'phone', value: formData.phone },
        { name: 'company_name', value: formData.companyName },
        { name: 'number_of_laptops', value: formData.numberOfLaptops },
        { name: 'address', value: formData.address },
        { name: 'comments', value: formData.comments },
        // Custom mapping for each laptop
        ...formData.laptopDetails.flatMap((laptop, index) => [
          { name: `laptop_${index + 1}_model`, value: laptop.laptopModel },
          { name: `laptop_${index + 1}_year`, value: laptop.laptopYear },
          {
            name: `laptop_${index + 1}_condition`,
            value: laptop.laptopCondition,
          },
        ]),
      ],
    };

    try {
      await axios.post(
        '/api/lead',
        hubspotFormData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setSubmitted(true);
    } catch (error) {
      console.error('There was an error submitting the form:', error);
      window.alert('We could not submit your request. Please try again in a moment.');
    }
  };

  return (
    <BaseLayout>
      <Container className="my-5">
        <Row>
          <Col md="8" className="mx-auto">
            <h2 className="text-center">Donate Your MacBook Pro</h2>
            <p className="text-center">
              Your generous donation will go directly to helping students in our
              apprenticeship program. Each donated laptop will be maintained by
              our IT volunteer, ensuring it is ready for development work. All
              donations are tax-deductible. Below you will find the necessary
              information to claim your deduction.
            </p>
            <p className="text-center font-weight-bold">
              Please note: We are only accepting Apple MacBook Pro models from
              2015 or newer.
            </p>
            <p className="text-center">
              **Tax Information: Onyx Creative Labs is a 501(c)(3) nonprofit
              organization. Our Tax ID is 99-4403186.**
            </p>

            {submitted ? (
              <Alert color="success" className="text-center">
                Thank you for your donation! We will get in touch with you
                shortly.
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="companyName">Company Name (if applicable)</Label>
                  <Input
                    type="text"
                    name="companyName"
                    id="companyName"
                    placeholder="Your Company Name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="numberOfLaptops">Number of Laptops</Label>
                  <Input
                    type="number"
                    name="numberOfLaptops"
                    id="numberOfLaptops"
                    placeholder="Number of Laptops"
                    value={formData.numberOfLaptops}
                    onChange={handleLaptopCountChange}
                    required
                  />
                </FormGroup>

                {formData.laptopDetails.map((_, index) => (
                  <div key={index}>
                    <h5 className="mt-4">Laptop {index + 1} Details</h5>
                    <FormGroup>
                      <Label for={`laptopModel${index}`}>Laptop Model</Label>
                      <Input
                        type="text"
                        name="laptopModel"
                        id={`laptopModel${index}`}
                        placeholder="MacBook Pro Model (e.g., 13-inch, 2017)"
                        value={formData.laptopDetails[index].laptopModel}
                        onChange={(e) => handleLaptopDetailsChange(index, e)}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for={`laptopYear${index}`}>Laptop Year</Label>
                      <Input
                        type="number"
                        name="laptopYear"
                        id={`laptopYear${index}`}
                        placeholder="Year of Manufacture (e.g., 2017)"
                        min="2015"
                        value={formData.laptopDetails[index].laptopYear}
                        onChange={(e) => handleLaptopDetailsChange(index, e)}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for={`laptopCondition${index}`}>
                        Laptop Condition
                      </Label>
                      <Input
                        type="select"
                        name="laptopCondition"
                        id={`laptopCondition${index}`}
                        value={formData.laptopDetails[index].laptopCondition}
                        onChange={(e) => handleLaptopDetailsChange(index, e)}
                        required
                      >
                        <option value="" disabled>
                          Select Condition
                        </option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Needs Repair">Needs Repair</option>
                      </Input>
                    </FormGroup>
                  </div>
                ))}

                <FormGroup>
                  <Label for="address">Pickup Address</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Your Address for Pickup"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="comments">Additional Comments</Label>
                  <Input
                    type="textarea"
                    name="comments"
                    id="comments"
                    placeholder="Any additional information or special instructions"
                    value={formData.comments}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <Button type="submit" color="primary" block>
                  Submit Donation
                </Button>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
};

export default LaptopDonationPage;
