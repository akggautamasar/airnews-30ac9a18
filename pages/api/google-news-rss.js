
import axios from "axios";
import { parseStringPromise } from "xml2js";

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
    console.log('Google News RSS feed request received');
    
    // Google News RSS feed URL - you can change the topic as needed
    const feedUrl = 'https://news.google.com/rss';
    
    console.log('Fetching from RSS feed URL:', feedUrl);
    
    // Fetch the RSS feed
    const response = await axios.get(feedUrl, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsApp/1.0)'
      }
    });

    console.log('RSS feed response status:', response.status);
    
    // Parse the XML response
    const parsedData = await parseStringPromise(response.data);
    
    // Extract the items from the feed
    const items = parsedData.rss.channel[0].item || [];
    console.log('RSS feed items count:', items.length);

    // Format the items into a more usable structure
    const news = items.map(item => ({
      headline: item.title[0],
      summary: item.description ? item.description[0] : "No description available",
      source: item.link[0],
      pubDate: item.pubDate ? item.pubDate[0] : new Date().toUTCString()
    }));

    res.status(200).json({ news });
  } catch (error) {
    console.error("Error fetching Google News RSS feed:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Check if error is from axios
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message || "Unknown error";
    
    res.status(statusCode).json({ 
      error: "Failed to fetch Google News RSS feed", 
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
