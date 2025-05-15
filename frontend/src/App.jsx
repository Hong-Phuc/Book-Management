import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateBook from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import Members from './pages/Members';
import Borrows from './pages/Borrows';

const App = () => {
  return (
    <>
      <nav style={{ padding: 16, background: '#e3f4fd', marginBottom: 24 }}>
        <Link to='/' style={{ marginRight: 16 }}>Books</Link>
        <Link to='/members' style={{ marginRight: 16 }}>Members</Link>
        <Link to='/borrows'>Borrows</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/books/create' element={<CreateBook />} />
        <Route path='/books/details/:id' element={<ShowBook />} />
        <Route path='/books/edit/:id' element={<EditBook />} />
        <Route path='/books/delete/:id' element={<DeleteBook />} />
        <Route path='/members' element={<Members />} />
        <Route path='/borrows' element={<Borrows />} />
      </Routes>
    </>
  );
};

export default App;
