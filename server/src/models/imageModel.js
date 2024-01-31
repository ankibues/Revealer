const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  description: String,
  theme: String,
});

const themeSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
});

const Image = mongoose.model('Image', imageSchema);
const Theme = mongoose.model('Theme', themeSchema);

module.exports = { Image, Theme };
