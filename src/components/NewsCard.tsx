import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  source: string;
  publishedAt: string;
}

export const NewsCard = ({
  title,
  summary,
  imageUrl,
  category,
  source,
  publishedAt,
}: NewsCardProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden animate-slideUp">
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
          <h2 className="text-xl font-bold mb-3 line-clamp-2">{title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{source}</span>
            <span>{new Date(publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};