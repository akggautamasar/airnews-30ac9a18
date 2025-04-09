
import { useEffect, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { LoadingState, ErrorState } from "@/components/news/NewsStateHandlers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GNewsSectionProps {
  selectedCategory: string;
}

export const GNewsSection = ({ selectedCategory }: GNewsSectionProps) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching GNews for category:", selectedCategory);
        
        // Use Supabase Edge Function instead of direct API call
        const response = await supabase.functions.invoke('fetch-news', {
          body: { 
            category: selectedCategory,
            isToday: selectedCategory === "Today's News",
            newsAgency: 'gnews'
          },
        });

        console.log("GNews response:", response);
        
        if (response.error) {
          throw new Error(response.error.message || "Failed to fetch news");
        }
        
        const articles = response.data.response?.results || [];
        
        if (articles.length > 0) {
          setNews(articles);
          setCurrentIndex(0);
        } else {
          console.warn("No GNews articles found for category:", selectedCategory);
          setNews([]);
        }
      } catch (err) {
        console.error("Error fetching GNews:", err);
        setError(err);
        toast.error("Failed to load news from GNews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  const handleNext = () => {
    if (currentIndex < news.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

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

  // Select the current news item to display
  const article = news[currentIndex];
  
  return (
    <div className="h-full relative">
      {article && (
        <div className="h-full">
          <NewsCard article={article} category={selectedCategory} />
        </div>
      )}
      
      {news.length > 1 && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-primary text-white p-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex === news.length - 1}
            className="bg-primary text-white p-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
