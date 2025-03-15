
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
        console.log('Google News API request received');
        
        // Get the API key from environment variables
        const apiKey = process.env.GOOGLE_NEWS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_NEWS_API_KEY || process.env.NEWS_API_KEY;
        
        if (!apiKey) {
            console.error("API key not found");
            throw new Error("News API key is not defined");
        }
        
        console.log('Using API key:', apiKey.substring(0, 5) + '...');

        // Fetch Google News using the News API
        const googleNewsResponse = await axios.get(
            `https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${apiKey}`,
            { timeout: 10000 }
        );

        console.log('Google News API response status:', googleNewsResponse.status);
        console.log('Google News API articles count:', googleNewsResponse.data.articles?.length || 0);

        // Format the response data
        const news = googleNewsResponse.data.articles.map(article => ({
            headline: article.title,
            summary: article.description || article.content || "No description available",
            source: article.url
        }));

        res.status(200).json({ news });
    } catch (error) {
        console.error("Error fetching Google News:", error.message);
        console.error("Stack trace:", error.stack);
        
        // Check if error is from axios
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || error.message || "Unknown error";
        
        res.status(statusCode).json({ 
            error: "Failed to fetch Google News", 
            message: errorMessage,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
