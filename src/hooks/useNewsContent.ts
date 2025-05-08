
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useNewsContent = (selectedCategory: string, selectedNewsAgency: string, refreshKey: number = 0) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [allNewsData, setAllNewsData] = useState<any[]>([]);

  // Reset current index when category or news agency changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, selectedNewsAgency, refreshKey]);

  // Handle fetching from all news sources
  const isAllNews = selectedNewsAgency === 'all';

  // Define the available news agencies to fetch from when "All News" is selected
  const availableApis = [
    'guardian', 
    'newsapi', 
    'thenewsapi', 
    'gnews', 
    'worldnewsapi', 
    'newsdata_io'
  ];

  // Fetch from a single news source
  const { data: newsData, isLoading: isNewsLoading, error: newsError, refetch } = useQuery({
    queryKey: ['news', selectedCategory, selectedNewsAgency, refreshKey],
    queryFn: async () => {
      try {
        console.log('Fetching news with params:', { selectedCategory, selectedNewsAgency });

        if (isAllNews) {
          // Fetch from multiple sources in parallel when "All News" is selected
          toast.info("Fetching news from multiple sources. This may take a moment...");
          
          const results = await Promise.allSettled(
            availableApis.map(agency => 
              supabase.functions.invoke('fetch-news', {
                body: { 
                  category: selectedCategory,
                  isToday: selectedCategory === "Today's News",
                  newsAgency: agency,
                  pageSize: 50 // Request more articles from each source
                },
              })
            )
          );

          const combinedResults: any[] = [];
          let successCount = 0;

          // Process the results from each API call
          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              const apiResponse = result.value;
              const apiName = availableApis[index];
              
              if (apiResponse.data?.response?.results?.length > 0) {
                // Add source information to each article
                const articlesWithSource = apiResponse.data.response.results.map((article: any) => ({
                  ...article,
                  source: apiName
                }));
                
                combinedResults.push(...articlesWithSource);
                successCount++;
              }
            }
          });

          // Sort combined results by publication date (newest first)
          combinedResults.sort((a, b) => {
            const dateA = new Date(a.webPublicationDate || a.publishedAt || Date.now());
            const dateB = new Date(b.webPublicationDate || b.publishedAt || Date.now());
            return dateB.getTime() - dateA.getTime();
          });

          setAllNewsData(combinedResults);
          
          if (combinedResults.length > 0) {
            toast.success(`Loaded ${combinedResults.length} articles from ${successCount} sources`);
          } else {
            toast.warning("No articles found from any source");
          }

          // Return in the expected format
          return {
            response: {
              status: 'ok',
              results: combinedResults
            }
          };
        }
        
        // For single source, make the regular API call
        const response = await supabase.functions.invoke('fetch-news', {
          body: { 
            category: selectedCategory,
            isToday: selectedCategory === "Today's News",
            newsAgency: selectedNewsAgency,
            pageSize: 50 // Request more articles
          },
        });

        console.log('News API response:', response);

        if (response.error) {
          console.error('Error in news response:', response.error);
          throw new Error(response.error.message || 'Failed to fetch news');
        }

        // Check if the response contains an error status from the API
        if (response.data?.response?.status === 'error') {
          const errorMessage = response.data.response.error || 'Failed to fetch news';
          const errorSource = response.data.response.errorSource || selectedNewsAgency;
          console.error(`Error in news API (${errorSource}):`, errorMessage);
          throw new Error(errorMessage);
        }

        // Check if we have any results
        if (!response.data?.response?.results || response.data.response.results.length === 0) {
          console.warn('No news results returned');
          toast.info(`No news found for ${selectedCategory} from ${selectedNewsAgency}`);
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
        console.log('Fetching advertisements...');
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        console.log('Advertisements fetched:', data);
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
    refetch,
    totalItems: combinedContent.length
  };
};
