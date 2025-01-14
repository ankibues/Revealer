const express = require('express');
const sharp = require("sharp");
const OpenAI = require('openai'); 
const dotenv = require('dotenv');
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const {ScheduledImage} = require('../models/imageModel');

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with the API key from the .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



const router = express.Router();

// setting up google drive API

const auth = new google.auth.GoogleAuth({
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

async function uploadFileToDrive(localFilePath, driveFileName, mimeType) {
  try {
    const fileMetadata = {
      name: driveFileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // optional folder
    };

    const media = {
      mimeType,        // e.g. 'image/png' or 'image/jpeg'
      body: fs.createReadStream(localFilePath),
    };

    // 1) Create the file in Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    const fileId = response.data.id;

    // 2) Make file publicly readable (if desired)
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // 3) Return a link (direct link to file contents)
    return `https://drive.google.com/uc?id=${fileId}`;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error.message);
    throw error;
  }
}

// ---------------------------------------------

// Endpoint to generate an image
router.post("/generate-image", async (req, res) => {
  console.log("API Key:", process.env.OPENAI_API_KEY);
  const { prompt } = req.body;

  try {
    // Generate the image using OpenAI
    const response = await openai.images.generate({ model: "dall-e-2", prompt, n: 1, size: "512x512",});
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

  // Temporary variables for extension & MIME type
  let extension = ".png";
  let mimeType = "image/png";

  // Will be assigned after we detect the extension
  let tempFilePath = "";

  try {
    // A) Download the image from OpenAI's URL
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Detect content type from headers
    const contentType = imageResponse.headers["content-type"] || "image/png";

    // Decide extension & MIME type based on contentType
    if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      extension = ".jpg";
      mimeType = "image/jpeg";
    } else if (contentType.includes("png")) {
      extension = ".png";
      mimeType = "image/png";
    } else {
      // If it's something else, default to PNG
      extension = ".png";
      mimeType = "image/png";
    }

    // Create a file name with the correct extension
    const fileName = `dalle-${Date.now()}${extension}`;

    // Build a full path in the same folder as this script
    tempFilePath = path.join(__dirname, fileName);

    // Write the downloaded bytes to a local file
    fs.writeFileSync(tempFilePath, imageResponse.data);

    // B) Upload to Drive with the correct mimeType
    const driveUrl = await uploadFileToDrive(tempFilePath, fileName, mimeType);

    // C) Store the Drive URL in the database
    const scheduledImage = await ScheduledImage.create({
      themeName,
      date: new Date(date),
      answer,
      imageUrl: driveUrl, // store permanent Drive URL
    });

    // D) Cleanup local file
    fs.unlinkSync(tempFilePath);

    // Return success
    res.status(200).json({
      message: "Image saved & scheduled successfully",
      scheduledImage,
    });
  } catch (error) {
    console.error("Error saving image:", error);

    // Attempt to remove temp file if it exists
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    res.status(500).json({ error: "Failed to save image" });
  }
});


module.exports = router;
