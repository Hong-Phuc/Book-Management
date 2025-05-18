import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateBook from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import Members from './pages/Members';
import Borrows from './pages/Borrows';
import FineReceipts from './pages/FineReceipts';
import Report from './pages/Report';
import Rules from './pages/Rules';

const App = () => {
  return (
    <>
      <nav style={{ padding: 16, background: '#e3f4fd', marginBottom: 24 }}>
        <Link to='/' style={{ marginRight: 16 }}>Books</Link>
        <Link to='/members' style={{ marginRight: 16 }}>Members</Link>
        <Link to='/borrows' style={{ marginRight: 16 }}>Borrows</Link>
        <Link to='/fine-receipts' style={{ marginRight: 16 }}>Phiếu phạt</Link>
        <Link to='/reports' style={{ marginRight: 16 }}>Báo cáo</Link>
        <Link to='/rules'>Quy định</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/books/create' element={<CreateBook />} />
        <Route path='/books/details/:id' element={<ShowBook />} />
        <Route path='/books/edit/:id' element={<EditBook />} />
        <Route path='/books/delete/:id' element={<DeleteBook />} />
        <Route path='/members' element={<Members />} />
        <Route path='/borrows' element={<Borrows />} />
        <Route path='/fine-receipts' element={<FineReceipts />} />
        <Route path='/reports' element={<Report />} />
        <Route path='/rules' element={<Rules />} />
      </Routes>
    </>
  );
};

export default App;
