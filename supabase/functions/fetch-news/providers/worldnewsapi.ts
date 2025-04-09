
import { corsHeaders } from "../../_shared/cors.ts";
import { validateApiKey } from "../utils.ts";

export async function fetchWorldNewsAPI(category: string) {
  const WORLDNEWS_API_KEY = Deno.env.get('WORLDNEWS_API_KEY');
  
  // Validate API key
  validateApiKey(WORLDNEWS_API_KEY, 'World News API');
  
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

  console.log('Fetching from World News API:', `${baseUrl}?${params.toString()}`);
  
  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('World News API error response:', errorText);
      throw new Error(`World News API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.news || data.news.length === 0) {
      console.warn('No articles returned from World News API');
    }
    
    // Transform World News API response to match Guardian API format
    return {
      response: {
        results: (data.news || []).map((article: any, index: number) => ({
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
  } catch (error) {
    console.error('Error fetching from World News API:', error);
    throw error;
  }
}
