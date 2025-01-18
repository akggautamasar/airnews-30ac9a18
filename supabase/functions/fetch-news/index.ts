import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || '';
    
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
    
    const guardianUrl = new URL('https://content.guardianapis.com/search');
    guardianUrl.searchParams.append('api-key', Deno.env.get('GUARDIAN_API_KEY') || '');
    
    // Add section parameter only if it's not Top Stories
    if (category !== 'Top Stories') {
      guardianUrl.searchParams.append('section', guardianSection);
    }
    
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