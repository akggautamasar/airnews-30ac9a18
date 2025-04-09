
import { corsHeaders } from "../../_shared/cors.ts";
import { mapCategoryForGNews } from "../utils.ts";

export async function fetchGNews(category: string) {
  const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY');
  
  if (!GNEWS_API_KEY) {
    throw new Error('GNews API key is not defined');
  }
  
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

  console.log('Fetching from GNews API:', `${baseUrl}?${params}`);
  
  const response = await fetch(`${baseUrl}?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`GNews API error: ${data.errors || response.statusText}`);
  }
  
  // Transform GNews API response to match Guardian API format
  return {
    response: {
      results: data.articles.map((article: any, index: number) => ({
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
}
