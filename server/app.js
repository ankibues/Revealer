const express = require('express');
const database = require('../utils/database');
const cors = require('cors');
require('dotenv').config();


// Create Express app
const app = express();


database.connect();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json


// Define port and start server
const PORT = PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


  
  
  
  
  
