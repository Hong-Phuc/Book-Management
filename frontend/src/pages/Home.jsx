import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';

const API_URL = 'http://localhost:5000/api/books';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [copiesInfo, setCopiesInfo] = useState({});
  const [showCopies, setShowCopies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');

  const fetchBooks = async () => {
    setLoading(true);
    const res = await axios.get(API_URL);
    setBooks(res.data);
    setLoading(false);
  };

  const fetchCopiesInfo = async (bookId) => {
    const res = await axios.get(`${API_URL}/${bookId}/copies`);
    setCopiesInfo((prev) => ({ ...prev, [bookId]: res.data }));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    books.forEach((b) => fetchCopiesInfo(b._id));
    // eslint-disable-next-line
  }, [books]);

  const handleAddCopy = async (bookId) => {
    await axios.post(`${API_URL}/${bookId}/copies`);
    fetchCopiesInfo(bookId);
  };

  const handleDeleteCopy = async (copyId, bookId) => {
    await axios.delete(`${API_URL}/copies/${copyId}`);
    fetchCopiesInfo(bookId);
  };

  return (
    <div className='p-4'>
      <div className='flex justify-center items-center gap-x-4'>
        <button
          className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
          onClick={() => setShowType('table')}
        >
          Table
        </button>
        <button
          className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
          onClick={() => setShowType('card')}
        >
          Card
        </button>
      </div>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Books List</h1>
        <Link to='/books/create'>
          <MdOutlineAddBox className='text-sky-800 text-4xl' />
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : showType === 'table' ? (
        <BooksTable books={books} copiesInfo={copiesInfo} showCopies={showCopies} handleAddCopy={handleAddCopy} handleDeleteCopy={handleDeleteCopy} />
      ) : (
        <BooksCard books={books} />
      )}
    </div>
  );
};

export default Home;
