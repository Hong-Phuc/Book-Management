const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// BM7.1
router.post('/borrow-stats', reportController.createBorrowStats);
router.get('/borrow-stats', reportController.getBorrowStats);

// BM7.2
router.post('/late-return-stats', reportController.createLateReturnStats);
router.get('/late-return-stats', reportController.getLateReturnStats);

// Get all reports
router.get('/', reportController.getAllReports);

// Get report by ID
router.get('/:id', reportController.getReportById);

// Create new report
router.post('/', reportController.createReport);

// Update report
router.put('/:id', reportController.updateReport);

// Delete report
router.delete('/:id', reportController.deleteReport);

// Get reports by type
router.get('/type/:type', reportController.getReportsByType);

// Get reports by date range
router.get('/date-range', reportController.getReportsByDateRange);

module.exports = router; 