
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

    // Update the secret
    const command = new Deno.Command('supabase', {
      args: ['secrets', 'set', `${key}=${value}`],
    });
    
    const output = await command.output();
    console.log(`Secret ${key} updated successfully`);
    
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
