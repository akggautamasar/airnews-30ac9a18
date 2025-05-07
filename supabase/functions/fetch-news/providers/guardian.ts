
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
      let errorText;
      try {
        errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || response.statusText };
        }
        
        console.error('Guardian API error response:', errorData);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Guardian API key is invalid or unauthorized. Please check your API key.`);
        } else {
          throw new Error(`Guardian API error: ${errorData.message || response.statusText}`);
        }
      } catch (parseError) {
        console.error('Error parsing Guardian API response:', parseError);
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Guardian API key is invalid or unauthorized. Please check your API key.`);
        } else {
          throw new Error(`Guardian API error: ${response.statusText}`);
        }
      }
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
