import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CategoryNav } from "@/components/CategoryNav";
import { NewsCard } from "@/components/NewsCard";
import { CalendarCard } from "@/components/CalendarCard";

const categories = [
  "Top Stories",
  "Technology",
  "Business",
  "Entertainment",
  "Sports",
];

export default function Index() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Top Stories");
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

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

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load news. Please try again later.",
      });
    }
  }, [error]);

  if (!session) {
    return null;
  }

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
        <main className="md:w-3/4">
          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center">Loading news...</div>
            ) : error ? (
              <div className="text-center text-red-500">
                Failed to load news. Please try again later.
              </div>
            ) : (
              newsData?.response?.results?.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  category={selectedCategory}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}