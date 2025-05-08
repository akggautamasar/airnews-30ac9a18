
import { corsHeaders } from "../../_shared/cors.ts";
import { mapCategoryForGNews, validateApiKey, transformToStandardFormat } from "../utils.ts";

export async function fetchGNews(category: string, pageSize: number = 50) {
  // Get API key from environment variables
  const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY');
  
  try {
    // Validate API key
    const apiKey = validateApiKey(GNEWS_API_KEY, 'GNews');
    
    const baseUrl = 'https://gnews.io/api/v4/top-headlines';
    
    // Map category for GNews
    let newsCategory = mapCategoryForGNews(category);
    
    // GNews free tier allows 100 articles per request, paid plans may allow more
    // We'll use the maximum allowed based on the user's plan, capped by what they requested
    const maxArticles = Math.min(pageSize, 100); // Adjust based on API plan limits
    
    const params = new URLSearchParams({
      'apikey': apiKey,
      'lang': 'en',
      'country': 'us',
      'max': maxArticles.toString(),
      'category': newsCategory
    });

    console.log('Fetching from GNews API:', `${baseUrl}?${params.toString()}`);
    
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GNews API error response:', errorText);
      console.error('GNews API response status:', response.status);
      throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.warn('No articles returned from GNews API');
      return transformToStandardFormat([], 'gnews', category);
    }
    
    console.log(`Successfully fetched ${data.articles.length} articles from GNews API`);
    
    // Transform GNews API response to use our standard format helper
    return transformToStandardFormat(data.articles.map((article: any) => ({
      title: article.title,
      publishedAt: article.publishedAt,
      url: article.url,
      description: article.description || article.content || 'No description available',
      image: article.image
    })), 'gnews', category);
  } catch (error) {
    console.error('Error fetching from GNews API:', error);
    throw error;
  }
}
