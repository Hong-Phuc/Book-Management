import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const API_URL = 'http://localhost:5555/books';

const EditBook = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', author: '', publishYear: '' });
  const [copiesInfo, setCopiesInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/${id}`).then(res => {
      setForm({
        title: res.data.title,
        author: res.data.author,
        publishYear: res.data.publishYear,
      });
      setLoading(false);
    });
    axios.get(`${API_URL}/${id}/copies`).then(res => setCopiesInfo(res.data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.put(`${API_URL}/${id}`, form);
    setLoading(false);
    navigate('/');
  };

  const handleAddCopy = async () => {
    await axios.post(`${API_URL}/${id}/copies`);
    const res = await axios.get(`${API_URL}/${id}/copies`);
    setCopiesInfo(res.data);
  };

  const handleDeleteCopy = async (copyId) => {
    await axios.delete(`${API_URL}/copies/${copyId}`);
    const res = await axios.get(`${API_URL}/${id}/copies`);
    setCopiesInfo(res.data);
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Book</h1>
      <form onSubmit={handleSubmit} className='border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            name='title'
            value={form.title}
            onChange={handleChange}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input
            type='text'
            name='author'
            value={form.author}
            onChange={handleChange}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input
            type='number'
            name='publishYear'
            value={form.publishYear}
            onChange={handleChange}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button type='submit' className='p-2 bg-sky-300 m-8 w-full'>Save</button>
      </form>
      {copiesInfo && (
        <div className='border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto mt-8'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Total Copies:</span>
            <span>{copiesInfo.total}</span>
            <span className='text-xl ml-8 mr-4 text-gray-500'>Available:</span>
            <span>{copiesInfo.available}</span>
            <button onClick={handleAddCopy} className='ml-8 px-2 py-1 bg-green-300 rounded'>+ Add Copy</button>
          </div>
          <div className='mt-4'>
            <table className='w-full border border-slate-400'>
              <thead>
                <tr>
                  <th>Copy #</th>
                  <th>Barcode</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {copiesInfo.copies.map(c => (
                  <tr key={c._id}>
                    <td>{c.copyNumber}</td>
                    <td>{c.barcode}</td>
                    <td>{c.status}</td>
                    <td>
                      <button onClick={() => handleDeleteCopy(c._id)} disabled={c.status === 'borrowed'} style={{ color: c.status === 'borrowed' ? '#aaa' : 'red' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBook;