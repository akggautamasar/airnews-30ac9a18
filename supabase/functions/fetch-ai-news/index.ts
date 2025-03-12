
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.13";
import { corsHeaders } from "../_shared/cors.ts";

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const QWEN_API_KEY = Deno.env.get('QWEN_API_KEY');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

// Function to fetch news from DeepSeek API
async function fetchFromDeepSeek(category: string) {
  console.log(`Fetching ${category} news from DeepSeek API`);
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a news curator that provides the latest trending news in a structured format."
          },
          {
            role: "user",
            content: `Fetch the latest top 10 news headlines globally or in India from today in the ${category} category. Provide a short summary for each news along with the source link. Format the response as a JSON array with each article containing a headline, summary (under 50 words), and source URL. Don't include any explanations or extra text, just return the JSON array.`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API error for ${category}: Status ${response.status}`, errorText);
      return [];
    }

    const data = await response.json();
    
    // Extract JSON from the text response
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error(`DeepSeek API returned empty content for ${category}`);
      return [];
    }
    
    let newsItems = [];
    
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        newsItems = JSON.parse(jsonMatch[0]);
      } else {
        // Try parsing the entire response if it might be valid JSON
        try {
          newsItems = JSON.parse(content);
        } catch {
          console.error(`Could not extract JSON from DeepSeek response for ${category}`);
        }
      }
    } catch (error) {
      console.error(`Error parsing DeepSeek JSON for ${category}:`, error);
    }

    return Array.isArray(newsItems) ? newsItems.map((item: any) => ({
      ...item,
      provider: "deepseek",
      category
    })) : [];
  } catch (error) {
    console.error(`Error fetching from DeepSeek for ${category}:`, error);
    return [];
  }
}

// Function to fetch news from Qwen API
async function fetchFromQwen(category: string) {
  console.log(`Fetching ${category} news from Qwen API`);
  
  try {
    // Using more robust error handling as shown in the sample code
    const payload = {
      model: "qwen-max",
      messages: [
        {
          role: "system",
          content: "You are a news curator that provides the latest trending news in a structured format."
        },
        {
          role: "user",
          content: `Fetch the latest top 10 news headlines globally or in India from today in the ${category} category. Provide a short summary for each news along with the source link. Format the response as a JSON array with each article containing a headline, summary (under 50 words), and source URL. Don't include any explanations or extra text, just return the JSON array.`
        }
      ],
      temperature: 0.7
    };
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
    };
    
    // Making the fetch request with proper error handling
    const response = await fetch('https://api.qwen.ai/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Qwen API error for ${category}: Status ${response.status}`, errorText);
      return [];
    }

    const data = await response.json();
    
    // Extract JSON from the text response
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error(`Qwen API returned empty content for ${category}`);
      return [];
    }
    
    let newsItems = [];
    
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        newsItems = JSON.parse(jsonMatch[0]);
      } else {
        // Try parsing the entire response if it might be valid JSON
        try {
          newsItems = JSON.parse(content);
        } catch {
          console.error(`Could not extract JSON from Qwen response for ${category}`);
        }
      }
    } catch (error) {
      console.error(`Error parsing Qwen JSON for ${category}:`, error);
    }

    return Array.isArray(newsItems) ? newsItems.map((item: any) => ({
      ...item,
      provider: "qwen",
      category
    })) : [];
  } catch (error) {
    console.error(`Error fetching from Qwen for ${category}:`, error);
    return [];
  }
}

