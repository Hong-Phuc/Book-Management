const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const fineReceiptRoutes = require('./routes/fineReceiptRoutes');
const ruleRoutes = require('./routes/ruleRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/fine-receipts', fineReceiptRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
