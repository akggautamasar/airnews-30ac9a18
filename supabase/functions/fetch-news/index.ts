import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function fetchGuardianNews(category: string, isToday: boolean) {
  const apiKey = Deno.env.get('GUARDIAN_API_KEY');
  if (!apiKey) {
    throw new Error('Guardian API key not configured');
  }

  const guardianUrl = new URL('https://content.guardianapis.com/search');
  guardianUrl.searchParams.append('api-key', apiKey);
  if (category && category !== "Today's News") {
    guardianUrl.searchParams.append('section', category.toLowerCase());
  }
  guardianUrl.searchParams.append('show-fields', 'thumbnail,bodyText,trailText');
  guardianUrl.searchParams.append('page-size', '50');
  
  if (isToday) {
    const today = new Date().toISOString().split('T')[0];
    guardianUrl.searchParams.append('from-date', today);
  }
  
  guardianUrl.searchParams.append('order-by', 'newest');

  console.log('Fetching from Guardian API:', guardianUrl.toString());
  const response = await fetch(guardianUrl.toString());
  if (!response.ok) {
    throw new Error(`Guardian API error: ${response.statusText}`);
  }
  return await response.json();
}

async function fetchNewsAPI(category: string, isToday: boolean) {
  const apiKey = Deno.env.get('NEWS_API_KEY');
  if (!apiKey) {
    throw new Error('News API key not configured');
  }

  const newsApiUrl = new URL('https://newsapi.org/v2/top-headlines');
  newsApiUrl.searchParams.append('apiKey', apiKey);
  
  // Map categories to News API categories
  const categoryMap: { [key: string]: string } = {
    "Today's News": '',
    "Technology": 'technology',
    "Business": 'business',
    "Entertainment": 'entertainment',
    "Sports": 'sports',
    "Science": 'science',
    "Health": 'health',
    "World": 'general'
  };

  if (category && categoryMap[category]) {
    newsApiUrl.searchParams.append('category', categoryMap[category]);
  }

  if (isToday) {
    const today = new Date().toISOString().split('T')[0];
    newsApiUrl.searchParams.append('from', today);
  }

  newsApiUrl.searchParams.append('pageSize', '50');
  newsApiUrl.searchParams.append('language', 'en');

  console.log('Fetching from News API:', newsApiUrl.toString());
  const response = await fetch(newsApiUrl.toString());
  if (!response.ok) {
    throw new Error(`News API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Transform News API response to match Guardian API format
  return {
    response: {
      status: 'ok',
      results: data.articles.map((article: any) => ({
        id: article.url,
        type: 'article',
        sectionId: article.source.name,
        sectionName: article.source.name,
        webPublicationDate: article.publishedAt,
        webTitle: article.title,
        webUrl: article.url,
        apiUrl: article.url,
        fields: {
          thumbnail: article.urlToImage,
          bodyText: article.description || article.content,
          trailText: article.description
        },
        source: article.source.name
      }))
    }
  };
}

async function fetchCustomNews(category: string, isToday: boolean) {
  const apiKey = Deno.env.get('D7F4AEC67AA64EF39093BF7FEA67BAC2');
  if (!apiKey) {
    throw new Error('Custom News API key not configured');
  }

  const customUrl = new URL('https://api.thenewsapi.com/v1/news/top');
  customUrl.searchParams.append('api_token', apiKey);
  customUrl.searchParams.append('locale', 'us');
  customUrl.searchParams.append('limit', '50');
  
  if (category && category !== "Today's News") {
    customUrl.searchParams.append('categories', category.toLowerCase());
  }

  if (isToday) {
    const today = new Date().toISOString().split('T')[0];
    customUrl.searchParams.append('published_on', today);
  }

  console.log('Fetching from Custom News API:', customUrl.toString());
  const response = await fetch(customUrl.toString());
  if (!response.ok) {
    throw new Error(`Custom News API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Transform Custom News API response to match Guardian API format
  return {
    response: {
      status: 'ok',
      results: data.data.map((article: any) => ({
        id: article.uuid,
        type: 'article',
        sectionId: article.categories?.[0] || 'general',
        sectionName: article.categories?.[0] || 'General',
        webPublicationDate: article.published_at,
        webTitle: article.title,
        webUrl: article.url,
        apiUrl: article.url,
        fields: {
          thumbnail: article.image_url,
          bodyText: article.description,
          trailText: article.snippet
        },
        source: article.source
      }))
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, isToday, newsAgency = 'guardian' } = await req.json();
    
    console.log('Fetching news for:', { category, isToday, newsAgency });
    
    let newsData;
    
    try {
      if (newsAgency === 'guardian') {
        newsData = await fetchGuardianNews(category, isToday);
      } else if (newsAgency === 'newsapi') {
        newsData = await fetchNewsAPI(category, isToday);
      } else if (newsAgency === 'custom') {
        newsData = await fetchCustomNews(category, isToday);
      } else {
        throw new Error(`Unsupported news agency: ${newsAgency}`);
      }
      
      return new Response(JSON.stringify(newsData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (error) {
      console.error(`Error fetching from ${newsAgency}:`, error);
      throw error;
    }
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        response: { status: 'error', results: [] }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
