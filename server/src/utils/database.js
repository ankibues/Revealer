const mongoose = require('mongoose');
MONGO_URI= process.env.MONGO_URI;


const connectToDatabase = async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); // Exit process with failure
    }
  };
  
  module.exports = {
    connect: connectToDatabase
  };