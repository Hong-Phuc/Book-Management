import mongoose from 'mongoose';

const bookCopySchema = mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  copyNumber: { type: Number, required: true },
  status: { type: String, enum: ['available', 'borrowed'], default: 'available' },
  barcode: { type: String },
}, { timestamps: true });

export const BookCopy = mongoose.model('BookCopy', bookCopySchema); 