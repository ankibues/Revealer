const { addImageToTheme } = require('./imageService');
const database = require('../utils/database');
const { Theme } = require('../models/imageModel');
require('dotenv').config();


// Connect to the database first
database.connect();

// Define your query and theme
const query = "Blue Jay";
const themeName ="Birds";

try {
   addImageToTheme(query, themeName,1);
  } 
  
  catch (error) {
    console.error('Error adding image:', error);
}



