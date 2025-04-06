
import { useNewsContent } from "@/hooks/useNewsContent";
import { NewsContent } from "@/components/news/NewsContent";
import { NewsNavigation } from "@/components/news/NewsNavigation";
import { LoadingState, ErrorState } from "@/components/news/NewsStateHandlers";

interface NewsSectionProps {
  selectedCategory: string;
  selectedNewsAgency: string;
}

export const NewsSection = ({ selectedCategory, selectedNewsAgency }: NewsSectionProps) => {
  const {
    combinedContent,
    currentIndex,
    direction,
    setDirection,
    setCurrentIndex,
    handlePrevious,
    handleNext,
    isNewsLoading,
    newsError
  } = useNewsContent(selectedCategory, selectedNewsAgency);

  if (isNewsLoading) {
    return <LoadingState isLoading={isNewsLoading} />;
  }

  if (newsError) {
    return <ErrorState error={newsError} />;
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
