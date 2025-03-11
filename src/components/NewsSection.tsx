
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "@/components/NewsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface NewsSectionProps {
  selectedCategory: string;
  selectedNewsAgency: string;
}

export const NewsSection = ({ selectedCategory, selectedNewsAgency }: NewsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: newsData, isLoading: isNewsLoading, error: newsError } = useQuery({
    queryKey: ['news', selectedCategory, selectedNewsAgency],
    queryFn: async () => {
      try {
        console.log('Fetching news with params:', { selectedCategory, selectedNewsAgency });
        
        const response = await supabase.functions.invoke('fetch-news', {
          body: { 
            category: selectedCategory,
            isToday: selectedCategory === "Today's News",
            newsAgency: selectedNewsAgency
          },
        });

        console.log('News API response:', response);

        if (response.error) {
          console.error('Error in news response:', response.error);
          throw new Error(response.error.message || 'Failed to fetch news');
        }

        return response.data;
      } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: advertisements } = useQuery({
    queryKey: ['active-advertisements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Reset current index when category or news agency changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, selectedNewsAgency]);

  // Combine news articles with advertisements
  const combinedContent = [];
  const newsItems = newsData?.response?.results || [];
  const adItems = advertisements || [];

  // Insert an advertisement after every 3 news articles
  newsItems.forEach((article, index) => {
    combinedContent.push({
      type: 'news',
      content: article,
    });

    // After every 3 news articles, add an advertisement if available
    if ((index + 1) % 3 === 0) {
      const adIndex = Math.floor(index / 3) % adItems.length;
      if (adItems[adIndex]) {
        combinedContent.push({
          type: 'ad',
          content: adItems[adIndex],
        });
      }
    }
  });

  if (isNewsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (newsError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load news. Please try again later.
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs bg-red-50/10 p-2 rounded overflow-auto">
              {newsError.message}
            </pre>
          )}
        </AlertDescription>
      </Alert>
    );
  }

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
          {combinedContent[currentIndex] && (
            <div className="h-full">
              {combinedContent[currentIndex].type === 'news' ? (
                <NewsCard
                  article={combinedContent[currentIndex].content}
                  category={selectedCategory}
                />
              ) : (
                <NewsCard
                  article={{
                    id: combinedContent[currentIndex].content.id,
                    webTitle: combinedContent[currentIndex].content.title,
                    webPublicationDate: combinedContent[currentIndex].content.created_at,
                    webUrl: combinedContent[currentIndex].content.link_url,
                    apiUrl: combinedContent[currentIndex].content.link_url,
                    type: 'advertisement',
                    sectionId: 'advertisement',
                    sectionName: 'Advertisement',
                    isHosted: false,
                    pillarId: '',
                    pillarName: '',
                    fields: {
                      thumbnail: combinedContent[currentIndex].content.image_url,
                      bodyText: combinedContent[currentIndex].content.description
                    }
                  }}
                  category="Advertisement"
                />
              )}
            </div>
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
          disabled={currentIndex === combinedContent.length - 1}
          className={`p-2 rounded-full bg-black/50 text-white ${currentIndex === combinedContent.length - 1 ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Indicator showing current position */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {combinedContent.length}
      </div>
    </div>
  );
};
