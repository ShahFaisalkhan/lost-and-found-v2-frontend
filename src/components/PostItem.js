// File: frontend/src/components/PostItem.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contactNo: '',
    date: '',
    isLost: true,
  });
  const [image, setImage] = useState(null); // State to store the image file

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to post an item.');
        return;
      }

      // Create a FormData object for file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('contactNo', formData.contactNo); // Add contact number to the form data
      data.append('date', formData.date);
      data.append('isLost', formData.isLost);

      if (image) data.append('image', image);
      // Send POST request with the FormData and Authorization header
      // await axios.post('http://localhost:5000/api/items', data, {
        await axios.post('https://lost-and-found-v-2-backend.vercel.app/api/items', data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Item posted successfully!');
      navigate('/'); // Navigate to the home page or desired location
    } catch (error) {
      console.error('Error posting item:', error);
      alert('Error posting item');
    }
  };
  
  return (
    <div className="container mt-4">
      <h1>Post an Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="form-control mb-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="form-control mb-2"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="form-control mb-2"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Contact Number"
          className="form-control mb-2"
          value={formData.contactNo}
          onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
          required
        />
        <input
          type="date"
          className="form-control mb-2"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <select
          className="form-select mb-2"
          value={formData.isLost}
          // onChange={(e) => setFormData({ ...formData, isLost: e.target.value === 'true' })}
          onChange={(e) => setFormData({ ...formData, isLost: e.target.value })}
        >
          <option value="true">Lost</option>
          <option value="false">Found</option>
        </select>
        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setImage(e.target.files[0])} // Set the image file
        />
        <button type="submit" className="btn btn-primary">Post Item</button>
      </form>
    </div>
  );
};

export default PostItem;
