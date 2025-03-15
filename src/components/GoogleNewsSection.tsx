
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface GoogleNewsItem {
  headline: string;
  summary: string;
  source: string;
}

export const GoogleNewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['google-news'],
    queryFn: async () => {
      const response = await fetch('/api/news');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch Google News');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load Google News. Please try again later.
          {process.env.NODE_ENV === 'development' && error instanceof Error && (
            <pre className="mt-2 text-xs bg-red-50/10 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!news?.news || news.news.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No Google News articles available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const newsItems: GoogleNewsItem[] = news.news;

  return (
    <div className="h-full space-y-6">
      <h2 className="text-2xl font-bold">Google News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsItems.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.headline}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{item.summary}</p>
              <a 
                href={item.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Read more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
