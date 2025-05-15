import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5555/members';

const inputStyle = {
  padding: '8px',
  marginRight: '8px',
  border: '1px solid #b3b3b3',
  borderRadius: '4px',
  minWidth: '120px',
};
const buttonStyle = {
  padding: '8px 16px',
  marginRight: '8px',
  border: 'none',
  borderRadius: '4px',
  background: '#4fc3f7',
  color: '#222',
  cursor: 'pointer',
};
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#f8fbff',
};
const thtdStyle = {
  border: '1px solid #b3b3b3',
  padding: '8px',
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setMembers(res.data.data);
    } catch (e) {
      setMembers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: '', email: '', phone: '', address: '' });
      setEditingId(null);
      await fetchMembers();
    } catch (e) {}
    setLoading(false);
  };

  const handleEdit = (member) => {
    setForm({ name: member.name, email: member.email, phone: member.phone, address: member.address });
    setEditingId(member._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await axios.delete(`${API_URL}/${id}`);
    await fetchMembers();
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2>Members List</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#e3f4fd', padding: 16, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} style={inputStyle} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} style={inputStyle} />
        <button type="submit" style={buttonStyle} disabled={loading}>{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" style={{...buttonStyle, background:'#bdbdbd'}} onClick={() => { setForm({ name: '', email: '', phone: '', address: '' }); setEditingId(null); }}>Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtdStyle}>No</th>
              <th style={thtdStyle}>Name</th>
              <th style={thtdStyle}>Email</th>
              <th style={thtdStyle}>Phone</th>
              <th style={thtdStyle}>Address</th>
              <th style={thtdStyle}>Operations</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, idx) => (
              <tr key={m._id}>
                <td style={thtdStyle}>{idx + 1}</td>
                <td style={thtdStyle}>{m.name}</td>
                <td style={thtdStyle}>{m.email}</td>
                <td style={thtdStyle}>{m.phone}</td>
                <td style={thtdStyle}>{m.address}</td>
                <td style={thtdStyle}>
                  <button style={buttonStyle} onClick={() => handleEdit(m)} disabled={loading}>Edit</button>
                  <button style={{...buttonStyle, background:'#ff5252', color:'#fff'}} onClick={() => handleDelete(m._id)} disabled={loading}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Members; 