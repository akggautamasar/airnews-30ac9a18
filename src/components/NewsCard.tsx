
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewsCardProps } from "@/types/news";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const NewsCard = ({ article, category }: NewsCardProps) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

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

      setIsBookmarking(true);
      
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
        is_bookmarked: true,
        user_id: session.session.user.id
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
    <motion.div className="h-full w-full select-none">
      <Card className="h-full overflow-hidden relative border-none">
        {article.fields?.thumbnail && (
          <div className="absolute inset-0 h-1/2">
            <img
              src={article.fields.thumbnail}
              alt={article.webTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-white/90 rounded-full py-1 px-3 flex items-center">
              <img src="/lovable-uploads/3acd26f4-c871-4f55-bd2d-78795349438a.png" className="h-4 w-4 mr-1" alt="Airnews logo" />
              <span className="text-xs font-bold">airnews</span>
            </div>
          </div>
        )}
        <CardContent className="relative h-full flex flex-col p-0">
          <div className="h-1/2" />
          <div className="flex-1 mt-[-3rem] flex flex-col">
            <div className="space-y-4 bg-gradient-to-t from-black/95 via-black/85 to-black/70 p-6 rounded-t-3xl h-full">
              <h2 className="text-2xl font-bold leading-tight text-[#9b87f5]">
                {article.webTitle}
              </h2>
              
              <p className="text-base text-white/90 leading-relaxed">
                {article.fields?.bodyText || "No content available"}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-white/80">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <a
                  href={article.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/90 hover:text-white underline"
                >
                  View Original
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
