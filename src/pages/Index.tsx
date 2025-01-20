import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryNav } from "@/components/CategoryNav";
import { NewsCard } from "@/components/NewsCard";
import { CalendarCard } from "@/components/CalendarCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  "Today's News",
  "Top Stories",
  "Technology",
  "Business",
  "Entertainment",
  "Sports",
  "World",
  "Science",
  "Environment",
  "Education",
  "Society",
  "Media",
  "Life & Style"
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState("Today's News");

  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['news', selectedCategory],
    queryFn: async () => {
      try {
        const response = await supabase.functions.invoke('fetch-news', {
          body: { 
            category: selectedCategory,
            isToday: selectedCategory === "Today's News"
          },
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to fetch news');
        }

        return response.data;
      } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Failed to fetch news. Please try again later.');
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="mt-8">
            <CalendarCard 
              title="Upcoming Events"
              date={new Date()}
              description="No upcoming events"
              type="event"
            />
          </div>
        </aside>
        <main className="md:w-3/4 h-[calc(100vh-8rem)]">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="text-center">Loading news...</div>
            ) : error ? (
              <div className="text-center text-red-500">
                Failed to load news. Please try again later.
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