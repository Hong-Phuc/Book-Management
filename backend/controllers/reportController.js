const Report = require('../models/reportModel');
const Book = require('../models/bookModel');
const Member = require('../models/memberModel');
const Borrow = require('../models/borrowModel');
const FineReceipt = require('../models/fineReceiptModel');
const BorrowStats = require('../models/reportModel').BorrowStats;
const LateReturnStats = require('../models/reportModel').LateReturnStats;

exports.createBorrowStats = async (req, res) => {
  try {
    const { month, category, borrowCount, ratio } = req.body;
    const stats = await BorrowStats.create({ month, category, borrowCount, ratio });
    res.status(201).json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBorrowStats = async (req, res) => {
  try {
    const { month } = req.query;
    const stats = month ? await BorrowStats.find({ month }) : await BorrowStats.find();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLateReturnStats = async (req, res) => {
  try {
    const { date, bookTitle, borrowDate, lateDays } = req.body;
    const stats = await LateReturnStats.create({ date, bookTitle, borrowDate, lateDays });
    res.status(201).json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLateReturnStats = async (req, res) => {
  try {
    const { date } = req.query;
    const stats = date ? await LateReturnStats.find({ date }) : await LateReturnStats.find();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new report
exports.createReport = async (req, res) => {
    try {
        const {
            type,
            title,
            startDate,
            endDate,
            createdBy
        } = req.body;
        if (!type || !title || !startDate || !endDate || !createdBy) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const data = await generateReportData(type, startDate, endDate);
        const report = new Report({
            type,
            title,
            startDate,
            endDate,
            data,
            createdBy,
            updatedBy: createdBy
        });
        const savedReport = await report.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update report
exports.updateReport = async (req, res) => {
    try {
        const {
            title,
            data,
            status,
            updatedBy
        } = req.body;
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        report.title = title || report.title;
        report.data = data || report.data;
        report.status = status || report.status;
        report.updatedBy = updatedBy || report.updatedBy;
        const updatedReport = await report.save();
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete report
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        await Report.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate report data
async function generateReportData(type, startDate, endDate) {
    const data = {
        totalBooks: 0,
        totalBorrows: 0,
        totalReturns: 0,
        totalFines: 0,
        totalMembers: 0,
        categoryStats: [],
        memberTypeStats: [],
        fineStats: {
            total: 0,
            paid: 0,
            pending: 0
        }
    };
    try {
        data.totalBooks = await Book.countDocuments();
        data.totalMembers = await Member.countDocuments();
        const borrows = await Borrow.find({
            borrowDate: { $gte: startDate, $lte: endDate }
        });
        data.totalBorrows = borrows.length;
        data.totalReturns = borrows.filter(b => b.status === 'returned').length;
        const categories = await Book.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        data.categoryStats = categories.map(cat => ({
            category: cat._id,
            count: cat.count
        }));
        const memberTypes = await Member.aggregate([
            { $group: { _id: '$memberType', count: { $sum: 1 } } }
        ]);
        data.memberTypeStats = memberTypes.map(type => ({
            type: type._id,
            count: type.count
        }));
        const fines = await FineReceipt.find({
            issueDate: { $gte: startDate, $lte: endDate }
        });
        data.totalFines = fines.reduce((sum, fine) => sum + fine.amount, 0);
        data.fineStats.paid = fines
            .filter(fine => fine.status === 'paid')
            .reduce((sum, fine) => sum + fine.amount, 0);
        data.fineStats.pending = fines
            .filter(fine => fine.status === 'pending')
            .reduce((sum, fine) => sum + fine.amount, 0);
        data.fineStats.total = data.fineStats.paid + data.fineStats.pending;
        return data;
    } catch (error) {
        throw new Error('Error generating report data: ' + error.message);
    }
}

// Get reports by type
exports.getReportsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const reports = await Report.find({ type }).sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reports by date range
exports.getReportsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const reports = await Report.find({
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        }).sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 