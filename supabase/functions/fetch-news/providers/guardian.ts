
import { corsHeaders } from "../../_shared/cors.ts";
import { validateApiKey } from "../utils.ts";

export async function fetchGuardianNews(category: string, isToday: boolean) {
  // Get API key from environment variables
  const GUARDIAN_API_KEY = Deno.env.get('GUARDIAN_API_KEY');
  
  try {
    // Validate API key
    const apiKey = validateApiKey(GUARDIAN_API_KEY, 'Guardian');
    
    const baseUrl = 'https://content.guardianapis.com/search';
    const today = new Date().toISOString().split('T')[0];
    
    // Map category to Guardian's section names
    let section = category?.toLowerCase()?.replace("'s news", '')?.trim() || '';
    if (category === "Today's News" || category === "Top Stories") {
      section = ""; // Don't filter by section for these categories
    }

    const params = new URLSearchParams({
      'api-key': apiKey,
      'show-fields': 'thumbnail,bodyText,trailText',
      'page-size': '10',
      'order-by': 'newest',
    });

    // Only add section parameter if we have a specific section
    if (section && section !== 'top stories') {
      params.append('section', section);
    }

    // Add date filters for today's news
    if (isToday) {
      params.append('from-date', today);
      params.append('to-date', today);
    }

    const url = `${baseUrl}?${params}`;
    console.log('Fetching from Guardian API with URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Guardian API error response:', errorData);
      throw new Error(`Guardian API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // If no results found, return a properly structured empty response
    if (!data.response?.results || data.response.results.length === 0) {
      console.warn('No articles returned from Guardian API');
      return {
        response: {
          status: 'ok',
          results: []
        }
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from Guardian API:', error);
    throw error;
  }
}
