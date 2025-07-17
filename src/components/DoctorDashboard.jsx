import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIES = [
  'Mental Health',
  'Heart Disease',
  'Covid19',
  'Immunization'
];

function DoctorDashboard({ user, onLogout }) {
  const [form, setForm] = useState({
    title: '',
    image: null,
    category: CATEGORIES[0],
    summary: '',
    content: '',
    is_draft: false
  });
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blogs/mine', {
        params: { doctor_id: user.id }
      });
      setMyBlogs(res.data);
    } catch (err) {
      setError('Failed to fetch your blogs');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (type === 'file') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('doctor_id', user.id);
      formData.append('title', form.title);
      formData.append('image', form.image);
      formData.append('category', form.category);
      formData.append('summary', form.summary);
      formData.append('content', form.content);
      formData.append('is_draft', form.is_draft);
      await axios.post('http://localhost:5000/api/blogs', formData);
      setForm({ title: '', image: null, category: CATEGORIES[0], summary: '', content: '', is_draft: false });
      fetchMyBlogs();
    } catch (err) {
      setError('Failed to upload blog');
    }
    setLoading(false);
  };

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

      <div className="form-container" style={{marginTop: '30px'}}>
        <h3>Upload New Blog Post</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-grid">
            <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <input type="file" name="image" accept="image/*" onChange={handleChange} required />
            <select name="category" value={form.category} onChange={handleChange} required>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <textarea name="summary" placeholder="Summary" value={form.summary} onChange={handleChange} required rows={2} />
          <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required rows={4} />
          <label style={{display:'block',margin:'10px 0'}}>
            <input type="checkbox" name="is_draft" checked={form.is_draft} onChange={handleChange} /> Mark as Draft
          </label>
          <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload Blog'}</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>

      <div style={{marginTop:'40px',textAlign:'left'}}>
        <h3 style={{textAlign:'center'}}>My Blog Posts</h3>
        <ul style={{listStyle:'none',padding:0}}>
          {myBlogs.map(blog => (
            <li key={blog.id} style={{marginBottom:'2em',border:'1px solid #eee',borderRadius:'8px',padding:'16px',background:'#fafbff'}}>
              <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                {blog.image_url && <img src={`http://localhost:5000${blog.image_url}`} alt="blog" style={{width:70,height:70,objectFit:'cover',borderRadius:'8px',border:'1px solid #ddd'}} />}
                <div>
                  <strong>{blog.title}</strong> <span style={{fontSize:'0.9em',color:'#888'}}>({blog.category})</span><br />
                  <span>{blog.summary}</span><br />
                  <span style={{color: blog.is_draft ? 'orange' : 'green',fontWeight:'bold'}}>{blog.is_draft ? 'Draft' : 'Published'}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DoctorDashboard;
