
import { corsHeaders } from "../../_shared/cors.ts";
import { validateApiKey } from "../utils.ts";

export async function fetchTheNewsAPI(category: string) {
  const THE_NEWS_API_KEY = Deno.env.get('THE_NEWS_API_KEY');
  
  // Validate API key
  validateApiKey(THE_NEWS_API_KEY, 'The News API');
  
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

  console.log('Fetching from The News API:', `${baseUrl}?${params.toString()}`);
  
  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('The News API error response:', errorText);
      throw new Error(`The News API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.warn('No articles returned from The News API');
    }
    
    // Transform The News API response to match Guardian API format
    return {
      response: {
        results: (data.data || []).map((article: any, index: number) => ({
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
  } catch (error) {
    console.error('Error fetching from The News API:', error);
    throw error;
  }
}
