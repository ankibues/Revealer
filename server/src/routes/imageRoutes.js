const express = require('express');
const { addImagesToTheme } = require('../services/ImageService');
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




module.exports = router;
