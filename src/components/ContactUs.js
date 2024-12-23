import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusType(''); // Reset status type
    setStatus('Submitting...'); // Show a temporary message

    try {
      // await axios.post('http://localhost:5000/api/contact', formData);
      await axios.post('https://lost-and-found-v-2-backend.vercel.app/api/contact', formData);
      // Show success message
      setStatusType('success');
      setStatus('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    } catch (error) {
      // Show error message
      setStatusType('error');
      setStatus('Failed to send your message. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Contact Us</h1>
      <p className="mb-4">Feel free to reach out to us with any questions or feedback!</p>

      {/* Status Message */}
      {status && (
        <div
          className={`alert ${statusType === 'success' ? 'alert-success' : 'alert-danger'} text-center`}
          role="alert"
        >
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <input
            type="text"
            name="subject"
            className="form-control"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            name="message"
            className="form-control"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;
