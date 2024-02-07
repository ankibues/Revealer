const { addImageToTheme } = require('./imageService');
const database = require('../utils/database');
const { Theme } = require('../models/imageModel');
require('dotenv').config();


// Connect to the database first
database.connect();

// Define your query and theme
const query = "Machu Picchu";
const themeName ="Wonders";

try {
   addImageToTheme(query, themeName,2);
  } 
  
  catch (error) {
    console.error('Error adding image:', error);
}



