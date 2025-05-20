import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reports';

const Report = () => {
  const [borrowStats, setBorrowStats] = useState([]);
  const [lateStats, setLateStats] = useState([]);

  useEffect(() => {
    const fetchBorrowStats = async () => {
      const res = await axios.get(`${API_URL}/borrow-stats`);
      setBorrowStats(res.data);
    };
    const fetchLateStats = async () => {
      const res = await axios.get(`${API_URL}/late-return-stats`);
      setLateStats(res.data);
    };
    fetchBorrowStats();
    fetchLateStats();
  }, []);

  const totalBorrowCount = borrowStats.reduce((sum, s) => sum + (s.borrowCount || 0), 0);
  const totalLateCount = lateStats.length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-900 drop-shadow-lg">Thống Kê Thư Viện</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Card 1: Thống kê mượn theo thể loại */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">Thống Kê Mượn Sách Theo Thể Loại</h2>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-3 py-2">STT</th>
                <th className="px-3 py-2">Thể Loại</th>
                <th className="px-3 py-2">Số Lượt Mượn</th>
                <th className="px-3 py-2">Tỉ Lệ</th>
              </tr>
            </thead>
            <tbody>
              {borrowStats.map((s, i) => (
                <tr key={i} className="even:bg-blue-50">
                  <td className="text-center py-2">{i + 1}</td>
                  <td className="py-2 font-medium">{s.category}</td>
                  <td className="text-center py-2">{s.borrowCount}</td>
                  <td className="text-center py-2">{s.ratio}</td>
                </tr>
              ))}
              {borrowStats.length === 0 && (
                <tr><td colSpan={4} className="text-center py-4 text-gray-400">Không có dữ liệu.</td></tr>
              )}
            </tbody>
          </table>
          <div className="mt-4 text-right text-blue-800 font-semibold">Tổng số lượt mượn: {totalBorrowCount}</div>
        </div>
        {/* Card 2: Thống kê sách trả trễ */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-red-700 mb-4 text-center">Thống Kê Sách Trả Trễ</h2>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-red-100 text-red-900">
                <th className="px-3 py-2">STT</th>
                <th className="px-3 py-2">Tên Sách</th>
                <th className="px-3 py-2">Ngày Mượn</th>
                <th className="px-3 py-2">Số Ngày Trả Trễ</th>
              </tr>
            </thead>
            <tbody>
              {lateStats.map((s, i) => (
                <tr key={i} className="even:bg-red-50">
                  <td className="text-center py-2">{i + 1}</td>
                  <td className="py-2 font-medium">{s.bookTitle}</td>
                  <td className="text-center py-2">{formatDate(s.borrowDate)}</td>
                  <td className="text-center py-2 text-red-600 font-bold">{s.lateDays}</td>
                </tr>
              ))}
              {lateStats.length === 0 && (
                <tr><td colSpan={4} className="text-center py-4 text-gray-400">Không có sách trả trễ.</td></tr>
              )}
            </tbody>
          </table>
          <div className="mt-4 text-right text-red-700 font-semibold">Tổng số sách trả trễ: {totalLateCount}</div>
        </div>
      </div>
    </div>
  );
};

export default Report; 