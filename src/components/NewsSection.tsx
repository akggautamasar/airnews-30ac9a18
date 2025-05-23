
import { useNewsContent } from "@/hooks/useNewsContent";
import { NewsContent } from "@/components/news/NewsContent";
import { NewsNavigation } from "@/components/news/NewsNavigation";
import { LoadingState, ErrorState } from "@/components/news/NewsStateHandlers";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface NewsSectionProps {
  selectedCategory: string;
  selectedNewsAgency: string;
}

export const NewsSection = ({ selectedCategory, selectedNewsAgency }: NewsSectionProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    combinedContent,
    currentIndex,
    direction,
    setDirection,
    setCurrentIndex,
    handlePrevious,
    handleNext,
    isNewsLoading,
    newsError,
    refetch,
    totalItems
  } = useNewsContent(selectedCategory, selectedNewsAgency, refreshKey);

  // Function to refresh and load new articles
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    
    // The actual refetch is triggered by changing refreshKey
    // which is picked up by the useNewsContent hook
    
    // Reset refresh state after a short delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Function to retry loading news
  const handleRetry = () => {
    handleRefresh();
  };

  const isAllNews = selectedNewsAgency === 'all';

  if (isNewsLoading) {
    return <LoadingState isLoading={isNewsLoading} />;
  }

  if (newsError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ErrorState error={newsError} onRetry={handleRetry} />
        <div className="mt-4">
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  if (!combinedContent || combinedContent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 mb-4">No news available for this category.</p>
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Try Again'}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden">
      {isAllNews && (
        <div className="absolute top-2 right-2 z-10 bg-opacity-70 bg-background rounded-md p-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span className="text-sm">Showing news from multiple sources</span>
        </div>
      )}
      
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <Badge variant="secondary" className="text-xs font-normal">
          {currentIndex + 1} of {totalItems} articles
        </Badge>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 bg-background/80 backdrop-blur-sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <NewsContent
        currentIndex={currentIndex}
        direction={direction}
        combinedContent={combinedContent}
        setDirection={setDirection}
        setCurrentIndex={setCurrentIndex}
        selectedCategory={selectedCategory}
      />

      <NewsNavigation
        currentIndex={currentIndex}
        totalItems={combinedContent.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};
