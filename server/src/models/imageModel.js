const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  answer: String,
  theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' },
  dayOfWeek: Number,
  credit: String, 
  crediturl: String,
});

const themeSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

const Image = mongoose.model('Image', imageSchema);
const Theme = mongoose.model('Theme', themeSchema);

module.exports = { Image, Theme };
