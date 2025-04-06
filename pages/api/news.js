
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
        console.log('News API request received');
        
        // Get the API key from environment variables
        const apiKey = process.env.NEWS_API_KEY || process.env.GOOGLE_NEWS_API_KEY;
        
        if (!apiKey) {
            console.error("API key not found");
            throw new Error("News API key is not defined");
        }
        
        console.log('Using API key:', apiKey.substring(0, 5) + '...');

        // Get query parameters
        const { category } = req.query;
        
        // Build the URL based on whether we have a category or not
        let url;
        if (!category || category === "Today's News" || category === "Top Stories") {
            url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
        } else {
            url = `https://newsapi.org/v2/top-headlines?category=${category.toLowerCase()}&country=us&apiKey=${apiKey}`;
        }

        console.log('Fetching news from URL:', url);

        // Fetch news using the News API
        const newsApiResponse = await axios.get(url, { timeout: 10000 });

        console.log('News API response status:', newsApiResponse.status);
        console.log('News API articles count:', newsApiResponse.data.articles?.length || 0);

        // Format the response data to match our expected format
        const news = newsApiResponse.data.articles.map((article, index) => ({
            headline: article.title,
            summary: article.description || article.content || "No description available",
            source: article.url,
            pubDate: article.publishedAt,
            image: article.urlToImage,
            // Add fields in the format expected by NewsCard
            id: `newsapi-${index}`,
            webTitle: article.title,
            webPublicationDate: article.publishedAt,
            webUrl: article.url,
            fields: {
                thumbnail: article.urlToImage,
                bodyText: article.description || article.content || "No description available"
            }
        }));

        res.status(200).json({ news });
    } catch (error) {
        console.error("Error fetching News API:", error.message);
        console.error("Stack trace:", error.stack);
        
        // Check if error is from axios
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || error.message || "Unknown error";
        
        res.status(statusCode).json({ 
            error: "Failed to fetch News API", 
            message: errorMessage,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
