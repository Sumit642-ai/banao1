import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupForm({ onSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', profilePic: '', username: '',
    email: '', password: '', confirmPassword: '', userType: 'Patient',
    address: { line1: '', city: '', state: '', pincode: '' }
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePic: reader.result });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (['line1', 'city', 'state', 'pincode'].includes(name)) {
      setForm({ ...form, address: { ...form.address, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
    } else {
      setError('');
      onSignup(form);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <div className="form-grid">
        <select name="userType" onChange={handleChange} value={form.userType}>
          <option>Patient</option>
          <option>Doctor</option>
        </select>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="file" name="profilePic" accept="image/*" onChange={handleChange} required />
        {/* Password field with eye icon */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{ width: '93%', paddingRight: '40px' }}
          />
          <i
            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#4f46e5'
            }}
          ></i>
        </div>

        {/* Confirm Password field with eye icon */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            style={{ width: '93%', paddingRight: '40px' }}
          />
          <i
            className={`fa ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowConfirm(!showConfirm)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#4f46e5'
            }}
          ></i>
        </div>


        <input type="text" name="line1" placeholder="Address Line 1" onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" onChange={handleChange} required />
        <input type="text" name="state" placeholder="State" onChange={handleChange} required />
        <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} required />
      </div>

      {form.profilePic && <img src={form.profilePic} alt="Preview" className="preview" />}
      {error && <p className="error">{error}</p>}
      <button type="submit">Create Account</button>

      <p style={{ textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default SignupForm;
