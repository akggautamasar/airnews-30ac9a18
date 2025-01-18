import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Share2, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GuardianArticle } from "@/utils/newsApi";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import type { Json } from "@/integrations/supabase/types";

interface NewsCardProps {
  article: GuardianArticle;
  category: string;
}

export const NewsCard = ({ article, category }: NewsCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfBookmarked();
  }, [article.id]);

  const checkIfBookmarked = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('article_id', article.id)
        .eq('user_id', session.session.user.id)
        .single();
      
      setIsBookmarked(!!bookmarks);
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  // Early return if article or required fields are undefined
  if (!article?.fields) {
    return null;
  }

  const formatSummary = (text: string) => {
    const cleanText = text.replace(/\([^)]*\)/g, '');
    const sentences = cleanText.split(/[.!?]+/);
    return sentences.slice(0, 2).join('. ').trim() + '.';
  };

  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const summary = article.fields.trailText || formatSummary(article.fields.bodyText || '');
  const readingTime = calculateReadingTime(article.fields.bodyText || '');

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.webTitle,
          text: summary,
          url: article.webUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${article.webTitle}\n\n${summary}\n\n${article.webUrl}`);
      toast("Link copied to clipboard!");
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast("Please sign in to bookmark articles");
      return;
    }
    
    setLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('article_id', article.id)
          .eq('user_id', session.session.user.id);
        
        if (error) throw error;
        toast("Article removed from bookmarks");
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            article_id: article.id,
            article_data: article as unknown as Json,
            user_id: session.session.user.id
          });
        
        if (error) throw error;
        toast("Article bookmarked successfully");
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast("Error updating bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <a href={article.webUrl} target="_blank" rel="noopener noreferrer" className="block hover:no-underline">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-2xl mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative">
              <img
                src={article.fields.thumbnail || '/placeholder.svg'}
                alt={article.webTitle}
                className="w-full h-48 md:h-full object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                {category}
              </Badge>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            <div className="md:w-3/5 p-6">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-bold mb-3 line-clamp-2">{article.webTitle}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleBookmark}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={loading}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <Bookmark className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-gray-500" />
                  </button>
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-gray-400 mt-2" />
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-base leading-relaxed">
                {summary}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>The Guardian</span>
                <span>{new Date(article.webPublicationDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </a>
  );
};