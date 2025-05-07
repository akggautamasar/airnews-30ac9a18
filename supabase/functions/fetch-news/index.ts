
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

    let apiResponse;
    let statusCode = 200;
    let errorMessage = null;
    let errorSource = newsAgency;

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
      
      // If the response doesn't follow our expected structure, normalize it
      if (!apiResponse.response) {
        apiResponse = {
          response: {
            status: 'ok',
            results: Array.isArray(apiResponse) ? apiResponse : []
          }
        };
      }
    } catch (error) {
      // Capture specific provider errors but don't throw
      console.error(`Error fetching from ${newsAgency}:`, error);
      errorMessage = error.message;
      statusCode = 200; // Still return 200 to prevent app crash
      
      // Create a valid but empty response structure
      apiResponse = {
        response: {
          status: 'error',
          results: [],
          error: errorMessage,
          errorSource: newsAgency
        }
      };
    }

    return new Response(JSON.stringify(apiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode
    });
  } catch (error) {
    // Handle general API errors (like JSON parsing)
    console.error('Error in fetch-news function:', error);
    
    return new Response(
      JSON.stringify({ 
        response: {
          status: 'error',
          results: [],
          error: error.message || 'Internal server error',
          errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      }),
      {
        status: 200, // Return 200 to prevent app crash
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
