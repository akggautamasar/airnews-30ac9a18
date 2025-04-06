
import { useEffect, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { LoadingState, ErrorState } from "@/components/news/NewsStateHandlers";

interface GNewsSectionProps {
  selectedCategory: string;
}

export const GNewsSection = ({ selectedCategory }: GNewsSectionProps) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/gnews?category=${encodeURIComponent(selectedCategory)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch news");
        }
        const data = await response.json();
        console.log("GNews data:", data);
        setNews(data.news || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching GNews:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  if (isLoading) {
    return <LoadingState isLoading={isLoading} />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!news || news.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No news found for this category.</p>
      </div>
    );
  }

  // Select the first news item to display
  const article = news[0];
  
  return (
    <div className="h-full">
      {article && (
        <div className="h-full">
          <NewsCard article={article} category={selectedCategory} />
        </div>
      )}
    </div>
  );
};
