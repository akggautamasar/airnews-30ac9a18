import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error(`HTTP method ${req.method} is not allowed`);
    }

    const { category, isToday } = await req.json();
    
    console.log('Received request for category:', category, 'isToday:', isToday);
    
    // Map our categories to Guardian sections/tags
    let guardianSection = category.toLowerCase();
    switch(category) {
      case "Today's News":
        guardianSection = '';  // Empty to fetch all sections
        break;
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
      case 'World':
        guardianSection = 'world';
        break;
      case 'Science':
        guardianSection = 'science';
        break;
      case 'Environment':
        guardianSection = 'environment';
        break;
      case 'Education':
        guardianSection = 'education';
        break;
      case 'Society':
        guardianSection = 'society';
        break;
      case 'Media':
        guardianSection = 'media';
        break;
      case 'Life & Style':
        guardianSection = 'lifeandstyle';
        break;
      default:
        guardianSection = 'news';
    }
    
    const apiKey = Deno.env.get('GUARDIAN_API_KEY');
    if (!apiKey) {
      console.error('Guardian API key not configured');
      throw new Error('Guardian API key not configured');
    }

    const guardianUrl = new URL('https://content.guardianapis.com/search');
    guardianUrl.searchParams.append('api-key', apiKey);
    if (guardianSection) {
      guardianUrl.searchParams.append('section', guardianSection);
    }
    guardianUrl.searchParams.append('show-fields', 'thumbnail,bodyText,trailText');
    guardianUrl.searchParams.append('page-size', '50');
    
    if (isToday) {
      const today = new Date().toISOString().split('T')[0];
      guardianUrl.searchParams.append('from-date', today);
    }
    
    guardianUrl.searchParams.append('order-by', 'newest');

    console.log('Fetching from Guardian API with URL:', guardianUrl.toString());

    try {
      const response = await fetch(guardianUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Guardian API error response:', errorText);
        throw new Error(`Guardian API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response || !Array.isArray(data.response.results)) {
        console.error('Invalid Guardian API response format:', data);
        throw new Error('Invalid response format from Guardian API');
      }

      console.log('Successfully fetched news data with', data.response.results.length, 'articles');

      return new Response(JSON.stringify(data), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200
      });
    } catch (fetchError) {
      console.error('Error fetching from Guardian API:', fetchError);
      throw new Error(`Failed to fetch from Guardian API: ${fetchError.message}`);
    }
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});