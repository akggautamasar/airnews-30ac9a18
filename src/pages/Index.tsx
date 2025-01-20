import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryNav } from "@/components/CategoryNav";
import { NewsCard } from "@/components/NewsCard";
import { CalendarCard } from "@/components/CalendarCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const categories = [
  "Top Stories",
  "Technology",
  "Business",
  "Entertainment",
  "Sports",
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState("Top Stories");

  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['news', selectedCategory],
    queryFn: async () => {
      try {
        const response = await supabase.functions.invoke('fetch-news', {
          body: { category: selectedCategory },
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
          {isLoading ? (
            <div className="text-center">Loading news...</div>
          ) : error ? (
            <div className="text-center text-red-500">
              Failed to load news. Please try again later.
            </div>
          ) : (
            <Carousel
              opts={{
                axis: 'y',
                dragFree: true,
              }}
              className="h-full"
              orientation="vertical"
            >
              <CarouselContent className="-mt-4">
                {newsData?.response?.results?.map((article) => (
                  <CarouselItem key={article.id} className="pt-4">
                    <NewsCard
                      article={article}
                      category={selectedCategory}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </main>
      </div>
    </div>
  );
}