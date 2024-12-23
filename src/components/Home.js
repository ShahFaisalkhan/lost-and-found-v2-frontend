// File: frontend/src/components/Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the dedicated stylesheet

const Home = () => {
  const [items, setItems] = useState([]); // Initialize items as an empty array
  const [filters, setFilters] = useState({ category: '', location: '', date: '', searchTerm: '' });
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Include filters in the query string
        // const query = new URLSearchParams({
        //   page: currentPage,
        //   category: filters.category,
        //   location: filters.location,
        //   date: filters.date,
        //   searchTerm: filters.searchTerm,
        // }).toString();
        // Create a basic query string
      // const queryString = `page=${currentPage}&category=${filters.category || ''}&location=${filters.location || ''}&date=${filters.date || ''}&searchTerm=${filters.searchTerm || ''}`;
         // Build query string manually
      const query = [];
      if (currentPage) query.push(`page=${currentPage}`);
      if (filters.category) query.push(`category=${filters.category}`);
      if (filters.location) query.push(`location=${filters.location}`);
      if (filters.date) query.push(`date=${filters.date}`);
      if (filters.searchTerm) query.push(`searchTerm=${filters.searchTerm}`);
      // console.log("query in home.js is",query)
      const queryString = query.join('&'); // Join the parts with "&" and converts it to string
      // console.log("query string in home.js is",queryString)
      // const { data } = await axios.get(`http://localhost:5000/api/items?${queryString}`);
      const { data } = await axios.get(`https://lost-and-found-v-2-backend.vercel.app/api/items?${queryString}`);

        // const { data } = await axios.get(`http://localhost:5000/api/items?${query}`);
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching items:', error); // Log the error for debugging
        // Extract meaningful error message from backend or fallback to a default message
        const message = error.response?.data?.message || 'Failed to fetch items. Please try again later.';
        alert(message); // Show the error message to the user
        setItems([]);   // Reset items to avoid displaying incorrect data
      }
    };
    fetchItems();
  }, [currentPage, filters]); // Re-fetch items when filters or page changes
  
  return (
    <div className="container mt-4">
      {/* <h1 className="text-center">Lost and Found</h1> */}

      {/* Filter Form */}
      <form className="mb-4">
        <select
          className="form-select"
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="Location"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        {/* <input
          type="date"
          className="form-control"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        /> */}
   <div className="form-group position-relative">
  <input
    type="date"
    className="form-control"
    value={filters.date || ''}
    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
  />
  {!filters.date && (
    <label
      className="form-label position-absolute search-date-label"
    >
      Search by date
    </label>
  )}
</div>

<style>
  {`
  .search-date-label {
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #212529c4; /* Dark text color */
    pointer-events: none;
    display: none; /* Hide label by default */
  }

  /* Show label only on small screens */
  @media (max-width: 768px) {
    .search-date-label {
      display: block;
    }
  }
  `}
</style>


        <input
             type="text"
            placeholder="Search by title or description"
            className="form-control"
             value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
      </form>

      {/* Item List */}
          <div className="row">
        {items.map((item) => (
          <div className="col-md-4" key={item._id}>
            <div className="card mb-4">
            {/* <img
            src={`http://localhost:5000${item.imageUrl || '/placeholder.jpg'}`}
            className="card-img-top fixed-image"
            alt={item.title}
            /> */}
            {item.imageUrl ? (
    <img
      // src={`http://localhost:5000${item.imageUrl}`}
      src={`https://lost-and-found-v-2-backend.vercel.app${item.imageUrl}`}
      alt={item.title}
      className="card-img-top"
      style={{ height: '200px', objectFit: 'cover' }}
    />
  ) : (
    <div
      style={{
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        fontSize: '2.2rem',
        fontWeight: 'bold',
      }}
    >
      {item.isLost ? 'Lost Item' : 'Item Found'}
    </div>
  )}
              <div className="card-body">
              <h5 className="card-title">{item.title.length > 20 ? item.title.slice(0,100) + '...' : item.title}</h5>
              <p className="card-text">{item.description.length > 50 ? item.description.slice(0, 150) + '...' : item.description}</p>
              Posted by: {item.userId?.username || 'Anonymous'}
              <p>Contact: {item.contactNo}</p>
                <Link to={`/item/${item._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination mt-4 text-center">
  <button
    className="btn btn-outline-primary me-2"
//     Math.max ensures the page number does not go below 1.
// For example:
// Math.max(0, 1); // 1
// Math.max(3, 1); // 3
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} // Decrement page, minimum is 1
    disabled={currentPage === 1} // Disable if on the first page
  >
    Previous
  </button>
  <span>Page {currentPage} of {totalPages}</span>
  <button
    className="btn btn-outline-primary ms-2"
    
    // When Clicked:
    // Suppose the current page is 3:
    
    // prev = 3
    // prev + 1 = 4
    // Math.min(4, 5) = 4
    // The new state of currentPage becomes 4.
    
    // Edge Case (Last Page):
    // Suppose the current page is 5 (the last page):
    
    // prev = 5
    // prev + 1 = 6
    // Math.min(6, 5) = 5
    // The currentPage remains 5 because it can't go beyond the last page.
        
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} // Increment page, max is totalPages
    disabled={currentPage === totalPages} // Disable if on the last page
  >
    Next
  </button>
</div>
    </div>
  );
};

export default Home;
