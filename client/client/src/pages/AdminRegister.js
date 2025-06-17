import React, { useState } from 'react';
import axios from 'axios';

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeId: '',
    password: '',
    role: 'admin'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async () => {
    try {
      // Assuming admin authentication token is stored in localStorage
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/create-user', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Admin user created successfully!');
      setFormData({
        name: '',
        email: '',
        collegeId: '',
        password: '',
        role: 'admin'
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`Error: ${err.response.data.error}`);
      } else {
        setMessage('Error during admin user creation');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Create Admin User</h2>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="collegeId" placeholder="College ID" value={formData.collegeId} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="teacher">Teacher</option>
      </select>
      <button onClick={handleRegister}>Create User</button>
      <p>{message}</p>
    </div>
  );
}

export default AdminRegister;
