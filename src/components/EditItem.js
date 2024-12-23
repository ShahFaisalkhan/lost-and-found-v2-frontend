// export default EditItem;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditItem = () => {
  const { id } = useParams(); // Get item ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contactNo: '',
    date: '',
    isLost: true, // Default to 'Lost'
  });

  const [image, setImage] = useState(null); // For new image
  const [existingImageUrl, setExistingImageUrl] = useState(''); // For displaying current image

  // Fetch item details on load
  useEffect(() => {
    const fetchItem = async () => {
      try {
        // const { data } = await axios.get(`http://localhost:5000/api/items/${id}`);
        const { data } = await axios.get(`https://lost-and-found-v-2-backend.vercel.app/api/items/${id}`);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          contactNo: data.contactNo || '',
          date: data.date ? new Date(data.date).toISOString().substr(0, 10) : '',
          isLost: data.isLost,
        });
        setExistingImageUrl(data.imageUrl); // Save the current image URL
      } catch (error) {
        console.error('Error fetching item:', error);
        alert('Failed to fetch item details.');
      }
    };

    fetchItem();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const updateData = new FormData();

      // Append fields directly
      updateData.append('title', formData.title);
      updateData.append('description', formData.description);
      updateData.append('location', formData.location);
      updateData.append('contactNo', formData.contactNo);
      updateData.append('date', formData.date);
      updateData.append('isLost', formData.isLost.toString());

      // Append new image, if uploaded
      if (image) {
        updateData.append('image', image);
      }

      // Submit the form
      // await axios.put(`http://localhost:5000/api/items/${id}`, updateData, {
        await axios.put(`https://lost-and-found-v-2-backend.vercel.app/api/items/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Item updated successfully!');
      navigate('/'); // Redirect to My Items or Home page
    } catch (error) {
      console.error('Error updating item:', error.response?.data || error.message);
      alert('Failed to update item.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit}>
        {existingImageUrl && (
          <div className="mb-3">
            <p>Current Image:</p>
            <img
              // src={`http://localhost:5000${existingImageUrl}`}
              src={`https://lost-and-found-v-2-backend.vercel.app${existingImageUrl}`}
              alt="Current Item"
              style={{ width: '300px', height: '200px', objectFit: 'cover' }}
            />
          </div>
        )}

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
          value={formData.isLost.toString()}
          onChange={(e) => setFormData({ ...formData, isLost: e.target.value === 'true' })}
        >
          <option value="true">Lost</option>
          <option value="false">Found</option>
        </select>
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setImage(e.target.files[0])} // Capture new image
        />
        <button type="submit" className="btn btn-primary">Update Item</button>
      </form>
    </div>
  );
};

export default EditItem;
