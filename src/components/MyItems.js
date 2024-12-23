import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token
        if (!token) {
          alert('You must be logged in to view your items.');
          return;
        }

        // Fetch user's items with pagination
        // const { data } = await axios.get('http://localhost:5000/api/items/my-items', {
          const { data } = await axios.get('https://lost-and-found-v-2-backend.vercel.app/api/items/my-items', {
          headers: { Authorization: `Bearer ${token}` },
           // Frontend: The params object in the axios.get request specifies the query parameters:
           //  This constructs a URL like: http://localhost:5000/api/items/my-items?page=1&limit=3
           params: { page: currentPage, limit: 6 }, // Include pagination parameters
        });
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
      }
    };

    fetchMyItems();
  }, [currentPage]); // Re-fetch items when the page changes

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token
      if (!token) {
        alert('You must be logged in to delete items.');
        return;
      }

      // Send DELETE request to the backend
      // await axios.delete(`http://localhost:5000/api/items/${id}`, {
        await axios.delete(`https://lost-and-found-v-2-backend.vercel.app/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted item from the state
      setItems(items.filter((item) => item._id !== id));
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>My Posts</h1>
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item._id} className="card mb-4">
            {item.imageUrl ? (
              <img
                // src={`http://localhost:5000${item.imageUrl}`}
                src={`https://lost-and-found-v-2-backend.vercel.app${item.imageUrl}`}
                alt={item.title}
                className="card-img-top"
                style={{
                  width: '300px',
                  height: '200px',
                  objectFit: 'cover',
                  margin: '0 auto',
                }}
              />
            ) : (
              <p className="text-center">No Image</p>
            )}
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">{item.description}</p>
              <p className="card-text">
                <strong>Location:</strong> {item.location}
              </p>
              <p className="card-text">
                <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
              </p>
              <p className="card-text">
                <strong>Contact:</strong> {item.contactNo}
              </p>
              <p className="card-text">
                <strong>Status:</strong> {item.isLost ? 'Lost' : 'Found'}
              </p>
              <button className="btn btn-danger me-2" onClick={() => handleDelete(item._id)}>
                Delete
              </button>
              <a href={`/edit-item/${item._id}`} className="btn btn-primary">
                Edit
              </a>
            </div>
          </div>
        ))
      ) : (
        <p>No items posted yet.</p>
      )}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-secondary me-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="align-self-center">Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyItems;

