const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Get all books
router.get('/', bookController.getAllBooks);

// Get book by ID
router.get('/:id', bookController.getBookById);

// Create new book
router.post('/', bookController.createBook);

// Update book
router.put('/:id', bookController.updateBook);

// Delete book
router.delete('/:id', bookController.deleteBook);

// Search books
router.get('/search', bookController.searchBooks);

module.exports = router; 