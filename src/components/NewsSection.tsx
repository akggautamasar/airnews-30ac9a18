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
        url = `https://newsapi.google.com/v2/top-headlines?category=${selectedCategory}&apiKey=d1eefd4b3dee29fa75de553a45248c8c1aca0630b98e07f9442d2e7a86e502d3`;
      } else if (selectedNewsAgency === 'guardian') {
        url = `https://content.guardianapis.com/search?section=${selectedCategory}&api-key=e7a83668-9fd1-4b09-a497-b0c39dc2b7ec`;
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
