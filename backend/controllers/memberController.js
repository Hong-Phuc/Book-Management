import { Member } from '../models/memberModel.js';

// Lấy danh sách thành viên
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json({ count: members.length, data: members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thành viên theo ID
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo thành viên mới
export const createMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thành viên
export const updateMember = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa thành viên
export const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 