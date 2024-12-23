import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    postsToday: 0,
    postsThisMonth: 0,
    usersToday: 0,
    usersThisMonth: 0,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token'); // Admin token
        // const { data } = await axios.get('http://localhost:5000/api/admin/dashboard', {
          const { data } = await axios.get('https://lost-and-found-v-2-backend.vercel.app/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("Returned data in admin dashboard.js is",data)
        setMetrics(data);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err.response?.data || err.message);
        setError('Failed to load dashboard metrics. Ensure you are logged in as an admin.');
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="row">
        {/* Posts Today Card */}
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Posts Today</h5>
              <p className="card-text">{metrics.postsToday}</p>
            </div>
          </div>
        </div>

        {/* Posts This Month Card */}
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Posts This Month</h5>
              <p className="card-text">{metrics.postsThisMonth}</p>
            </div>
          </div>
        </div>

        {/* Users Today Card */}
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Users Registered Today</h5>
              <p className="card-text">{metrics.usersToday}</p>
            </div>
          </div>
        </div>

        {/* Users This Month Card */}
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5 className="card-title">Users Registered This Month</h5>
              <p className="card-text">{metrics.usersThisMonth}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
