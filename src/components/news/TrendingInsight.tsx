
import { useState } from "react";
import { ChevronUp, ChevronDown, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { NewsNavigation } from "./NewsNavigation";

interface TrendingInsightProps {
  headline: string;
  quotes: string[];
  imageUrl: string;
}

export const TrendingInsight = ({
  headline,
  quotes,
  imageUrl
}: TrendingInsightProps) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleNext = () => {
    if (currentQuoteIndex < quotes.length - 1) {
      setCurrentQuoteIndex(currentQuoteIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuoteIndex > 0) {
      setCurrentQuoteIndex(currentQuoteIndex - 1);
    }
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from liked quotes" : "Added to liked quotes");
  };
  
  const handleComment = () => {
    toast.info("Comments feature coming soon");
  };
  
  return (
    <div className="relative h-full bg-gray-900 text-white flex flex-col">
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src={imageUrl} 
          alt={headline} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col justify-center p-6">
        <div className="max-w-xl mx-auto w-full">
          <h2 className="text-lg font-semibold mb-8">{headline}</h2>
          
          <div className="text-3xl font-bold mb-12">
            "{quotes[currentQuoteIndex]}"
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button 
                onClick={handleLike}
                className="flex items-center gap-1"
              >
                <Heart className={isLiked ? "fill-red-500 text-red-500" : ""} size={20} />
                <span>Like</span>
              </button>
              
              <button 
                onClick={handleComment}
                className="flex items-center gap-1"
              >
                <MessageCircle size={20} />
                <span>Comment</span>
              </button>
            </div>
            
            <div className="text-sm opacity-80">
              {currentQuoteIndex + 1} / {quotes.length}
            </div>
          </div>
        </div>
      </div>
      
      <NewsNavigation 
        currentIndex={currentQuoteIndex}
        totalItems={quotes.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};
