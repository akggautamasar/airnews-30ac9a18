
import { ChevronUp, ChevronDown } from "lucide-react";

interface NewsNavigationProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const NewsNavigation = ({ 
  currentIndex, 
  totalItems, 
  onPrevious, 
  onNext 
}: NewsNavigationProps) => {
  return (
    <>
      {/* Navigation controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={onPrevious} 
          disabled={currentIndex === 0}
          className={`p-2 rounded-full bg-black/50 text-white ${currentIndex === 0 ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
        >
          <ChevronUp size={24} />
        </button>
        <button 
          onClick={onNext} 
          disabled={currentIndex === totalItems - 1}
          className={`p-2 rounded-full bg-black/50 text-white ${currentIndex === totalItems - 1 ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Indicator showing current position */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {totalItems}
      </div>
    </>
  );
};
