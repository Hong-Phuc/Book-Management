import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5555/reports';

const Report = () => {
  const [borrowStats, setBorrowStats] = useState([]);
  const [lateStats, setLateStats] = useState([]);
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');

  const fetchBorrowStats = async () => {
    const res = await axios.get(`${API_URL}/borrow-stats${month ? `?month=${month}` : ''}`);
    setBorrowStats(res.data);
  };
  const fetchLateStats = async () => {
    const res = await axios.get(`${API_URL}/late-return-stats${date ? `?date=${date}` : ''}`);
    setLateStats(res.data);
  };

  useEffect(() => { fetchBorrowStats(); fetchLateStats(); }, []);

  return (
    <div className='p-4'>
      <h1 className='text-2xl mb-4'>Báo Cáo Thống Kê</h1>
      <div className='mb-8'>
        <h2 className='text-xl mb-2'>BM7.1: Thống kê mượn theo thể loại</h2>
        <input value={month} onChange={e => setMonth(e.target.value)} placeholder='Tháng (MM-YYYY)' className='border px-2 mr-2'/>
        <button onClick={fetchBorrowStats} className='bg-gray-400 px-2 py-1 rounded'>Lọc</button>
        <table className='w-full border mt-2'>
          <thead>
            <tr className='bg-gray-200'>
              <th>Thể loại</th>
              <th>Số lượt mượn</th>
              <th>Tỉ lệ</th>
              <th>Tháng</th>
            </tr>
          </thead>
          <tbody>
            {borrowStats.map((s, i) => (
              <tr key={i} className='border-t'>
                <td>{s.category}</td>
                <td>{s.borrowCount}</td>
                <td>{s.ratio}</td>
                <td>{s.month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className='text-xl mb-2'>BM7.2: Thống kê sách trả trễ</h2>
        <input value={date} onChange={e => setDate(e.target.value)} placeholder='Ngày (YYYY-MM-DD)' className='border px-2 mr-2'/>
        <button onClick={fetchLateStats} className='bg-gray-400 px-2 py-1 rounded'>Lọc</button>
        <table className='w-full border mt-2'>
          <thead>
            <tr className='bg-gray-200'>
              <th>Tên sách</th>
              <th>Ngày mượn</th>
              <th>Số ngày trả trễ</th>
              <th>Ngày thống kê</th>
            </tr>
          </thead>
          <tbody>
            {lateStats.map((s, i) => (
              <tr key={i} className='border-t'>
                <td>{s.bookTitle}</td>
                <td>{new Date(s.borrowDate).toLocaleDateString()}</td>
                <td>{s.lateDays}</td>
                <td>{new Date(s.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report; 