import { useEffect, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { CategoryNav } from "@/components/CategoryNav";
import { CalendarCard } from "@/components/CalendarCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GuardianArticle } from "@/types/news";

const categories = [
  "Top Stories",
  "World",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Science",
  "Health",
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Top Stories");
  const [userCategories, setUserCategories] = useState<string[]>(categories);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_categories')
        .eq('id', session.session.user.id)
        .single();

      if (profile?.preferred_categories) {
        setUserCategories(profile.preferred_categories);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['news', selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/fetch-news?category=${selectedCategory}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      return data.response;
    },
  });

  const todayEvent = {
    title: "Today's Highlights",
    date: new Date(),
    description: "Stay updated with the latest news and events",
    type: "reminder" as const,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <CategoryNav
            categories={userCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="mt-8">
            <CalendarCard {...todayEvent} />
          </div>
        </aside>
        
        <main className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-8">{selectedCategory}</h1>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load news. Please try again later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {newsData?.results?.map((article: GuardianArticle) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  category={selectedCategory}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;