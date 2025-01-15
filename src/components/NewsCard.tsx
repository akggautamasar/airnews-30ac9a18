import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

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

  const formattedSummary = formatSummary(summary);

  return (
    <CardWrapper>
      <Card className="w-full max-w-2xl mx-auto overflow-hidden animate-slideUp hover:shadow-lg transition-shadow duration-200">
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
          </div>
          <div className="md:w-3/5 p-6">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-bold mb-3 line-clamp-2">{title}</h2>
              {url && (
                <ExternalLink className="h-5 w-5 flex-shrink-0 text-gray-400" />
              )}
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
    </CardWrapper>
  );
};