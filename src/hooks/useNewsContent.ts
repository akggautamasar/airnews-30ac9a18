
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useNewsContent = (selectedCategory: string, selectedNewsAgency: string, refreshKey: number = 0) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Reset current index when category or news agency changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, selectedNewsAgency, refreshKey]);

  const { data: newsData, isLoading: isNewsLoading, error: newsError, refetch } = useQuery({
    queryKey: ['news', selectedCategory, selectedNewsAgency, refreshKey],
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

        // Check if the response contains an error status from the API
        if (response.data?.response?.status === 'error') {
          console.error('Error in news API:', response.data.response.error);
          throw new Error(response.data.response.error || 'Failed to fetch news');
        }

        // Check if we have any results
        if (!response.data?.response?.results || response.data.response.results.length === 0) {
          console.warn('No news results returned');
          toast.info(`No news found for ${selectedCategory}`);
        }

        return response.data;
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error(`Failed to load news: ${error.message}`);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: advertisements } = useQuery({
    queryKey: ['active-advertisements', refreshKey],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching advertisements:', error);
        return [];
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

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

  return {
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
  };
};
