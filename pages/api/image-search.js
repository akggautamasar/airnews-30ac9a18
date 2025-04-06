
import axios from "axios";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { source, query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    let imageUrl = null;
    
    if (source === 'pixabay') {
      // Get the Pixabay API key from environment variables
      const apiKey = process.env.PIXABAY_API_KEY;
      
      if (!apiKey) {
        throw new Error("Pixabay API key is not defined");
      }
      
      // Fetch image from Pixabay
      const response = await axios.get(
        `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`,
        { timeout: 10000 }
      );
      
      if (response.data.hits && response.data.hits.length > 0) {
        // Get a random image from the results
        const randomIndex = Math.floor(Math.random() * Math.min(response.data.hits.length, 3));
        imageUrl = response.data.hits[randomIndex].webformatURL;
      }
    } else if (source === 'pexels') {
      // Get the Pexels API key from environment variables
      const apiKey = process.env.PEXELS_API_KEY;
      
      if (!apiKey) {
        throw new Error("Pexels API key is not defined");
      }
      
      // Fetch image from Pexels
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3`,
        { 
          headers: { Authorization: apiKey },
          timeout: 10000 
        }
      );
      
      if (response.data.photos && response.data.photos.length > 0) {
        // Get a random image from the results
        const randomIndex = Math.floor(Math.random() * Math.min(response.data.photos.length, 3));
        imageUrl = response.data.photos[randomIndex].src.medium;
      }
    } else {
      return res.status(400).json({ error: 'Invalid source parameter' });
    }
    
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error fetching image:", error.message);
    console.error("Stack trace:", error.stack);
    
    return res.status(500).json({ 
      error: "Failed to fetch image", 
      message: error.message || "Unknown error",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
