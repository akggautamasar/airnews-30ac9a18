
import { corsHeaders } from "../../_shared/cors.ts";
import { validateApiKey, transformToStandardFormat } from "../utils.ts";

export async function fetchWorldNewsAPI(category: string) {
  // Get API key from environment variables, or use a fallback for testing
  const WORLDNEWS_API_KEY = Deno.env.get('WORLDNEWS_API_KEY');
  
  try {
    // Validate API key - this will throw an error if the key is invalid
    const apiKey = validateApiKey(WORLDNEWS_API_KEY, 'World News API');
    
    const baseUrl = 'https://api.worldnewsapi.com/search-news';
    
    const params = new URLSearchParams({
      'api-key': apiKey,
      'number': '10',
      'language': 'en'
    });
    
    // Add search query based on category
    if (category && category !== "Today's News" && category !== "Top Stories") {
      params.append('text', category);
    }

    console.log('Fetching from World News API:', `${baseUrl}?${params.toString()}`);
    
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
      // Return an empty response rather than throwing an error
      return transformToStandardFormat([], 'worldnewsapi', category);
    }
    
    // Transform World News API response to match Guardian API format
    return transformToStandardFormat(data.news.map((article: any) => ({
      title: article.title,
      publishedAt: article.publishDate,
      url: article.url,
      description: article.text?.substring(0, 300) + '...' || 'No description available',
      image: article.image
    })), 'worldnewsapi', category);
  } catch (error) {
    console.error('Error fetching from World News API:', error);
    throw error;
  }
}
