import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const BooksTable = ({ books, copiesInfo, showCopies, handleAddCopy, handleDeleteCopy }) => {
  return (
    <table className='w-full border-separate border-spacing-2'>
      <thead>
        <tr>
          <th className='border border-slate-600 rounded-md'>No</th>
          <th className='border border-slate-600 rounded-md'>Title</th>
          <th className='border border-slate-600 rounded-md max-md:hidden'>
            Author
          </th>
          <th className='border border-slate-600 rounded-md max-md:hidden'>
            Publish Year
          </th>
          <th className='border border-slate-600 rounded-md'>Total Copies</th>
          <th className='border border-slate-600 rounded-md'>Available Copies</th>
          <th className='border border-slate-600 rounded-md'>Copies</th>
          <th className='border border-slate-600 rounded-md'>Operations</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={book._id} className='h-8'>
            <td className='border border-slate-700 rounded-md text-center'>
              {index + 1}
            </td>
            <td className='border border-slate-700 rounded-md text-center'>
              {book.title}
            </td>
            <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
              {book.author}
            </td>
            <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
              {book.publishYear}
            </td>
            <td className='border border-slate-700 rounded-md text-center'>
              {copiesInfo?.[book._id]?.total ?? '-'}
            </td>
            <td className='border border-slate-700 rounded-md text-center'>
              {copiesInfo?.[book._id]?.available ?? '-'}
            </td>
            <td className='border border-slate-700 rounded-md text-center'>
              <button onClick={() => showCopies(book._id)}>
                View
              </button>
              {showCopies === book._id && (
                <div style={{ background: '#f8fbff', border: '1px solid #b3b3b3', borderRadius: 8, marginTop: 8, padding: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <button onClick={() => handleAddCopy(book._id)} style={{ marginRight: 8 }}>+ Add Copy</button>
                  </div>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Copy #</th>
                        <th>Barcode</th>
                        <th>Status</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {copiesInfo?.[book._id]?.copies?.map((c) => (
                        <tr key={c._id}>
                          <td>{c.copyNumber}</td>
                          <td>{c.barcode}</td>
                          <td>{c.status}</td>
                          <td>
                            <button onClick={() => handleDeleteCopy(c._id, book._id)} disabled={c.status === 'borrowed'} style={{ color: c.status === 'borrowed' ? '#aaa' : 'red' }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </td>
            <td className='border border-slate-700 rounded-md text-center'>
              <div className='flex justify-center gap-x-4'>
                <Link to={`/books/details/${book._id}`}>
                  <BsInfoCircle className='text-2xl text-green-800' />
                </Link>
                <Link to={`/books/edit/${book._id}`}>
                  <AiOutlineEdit className='text-2xl text-yellow-600' />
                </Link>
                <Link to={`/books/delete/${book._id}`}>
                  <MdOutlineDelete className='text-2xl text-red-600' />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BooksTable;
