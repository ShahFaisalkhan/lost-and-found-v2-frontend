// File: frontend/src/components/Signup.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
 // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
   // const response = await axios.post('http://localhost:5000/auth/signup', formData);
    const response = await axios.post('https://lost-and-found-v-2-backend.vercel.app/auth/signup', formData);
    alert(response.data.message); // Success message from backend
    navigate('/login'); // Navigate to login on success
  } catch (error) {
    if (error.response) {
      // Backend returned an error response
      const { status, data } = error.response;
      if (status === 400) {
        alert(data.message); // Display specific error message from backend
      } else if (status === 500) {
        alert('Server error. Please try again later.');
      }
    } else {
      // Network error or other issues
      console.error('Error during signup:', error);
      alert('An unexpected error occurred. Please check your network and try again.');
    }
  }
};
  return (
    <div className="container mt-4">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="form-control mb-2"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
