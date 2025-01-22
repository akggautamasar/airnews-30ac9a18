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
  const { data: newsData, isLoading, error } = useQuery({
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
          Failed to load news. Please try again later.
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs bg-red-50/10 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-6">
        {newsData?.response?.results?.map((article) => (
          <div key={article.id} className="h-[80vh] min-h-[600px]">
            <NewsCard
              article={article}
              category={selectedCategory}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};