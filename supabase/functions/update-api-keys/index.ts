
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { key, value } = await req.json();
    
    if (!key || !value) {
      return new Response(
        JSON.stringify({ error: 'Key and value are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate key names for security - Updated to match only the ones we want
    const allowedKeys = [
      "GUARDIAN_API_KEY",
      "NEWS_API_KEY",
      "THE_NEWS_API_KEY",
      "GNEWS_API_KEY",
      "WORLDNEWS_API_KEY",
      "NEWSDATA_IO_API_KEY"
    ];

    if (!allowedKeys.includes(key)) {
      return new Response(
        JSON.stringify({ error: 'Invalid key name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store the secret in Deno Deploy environment
    console.log(`Updating secret: ${key}`);
    
    try {
      // Use Supabase's native secrets handling
      Deno.env.set(key, value);
      console.log(`Secret ${key} updated successfully`);
    } catch (error) {
      console.error(`Error setting environment variable: ${error.message}`);
      throw new Error(`Failed to set API key: ${error.message}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: `API key ${key} updated successfully` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating API key:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to update API key' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
