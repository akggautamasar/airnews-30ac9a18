import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || '';
    
    // Map our categories to Guardian sections/tags
    const guardianSection = category === 'Top Stories' ? 'news' : category.toLowerCase();
    
    const guardianUrl = new URL('https://content.guardianapis.com/search');
    guardianUrl.searchParams.append('api-key', Deno.env.get('GUARDIAN_API_KEY') || '');
    guardianUrl.searchParams.append('section', guardianSection);
    guardianUrl.searchParams.append('show-fields', 'thumbnail,bodyText,trailText');
    guardianUrl.searchParams.append('page-size', '10');
    guardianUrl.searchParams.append('order-by', 'newest');

    const response = await fetch(guardianUrl.toString());
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});