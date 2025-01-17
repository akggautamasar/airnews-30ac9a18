import { useState, useEffect } from "react";
import { NewsCard } from "@/components/NewsCard";
import { CalendarCard } from "@/components/CalendarCard";
import { CategoryNav } from "@/components/CategoryNav";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "@/utils/newsApi";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const categories = [
  "Top Stories",
  "Technology",
  "Business",
  "Sport",
  "Culture",
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Top Stories");
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_categories')
        .eq('id', user.id)
        .single();
      
      if (profile?.preferred_categories) {
        setUserPreferences(profile.preferred_categories);
      }
    }
  };

  const { data: news, isLoading: isLoadingNews } = useQuery({
    queryKey: ['news', activeCategory],
    queryFn: () => fetchNews(activeCategory),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: bookmarks, isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: specialEvents, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['special-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const isLoading = isLoadingNews || isLoadingEvents || isLoadingBookmarks;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-6">
        <div className="space-y-8">
          {/* Calendar Events Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Important Dates & Events</h2>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {specialEvents?.map((event) => (
                  <CalendarCard
                    key={event.id}
                    title={event.title}
                    date={event.event_date}
                    description={event.description}
                    type="Event"
                  />
                ))}
              </div>
            </ScrollArea>
          </section>

          <Separator className="my-8" />

          {/* News Section */}
          <section>
            <Tabs defaultValue="latest" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="latest">Latest News</TabsTrigger>
                <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
              </TabsList>

              <TabsContent value="latest">
                <h2 className="text-2xl font-bold mb-4">Latest News</h2>
                <CategoryNav
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />

                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto px-4">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {specialEvents?.map((event) => (
                          <CarouselItem key={event.id}>
                            <NewsCard
                              article={{
                                id: event.id,
                                type: 'special',
                                sectionId: 'events',
                                webTitle: event.title,
                                webPublicationDate: event.event_date,
                                webUrl: '#',
                                fields: {
                                  thumbnail: event.image_url,
                                  bodyText: event.description,
                                  trailText: event.description,
                                },
                              }}
                              category="Special Event"
                            />
                          </CarouselItem>
                        ))}
                        
                        {news?.map((article) => (
                          <CarouselItem key={article.id}>
                            <NewsCard
                              article={article}
                              category={activeCategory}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-center gap-4 mt-4">
                        <CarouselPrevious />
                        <CarouselNext />
                      </div>
                    </Carousel>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookmarks">
                <h2 className="text-2xl font-bold mb-4">My Bookmarks</h2>
                {isLoadingBookmarks ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookmarks?.map((bookmark) => (
                      <NewsCard
                        key={bookmark.id}
                        article={bookmark.article_data}
                        category={bookmark.article_data.sectionId}
                      />
                    ))}
                    {bookmarks?.length === 0 && (
                      <p className="text-center text-gray-500 py-12">
                        No bookmarks yet. Start saving articles you want to read later!
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;