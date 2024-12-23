// // File: frontend/src/components/ItemDetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ItemDetails.css'; // Add a CSS file for styling

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      // .get(`http://localhost:5000/api/items/${id}`)
      .get(`https://lost-and-found-v-2-backend.vercel.app/api/items/${id}`)
      .then((response) => setItem(response.data))
      .catch((error) => console.error('Error fetching item details:', error));
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className="item-details-container">
      <div className="item-details-card">
        {item.imageUrl ? (
          <img
            // src={`http://localhost:5000${item.imageUrl}`}
            src={`https://lost-and-found-v-2-backend.vercel.app${item.imageUrl}`}
            alt={item.title}
            className="item-image"
          />
        ) : (
          <div className="placeholder-image">
            {item.isLost ? 'Lost Item' : 'Item Found'}
          </div>
        )}
        <div className="item-details-content">
          <h1 className="item-title">{item.title}</h1>
          <p className="item-description"><strong>Description:</strong> {item.description}</p>
          <p className="item-location"><strong>Location:</strong> {item.location}</p>
          <p className="item-posted-by"><strong>Posted by:</strong> {item.userId?.username || 'Anonymous'}</p>
          <p className="item-contact"><strong>Contact:</strong> {item.contactNo}</p>
          <p className="item-date"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
          <p className="item-status"><strong>Status:</strong> {item.isLost ? 'Lost' : 'Found'}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
