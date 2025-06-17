import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const att = await axios.get("/api/admin/attendance");
    const usr = await axios.get("/api/admin/users");
    const lv = await axios.get("/api/admin/leaves");

    setAttendance(att.data);
    setUsers(usr.data);
    setLeaves(lv.data);
  };

  const exportExcel = async () => {
    const res = await axios.get("/api/admin/export", { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendance.xlsx');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Panel</h2>

      <button onClick={exportExcel}>📥 Export Attendance (Excel)</button>

      <h3>All Users</h3>
      <ul>
        {users.map(u => <li key={u._id}>{u.name} ({u.role}) - {u.email}</li>)}
      </ul>

      <h3>Attendance Records</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Student</th>
            <th>Date</th>
            <th>Status</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map(a => (
            <tr key={a._id}>
              <td>{a.studentId}</td>
              <td>{new Date(a.date).toLocaleDateString()}</td>
              <td>{a.status}</td>
              <td>{a.class}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Leave Requests</h3>
      {leaves.map(l => (
        <div key={l._id}>
          <p>📝 {l.reason} by {l.studentId} on {l.date}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
