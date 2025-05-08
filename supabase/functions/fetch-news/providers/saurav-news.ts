
import { corsHeaders } from "../../_shared/cors.ts";
import { transformToStandardFormat } from "../utils.ts";

export async function fetchSauravNews(category: string, pageSize: number = 50) {
  try {
    // Base URL for the SauravKanchan NewsAPI
    const baseUrl = 'https://saurav.tech/NewsAPI/';
    
    // Map category to endpoint path
    let endpointPath = '';
    if (category === "Today's News" || category === "Top Stories") {
      endpointPath = 'top-headlines/category/general/us.json';
    } else {
      // Map our categories to this API's supported categories
      const categoryMap: Record<string, string> = {
        "Technology": "technology",
        "Business": "business",
        "Entertainment": "entertainment",
        "Sports": "sports",
        "Health": "health",
        "Science": "science",
        "General": "general",
      };
      
      const mappedCategory = categoryMap[category] || 'general';
      endpointPath = `top-headlines/category/${mappedCategory.toLowerCase()}/us.json`;
    }
    
    const apiUrl = `${baseUrl}${endpointPath}`;
    console.log('Fetching from SauravKanchan NewsAPI:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('SauravKanchan NewsAPI error response:', errorText);
      throw new Error(`SauravKanchan NewsAPI error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.warn('No articles returned from SauravKanchan NewsAPI');
      return transformToStandardFormat([], 'saurav-news', category);
    }
    
    // Calculate the number of articles to use (respect pageSize)
    const articlesToUse = data.articles.slice(0, pageSize);
    
    console.log(`Successfully fetched ${articlesToUse.length} articles from SauravKanchan NewsAPI`);
    
    // Transform response to use our standard format
    return transformToStandardFormat(articlesToUse.map((article: any) => ({
      title: article.title,
      publishedAt: article.publishedAt,
      url: article.url,
      description: article.description || article.content || 'No description available',
      image: article.urlToImage,
      source: article.source?.name || 'SauravKanchan NewsAPI'
    })), 'saurav-news', category);
  } catch (error) {
    console.error('Error fetching from SauravKanchan NewsAPI:', error);
    throw error;
  }
}
