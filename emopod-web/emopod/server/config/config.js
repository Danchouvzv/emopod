require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/emopod',
    jwtSecret: process.env.JWT_SECRET || 'emopod_secret_key_123',
    jwtExpiration: '24h'
}; 