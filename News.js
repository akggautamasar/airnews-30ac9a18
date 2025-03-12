import { useEffect, useState } from "react";

export default function News() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch("/api/news")
            .then(response => response.json())
            .then(data => setNews(data.news))
            .catch(error => console.error("Error fetching news:", error));
    }, []);

    return (
        <div>
            <h2>Top AI-Generated News</h2>
            <div className="news-container">
                {news.map((item, index) => (
                    <div key={index} className="news-card">
                        <h3>{item.headline}</h3>
                        <p>{item.summary}</p>
                        <a href={item.source} target="_blank" rel="noopener noreferrer">
                            Read more
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
