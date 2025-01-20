import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full"
    >
      <Card className="h-full overflow-hidden relative">
        {article.fields?.thumbnail && (
          <div className="absolute inset-0 bg-black/20">
            <img
              src={article.fields.thumbnail}
              alt={article.webTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="relative h-full flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold leading-tight">
              {article.webTitle}
            </h2>
            <p className="text-sm opacity-90 line-clamp-3">
              {article.fields?.bodyText}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {format(new Date(article.webPublicationDate), 'PPP')}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  disabled={isBookmarking || isBookmarked}
                  className="text-white hover:text-white/80"
                >
                  <Bookmark
                    className={`h-5 w-5 ${isBookmarked ? "fill-white" : ""}`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="text-white hover:text-white/80"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <a
              href={article.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-white/90 hover:text-white underline"
            >
              Read full article
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};