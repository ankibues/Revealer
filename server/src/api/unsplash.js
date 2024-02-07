const axios = require('axios');
require('dotenv').config();
UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_URL = 'https://api.unsplash.com/search/photos';

async function fetchImageFromUnsplash(searchQuery, perPage = 3, nthimage) {
    try {
      const response = await axios.get(UNSPLASH_URL, {
        params: {
          query: searchQuery,
          per_page: perPage,
          client_id: UNSPLASH_ACCESS_KEY,
        },
      });
      console.log(response.data); 
      const firstResult = response.data.results[nthimage]; // Assuming you want the first image
      const imageUrl = firstResult.urls.regular; // Accessing the 'regular' sized image URL
      const photographerName = firstResult.user.name; 
      const photographerUrl = `${firstResult.user.links.html}?utm_source=revealer&utm_medium=referral`;

      return {
        url: imageUrl,
        credit: photographerName,
        crediturl: photographerUrl,
      }
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      return [];
    }
  };

  module.exports = {
    fetchImageFromUnsplash,
  };
  
  