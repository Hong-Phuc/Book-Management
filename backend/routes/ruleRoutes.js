const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

// Get all rules
router.get('/', ruleController.getAllRules);

// Get rule by ID
router.get('/:id', ruleController.getRuleById);

// Create new rule
router.post('/', ruleController.createRule);

// Update rule
router.put('/:id', ruleController.updateRule);

// Delete rule
router.delete('/:id', ruleController.deleteRule);

// Get active rules
router.get('/active', ruleController.getActiveRules);

// Get rule by name
router.get('/name/:name', ruleController.getRuleByName);

module.exports = router; 