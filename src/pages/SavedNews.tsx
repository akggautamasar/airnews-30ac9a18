
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "@/components/news/NotificationItem";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

export default function SavedNews() {
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsLoading(false);
          return;
        }
        
        // Fetch saved articles
        const { data, error } = await supabase
          .from('saved_articles')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setSavedArticles(data || []);
      } catch (error) {
        console.error('Error fetching saved articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Saved</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {savedArticles.length === 0 ? (
        <div className="p-4 mt-8 flex flex-col items-center justify-center">
          <div className="bg-blue-50 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2 text-center">No saved articles yet</h2>
            <p className="text-gray-600 text-center mb-4">
              Bookmark articles to read them later.
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate("/")}
            >
              Browse Articles
            </Button>
          </div>
        </div>
      ) : (
        <div className="pb-16">
          {savedArticles.map((item) => {
            const article = item.article_data;
            return (
              <NotificationItem
                key={item.id}
                title={article.webTitle || article.title}
                imageUrl={article.fields?.thumbnail || article.urlToImage}
                timestamp={item.created_at}
                onClick={() => navigate(`/article/${article.id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
