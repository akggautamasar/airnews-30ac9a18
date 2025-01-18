import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewsCardProps } from "@/types/news";
import { format } from "date-fns";

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

      const { error } = await supabase.from("bookmarks").insert({
        user_id: session.session.user.id,
        article_id: article.id,
        article_data: article
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

  return (
    <Card>
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
  );
};