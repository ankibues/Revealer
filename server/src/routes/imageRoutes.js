const express = require('express');
const { addImagesToTheme } = require('../services/imageService');
const { Image, Theme } = require('../models/imageModel');

const router = express.Router();

// Endpoint to add images to a theme
router.post('/theme/:themeName/images', async (req, res) => {
  const themeName = req.params.themeName;
  const images = req.body.images; // Expecting an array of image objects in the request body

  try {
    const addedImage = await addImageToTheme(themeName, images);
    res.status(201).json(addedImage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add image to the theme', error });
  }
});

// Endpoint to add theme to database
router.post('/themes', async (req, res) => {
    const { name, startDate, endDate } = req.body;
    try {
      const theme = new Theme({ name, startDate, endDate });
      await theme.save();
      res.status(201).json(theme);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// Endpoint to add a new image to a theme in the database
router.post('/images', async (req, res) => {
    const { url, description, day, theme } = req.body;
    try {
      const image = new Image({ url, description, day, theme });
      await image.save();
      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Endpoint to get an image for a specific day and theme
  router.get('/image-of-the-day/:themeName', async (req, res) => {
    const themeName = req.params.themeName;
    const dayOfWeek = new Date().getDay(); 
  
    try {
      const theme = await Theme.findOne({ name: themeName });
    if (!theme) {
      return res.status(404).send('Theme not found.');
    }

      const image = await Image.findOne({
        theme: theme._id,
        dayOfWeek: dayOfWeek
      });
  
      if (!image) {
        return res.status(404).send('Image not found for today.');
      }
  
      res.json(image);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  





  // Route to get an image by theme
router.get('/by-theme/:theme', async (req, res) => {
  const theme = req.params.theme;

  try {
      // Fetch a single image that matches the theme
      // This example fetches the latest image for the theme
      const image = await Image.findOne({ theme }).sort({ createdAt: -1 });

      if (image) {
          res.json(image);
      } else {
          res.status(404).send('No image found for the given theme');
      }
  } catch (error) {
      res.status(500).send('Error fetching image');
  }
});


router.get('/autocomplete', async(req,res) => {
  try {
    const { searchTerm } = req.query;
    const regex = new RegExp(`^${searchTerm}`, 'i'); // Case insensitive matching
    const suggestions = await Image.find({ answer: regex }).limit(5); // Limit to 10 suggestions
    res.json(suggestions.map(suggestion => suggestion.answer));
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// GET themes by date
router.get('/by-date', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required.' });
    }
    
    const queryDate = new Date(date);
    const themes = await Theme.find({
      startDate: { $lte: queryDate },
      endDate: { $gte: queryDate }
    }, 'name'); // Select only the name field
    
    const themeNames = themes.map(theme => theme.name);
    res.json(themeNames);
  } catch (error) {
    console.error('Failed to retrieve themes by date:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unified Endpoint to get the image for a particular day based on the theme's assigned date
router.get('/image-for-date', async (req, res) => {
  const { date } = req.query;

  // Validate date query parameter
  if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required.' });
  }

  try {
      const queryDate = new Date(date);
      const dayOfWeek = queryDate.getDay();

      // Retrieve theme active on the given date
      const theme = await Theme.findOne({
          startDate: { $lte: queryDate },
          endDate: { $gte: queryDate }
      });

      if (!theme) {
          return res.status(404).json({ message: 'No theme found for the provided date.' });
      }

      // Retrieve image for the current day of the week within the found theme
      const image = await Image.findOne({
          theme: theme._id,
          dayOfWeek: dayOfWeek
      });

      if (!image) {
          return res.status(404).json({ message: 'Image not found for the provided date.' });
      }

      // Respond with the found image details
      res.json(image);
  } catch (error) {
      console.error('Failed to retrieve image:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
