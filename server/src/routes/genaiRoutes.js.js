const express = require('express');
const OpenAI = require('openai'); 
const dotenv = require('dotenv');
const { Image, Theme } = require('../models/imageModel');

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with the API key from the .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const router = express.Router();

// Endpoint to generate an image
router.post("/generate-image", async (req, res) => {
  console.log("API Key:", process.env.OPENAI_API_KEY);
  const { prompt } = req.body;

  try {
    console.log("API Key:", process.env.OPENAI_API_KEY);
    // Generate the image using OpenAI
    const response = await openai.images.generate({ prompt, n: 1, size: "1024x1024" });
    const imageUrl = response.data[0].url;

    // Return the generated image URL to the frontend
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Endpoint to save the generated image with theme, date, and other details
router.post("/save-image", async (req, res) => {
  const { imageUrl, answer, themeName, date } = req.body;

  try {
    // Find or create the theme
    let theme = await Theme.findOne({ name: themeName });
    if (!theme) {
      theme = await Theme.create({ name: themeName, startDate: new Date(), endDate: new Date() });
    }

    // Determine the day of the week from the provided date
    const dayOfWeek = new Date(date).getDay();

    // Save the image details in MongoDB
    const newImage = await Image.create({
      url: imageUrl,
      answer,
      theme: theme._id,
      dayOfWeek,
    });

    // Add the image reference to the theme
    theme.images.push(newImage._id);
    await theme.save();

    // Return success response
    res.status(200).json({ message: "Image saved successfully", image: newImage });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Failed to save image" });
  }
});

module.exports = router;
