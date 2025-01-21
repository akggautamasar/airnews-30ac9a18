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

  const response = await fetch(guardianUrl.toString());
  if (!response.ok) {
    throw new Error(`Guardian API error: ${response.statusText}`);
  }
  return await response.json();
}

async function fetchNewsAPI(category: string) {
  const apiKey = Deno.env.get('NEWS_API_KEY');
  if (!apiKey) {
    throw new Error('News API key not configured');
  }

  const newsApiUrl = new URL('https://newsapi.org/v2/top-headlines');
  newsApiUrl.searchParams.append('apiKey', apiKey);
  
  if (category && category !== "Today's News") {
    newsApiUrl.searchParams.append('category', category.toLowerCase());
  }
  newsApiUrl.searchParams.append('pageSize', '50');
  newsApiUrl.searchParams.append('language', 'en');

  const response = await fetch(newsApiUrl.toString());
  if (!response.ok) {
    throw new Error(`News API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    response: {
      status: 'ok',
      results: data.articles.map((article: any) => ({
        id: article.url,
        webTitle: article.title,
        webPublicationDate: article.publishedAt,
        webUrl: article.url,
        fields: {
          thumbnail: article.urlToImage,
          bodyText: article.description || article.content
        },
        source: article.source.name
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
        newsData = await fetchNewsAPI(category);
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