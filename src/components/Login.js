import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send login request to the backend
      // const response = await axios.post('http://localhost:5000/auth/login', formData);
      const response = await axios.post('https://lost-and-found-v-2-backend.vercel.app/auth/login', formData);
      // On success
      alert(response.data.message); // Display success message from backend
      localStorage.setItem('token', response.data.token); // Save the token in local storage
      onLogin(); // Call the parent's onLogin function to update login state
      navigate('/'); // Navigate to home page
    } catch (error) {
      console.error('Login error:', error);
  
      // Display appropriate error message from backend
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Show specific error message from backend
      } else {
        alert('An unexpected error occurred. Please try again later.'); // Fallback for unexpected errors
      }
    }
  };
  return (
    <div className="container mt-4">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
