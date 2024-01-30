const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    score: Number,
    // Add any other relevant fields
});

module.exports = mongoose.model('User', userSchema);
