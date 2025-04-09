
import { corsHeaders } from "../../_shared/cors.ts";

export async function fetchGuardianNews(category: string, isToday: boolean) {
  const GUARDIAN_API_KEY = Deno.env.get('GUARDIAN_API_KEY');
  
  if (!GUARDIAN_API_KEY) {
    throw new Error('Guardian API key is not defined');
  }
  
  const baseUrl = 'https://content.guardianapis.com/search';
  const today = new Date().toISOString().split('T')[0];
  
  // Map category to Guardian's section names
  let section = category?.toLowerCase()?.replace("'s news", '')?.trim() || '';
  if (category === "Today's News" || category === "Top Stories") {
    section = ""; // Don't filter by section for these categories
  }

  const params = new URLSearchParams({
    'api-key': GUARDIAN_API_KEY,
    'show-fields': 'thumbnail,bodyText',
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
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Guardian API error response:', data);
    throw new Error(`Guardian API error: ${data.message || response.statusText}`);
  }
  
  return data;
}
