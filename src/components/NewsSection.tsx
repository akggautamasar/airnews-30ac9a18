
import { useNewsContent } from "@/hooks/useNewsContent";
import { NewsContent } from "@/components/news/NewsContent";
import { NewsNavigation } from "@/components/news/NewsNavigation";
import { LoadingState, ErrorState } from "@/components/news/NewsStateHandlers";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface NewsSectionProps {
  selectedCategory: string;
  selectedNewsAgency: string;
}

export const NewsSection = ({ selectedCategory, selectedNewsAgency }: NewsSectionProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  
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
    refetch
  } = useNewsContent(selectedCategory, selectedNewsAgency, refreshKey);

  // Function to retry loading news
  const handleRetry = () => {
    setRefreshKey(prev => prev + 1);
  };

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
          >
            <RefreshCw className="h-4 w-4" /> Try Again
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
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden">
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
