const express = require('express');
const database = require('./src/utils/database');
const imageRoutes = require('./src/routes/imageRoutes');
const cors = require('cors');
require('dotenv').config();


// Create Express app
const app = express();
database.connect();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/images', imageRoutes);

// Define port and start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


  
  
  
  
  
