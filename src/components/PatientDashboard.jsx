import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CATEGORIES = [
  'Mental Health',
  'Heart Disease',
  'Covid19',
  'Immunization'
];

function truncateSummary(summary) {
  const words = summary.split(' ');
  if (words.length <= 15) return summary;
  return words.slice(0, 15).join(' ') + '...';
}

function PatientDashboard({ user, onLogout }) {
  const [blogsByCategory, setBlogsByCategory] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const all = {};
      for (let cat of CATEGORIES) {
        const res = await axios.get('http://localhost:5000/api/blogs', { params: { category: cat } });
        all[cat] = res.data;
      }
      setBlogsByCategory(all);
    } catch (err) {
      setError('Failed to fetch blogs');
    }
  };

  return (
    <div className="dashboard">
      <h2>Patient Dashboard</h2>
      <img src={user.profilePic} className="preview" alt="Profile" />
      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Type:</strong> {user.userType}</p>
      <p><strong>Address:</strong> {user.address.line1}, {user.address.city}, {user.address.state} - {user.address.pincode}</p>
      <button onClick={onLogout}>Logout</button>

      <div style={{marginTop:'30px'}}>
        <h3>Blog Posts by Category</h3>
        {error && <div className="error">{error}</div>}
        {CATEGORIES.map(cat => (
          <div key={cat} style={{marginBottom:'2em'}}>
            <h4 style={{color:'#4f46e5'}}>{cat}</h4>
            <ul style={{listStyle:'none',padding:0}}>
              {(blogsByCategory[cat] || []).map(blog => (
                <li key={blog.id} style={{marginBottom:'1em',border:'1px solid #eee',borderRadius:'8px',padding:'16px',background:'#fafbff'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                    {blog.image_url && <img src={`http://localhost:5000${blog.image_url}`} alt="blog" style={{width:70,height:70,objectFit:'cover',borderRadius:'8px',border:'1px solid #ddd'}} />}
                    <div>
                      <strong>{blog.title}</strong><br />
                      <span>{truncateSummary(blog.summary)}</span>
                    </div>
                  </div>
                </li>
              ))}
              {(!blogsByCategory[cat] || blogsByCategory[cat].length === 0) && <li style={{color:'#888'}}>No posts in this category.</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientDashboard;
