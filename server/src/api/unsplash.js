const axios = require('axios');
require('dotenv').config();

const UNSPLASH_URL = 'https://api.unsplash.com/search/photos';

async function fetchImageFromUnsplash(searchQuery, perPage = 1) {
    try {
      const response = await axios.get(UNSPLASH_URL, {
        params: {
          query: searchQuery,
          client_id: UNSPLASH_ACCESS_KEY,
          per_page: perPage,
        },
      });
      return response.data.results.map(image => ({
        url: image.urls.regular,
        description: image.description || image.alt_description,
      }));
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      return [];
    }
  };

  module.exports = {
    fetchImageFromUnsplash,
  };
  
  