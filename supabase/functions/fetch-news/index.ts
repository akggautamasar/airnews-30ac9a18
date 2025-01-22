import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const GUARDIAN_API_KEY = Deno.env.get('GUARDIAN_API_KEY');
const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { category, isToday, newsAgency } = await req.json();
    let apiResponse;

    console.log('Received request with params:', { category, isToday, newsAgency });

    if (newsAgency === 'guardian') {
      const baseUrl = 'https://content.guardianapis.com/search';
      const today = new Date().toISOString().split('T')[0];
      
      const params = new URLSearchParams({
        'api-key': GUARDIAN_API_KEY || '',
        'section': category.toLowerCase(),
        'show-fields': 'thumbnail,bodyText',
        'page-size': '10',
        'order-by': 'newest',
        ...(isToday && { 'from-date': today, 'to-date': today }),
      });

      console.log('Fetching from Guardian API:', `${baseUrl}?${params}`);
      
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Guardian API error: ${data.message || response.statusText}`);
      }
      
      apiResponse = data;
    } else if (newsAgency === 'newsapi') {
      const baseUrl = 'https://newsapi.org/v2/top-headlines';
      const params = new URLSearchParams({
        'apiKey': NEWS_API_KEY || '',
        'category': category.toLowerCase(),
        'pageSize': '10',
      });

      console.log('Fetching from News API:', `${baseUrl}?${params}`);
      
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`News API error: ${data.message || response.statusText}`);
      }
      
      // Transform News API response to match Guardian API format
      apiResponse = {
        response: {
          results: data.articles.map((article: any, index: number) => ({
            id: `newsapi-${index}`,
            type: 'article',
            sectionId: category.toLowerCase(),
            sectionName: category,
            webPublicationDate: article.publishedAt,
            webTitle: article.title,
            webUrl: article.url,
            apiUrl: article.url,
            fields: {
              thumbnail: article.urlToImage,
              bodyText: article.description
            }
          }))
        }
      };
    }

    return new Response(JSON.stringify(apiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});