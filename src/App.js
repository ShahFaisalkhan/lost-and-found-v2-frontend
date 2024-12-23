//Important code
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import
import Home from './components/Home';
import PostItem from './components/PostItem';
import ItemDetails from './components/ItemDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import MyItems from './components/MyItems';
import EditItem from './components/EditItem';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import AdminPosts from './components/AdminPosts';
import AdminUsers from './components/AdminUsers';
import ContactUs from './components/ContactUs';
import './App.css';

const SessionExpiredAlert = ({ message, onClose }) => (
  <div className="alert alert-danger fixed-top text-center">
    {message}
    <button className="btn btn-sm btn-danger ms-3" onClick={onClose}>
      Dismiss
    </button>
  </div>
);

const AppContent = () => {
  const navigate = useNavigate();

  // **Helper Functions**
  const isValidToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      // console.log("decoded time and currenttime in app.js is",decoded.exp,currentTime)
      return decoded.exp > currentTime; // Token is valid if expiration time > current time
    } catch {
      return false;
    }
  };

  const isAdminToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.role === 'admin';
    } catch {
      return false;
    }
  };

  // Initialize state dynamically from the token
  const token = localStorage.getItem('token');
  const [isLoggedIn, setIsLoggedIn] = useState(token ? isValidToken(token) : false);
  const [isAdmin, setIsAdmin] = useState(token ? isAdminToken(token) : false);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');
  // console.log("isLoggedIn state and isAdmin state in app.js is",isLoggedIn,isAdmin)
  
  useEffect(() => {
    const restoreSession = () => {
      if (token && isValidToken(token)) {
        setIsLoggedIn(true);
        setIsAdmin(isAdminToken(token));
      } else if (isLoggedIn) {
        // Only trigger token expiration logic if already logged in
        handleTokenExpiration();
      }
    };
  
    restoreSession();
  
    // Periodic token validity check
    const interval = setInterval(() => {
      if (isLoggedIn && token && !isValidToken(token)) {
        handleTokenExpiration();
      }
    }, 50000); // Check every 50 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [token, isLoggedIn]);
  
  const handleTokenExpiration = () => {
    if (!isLoggedIn || sessionExpiredMessage) return; // Skip if not logged in or alert already shown
    setSessionExpiredMessage('Your session has expired. Please log in again.');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setTimeout(() => {
      // setSessionExpiredMessage('');
      navigate('/login');
    }, 3000); // Redirect to login after 3 seconds
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token && isValidToken(token)) {
      setIsLoggedIn(true);
      setIsAdmin(isAdminToken(token));
    } else {
      handleLogout();
    }
  };

  return (
    <>
      {sessionExpiredMessage && (
        <SessionExpiredAlert
          message={sessionExpiredMessage}
          onClose={() => setSessionExpiredMessage('')}
        />
      )}
       
<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container">

    <Link className="navbar-brand logo" to="/">Lost and Found</Link>
    {/* Toggler button for mobile view */}
    <button 
      className="navbar-toggler" 
      type="button" 
      data-bs-toggle="collapse" 
      data-bs-target="#navbarNav" 
      aria-controls="navbarNav" 
      aria-expanded="false" 
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <Link 
            className="nav-link" 
            to="/" 
            onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
          >
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            className="nav-link" 
            to="/contact" 
            onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
          >
            Contact Us
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/post-item" 
                onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
              >
                New Post
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/my-items" 
                onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
              >
                My Posts
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/profile" 
                onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
              >
                Profile
              </Link>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/admin-dashboard" 
                    onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
                  >
                    Admin Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/admin-posts" 
                    onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
                  >
                    Manage Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/admin-users" 
                    onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
                  >
                    Manage Users
                  </Link>
                </li>
              </>
            )}
          </>
        )}
      </ul>
      <ul className="navbar-nav">
        {!isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/login" 
                onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/signup" 
                onClick={() => document.querySelector('#navbarNav').classList.remove('show')}
              >
                Signup
              </Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <button 
              className="btn btn-link nav-link text-light" 
              onClick={() => {
                handleLogout();
                document.querySelector('#navbarNav').classList.remove('show');
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  </div>
</nav>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/post-item" element={isLoggedIn ? <PostItem /> : <Navigate to="/login" />} />
        <Route path="/my-items" element={isLoggedIn ? <MyItems /> : <Navigate to="/login" />} />
        <Route path="/edit-item/:id" element={<EditItem />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={isLoggedIn && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin-posts" element={isLoggedIn && isAdmin ? <AdminPosts /> : <Navigate to="/login" />} />
        <Route path="/admin-users" element={isLoggedIn && isAdmin ? <AdminUsers /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
