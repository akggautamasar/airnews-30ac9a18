import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    
    console.log('Received request for category:', category);
    
    // Map our categories to Guardian sections/tags
    let guardianSection = category.toLowerCase();
    switch(category) {
      case 'Top Stories':
        guardianSection = 'news';
        break;
      case 'Entertainment':
        guardianSection = 'culture';
        break;
      case 'Technology':
        guardianSection = 'technology';
        break;
      case 'Sports':
        guardianSection = 'sport';
        break;
      case 'Business':
        guardianSection = 'business';
        break;
      default:
        guardianSection = 'news';
    }
    
    const apiKey = Deno.env.get('GUARDIAN_API_KEY');
    if (!apiKey) {
      throw new Error('Guardian API key not configured');
    }

    const guardianUrl = new URL('https://content.guardianapis.com/search');
    guardianUrl.searchParams.append('api-key', apiKey);
    guardianUrl.searchParams.append('section', guardianSection);
    guardianUrl.searchParams.append('show-fields', 'thumbnail,bodyText,trailText');
    guardianUrl.searchParams.append('page-size', '10');
    guardianUrl.searchParams.append('order-by', 'newest');

    console.log('Fetching from Guardian API:', guardianUrl.toString());

    const response = await fetch(guardianUrl.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error('Guardian API error:', data);
      throw new Error(`Guardian API error: ${data.message || 'Unknown error'}`);
    }

    console.log('Successfully fetched news data');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: { 
          status: 'error',
          results: [] 
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});