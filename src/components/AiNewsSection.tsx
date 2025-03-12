
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewsCard } from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw } from 'lucide-react';

interface AiNewsItem {
  headline: string;
  summary: string;
  source: string;
  category: string;
  provider: string;
}

interface AiNewsData {
  date: string;
  news: AiNewsItem[];
}

export const AiNewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const { data: aiNews, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['ai-news'],
    queryFn: async () => {
      try {
        const response = await supabase.functions.invoke('fetch-ai-news');
        if (response.error) throw new Error(response.error.message);
        return response.data as AiNewsData;
      } catch (error) {
        console.error('Error fetching AI news:', error);
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const categories = [
    'All', 'Politics', 'Business', 'Technology', 'Health', 'Entertainment'
  ];

  const filteredNews = aiNews?.news
    ? selectedCategory === 'All'
      ? aiNews.news
      : aiNews.news.filter(item => item.category === selectedCategory)
    : [];

  // Transform AI news to the format expected by NewsCard
  const transformedNews = filteredNews.map(item => ({
    id: `ai-${item.headline.replace(/\s+/g, '-').toLowerCase()}`,
    webTitle: item.headline,
    webPublicationDate: aiNews?.date || new Date().toISOString(),
    webUrl: item.source,
    apiUrl: item.source,
    type: 'article',
    sectionId: item.category.toLowerCase(),
    sectionName: item.category,
    isHosted: false,
    pillarId: '',
    pillarName: item.provider === 'deepseek' ? 'DeepSeek AI' : 'Qwen AI',
    fields: {
      thumbnail: '', // No thumbnail available from AI-generated news
      bodyText: item.summary
    }
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Curated News</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="flex gap-2"
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="All" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => setSelectedCategory(category)}
              className="flex-1"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load AI news. Please try refreshing.
              </AlertDescription>
            </Alert>
          ) : transformedNews.length === 0 ? (
            <Alert>
              <AlertDescription>
                No news available for this category. Try refreshing or selecting a different category.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transformedNews.map(article => (
                <div key={article.id} className="h-[400px]">
                  <NewsCard article={article} category={article.sectionName} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
