
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
        // Get the API key from environment variables
        const apiKey = process.env.GOOGLE_NEWS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_NEWS_API_KEY;
        
        if (!apiKey) {
            throw new Error("Google News API key is not defined");
        }

        // Fetch Google News using your API
        const googleNewsResponse = await axios.get(
            `https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${apiKey}`
        );

        // Format the response data
        const news = googleNewsResponse.data.articles.map(article => ({
            headline: article.title,
            summary: article.description,
            source: article.url
        }));

        res.status(200).json({ news });
    } catch (error) {
        console.error("Error fetching Google News:", error);
        res.status(500).json({ 
            error: "Failed to fetch Google News", 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
