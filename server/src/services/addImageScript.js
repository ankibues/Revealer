const { addImageForTheme } = require('./imageService');
const database = require('../utils/database');
require('dotenv').config();


// Connect to the database first
database.connect();

// Define your query and theme
const query = "Taj Mahal";
const themeName = "Wonders of the World";

// Function to add image
async function addImage() {
  try {
    const addedImage = await addImageToTheme(query, themeName);
    console.log('Added image:', addedImage);
  } catch (error) {
    console.error('Error adding image:', error);
  } finally {
    // Close the database connection if needed
    // mongoose.disconnect();
  }
}

addImage();
