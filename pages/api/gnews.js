
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
    console.log('GNews API request received');
    
    // Get the API key from environment variables
    const apiKey = process.env.GNEWS_API_KEY;
    
    if (!apiKey) {
      console.error("GNews API key not found");
      throw new Error("GNews API key is not defined");
    }
    
    console.log('Using GNews API key:', apiKey.substring(0, 5) + '...');

    // Get query parameters
    const { category } = req.query;
    const topic = category ? mapCategoryForGNews(category) : 'breaking-news'; // Default to breaking-news if no category is provided
    
    // Fetch news from GNews API
    const gnewsResponse = await axios.get(
      `https://gnews.io/api/v4/top-headlines?category=${topic}&lang=en&apikey=${apiKey}`,
      { timeout: 15000 }
    );

    console.log('GNews API response status:', gnewsResponse.status);
    console.log('GNews API articles count:', gnewsResponse.data.articles?.length || 0);

    // Format the response data to match our expected format
    const news = gnewsResponse.data.articles.map(article => ({
      headline: article.title,
      summary: article.description || article.content || "No description available",
      source: article.url,
      pubDate: article.publishedAt,
      image: article.image
    }));

    res.status(200).json({ news });
  } catch (error) {
    console.error("Error fetching GNews:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Check if error is from axios
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message || "Unknown error";
    
    res.status(statusCode).json({ 
      error: "Failed to fetch GNews", 
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Helper function to map general categories to GNews categories
function mapCategoryForGNews(category) {
  const categoryMap = {
    "Today's News": "breaking-news",
    "Top Stories": "breaking-news",
    "Technology": "technology",
    "Business": "business",
    "Entertainment": "entertainment",
    "Sports": "sports",
    "World": "world",
    "Science": "science",
    "Health": "health"
  };
  
  return categoryMap[category] || "general";
}
