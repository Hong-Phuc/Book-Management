import { Borrow } from '../models/borrowModel.js';
import { Book } from '../models/bookModel.js';
import { BookCopy } from '../models/bookCopyModel.js';

// Lấy danh sách mượn trả
export const getBorrows = async (req, res) => {
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
export const getBorrowById = async (req, res) => {
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
export const createBorrow = async (req, res) => {
  try {
    // req.body.bookId là _id của Book
    const availableCopy = await BookCopy.findOne({ bookId: req.body.bookId, status: 'available' });
    if (!availableCopy) {
      return res.status(400).json({ message: 'No available copy for this book' });
    }
    // Đánh dấu bản copy này là borrowed
    availableCopy.status = 'borrowed';
    await availableCopy.save();
    // Lưu borrow record, bookId là _id của BookCopy
    const newBorrow = new Borrow({
      ...req.body,
      bookId: availableCopy._id
    });
    await newBorrow.save();
    res.status(201).json(newBorrow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật bản ghi mượn (trả sách)
export const returnBook = async (req, res) => {
  try {
    const updatedBorrow = await Borrow.findByIdAndUpdate(
      req.params.id,
      { status: 'returned', returnDate: new Date() },
      { new: true }
    );
    if (!updatedBorrow) return res.status(404).json({ message: 'Borrow record not found' });
    // Cập nhật trạng thái BookCopy thành "available"
    await BookCopy.findByIdAndUpdate(updatedBorrow.bookId, { status: 'available' });
    res.status(200).json(updatedBorrow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa bản ghi mượn
export const deleteBorrow = async (req, res) => {
  try {
    const deletedBorrow = await Borrow.findByIdAndDelete(req.params.id);
    if (!deletedBorrow) return res.status(404).json({ message: 'Borrow record not found' });
    res.status(200).json({ message: 'Borrow record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 