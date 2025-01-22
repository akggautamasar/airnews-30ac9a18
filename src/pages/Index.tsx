import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryNav } from "@/components/CategoryNav";
import { NewsCard } from "@/components/NewsCard";
import { CalendarCard } from "@/components/CalendarCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const categories = [
  "Today's News",
  "Top Stories",
  "Technology",
  "Business",
  "Entertainment",
  "Sports",
  "World",
  "Science",
  "Health"
];

const newsAgencies = [
  { id: 'guardian', name: 'The Guardian' },
  { id: 'newsapi', name: 'News API' },
  { id: 'custom', name: 'The News API' }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState("Today's News");
  const [selectedNewsAgency, setSelectedNewsAgency] = useState('guardian');

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
        toast.error('Failed to fetch news. Please try again later.');
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: advertisements } = useQuery({
    queryKey: ['active-advertisements'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching advertisements:', error);
        return [];
      }
    },
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('special_events')
          .select('*')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {advertisements && advertisements.length > 0 && (
        <div className="mb-8">
          <a
            href={advertisements[0].link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="overflow-hidden">
              <div className="relative h-96">
                {advertisements[0].image_url && (
                  <>
                    <img
                      src={advertisements[0].image_url}
                      alt={advertisements[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {advertisements[0].title}
                  </h2>
                  <p className="text-xl text-white/90">
                    {advertisements[0].description}
                  </p>
                </div>
              </div>
            </Card>
          </a>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select News Source</label>
            <Select value={selectedNewsAgency} onValueChange={setSelectedNewsAgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select a news source" />
              </SelectTrigger>
              <SelectContent>
                {newsAgencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="mt-8 space-y-4">
            <h3 className="font-bold text-lg mb-4">Upcoming Events</h3>
            {upcomingEvents?.map((event) => (
              <CalendarCard
                key={event.id}
                title={event.title}
                date={new Date(event.event_date)}
                description={event.description}
                type="event"
              />
            ))}
          </div>
        </aside>
        <main className="md:w-3/4 h-[calc(100vh-8rem)]">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="text-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading news...</p>
              </div>
            ) : error ? (
              <div className="text-center p-8 text-red-500">
                <p>Failed to load news. Please try again later.</p>
                <pre className="mt-2 text-xs text-left bg-red-50 p-4 rounded">
                  {error.message}
                </pre>
              </div>
            ) : (
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
            )}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}