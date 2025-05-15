import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const API_URL = 'http://localhost:5555/books';

const ShowBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [copiesInfo, setCopiesInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/${id}`).then(res => setBook(res.data));
    axios.get(`${API_URL}/${id}/copies`).then(res => setCopiesInfo(res.data));
    setLoading(false);
  }, [id]);

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show Book</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Id</span>
            <span>{book._id}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Title</span>
            <span>{book.title}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Author</span>
            <span>{book.author}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Publish Year</span>
            <span>{book.publishYear}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Create Time</span>
            <span>{new Date(book.createdAt).toString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
            <span>{new Date(book.updatedAt).toString()}</span>
          </div>
          {copiesInfo && (
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Total Copies:</span>
              <span>{copiesInfo.total}</span>
              <span className='text-xl ml-8 mr-4 text-gray-500'>Available:</span>
              <span>{copiesInfo.available}</span>
              <div className='mt-4'>
                <table className='w-full border border-slate-400'>
                  <thead>
                    <tr>
                      <th>Copy #</th>
                      <th>Barcode</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {copiesInfo.copies.map(c => (
                      <tr key={c._id}>
                        <td>{c.copyNumber}</td>
                        <td>{c.barcode}</td>
                        <td>{c.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowBook;
