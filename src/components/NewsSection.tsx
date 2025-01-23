import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "@/components/NewsCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface NewsSectionProps {
  selectedCategory: string;
  selectedNewsAgency: string;
}

export const NewsSection = ({ selectedCategory, selectedNewsAgency }: NewsSectionProps) => {
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

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-6">
        {combinedContent.map((item, index) => (
          <div key={`${item.type}-${index}`} className="h-[80vh] min-h-[600px]">
            {item.type === 'news' ? (
              <NewsCard
                article={item.content}
                category={selectedCategory}
              />
            ) : (
              <NewsCard
                article={{
                  id: item.content.id,
                  webTitle: item.content.title,
                  webPublicationDate: item.content.created_at,
                  webUrl: item.content.link_url,
                  apiUrl: item.content.link_url, // Added apiUrl to match GuardianArticle type
                  type: 'advertisement',
                  sectionId: 'advertisement',
                  sectionName: 'Advertisement',
                  isHosted: false,
                  pillarId: '',
                  pillarName: '',
                  fields: {
                    thumbnail: item.content.image_url,
                    bodyText: item.content.description
                  }
                }}
                category="Advertisement"
              />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};