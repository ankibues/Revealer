const { Image, Theme } = require('../models/imageModel'); // Import the Image model you created
const { fetchImageFromUnsplash} = require('../api/unsplash');

async function addImageToTheme(searchQuery, themeName, nthImage) {

  try {
  const image = await fetchImageFromUnsplash(searchQuery,undefined, nthImage);

  const theme = await Theme.findOne({name:themeName});
  
  if (!theme) {
    console.log('Theme not found');
    return;
  }

  const newImage = new Image({
   url: image.url,
   answer: searchQuery, 
   theme: theme._id,
   credit: image.credit, 
   crediturl: image.crediturl, 
  });

      await newImage.save();
      console.log('Image added successfully to the theme:', newImage);
      theme.images.push(newImage._id);
      await theme.save();
      console.log('Updated theme with new image:', theme);
      
  } catch (error){
    console.error('Error updating image:', error);
  }

  }


module.exports = { 
  addImageToTheme,
  }
  