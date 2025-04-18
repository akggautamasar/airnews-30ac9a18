
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
    // Parse request body
    const requestData = await req.json();
    const { category = '', isToday = false, newsAgency = 'guardian' } = requestData;

    console.log('Received request with params:', { category, isToday, newsAgency });

    // Verify we have the required API key for the requested news agency
    const apiKeyName = `${newsAgency.toUpperCase().replace(/\s/g, '_')}_API_KEY`;
    const apiKey = Deno.env.get(apiKeyName) || Deno.env.get(newsAgency.toUpperCase());
    
    if (!apiKey && newsAgency !== 'guardian') {
      console.error(`No API key found for ${newsAgency} (looking for ${apiKeyName})`);
      return new Response(
        JSON.stringify({
          error: `API key not configured for ${newsAgency}`,
          message: `Please configure the ${apiKeyName} secret in your Supabase project`,
          availableKeys: Object.keys(Deno.env.toObject()).filter(k => k.includes('API_KEY'))
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let apiResponse;

    try {
      // Select news provider based on newsAgency parameter
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
        status: 200
      });
    } catch (error) {
      // Capture specific provider errors and enhance the error message
      console.error(`Error fetching from ${newsAgency}:`, error);
      
      // Create a more detailed error response
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch from ${newsAgency}`,
          message: error.message,
          category: category,
          provider: newsAgency,
          availableKeys: Object.keys(Deno.env.toObject()).filter(k => k.includes('API_KEY'))
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    // Handle general API errors (like JSON parsing)
    console.error('Error in fetch-news function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack,
        availableKeys: Object.keys(Deno.env.toObject()).filter(k => k.includes('API_KEY'))
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
