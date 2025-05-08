
import { useEffect, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { LoadingState, ErrorState } from "@/components/news/NewsStateHandlers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface GNewsSectionProps {
  selectedCategory: string;
}

export const GNewsSection = ({ selectedCategory }: GNewsSectionProps) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    setApiKeyError(false);
    
    try {
      console.log("Fetching GNews for category:", selectedCategory);
      
      // Use Supabase Edge Function with larger page size
      const response = await supabase.functions.invoke('fetch-news', {
        body: { 
          category: selectedCategory,
          isToday: selectedCategory === "Today's News",
          newsAgency: 'gnews',
          pageSize: 50 // Request more articles
        },
      });

      console.log("GNews response:", response);
      
      if (response.error) {
        console.error("GNews API error:", response.error);
        
        // Check if this is an API key configuration error
        if (response.error.message && response.error.message.includes('API key')) {
          setApiKeyError(true);
        }
        
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
        
        <div className="flex flex-col gap-4 items-center mt-6">
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
          
          {apiKeyError && (
            <Link to="/admin/api-keys">
              <Button className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Configure API Keys
              </Button>
            </Link>
          )}
        </div>
        
        {apiKeyError && (
          <Alert className="mt-6 max-w-lg" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Key Required</AlertTitle>
            <AlertDescription>
              You need to add your GNews API key in the API Keys management page.
              <ul className="list-disc pl-5 mt-2">
                <li>Get a free API key from <a href="https://gnews.io/" target="_blank" rel="noopener noreferrer" className="text-primary underline">GNews.io</a></li>
                <li>Add it in the <Link to="/admin/api-keys" className="text-primary underline">API Keys management page</Link></li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 mb-4">No news found for this category.</p>
        <div className="flex gap-4">
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
          
          <Link to="/admin/api-keys">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Manage API Keys
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Select the current news item to display
  const article = news[currentIndex];
  
  return (
    <div className="h-full relative">
      <div className="absolute top-2 left-2 z-10">
        <Badge variant="secondary" className="text-xs font-normal">
          {currentIndex + 1} of {news.length} articles
        </Badge>
      </div>
      
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
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={currentIndex === news.length - 1}
            variant="default"
            size="sm"
            className="flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
