
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NewsCard } from "@/components/NewsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { GuardianArticle } from "@/types/news";

export const GNewsSection = ({ selectedCategory }: { selectedCategory: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Convert selectedCategory to GNews format
  const getCategoryForGNews = (category: string) => {
    switch (category) {
      case "Today's News":
      case "Top Stories":
        return "breaking-news";
      case "Technology":
        return "technology";
      case "Business":
        return "business";
      case "Entertainment":
        return "entertainment";
      case "Sports":
        return "sports";
      case "World":
        return "world";
      case "Science":
        return "science";
      case "Health":
        return "health";
      default:
        return "general";
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['gnews', selectedCategory],
    queryFn: async () => {
      try {
        console.log('Fetching GNews with category:', selectedCategory);
        const category = getCategoryForGNews(selectedCategory);
        
        const response = await axios.get(`/api/gnews?category=${category}`);
        console.log('GNews API response:', response.data);
        
        return response.data;
      } catch (error) {
        console.error('Error fetching GNews:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load GNews. Please try again later.
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs bg-red-50/10 p-2 rounded overflow-auto">
              {(error as Error).message}
            </pre>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Convert GNews data to Guardian format for compatibility with our NewsCard component
  const convertToGuardianFormat = (newsItem: any): GuardianArticle => {
    return {
      id: `gnews-${Math.random().toString(36).substring(2, 11)}`,
      webTitle: newsItem.headline,
      webPublicationDate: newsItem.pubDate || new Date().toISOString(),
      webUrl: newsItem.source,
      apiUrl: newsItem.source,
      fields: {
        thumbnail: newsItem.image || "",
        bodyText: newsItem.summary
      }
    };
  };

  const newsItems = data?.news || [];
  const articles = newsItems.map(convertToGuardianFormat);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y > threshold && currentIndex > 0) {
      // Swiped down, show previous card
      setDirection(1);
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.y < -threshold && currentIndex < articles.length - 1) {
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
    if (currentIndex < articles.length - 1) {
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
    <div className="h-full relative overflow-hidden">
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
          {articles[currentIndex] && (
            <NewsCard
              article={articles[currentIndex]}
              category={selectedCategory}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
          className={`p-2 rounded-full bg-black/50 text-white ${currentIndex === 0 ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
        >
          <ChevronUp size={24} />
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentIndex === articles.length - 1}
          className={`p-2 rounded-full bg-black/50 text-white ${currentIndex === articles.length - 1 ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Indicator showing current position */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {articles.length}
      </div>
    </div>
  );
};
