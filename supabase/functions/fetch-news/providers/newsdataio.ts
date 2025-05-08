
import { corsHeaders } from "../../_shared/cors.ts";
import { validateApiKey, transformToStandardFormat } from "../utils.ts";

export async function fetchNewsDataIO(category: string, pageSize: number = 50) {
  // Get API key from environment variables
  const NEWSDATA_IO_API_KEY = Deno.env.get('NEWSDATA_IO_API_KEY');
  
  try {
    // Validate API key
    const apiKey = validateApiKey(NEWSDATA_IO_API_KEY, 'NewsData.io');
    
    const baseUrl = 'https://newsdata.io/api/1/news';
    
    // Map category for NewsData.io
    let newsCategory = '';
    if (category) {
      // Map our categories to NewsData.io categories
      const categoryMap: Record<string, string> = {
        "Today's News": 'top',
        "Top Stories": 'top',
        "Technology": 'technology',
        "Business": 'business',
        "Entertainment": 'entertainment',
        "Sports": 'sports',
        "World": 'world',
        "Science": 'science',
        "Health": 'health',
      };
      
      newsCategory = categoryMap[category] || category.toLowerCase();
    }
    
    // NewsData.io free tier typically accepts 'size' up to 10, paid plans allow more
    // Let's use 10 as a safe default for the free tier
    // NOTE: The API will reject invalid values, different plans have different limits
    const safeSize = Math.min(10, pageSize); // Adjust based on plan limits
    
    const params = new URLSearchParams({
      'apikey': apiKey,
      'language': 'en',
      'size': safeSize.toString()
    });
    
    // Add category if specific
    if (newsCategory && newsCategory !== 'top stories') {
      params.append('category', newsCategory);
    }

    console.log('Fetching from NewsData.io:', `${baseUrl}?${params.toString()}`);
    
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewsData.io error response:', errorText);
      throw new Error(`NewsData.io API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success' || !data.results || data.results.length === 0) {
      console.warn('No articles returned from NewsData.io API');
      return transformToStandardFormat([], 'newsdata_io', category);
    }
    
    console.log(`Successfully fetched ${data.results.length} articles from NewsData.io API`);
    
    // Transform NewsData.io response to use our standard format
    return transformToStandardFormat(data.results.map((article: any) => ({
      title: article.title,
      publishedAt: article.pubDate,
      url: article.link,
      description: article.description || article.content || 'No description available',
      image: article.image_url,
      source: article.source_id
    })), 'newsdata_io', category);
  } catch (error) {
    console.error('Error fetching from NewsData.io API:', error);
    throw error;
  }
}
