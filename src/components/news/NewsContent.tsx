
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ContentItem } from "./ContentItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { WebNavigationControls } from "./WebNavigationControls";

interface NewsContentProps {
  currentIndex: number;
  direction: number;
  combinedContent: Array<{type: 'news' | 'ad', content: any}>;
  setDirection: (direction: number) => void;
  setCurrentIndex: (index: number) => void;
  selectedCategory: string;
}

export const NewsContent = ({ 
  currentIndex, 
  direction, 
  combinedContent,
  setDirection,
  setCurrentIndex,
  selectedCategory 
}: NewsContentProps) => {
  const isMobile = useIsMobile();
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return; // Only enable swipe on mobile
    
    const threshold = 50;
    if (info.offset.y > threshold && currentIndex > 0) {
      // Swiped down, show previous card
      setDirection(1);
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.y < -threshold && currentIndex < combinedContent.length - 1) {
      // Swiped up, show next card
      setDirection(-1);
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(1);
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < combinedContent.length - 1) {
      setDirection(-1);
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const variants = {
    enter: (direction: number) => {
      return {
        y: direction > 0 ? -1000 : 1000,
        opacity: 0
      };
    },
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        y: direction < 0 ? -1000 : 1000,
        opacity: 0
      };
    }
  };

  return (
    <>
      {!isMobile && (
        <WebNavigationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPreviousDisabled={currentIndex === 0}
          isNextDisabled={currentIndex === combinedContent.length - 1}
        />
      )}
      
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag={isMobile ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.5}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 h-full overflow-y-auto"
        >
          {combinedContent[currentIndex] && (
            <div className="h-full">
              <ContentItem 
                item={combinedContent[currentIndex]} 
                category={selectedCategory} 
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {isMobile && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 z-10">
          Swipe for more news
        </div>
      )}
    </>
  );
};
