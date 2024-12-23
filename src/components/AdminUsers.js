// export default AdminUsers;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users

  // Fetch users with pagination
  const fetchUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      // const { data } = await axios.get('http://localhost:5000/api/admin/users', {
        const { data } = await axios.get('https://lost-and-found-v-2-backend.vercel.app/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 36 }, // Pass pagination parameters
      });

      setUsers(data.users);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setFilteredUsers(data.users); // Set filtered users initially to all users
    } catch (err) {
      console.error('Error fetching users:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users); // Reset to all users if search is empty
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerSearchTerm) ||
          user.email.toLowerCase().includes(lowerSearchTerm) ||
          user.role.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Handle delete user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      // await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        await axios.delete(`https://lost-and-found-v-2-backend.vercel.app/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('User deleted successfully!');
      fetchUsers(currentPage); // Refresh users for the current page
    } catch (err) {
      console.error('Error deleting user:', err.response?.data || err.message);
    }
  };

  // Handle promote user to admin
  const handlePromote = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      // await axios.patch(`http://localhost:5000/api/admin/users/${userId}/promote`, {}, {
        await axios.patch(`https://lost-and-found-v-2-backend.vercel.app/api/admin/users/${userId}/promote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('User promoted to admin!');
      fetchUsers(currentPage);
    } catch (err) {
      console.error('Error promoting user:', err.response?.data || err.message);
    }
  };

  // Handle demote admin to user
  const handleDemote = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      // await axios.patch(`http://localhost:5000/api/admin/users/${userId}/demote`, {}, {
        await axios.patch(`https://lost-and-found-v-2-backend.vercel.app/api/admin/users/${userId}/demote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Admin demoted to user!');
      fetchUsers(currentPage);
    } catch (err) {
      console.error('Error demoting admin:', err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Admin: Manage Users</h1>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by username, email, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
        />
      </div>

      {filteredUsers.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Posts</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td> {/* Display plain password */}
                  <td>{user.postCount}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-danger me-2" onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                    {user.role === 'user' && (
                      <button className="btn btn-primary me-2" onClick={() => handlePromote(user._id)}>
                        Promote to Admin
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <button className="btn btn-secondary me-2" onClick={() => handleDemote(user._id)}>
                        Back to User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {[...Array(totalPages).keys()].map((pageNum) => (
                <li
                  key={pageNum}
                  className={`page-item ${currentPage === pageNum + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(pageNum + 1)}
                  >
                    {pageNum + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : (
        <p>No users available.</p>
      )}
    </div>
  );
};

export default AdminUsers;
