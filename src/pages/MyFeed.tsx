
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "@/components/news/NotificationItem";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNewsContent } from "@/hooks/useNewsContent";

export default function MyFeed() {
  const [isLoading, setIsLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    combinedContent,
    isNewsLoading,
    newsError,
  } = useNewsContent("Today's News", "all", refreshKey);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsLoading(false);
          return;
        }
        
        // Fetch user preferences
        const { data, error } = await supabase
          .from('profiles')
          .select('preferred_categories')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        setUserPreferences(data?.preferred_categories || []);
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPreferences();
  }, []);

  if (isLoading || isNewsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter content based on user preferences if any
  const filteredContent = userPreferences.length > 0
    ? combinedContent.filter(item => 
        item.type === 'news' && 
        userPreferences.includes(item.content.sectionName || item.content.category || ""))
    : combinedContent;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
        <h1 className="text-xl font-bold text-blue-500">My Feed</h1>
      </div>
      
      {filteredContent.length === 0 ? (
        <div className="p-4 mt-8 flex flex-col items-center justify-center">
          <div className="bg-blue-50 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2 text-center">Personalize Your Feed</h2>
            <p className="text-gray-600 text-center mb-4">
              Sign in and set your preferences to get news tailored to your interests.
            </p>
            <Button 
              className="w-full mb-2" 
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => navigate("/")}
            >
              Browse All News
            </Button>
          </div>
        </div>
      ) : (
        <div className="pb-16">
          {filteredContent.map((item, index) => {
            if (item.type === 'news') {
              const article = item.content;
              return (
                <NotificationItem
                  key={`${article.id || article.url}-${index}`}
                  title={article.webTitle || article.title}
                  imageUrl={article.fields?.thumbnail || article.urlToImage}
                  timestamp={article.webPublicationDate || article.publishedAt}
                  onClick={() => navigate(`/article/${article.id || index}`)}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
