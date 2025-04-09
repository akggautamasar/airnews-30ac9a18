
import { corsHeaders } from "../../_shared/cors.ts";

export async function fetchNewsAPI(category: string) {
  const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');
  
  if (!NEWS_API_KEY) {
    throw new Error('News API key is not defined');
  }
  
  const baseUrl = 'https://newsapi.org/v2/top-headlines';
  
  // Map category to News API categories
  let newsCategory = category.toLowerCase();
  if (category === "Today's News" || category === "Top Stories") {
    newsCategory = ''; // Don't filter by category for these
  }
  
  const params = new URLSearchParams({
    'apiKey': NEWS_API_KEY,
    'pageSize': '10',
    'language': 'en',
    'country': 'us'
  });
  
  // Only add category if we have a specific one
  if (newsCategory && !['today\'s news', 'top stories'].includes(newsCategory)) {
    params.append('category', newsCategory);
  }

  console.log('Fetching from News API:', `${baseUrl}?${params}`);
  
  const response = await fetch(`${baseUrl}?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`News API error: ${data.message || response.statusText}`);
  }
  
  // Transform News API response to match Guardian API format
  return {
    response: {
      results: data.articles.map((article: any, index: number) => ({
        id: `newsapi-${index}`,
        type: 'article',
        sectionId: newsCategory || 'general',
        sectionName: category,
        webPublicationDate: article.publishedAt,
        webTitle: article.title,
        webUrl: article.url,
        apiUrl: article.url,
        fields: {
          thumbnail: article.urlToImage,
          bodyText: article.description || article.content || 'No description available'
        }
      }))
    }
  };
}
