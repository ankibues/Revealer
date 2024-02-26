const express = require('express');
const path = require('path');
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

// Path to the React build directory
const buildPath = path.join(__dirname, '..', 'build');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});




// Define port and start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


  
  
  
  
  
