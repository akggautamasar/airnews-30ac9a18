
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GUARDIAN_API_KEY = Deno.env.get('GUARDIAN_API_KEY');
const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');
const THE_NEWS_API_KEY = Deno.env.get('THE_NEWS_API_KEY');
const NEWSDATA_IO_API_KEY = Deno.env.get('NEWSDATA_IO_API_KEY');
const MEDIASTACK_API_KEY = Deno.env.get('MEDIASTACK_API_KEY');
const WORLDNEWS_API_KEY = Deno.env.get('WORLDNEWS_API_KEY');
const PIXABAY_API_KEY = Deno.env.get('PIXABAY_API_KEY');
const PEXELS_API_KEY = Deno.env.get('PEXELS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, isToday, newsAgency } = await req.json();
    let apiResponse;

    console.log('Received request with params:', { category, isToday, newsAgency });

    if (newsAgency === 'guardian') {
      const baseUrl = 'https://content.guardianapis.com/search';
      const today = new Date().toISOString().split('T')[0];
      
      // Map category to Guardian's section names
      let section = category?.toLowerCase()?.replace("'s news", '')?.trim() || '';
      if (category === "Today's News" || category === "Top Stories") {
        section = ""; // Don't filter by section for these categories
      }

      const params = new URLSearchParams({
        'api-key': GUARDIAN_API_KEY || '',
        'show-fields': 'thumbnail,bodyText',
        'page-size': '10',
        'order-by': 'newest',
      });

      // Only add section parameter if we have a specific section
      if (section && section !== 'top stories') {
        params.append('section', section);
      }

      // Add date filters for today's news
      if (isToday) {
        params.append('from-date', today);
        params.append('to-date', today);
      }

      const url = `${baseUrl}?${params}`;
      console.log('Fetching from Guardian API with URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Guardian API error response:', data);
        throw new Error(`Guardian API error: ${data.message || response.statusText}`);
      }
      
      apiResponse = data;
    } else if (newsAgency === 'newsapi') {
      const baseUrl = 'https://newsapi.org/v2/top-headlines';
      
      // Map category to News API categories
      let newsCategory = category.toLowerCase();
      if (category === "Today's News" || category === "Top Stories") {
        newsCategory = ''; // Don't filter by category for these
      }
      
      const params = new URLSearchParams({
        'apiKey': NEWS_API_KEY || '',
        'pageSize': '10',
        'language': 'en'
      });
      
      // Only add category if we have a specific one
      if (newsCategory && !['today\'s news', 'top stories'].includes(newsCategory)) {
        params.append('category', newsCategory);
      }

      console.log('Fetching from News API:', `${baseUrl}?${params}`);
      
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`News API error: ${data.message || response.statusText}`);
      }
      
      // Transform News API response to match Guardian API format
      apiResponse = {
        response: {
          results: data.articles.map((article: any, index: number) => ({
            id: `newsapi-${index}`,
            type: 'article',
            sectionId: newsCategory || 'general',
            sectionName: category,
            webPublicationDate: article.publishedAt,
            webTitle: article.title,
            webUrl: article.url,
            apiUrl: article.url,
            fields: {
              thumbnail: article.urlToImage,
              bodyText: article.description || article.content || 'No description available'
            }
          }))
        }
      };
    } else if (newsAgency === 'thenewsapi') {
      // The News API integration
      const baseUrl = 'https://api.thenewsapi.com/v1/news/top';
      
      // Map category for The News API
      let newsCategory = '';
      if (category && category !== "Today's News" && category !== "Top Stories") {
        newsCategory = category.toLowerCase();
      }
      
      const params = new URLSearchParams({
        'api_token': THE_NEWS_API_KEY || '',
        'limit': '10',
        'language': 'en'
      });
      
      // Add category if specific
      if (newsCategory) {
        params.append('categories', newsCategory);
      }

      console.log('Fetching from The News API:', `${baseUrl}?${params}`);
      
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`The News API error: ${data.message || response.statusText}`);
      }
      
      // Transform The News API response to match Guardian API format
      apiResponse = {
        response: {
          results: data.data.map((article: any, index: number) => ({
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
    } else if (newsAgency === 'newsdataio') {
      // NewsData.io API integration
      const baseUrl = 'https://newsdata.io/api/1/news';
      
      // Map category for NewsData.io
      let newsCategory = '';
      if (category && category !== "Today's News" && category !== "Top Stories") {
        newsCategory = mapCategoryForNewsDataIO(category);
      }
      
      const params = new URLSearchParams({
        'apikey': NEWSDATA_IO_API_KEY || '',
        'language': 'en',
        'size': '10'
      });
      
      // Add category if specific
      if (newsCategory) {
        params.append('category', newsCategory);
      }

      console.log('Fetching from NewsData.io API:', `${baseUrl}?${params}`);
      
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(`NewsData.io API error: ${data.results?.message || 'Unknown error'}`);
      }
      
      // Transform NewsData.io API response to match Guardian API format
      apiResponse = {
        response: {
          results: data.results.map((article: any, index: number) => ({
            id: `newsdataio-${index}`,
            type: 'article',
            sectionId: newsCategory || 'general',
            sectionName: category,
            webPublicationDate: article.pubDate,
            webTitle: article.title,
            webUrl: article.link,
            apiUrl: article.link,
            fields: {
              thumbnail: article.image_url,
              bodyText: article.description || article.content || 'No description available'
            }
          }))
        }
      };
    } else if (newsAgency === 'mediastack') {
      // Mediastack API integration
      const baseUrl = 'http://api.mediastack.com/v1/news';
      
      // Map category for Mediastack
      let newsCategory = '';
      if (category && category !== "Today's News" && category !== "Top Stories") {
        newsCategory = category.toLowerCase();
      }
      
      const params = new URLSearchParams({
        'access_key': MEDIASTACK_API_KEY || '',
        'limit': '10',
        'languages': 'en'
      });
      
      // Add category if specific
      if (newsCategory) {
        params.append('categories', newsCategory);
      }

      console.log('Fetching from Mediastack API:', `${baseUrl}?${params}`);
      
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Mediastack API error: ${data.error.info || 'Unknown error'}`);
      }
      
      // Transform Mediastack API response to match Guardian API format
      apiResponse = {
        response: {
          results: data.data.map((article: any, index: number) => ({
            id: `mediastack-${index}`,
            type: 'article',
            sectionId: article.category || 'general',
            sectionName: article.category ? capitalizeFirstLetter(article.category) : 'General',
            webPublicationDate: article.published_at,
            webTitle: article.title,
            webUrl: article.url,
            apiUrl: article.url,
            fields: {
              thumbnail: article.image,
              bodyText: article.description || 'No description available'
            }
          }))
        }
      };
    } else if (newsAgency === 'worldnewsapi') {
      // World News API integration
      const baseUrl = 'https://api.worldnewsapi.com/search-news';
      
      const params = new URLSearchParams({
        'api-key': WORLDNEWS_API_KEY || '',
        'number': '10',
        'language': 'en'
      });
      
      // Add search query based on category
      if (category && category !== "Today's News" && category !== "Top Stories") {
        params.append('text', category);
      }

      console.log('Fetching from World News API:', `${baseUrl}?${params}`);
      
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`World News API error: ${data.message || response.statusText}`);
      }
      
      // Transform World News API response to match Guardian API format
      apiResponse = {
        response: {
          results: data.news.map((article: any, index: number) => ({
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
    } else {
      throw new Error(`Unsupported news agency: ${newsAgency}`);
    }

    return new Response(JSON.stringify(apiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper functions
function mapCategoryForNewsDataIO(category: string): string {
  // Map standard categories to NewsData.io categories
  const categoryMap: Record<string, string> = {
    'technology': 'technology',
    'business': 'business',
    'entertainment': 'entertainment',
    'sports': 'sports',
    'world': 'world',
    'science': 'science',
    'health': 'health',
    'politics': 'politics',
    'environment': 'environment',
    'food': 'food',
    'top': 'top'
  };

  const lowerCategory = category.toLowerCase();
  return categoryMap[lowerCategory] || 'top';
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
