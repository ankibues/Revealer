const { Image } = require('../models/imageModel'); // Import the Image model you created

async function addImageToTheme(themeName, searchQuery) {
  const image = await fetchImageFromUnsplash(searchQuery);
  

    try {
      const newImage = new Image({
        url: image.url,
        description: image.description, 
        theme: themeName,
      });
      await newImage.save();
      console.log('Image saved:', image.url);
    } catch (error) {
      console.error('Error saving image to MongoDB:', error);
    }
  }

module.exports = {
    addImageToTheme,
  };
  


// Example usage:
// addImagesToTheme('Wonders of the World', 'wonder');
