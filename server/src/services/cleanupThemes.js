const { addImageToTheme } = require('./imageService');
const database = require('../utils/database');
const { Image, Theme } = require('../models/imageModel');
require('dotenv').config();


// Connect to the database first
database.connect();

async function cleanupOrphanImages() {
    // Fetch all valid image IDs
    const validImageIds = await Image.find().distinct('_id');
  
    // Convert to strings for comparison purposes
    const validImageIdStrings = validImageIds.map(id => id.toString());
  
    // Find themes and iterate over them to clean up invalid image references
    const themes = await Theme.find();
  
    for (let theme of themes) {
      // Filter out invalid image IDs
      const filteredImages = theme.images.filter(imageId => 
        validImageIdStrings.includes(imageId.toString())
      );
  
      // Check if any IDs were filtered out
      if (filteredImages.length !== theme.images.length) {
        // Update the theme with the filtered image IDs
        theme.images = filteredImages;
        await theme.save();
        console.log(`Cleaned up theme ${theme.name}`);
      }
    }
  }
  
  cleanupOrphanImages()
  .then(() => console.log('Cleanup complete'))
  .catch(err => console.error('Cleanup failed', err));

  