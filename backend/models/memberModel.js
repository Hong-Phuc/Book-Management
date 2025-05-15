import mongoose from 'mongoose';

const memberSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String }
}, { timestamps: true });

export const Member = mongoose.model('Member', memberSchema); 