import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Share2, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface NewsCardProps {
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  source: string;
  publishedAt: string;
  url?: string;
}

export const NewsCard = ({
  title,
  summary,
  imageUrl,
  category,
  source,
  publishedAt,
  url,
}: NewsCardProps) => {
  const { toast } = useToast();

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:no-underline"
        >
          {children}
        </a>
      );
    }
    return <>{children}</>;
  };

  // Format summary to be more concise
  const formatSummary = (text: string) => {
    // Remove any text in parentheses as it's usually context that can be omitted
    const cleanText = text.replace(/\([^)]*\)/g, '');
    // Split into sentences
    const sentences = cleanText.split(/[.!?]+/);
    // Take first two sentences and join them
    return sentences.slice(0, 2).join('. ').trim() + '.';
  };

  // Calculate reading time
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const formattedSummary = formatSummary(summary);
  const readingTime = calculateReadingTime(summary);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: formattedSummary,
          url: url || window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${title}\n\n${formattedSummary}\n\n${url || window.location.href}`);
      toast({
        description: "Link copied to clipboard!",
        duration: 2000,
      });
    }
  };

  return (
    <CardWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-2xl mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative">
              <img
                src={imageUrl}
                alt={title}
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
                <h2 className="text-xl font-bold mb-3 line-clamp-2">{title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-gray-500" />
                  </button>
                  {url && (
                    <ExternalLink className="h-5 w-5 flex-shrink-0 text-gray-400 mt-2" />
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-base leading-relaxed">
                {formattedSummary}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{source}</span>
                <span>{new Date(publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </CardWrapper>
  );
};