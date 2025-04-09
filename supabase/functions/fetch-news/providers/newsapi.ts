
import { corsHeaders } from "../../_shared/cors.ts";
import { validateApiKey, transformToStandardFormat } from "../utils.ts";

export async function fetchNewsAPI(category: string) {
  // Get API key from environment variables
  const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');
  
  try {
    // Validate API key
    const apiKey = validateApiKey(NEWS_API_KEY, 'News API');
    
    const baseUrl = 'https://newsapi.org/v2/top-headlines';
    
    // Map category to News API categories
    let newsCategory = category.toLowerCase();
    if (category === "Today's News" || category === "Top Stories") {
      newsCategory = ''; // Don't filter by category for these
    }
    
    const params = new URLSearchParams({
      'apiKey': apiKey,
      'pageSize': '10',
      'language': 'en',
      'country': 'us'
    });
    
    // Only add category if we have a specific one
    if (newsCategory && !['today\'s news', 'top stories'].includes(newsCategory)) {
      params.append('category', newsCategory);
    }

    console.log('Fetching from News API:', `${baseUrl}?${params.toString()}`);
    
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('News API error response:', errorText);
      throw new Error(`News API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.warn('No articles returned from News API');
      return transformToStandardFormat([], 'newsapi', category);
    }
    
    // Use our standard transform function
    return transformToStandardFormat(data.articles.map((article: any) => ({
      title: article.title,
      publishedAt: article.publishedAt,
      url: article.url,
      description: article.description || article.content || 'No description available',
      image: article.urlToImage
    })), 'newsapi', category);
  } catch (error) {
    console.error('Error fetching from News API:', error);
    throw error;
  }
}
