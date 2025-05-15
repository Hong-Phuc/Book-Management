import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5555/borrows';
const BOOKS_URL = 'http://localhost:5555/books';
const MEMBERS_URL = 'http://localhost:5555/members';

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

const Borrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ memberId: '', bookId: '', dueDate: '' });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, mRes, brRes] = await Promise.all([
        axios.get(BOOKS_URL),
        axios.get(MEMBERS_URL),
        axios.get(API_URL)
      ]);
      setBooks(bRes.data.data);
      setMembers(mRes.data.data);
      setBorrows(brRes.data.data);
    } catch (e) {
      setBooks([]);
      setMembers([]);
      setBorrows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, form);
      setForm({ memberId: '', bookId: '', dueDate: '' });
      await fetchAll();
    } catch (e) {}
    setLoading(false);
  };

  const handleReturn = async (id) => {
    setLoading(true);
    await axios.patch(`${API_URL}/${id}/return`);
    await fetchAll();
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h2>Borrow/Return Books</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#e3f4fd', padding: 16, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <select name="memberId" value={form.memberId} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Member</option>
          {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <select name="bookId" value={form.bookId} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Book</option>
          {books.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
        </select>
        <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={buttonStyle} disabled={loading}>Borrow</button>
      </form>
      {loading ? <div>Loading...</div> : (
        borrows.length === 0 ? <div style={{marginTop: 24}}>No borrow records found.</div> : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtdStyle}>No</th>
              <th style={thtdStyle}>Member</th>
              <th style={thtdStyle}>Book</th>
              <th style={thtdStyle}>Copy</th>
              <th style={thtdStyle}>Barcode</th>
              <th style={thtdStyle}>Borrow Date</th>
              <th style={thtdStyle}>Due Date</th>
              <th style={thtdStyle}>Return Date</th>
              <th style={thtdStyle}>Status</th>
              <th style={thtdStyle}>Operations</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((br, idx) => (
              <tr key={br._id}>
                <td style={thtdStyle}>{idx + 1}</td>
                <td style={thtdStyle}>{br.memberId?.name}</td>
                <td style={thtdStyle}>{br.bookId?.bookId?.title || ''}</td>
                <td style={thtdStyle}>{br.bookId?.copyNumber}</td>
                <td style={thtdStyle}>{br.bookId?.barcode}</td>
                <td style={thtdStyle}>{br.borrowDate ? new Date(br.borrowDate).toLocaleDateString() : ''}</td>
                <td style={thtdStyle}>{br.dueDate ? new Date(br.dueDate).toLocaleDateString() : ''}</td>
                <td style={thtdStyle}>{br.returnDate ? new Date(br.returnDate).toLocaleDateString() : ''}</td>
                <td style={thtdStyle}>{br.status}</td>
                <td style={thtdStyle}>
                  {br.status === 'borrowed' && <button style={buttonStyle} onClick={() => handleReturn(br._id)} disabled={loading}>Return</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )
      )}
    </div>
  );
};

export default Borrows; 