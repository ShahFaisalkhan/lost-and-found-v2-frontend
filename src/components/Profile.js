import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState(''); // To display success or error messages

  // Fetch user details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        // const { data } = await axios.get('http://localhost:5000/auth/me', {
          const { data } = await axios.get('https://lost-and-found-v-2-backend.vercel.app/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({ username: data.username, email: data.email, currentPassword: '', newPassword: '' });
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        setMessage('Failed to load profile information.');
      }
    };

    fetchProfile();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      // const { data } = await axios.put('http://localhost:5000/auth/profile', formData, {
        const { data } = await axios.put('https://lost-and-found-v-2-backend.vercel.app/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(data.message); // Display success message
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Profile</h1>
      {message && <p className="alert alert-info">{message}</p>}
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
          placeholder="Current Password"
          className="form-control mb-2"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
        />
        <input
          type="password"
          placeholder="New Password"
          className="form-control mb-2"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
