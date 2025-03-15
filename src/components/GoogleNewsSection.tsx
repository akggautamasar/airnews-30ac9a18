
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GoogleNewsItem {
  headline: string;
  summary: string;
  source: string;
}

export const GoogleNewsSection = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['google-news'],
    queryFn: async () => {
      console.log('Fetching Google News');
      const response = await fetch('/api/news');
      console.log('Google News API response status:', response.status);
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error('Google News API error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch Google News');
        } catch (e) {
          console.error('Error parsing API response:', e);
          throw new Error('Failed to fetch Google News: ' + response.statusText);
        }
      }
      
      const data = await response.json();
      console.log('Google News API response data:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="h-full space-y-6">
        <h2 className="text-2xl font-bold">Google News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-20 mb-3" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Google News error:', error);
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
