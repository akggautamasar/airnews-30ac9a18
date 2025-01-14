import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { CategoryNav } from "@/components/CategoryNav";
import { useQuery } from "@tanstack/react-query";
import { fetchGuardianNews, GuardianArticle } from "@/utils/guardianApi";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

const categories = [
  "Top Stories",
  "Technology",
  "Business",
  "Sport",
  "Culture",
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Top Stories");

  const { data: news, isLoading: isLoadingNews } = useQuery({
    queryKey: ['news', activeCategory],
    queryFn: () => fetchGuardianNews(activeCategory),
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

  const isLoading = isLoadingNews || isLoadingEvents;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container">
          <h1 className="text-3xl font-bold text-center">Airnews</h1>
          <p className="text-center mt-2 text-primary-foreground/80">
            Your daily dose of news and events
          </p>
        </div>
      </header>

      <main className="container py-6">
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
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 pr-4">
              {specialEvents?.map((event) => (
                <NewsCard
                  key={event.id}
                  title={event.title}
                  summary={event.description}
                  imageUrl={event.image_url}
                  category="Special Event"
                  source="Local Events"
                  publishedAt={event.event_date}
                />
              ))}
              
              {news?.map((article: GuardianArticle) => (
                <NewsCard
                  key={article.id}
                  title={article.webTitle}
                  summary={article.fields?.bodyText?.slice(0, 200) + '...' || ''}
                  imageUrl={article.fields?.thumbnail || '/placeholder.svg'}
                  category={article.sectionName}
                  source="The Guardian"
                  publishedAt={article.webPublicationDate}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </main>
    </div>
  );
};

export default Index;