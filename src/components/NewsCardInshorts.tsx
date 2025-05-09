
import { useState } from "react";
import { Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NewsCardInshortsProps {
  article: any;
  currentIndex: number;
  totalItems: number;
}

export const NewsCardInshorts = ({ 
  article, 
  currentIndex,
  totalItems
}: NewsCardInshortsProps) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast.error("Please sign in to bookmark articles", {
          action: {
            label: "Sign In",
            onClick: () => navigate("/auth")
          }
        });
        return;
      }

      // Logic to save bookmark to Supabase
      setIsBookmarked(true);
      toast.success("Article bookmarked successfully");
    } catch (error) {
      console.error("Error bookmarking article:", error);
      toast.error("Failed to bookmark article");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.webTitle || article.title,
          text: article.fields?.bodyText?.slice(0, 140) + "..." || article.description,
          url: article.webUrl || article.url
        });
      } else {
        await navigator.clipboard.writeText(article.webUrl || article.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-full max-w-3xl mx-auto">
      <div className="relative h-1/2 min-h-[40vh] bg-gray-100">
        {article.fields?.thumbnail || article.image || article.urlToImage ? (
          <img 
            src={article.fields?.thumbnail || article.image || article.urlToImage} 
            alt={article.webTitle || article.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span>No Image Available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2">
          <div className="bg-white/90 rounded-full py-1 px-3 flex items-center">
            <img src="/lovable-uploads/75566c73-e7d9-4497-9265-da577f300186.png" className="h-6 w-6 mr-1" alt="AirNews logo" />
            <span className="text-sm font-bold">AirNews</span>
          </div>
          <div className="text-white text-sm bg-black/40 px-2 py-1 rounded-full">
            {currentIndex + 1} of {totalItems}
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">{article.webTitle || article.title}</h2>
        <p className="text-gray-600 mb-4">
          {article.fields?.bodyText || article.description || "No description available"}
        </p>
        
        <div className="mt-auto border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {article.source?.name || article.sectionName || "News Source"} · {new Date(article.webPublicationDate || article.publishedAt).toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handleBookmark}>
                <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
