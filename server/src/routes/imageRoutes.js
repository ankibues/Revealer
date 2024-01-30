const express = require('express');
const { addImagesToTheme } = require('../services/ImageService');
const { Image, Theme } = require('./src/models');

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
router.get('/images/:theme/:day', async (req, res) => {
    const { theme, day } = req.params;
    try {
      const image = await Image.findOne({ theme, day });
      if (image) {
        res.json(image);
      } else {
        res.status(404).json({ message: 'Image not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



module.exports = router;
