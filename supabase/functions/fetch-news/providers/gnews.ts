
import { corsHeaders } from "../../_shared/cors.ts";
import { mapCategoryForGNews, validateApiKey } from "../utils.ts";

export async function fetchGNews(category: string) {
  const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY');
  
  // Validate API key
  validateApiKey(GNEWS_API_KEY, 'GNews');
  
  const baseUrl = 'https://gnews.io/api/v4/top-headlines';
  
  // Map category for GNews
  let newsCategory = mapCategoryForGNews(category);
  
  const params = new URLSearchParams({
    'apikey': GNEWS_API_KEY,
    'lang': 'en',
    'country': 'us',
    'max': '10',
    'category': newsCategory
  });

  console.log('Fetching from GNews API:', `${baseUrl}?${params.toString()}`);
  
  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GNews API error response:', errorText);
      throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.warn('No articles returned from GNews API');
    }
    
    // Transform GNews API response to match Guardian API format
    return {
      response: {
        results: (data.articles || []).map((article: any, index: number) => ({
          id: `gnews-${index}`,
          type: 'article',
          sectionId: newsCategory || 'general',
          sectionName: category,
          webPublicationDate: article.publishedAt,
          webTitle: article.title,
          webUrl: article.url,
          apiUrl: article.url,
          fields: {
            thumbnail: article.image,
            bodyText: article.description || article.content || 'No description available'
          }
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching from GNews API:', error);
    throw error;
  }
}
