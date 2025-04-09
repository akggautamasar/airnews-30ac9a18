
import { useEffect, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { LoadingState, ErrorState } from "@/components/news/NewsStateHandlers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface GNewsSectionProps {
  selectedCategory: string;
}

export const GNewsSection = ({ selectedCategory }: GNewsSectionProps) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching GNews for category:", selectedCategory);
      
      // Use Supabase Edge Function
      const response = await supabase.functions.invoke('fetch-news', {
        body: { 
          category: selectedCategory,
          isToday: selectedCategory === "Today's News",
          newsAgency: 'gnews'
        },
      });

      console.log("GNews response:", response);
      
      if (response.error) {
        console.error("GNews API error:", response.error);
        throw new Error(response.error.message || "Failed to fetch news");
      }
      
      const articles = response.data.response?.results || [];
      
      if (articles.length > 0) {
        setNews(articles);
        setCurrentIndex(0);
        toast.success(`Loaded ${articles.length} articles from GNews`);
      } else {
        console.warn("No GNews articles found for category:", selectedCategory);
        setNews([]);
        toast.info("No articles found for this category");
      }
    } catch (err) {
      console.error("Error fetching GNews:", err);
      setError(err);
      toast.error("Failed to load news from GNews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Retrying...");
  };

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
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <ErrorState error={error} />
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          className="mt-4 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
        <Alert className="mt-4 max-w-lg">
          <AlertDescription>
            You may need to add or update your GNews API key in Supabase secrets.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 mb-4">No news found for this category.</p>
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
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
          <Button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="default"
            size="sm"
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={currentIndex === news.length - 1}
            variant="default"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
