import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || '';
    const apiKey = Deno.env.get('NEWS_API_KEY');

    if (!apiKey) {
      throw new Error('NEWS_API_KEY is not configured');
    }

    console.log('Fetching news for category:', category);

    const newsApiUrl = new URL('https://newsapi.org/v2/top-headlines');
    newsApiUrl.searchParams.append('apiKey', apiKey);
    newsApiUrl.searchParams.append('country', 'us');
    newsApiUrl.searchParams.append('pageSize', '10');
    
    if (category && category !== 'Top Stories') {
      newsApiUrl.searchParams.append('category', category.toLowerCase());
    }

    const response = await fetch(newsApiUrl.toString());
    const data = await response.json();

    console.log('News API response status:', response.status);

    if (!response.ok) {
      throw new Error(`News API error: ${data.message || 'Unknown error'}`);
    }

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});