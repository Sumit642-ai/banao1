import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleSignup = (data) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u) => u.email === data.email)) {
      alert("Email already registered.");
      return;
    }
    users.push(data);
    localStorage.setItem('users', JSON.stringify(users));
    navigate('/login');
  };

  const handleLogin = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      setUserData(foundUser);
      navigate(`/${foundUser.userType.toLowerCase()}`);
    } else {
      alert("Invalid email or password.");
    }
  };

  const handleLogout = () => {
    setUserData(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<SignupForm onSignup={handleSignup} />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/patient" element={<PatientDashboard user={userData} onLogout={handleLogout} />} />
        <Route path="/doctor" element={<DoctorDashboard user={userData} onLogout={handleLogout} />} />
      </Routes>
    </div>
  );
}

export default App;
