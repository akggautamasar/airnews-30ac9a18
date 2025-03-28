
import { useEffect, useState } from "react";

export default function News() {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/news")
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || "Failed to fetch news");
                    });
                }
                return response.json();
            })
            .then(data => {
                setNews(data.news || []);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching news:", error);
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="p-4 text-center">Loading news...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500 bg-red-50 rounded-md">Error: {error}</div>;
    }

    if (!news || news.length === 0) {
        return <div className="p-4 text-center">No news articles available.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Google News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-2">{item.headline}</h3>
                        <p className="text-gray-600 mb-3">{item.summary}</p>
                        <a 
                            href={item.source} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Read more
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
