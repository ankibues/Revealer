const { addImageToTheme } = require('./imageService');
const database = require('../utils/database');
const { Theme } = require('../models/imageModel');
require('dotenv').config();


// Connect to the database first
database.connect();

// Define your query and theme
const query = "Moose";
const themeName ="Animals";

try {
   addImageToTheme(query, themeName,1);
  } 
  
  catch (error) {
    console.error('Error adding image:', error);
}



