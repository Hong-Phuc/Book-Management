module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/library',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development'
};

