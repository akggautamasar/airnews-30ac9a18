
import { corsHeaders } from "../../_shared/cors.ts";
import { validateApiKey, transformToStandardFormat } from "../utils.ts";

export async function fetchTheNewsAPI(category: string) {
  // Get API key from environment variables
  const THE_NEWS_API_KEY = Deno.env.get('THE_NEWS_API_KEY');
  
  try {
    // Validate API key
    const apiKey = validateApiKey(THE_NEWS_API_KEY, 'The News API');
    
    const baseUrl = 'https://api.thenewsapi.com/v1/news/top';
    
    // Map category for The News API
    let newsCategory = '';
    if (category && category !== "Today's News" && category !== "Top Stories") {
      newsCategory = category.toLowerCase();
    }
    
    const params = new URLSearchParams({
      'api_token': apiKey,
      'limit': '10',
      'language': 'en'
    });
    
    // Add category if specific
    if (newsCategory) {
      params.append('categories', newsCategory);
    }

    console.log('Fetching from The News API:', `${baseUrl}?${params.toString()}`);
    
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
      return transformToStandardFormat([], 'thenewsapi', category);
    }
    
    // Use our standard transform function
    return transformToStandardFormat(data.data.map((article: any) => ({
      title: article.title,
      published_at: article.published_at,
      url: article.url,
      description: article.description || article.snippet || 'No description available',
      image: article.image_url
    })), 'thenewsapi', category);
  } catch (error) {
    console.error('Error fetching from The News API:', error);
    throw error;
  }
}
