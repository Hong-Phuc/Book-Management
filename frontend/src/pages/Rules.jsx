import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5555/rules';

const Rules = () => {
  const [rule, setRule] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  const fetchRule = async () => {
    const res = await axios.get(API_URL);
    setRule(res.data);
    setForm(res.data);
  };

  useEffect(() => { fetchRule(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(API_URL, form);
    setEdit(false);
    fetchRule();
  };

  if (!rule) return <div>Loading...</div>;

  return (
    <div className='p-4'>
      <h1 className='text-2xl mb-4'>Quy Định Hệ Thống</h1>
      {!edit ? (
        <div>
          <div>Tuổi tối thiểu: {rule.minAge}</div>
          <div>Tuổi tối đa: {rule.maxAge}</div>
          <div>Hạn thẻ (tháng): {rule.cardDurationMonths}</div>
          <div>Thể loại: {rule.categories && rule.categories.join(', ')}</div>
          <div>Tối đa tác giả: {rule.maxAuthors}</div>
          <div>Khoảng cách năm xuất bản: {rule.maxPublishYearGap}</div>
          <div>Số sách mượn tối đa: {rule.maxBooksPerBorrow}</div>
          <div>Số ngày mượn tối đa: {rule.maxBorrowDays}</div>
          <div>Tiền phạt/ngày: {rule.finePerDay}</div>
          <button className='mt-4 bg-blue-500 text-white px-3 py-1 rounded' onClick={() => setEdit(true)}>Chỉnh sửa</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 max-w-md'>
          <input name='minAge' value={form.minAge} onChange={handleChange} placeholder='Tuổi tối thiểu' className='border px-2'/>
          <input name='maxAge' value={form.maxAge} onChange={handleChange} placeholder='Tuổi tối đa' className='border px-2'/>
          <input name='cardDurationMonths' value={form.cardDurationMonths} onChange={handleChange} placeholder='Hạn thẻ (tháng)' className='border px-2'/>
          <input name='categories' value={form.categories} onChange={handleChange} placeholder='Thể loại (A,B,C)' className='border px-2'/>
          <input name='maxAuthors' value={form.maxAuthors} onChange={handleChange} placeholder='Tối đa tác giả' className='border px-2'/>
          <input name='maxPublishYearGap' value={form.maxPublishYearGap} onChange={handleChange} placeholder='Khoảng cách năm xuất bản' className='border px-2'/>
          <input name='maxBooksPerBorrow' value={form.maxBooksPerBorrow} onChange={handleChange} placeholder='Số sách mượn tối đa' className='border px-2'/>
          <input name='maxBorrowDays' value={form.maxBorrowDays} onChange={handleChange} placeholder='Số ngày mượn tối đa' className='border px-2'/>
          <input name='finePerDay' value={form.finePerDay} onChange={handleChange} placeholder='Tiền phạt/ngày' className='border px-2'/>
          <button type='submit' className='bg-green-500 text-white px-3 py-1 rounded'>Lưu</button>
          <button type='button' className='bg-gray-400 text-white px-3 py-1 rounded' onClick={() => setEdit(false)}>Hủy</button>
        </form>
      )}
    </div>
  );
};

export default Rules; 