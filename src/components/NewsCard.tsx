import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewsCardProps } from "@/types/news";
import { format } from "date-fns";
import { motion } from "framer-motion";

export const NewsCard = ({ article, category }: NewsCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast.error("Please sign in to bookmark articles");
        return;
      }

      // Create a serializable version of the article
      const articleData = {
        id: article.id,
        type: article.type || "",
        sectionId: article.sectionId || "",
        sectionName: article.sectionName || "",
        webPublicationDate: article.webPublicationDate,
        webTitle: article.webTitle,
        webUrl: article.webUrl,
        apiUrl: article.apiUrl || "",
        fields: {
          thumbnail: article.fields?.thumbnail || "",
          bodyText: article.fields?.bodyText || ""
        },
        isHosted: article.isHosted || false,
        pillarId: article.pillarId || "",
        pillarName: article.pillarName || ""
      };

      const { error } = await supabase.from("saved_articles").insert({
        user_id: session.session.user.id,
        article_data: articleData,
        is_bookmarked: true
      });

      if (error) throw error;
      
      setIsBookmarked(true);
      toast.success("Article bookmarked successfully");
    } catch (error) {
      console.error("Error bookmarking article:", error);
      toast.error("Failed to bookmark article");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.webTitle,
          text: article.fields?.bodyText?.slice(0, 140) + "...",
          url: article.webUrl
        });
      } else {
        await navigator.clipboard.writeText(article.webUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing article:", error);
      toast.error("Failed to share article");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">
                <a
                  href={article.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {article.webTitle}
                </a>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(article.webPublicationDate), 'PPP')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                disabled={isBookmarking || isBookmarked}
              >
                <Bookmark
                  className={`h-5 w-5 ${isBookmarked ? "fill-primary" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {article.fields?.thumbnail && (
            <img
              src={article.fields.thumbnail}
              alt={article.webTitle}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <p className="text-muted-foreground">
            {article.fields?.bodyText?.slice(0, 200)}...
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {article.sectionName || category}
            </span>
            <a
              href={article.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Read more
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};