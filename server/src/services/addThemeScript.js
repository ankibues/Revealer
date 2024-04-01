const database = require('../utils/database');
const { Theme } = require('../models/imageModel');
require('dotenv').config();


async function addTheme(){
  try {
    const themeName = "Animals";
    const newTheme = new Theme({
      name: themeName,
      startDate: new Date('2024-04-14'),
      endDate: new Date('2024-04-20T23:59:59.999Z'),
      images: []
    });
    await newTheme.save();
    console.log('Theme saved:', newTheme.name);
    return newTheme.name;
  } catch (error) {
    console.error('Error saving theme to MongoDB:', error);
    return null;
  }
}

async function run() {
    await database.connect();
    await addTheme();
    await database.close(); // Ensure this is called after operations are complete
}

run().catch(console.error);



