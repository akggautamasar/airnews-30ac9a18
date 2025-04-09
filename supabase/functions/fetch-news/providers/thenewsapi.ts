
import { corsHeaders } from "../../_shared/cors.ts";

export async function fetchTheNewsAPI(category: string) {
  const THE_NEWS_API_KEY = Deno.env.get('THE_NEWS_API_KEY');
  
  if (!THE_NEWS_API_KEY) {
    throw new Error('The News API key is not defined');
  }
  
  const baseUrl = 'https://api.thenewsapi.com/v1/news/top';
  
  // Map category for The News API
  let newsCategory = '';
  if (category && category !== "Today's News" && category !== "Top Stories") {
    newsCategory = category.toLowerCase();
  }
  
  const params = new URLSearchParams({
    'api_token': THE_NEWS_API_KEY,
    'limit': '10',
    'language': 'en'
  });
  
  // Add category if specific
  if (newsCategory) {
    params.append('categories', newsCategory);
  }

  console.log('Fetching from The News API:', `${baseUrl}?${params}`);
  
  const response = await fetch(`${baseUrl}?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`The News API error: ${data.message || response.statusText}`);
  }
  
  // Transform The News API response to match Guardian API format
  return {
    response: {
      results: data.data.map((article: any, index: number) => ({
        id: `thenewsapi-${index}`,
        type: 'article',
        sectionId: newsCategory || 'general',
        sectionName: category,
        webPublicationDate: article.published_at,
        webTitle: article.title,
        webUrl: article.url,
        apiUrl: article.url,
        fields: {
          thumbnail: article.image_url,
          bodyText: article.description || article.snippet || 'No description available'
        }
      }))
    }
  };
}
