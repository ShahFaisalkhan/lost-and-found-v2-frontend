import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPosts.css';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    searchTerm: '', // New state for search filter
  });
  const navigate = useNavigate();

  // Fetch posts
  const fetchPosts = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      // const { data } = await axios.get('http://localhost:5000/api/admin/posts', {
        const { data } = await axios.get('https://lost-and-found-v-2-backend.vercel.app/api/admin/posts', {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, page },
      });

      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      console.error('Error fetching posts:', err.response?.data || err.message);
      alert('Failed to fetch posts. Ensure you are logged in as an admin.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  // Handle delete post
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      // await axios.delete(`http://localhost:5000/api/admin/posts/${postId}`, {
        await axios.delete(`https://lost-and-found-v-2-backend.vercel.app/api/admin/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Post deleted successfully!');
      fetchPosts(currentPage); // Refresh the current page
    } catch (err) {
      console.error('Error deleting post:', err.response?.data || err.message);
      alert('Failed to delete post.');
    }
  };

  // Navigate to edit page
  const handleEdit = (postId) => {
    navigate(`/edit-item/${postId}`);
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="container mt-4">
      <h1>Admin: Manage Posts</h1>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-3">
        <label htmlFor="startDate" className="form-label">Search Term</label>

          <input
            type="text"
            name="searchTerm"
            className="form-control"
            placeholder="Search by title, description, location, username, or contact"
            value={filters.searchTerm}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
        <label htmlFor="startDate" className="form-label">Select Category</label>

          <select
            name="category"
            className="form-select"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        {/* <div className="col-md-3">
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            name="endDate"
            className="form-control"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div> */}
     <div className="col-md-3">
    <div className="form-group">
      <label htmlFor="startDate" className="form-label">Start Date</label>
      <input
        type="date"
        id="startDate"
        name="startDate"
        className="form-control"
        value={filters.startDate}
        onChange={handleFilterChange}
      />
    </div>
  </div>
  <div className="col-md-3">
    <div className="form-group">
      <label htmlFor="endDate" className="form-label">End Date</label>
      <input
        type="date"
        id="endDate"
        name="endDate"
        className="form-control"
        value={filters.endDate}
        onChange={handleFilterChange}
      />
    </div>
  </div>
  
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="card mb-4">
            {post.imageUrl && (
              <img
                // src={`http://localhost:5000${post.imageUrl}`}
                src={`https://lost-and-found-v-2-backend.vercel.app${post.imageUrl}`}
                alt={post.title}
                className="card-img-top admin-post-image"
                style={{ height: '200px', objectFit: 'cover' }}
              />
            )}
            {/* <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">{post.description}</p>
              <p><strong>Location:</strong> {post.location}</p>
              <p><strong>Posted by:</strong> {post.userId?.username || 'Anonymous'}</p>
              <p><strong>Contact:</strong> {post.contactNo}</p>
              <button className="btn btn-danger me-2" onClick={() => handleDelete(post._id)}>
                Delete
              </button>
              <button className="btn btn-primary" onClick={() => handleEdit(post._id)}>
                Edit
              </button>
            </div> */}
            <div className="card-body">
      <h5 className="card-title">{post.title}</h5>
      <p className="card-text"><strong>Description:</strong> {post.description}</p>
      <p><strong>Location:</strong> {post.location}</p>
{/* new Date(post.date):

Converts the date string from the backend into a JavaScript Date object.
Example: "2024-12-17T00:00:00.000Z" becomes a Date object representing Dec 17, 2024.
.toLocaleDateString():

Converts the Date object into a human-readable date string.
The format depends on the user's browser settings (locale).
Example:
In the U.S. locale (en-US): "12/17/2024".
In the UK locale (en-GB): "17/12/2024". */}
      <p><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
      <p><strong>Contact Number:</strong> {post.contactNo}</p>
      <p><strong>Posted By:</strong> {post.userId?.username || 'Anonymous'}</p>
      <p><strong>Category:</strong> {post.isLost ? 'Lost' : 'Found'}</p>
      <button className="btn btn-danger me-2" onClick={() => handleDelete(post._id)}>
        Delete
      </button>
      <button className="btn btn-primary" onClick={() => handleEdit(post._id)}>
        Edit
      </button>
    </div>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {/* {console.log ('pagination array is',[...Array(totalPages).keys()])} */}
            {[...Array(totalPages).keys()].map((pageNum) => (
              <li
                key={pageNum}
                className={`page-item ${currentPage === pageNum + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => fetchPosts(pageNum + 1)}
                >
                  {pageNum + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminPosts;
