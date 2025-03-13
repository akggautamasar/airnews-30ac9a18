import { useEffect, useState } from "react";

interface NewsSectionProps {
  selectedCategory: string;
  selectedNewsAgency: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ selectedCategory, selectedNewsAgency }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      let url = '';
      if (selectedNewsAgency === 'google') {
        url = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=YOUR_GOOGLE_NEWS_API_KEY`;
      } else if (selectedNewsAgency === 'guardian') {
        url = `https://content.guardianapis.com/search?section=${selectedCategory}&api-key=YOUR_GUARDIAN_API_KEY`;
      }
      // Add other APIs here...

      const response = await fetch(url);
      const data = await response.json();
      setNews(data.articles || data.results);
    };

    fetchNews();
  }, [selectedCategory, selectedNewsAgency]);

  return (
    <div>
      {news.map((article, index) => (
        <div key={index}>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
        </div>
      ))}
    </div>
  );
};
