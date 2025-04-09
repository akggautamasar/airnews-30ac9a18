
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
    const { source, query } = await req.json();
    let imageUrl = null;

    console.log('Image search request for:', { source, query });

    if (source === 'pixabay') {
      const PIXABAY_API_KEY = Deno.env.get('PIXABAY_API_KEY');
      
      if (!PIXABAY_API_KEY) {
        throw new Error('Pixabay API key is not defined');
      }
      
      const pixabayUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`;
      
      const response = await fetch(pixabayUrl);
      const data = await response.json();
      
      if (data.hits && data.hits.length > 0) {
        imageUrl = data.hits[0].webformatURL;
      }
    } 
    else if (source === 'pexels') {
      const PEXELS_API_KEY = Deno.env.get('PEXELS_API_KEY');
      
      if (!PEXELS_API_KEY) {
        throw new Error('Pexels API key is not defined');
      }
      
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;
      
      const response = await fetch(pexelsUrl, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });
      const data = await response.json();
      
      if (data.photos && data.photos.length > 0) {
        imageUrl = data.photos[0].src.medium;
      }
    }
    else {
      throw new Error(`Unsupported image source: ${source}`);
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in image-search function:', error);
    
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
