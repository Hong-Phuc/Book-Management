import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const API_URL = 'http://localhost:5555/books';

const inputStyle = {
  padding: '8px',
  marginRight: '8px',
  border: '1px solid #b3b3b3',
  borderRadius: '4px',
  minWidth: '120px',
};
const buttonStyle = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  background: '#4fc3f7',
  color: '#222',
  cursor: 'pointer',
};

const CreateBooks = () => {
  const [form, setForm] = useState({ title: '', author: '', publishYear: '', quantity: 1 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, form);
      enqueueSnackbar('Book Created successfully', { variant: 'success' });
      navigate('/');
    } catch (e) {
      enqueueSnackbar('Error', { variant: 'error' });
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Title</label>
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Author</label>
            <input
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
            <input
              name="publishYear"
              placeholder="Publish Year"
              value={form.publishYear}
              onChange={handleChange}
              required
              style={inputStyle}
              type="number"
              min="0"
            />
          </div>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Quantity</label>
            <input
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              style={inputStyle}
              type="number"
              min="1"
            />
          </div>
          <button type="submit" style={buttonStyle} disabled={loading}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBooks