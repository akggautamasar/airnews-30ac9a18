
import { corsHeaders } from "../../_shared/cors.ts";

export async function fetchWorldNewsAPI(category: string) {
  const WORLDNEWS_API_KEY = Deno.env.get('WORLDNEWS_API_KEY');
  
  if (!WORLDNEWS_API_KEY) {
    throw new Error('World News API key is not defined');
  }
  
  const baseUrl = 'https://api.worldnewsapi.com/search-news';
  
  const params = new URLSearchParams({
    'api-key': WORLDNEWS_API_KEY,
    'number': '10',
    'language': 'en'
  });
  
  // Add search query based on category
  if (category && category !== "Today's News" && category !== "Top Stories") {
    params.append('text', category);
  }

  console.log('Fetching from World News API:', `${baseUrl}?${params}`);
  
  const response = await fetch(`${baseUrl}?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`World News API error: ${data.message || response.statusText}`);
  }
  
  // Transform World News API response to match Guardian API format
  return {
    response: {
      results: data.news.map((article: any, index: number) => ({
        id: `worldnewsapi-${index}`,
        type: 'article',
        sectionId: 'general',
        sectionName: category,
        webPublicationDate: article.publishDate,
        webTitle: article.title,
        webUrl: article.url,
        apiUrl: article.url,
        fields: {
          thumbnail: article.image,
          bodyText: article.text?.substring(0, 300) + '...' || 'No description available'
        }
      }))
    }
  };
}
