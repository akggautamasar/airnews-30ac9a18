
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { fetchGuardianNews } from "./providers/guardian.ts";
import { fetchNewsAPI } from "./providers/newsapi.ts";
import { fetchTheNewsAPI } from "./providers/thenewsapi.ts";
import { fetchGNews } from "./providers/gnews.ts";
import { fetchWorldNewsAPI } from "./providers/worldnewsapi.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, isToday, newsAgency } = await req.json();
    let apiResponse;

    console.log('Received request with params:', { category, isToday, newsAgency });

    try {
      switch (newsAgency) {
        case 'guardian':
          apiResponse = await fetchGuardianNews(category, isToday);
          break;
        case 'newsapi':
          apiResponse = await fetchNewsAPI(category);
          break;
        case 'thenewsapi':
          apiResponse = await fetchTheNewsAPI(category);
          break;
        case 'gnews':
          apiResponse = await fetchGNews(category);
          break;
        case 'worldnewsapi':
          apiResponse = await fetchWorldNewsAPI(category);
          break;
        default:
          throw new Error(`Unsupported news agency: ${newsAgency}`);
      }

      // If we successfully get here, log the success
      console.log(`Successfully fetched news from ${newsAgency} for category ${category}`);
      
      return new Response(JSON.stringify(apiResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // Capture specific provider errors
      console.error(`Error fetching from ${newsAgency}:`, error);
      throw new Error(`Failed to fetch from ${newsAgency}: ${error.message}`);
    }
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
