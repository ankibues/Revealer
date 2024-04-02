const { addImageToTheme } = require('./imageService');
const database = require('../utils/database');
const { Image, Theme } = require('../models/imageModel');
require('dotenv').config();

// Shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

database.connect();

async function assignUniqueDayOfWeek(themeName) {
    try {
        const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        shuffleArray(daysOfWeek);

        // Find the theme by name
        const theme = await Theme.findOne({ name: themeName });
        if (!theme) {
            console.error(`Error: Theme '${themeName}' not found.`);
            return;
        }

        const images = await Image.find({ theme: theme._id });

        if (images.length > daysOfWeek.length) {
            console.error('Error: More images than days in a week.');
            return;
        }

        await Promise.all(images.map((image, index) => {
            image.dayOfWeek = daysOfWeek[index];
            return image.save();
        }));

        console.log('All images have been assigned a unique day of the week');
    } catch (error) {
        console.error('Error:', error);
    } 
}

assignUniqueDayOfWeek('Birds');