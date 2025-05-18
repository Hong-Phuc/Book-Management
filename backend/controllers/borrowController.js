const Borrow = require('../models/borrowModel');
const Book = require('../models/bookModel');
const BookCopy = require('../models/bookCopyModel');
const Member = require('../models/memberModel');
const FineReceipt = require('../models/fineReceiptModel');

// Lấy danh sách mượn trả
exports.getBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find().populate('memberId').populate({
      path: 'bookId',
      populate: { path: 'bookId', model: 'Book' }
    });
    res.status(200).json({ count: borrows.length, data: borrows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin mượn trả theo ID
exports.getBorrowById = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id).populate('memberId').populate({
      path: 'bookId',
      populate: { path: 'bookId', model: 'Book' }
    });
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    res.status(200).json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo mới bản ghi mượn sách (theo BookCopy)
exports.createBorrow = async (req, res) => {
  try {
    const { member, book, dueDate, note } = req.body;
    if (!member || !book || !dueDate) {
      return res.status(400).json({ message: 'Member, book and due date are required' });
    }
    const memberExists = await Member.findById(member);
    if (!memberExists) {
      return res.status(404).json({ message: 'Member not found' });
    }
    if (memberExists.status !== 'active') {
      return res.status(400).json({ message: 'Member is not active' });
    }
    const bookExists = await Book.findById(book);
    if (!bookExists) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (bookExists.availableQuantity <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }
    const activeBorrows = await Borrow.countDocuments({
      member,
      status: 'borrowed'
    });
    if (activeBorrows >= 5) {
      return res.status(400).json({ message: 'Member has reached maximum borrow limit' });
    }
    const borrow = new Borrow({
      member,
      book,
      borrowDate: new Date(),
      dueDate,
      note
    });
    bookExists.availableQuantity -= 1;
    await bookExists.save();
    const savedBorrow = await borrow.save();
    res.status(201).json(savedBorrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật bản ghi mượn (trả sách)
exports.returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }
    if (borrow.status === 'returned') {
      return res.status(400).json({ message: 'Book has already been returned' });
    }
    const returnDate = new Date();
    const dueDate = new Date(borrow.dueDate);
    let fine = 0;
    if (returnDate > dueDate) {
      const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 1000;
      const fineReceipt = new FineReceipt({
        member: borrow.member,
        borrow: borrow._id,
        amount: fine,
        reason: `Late return: ${daysLate} days`,
        issueDate: returnDate
      });
      await fineReceipt.save();
    }
    borrow.returnDate = returnDate;
    borrow.status = 'returned';
    borrow.fine = fine;
    await borrow.save();
    const book = await Book.findById(borrow.book);
    book.availableQuantity += 1;
    await book.save();
    res.status(200).json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bản ghi mượn
exports.deleteBorrow = async (req, res) => {
  try {
    const deletedBorrow = await Borrow.findByIdAndDelete(req.params.id);
    if (!deletedBorrow) return res.status(404).json({ message: 'Borrow record not found' });
    res.status(200).json({ message: 'Borrow record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all borrows
exports.getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate('member', 'fullName email phone')
      .populate('book', 'bookCode title authors')
      .sort({ createdAt: -1 });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get member's borrows
exports.getMemberBorrows = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const borrows = await Borrow.find({ member: memberId })
      .populate('book', 'bookCode title authors')
      .sort({ createdAt: -1 });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get book's borrows
exports.getBookBorrows = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const borrows = await Borrow.find({ book: bookId })
      .populate('member', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get overdue borrows
exports.getOverdueBorrows = async (req, res) => {
  try {
    const now = new Date();
    const borrows = await Borrow.find({
      status: 'borrowed',
      dueDate: { $lt: now }
    })
      .populate('member', 'fullName email phone')
      .populate('book', 'bookCode title authors')
      .sort({ dueDate: 1 });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 