 import axios from "axios";

export default async function handler(req, res) {
    try {
        // Fetch Google News using your API
        const googleNewsResponse = await axios.get(
            `https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${process.env.GOOGLE_NEWS_API_KEY}`
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
        res.status(500).json({ error: "Failed to fetch Google News" });
    }
}
