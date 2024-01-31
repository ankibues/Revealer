const { Image } = require('../models/imageModel'); // Import the Image model you created
const { fetchImageFromUnsplash} = require('../api/unsplash');

async function addImageToTheme(searchQuery, themeName) {
  const image = await fetchImageFromUnsplash(searchQuery);
  

    try {
      const newImage = new Image({
        url: image.url,
        description: image.description, 
        theme: themeName,
      });
      await newImage.save();
      console.log('Image saved:', image.url);
      return newImage;
    } catch (error) {
      console.error('Error saving image to MongoDB:', error);
      return null;
    }
  }

module.exports = {
    addImageToTheme,
  };
  


// Example usage:
// addImagesToTheme('Wonders of the World', 'wonder');
