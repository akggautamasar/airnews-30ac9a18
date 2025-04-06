
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ContentItem } from "./ContentItem";

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
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 h-full"
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
  );
};
