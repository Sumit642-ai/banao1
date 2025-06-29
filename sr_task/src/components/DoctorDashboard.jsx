import React from 'react';

function DoctorDashboard({ user, onLogout }) {
  return (
    <div className="dashboard">
      <h2>Doctor Dashboard</h2>
      <img src={user.profilePic} className="preview" alt="Profile" />
      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Type:</strong> {user.userType}</p>
      <p><strong>Address:</strong> {user.address.line1}, {user.address.city}, {user.address.state} - {user.address.pincode}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default DoctorDashboard;