// Function to fetch news from Gemini API
async function fetchFromGemini(category: string) {
  console.log(`Fetching ${category} news from Gemini API`);
  
  try {
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Fetch the latest top 10 news headlines globally or in India from today in the ${category} category. Provide a short summary for each news along with the source link. Format the response as a JSON array with each article containing a headline, summary (under 50 words), and source URL. Don't include any explanations or extra text, just return the JSON array.`
            }
          ],
          role: "user"
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    const headers = {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY!
    };
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error for ${category}: Status ${response.status}`, errorText);
      return [];
    }

    const data = await response.json();
    
    // Extract JSON from the text response
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      console.error(`Gemini API returned empty content for ${category}`);
      return [];
    }
    
    let newsItems = [];
    
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        newsItems = JSON.parse(jsonMatch[0]);
      } else {
        // Try parsing the entire response if it might be valid JSON
        try {
          newsItems = JSON.parse(content);
        } catch {
          console.error(`Could not extract JSON from Gemini response for ${category}`);
        }
      }
    } catch (error) {
      console.error(`Error parsing Gemini JSON for ${category}:`, error);
    }

    return Array.isArray(newsItems) ? newsItems.map((item: any) => ({
      ...item,
      provider: "gemini",
      category
    })) : [];
  } catch (error) {
    console.error(`Error fetching from Gemini for ${category}:`, error);
    return [];
  }
}

// Generate mock news when real APIs fail
function generateMockNews() {
  const categories = ["Politics", "Business", "Technology", "Health", "Entertainment"];
  const mockNews = [];
  
  for (const category of categories) {
    for (let i = 1; i <= 2; i++) {
      mockNews.push({
        headline: `${category} News Item ${i}`,
        summary: `This is a mock summary for ${category.toLowerCase()} news item ${i}. Generated as a fallback when real API calls fail.`,
        source: "https://example.com/news",
        category: category,
        provider: "mock"
      });
    }
  }
  
  return mockNews;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting AI news fetch process');
    const today = new Date().toISOString().split('T')[0];
    const categories = ["Politics", "Business", "Technology", "Health", "Entertainment"];
    let allNews: any[] = [];

    // First check if we already have news for today
    const { data: existingNews, error: fetchError } = await supabase
      .from('ai_news')
      .select('*')
      .eq('date', today)
      .single();

    if (!fetchError && existingNews && existingNews.news && existingNews.news.length > 0) {
      console.log('Found existing news for today, returning that');
      return new Response(JSON.stringify(existingNews), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch news from all three providers for each category
    const fetchPromises = [];
    for (const category of categories) {
      fetchPromises.push(fetchFromDeepSeek(category));
      fetchPromises.push(fetchFromQwen(category));
      fetchPromises.push(fetchFromGemini(category));
    }
    
    // Wait for all API calls to complete
    const results = await Promise.allSettled(fetchPromises);
    
    // Process successful results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allNews = [...allNews, ...result.value];
      } else {
        console.error(`API call ${index} failed:`, result);
      }
    });
      
    // If no news was fetched, generate mock news as fallback
    if (allNews.length === 0) {
      console.log('No news fetched from APIs, generating mock news');
      allNews = generateMockNews();
    } else {
      // Deduplicate news (use headline as key)
      const uniqueHeadlines = new Set();
      allNews = allNews.filter(item => {
        if (!item.headline) return false;
        const isDuplicate = uniqueHeadlines.has(item.headline);
        uniqueHeadlines.add(item.headline);
        return !isDuplicate;
      });
    }
    
    // Take top 10 news items per category
    const newsPerCategory: Record<string, any[]> = {};
    for (const category of categories) {
      newsPerCategory[category] = allNews
        .filter(item => item.category === category)
        .slice(0, 10);
    }
    
    // Combine all categories
    allNews = Object.values(newsPerCategory).flat().slice(0, 50);

    // Format news in the requested structure
    const formattedNews = {
      date: today,
      news: allNews.map(item => ({
        headline: item.headline || "Untitled News",
        summary: (item.summary || "No summary available").substring(0, 200), // Ensure summary is not too long
        source: item.source || "https://example.com",
        category: item.category,
        provider: item.provider
      }))
    };

    // Store in Supabase
    const { error: insertError } = await supabase
      .from('ai_news')
      .upsert({
        date: today,
        news: formattedNews.news
      });

    if (insertError) {
      console.error('Error storing news in database:', insertError);
    } else {
      console.log('Successfully stored news in database');
    }

    return new Response(JSON.stringify(formattedNews), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-ai-news function:', error);
    
    // Generate mock data as fallback when there's an error
    const today = new Date().toISOString().split('T')[0];
    const mockData = {
      date: today,
      news: generateMockNews()
    };
    
    return new Response(JSON.stringify(mockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
