import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="navbar-brand" style={{ flex: '1', display: 'flex', alignItems: 'center' }}>
        <img src="/Logo.jpg" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <h3 style={{ margin: 0, lineHeight: '40px' }}>TransStadia</h3>
      </div>

      <ul className={`nav-links ${menuOpen ? 'show' : ''}`} onClick={closeMenu} style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0, flex: '1', justifyContent: 'flex-end' }}>
        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
        {user?.role === 'student' && (
          <>
            <li><Link to="/student">Dashboard</Link></li>
            <li><Link to="/scan">Scan QR</Link></li>
          </>
        )}
        {user?.role === 'teacher' && (
          <>
            <li><Link to="/teacher-dashboard">Teacher Dashboard</Link></li>
            <li><Link to="/mark-attendance">Mark Attendance</Link></li>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <li><Link to="/admin">Admin Panel</Link></li>
            <li><Link to="/admin-register">Register User</Link></li>
          </>
        )}
        {user && (
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
