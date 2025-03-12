
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.13";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const QWEN_API_KEY = Deno.env.get('QWEN_API_KEY');
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
            content: `Please provide the top 5 trending news articles from today in the ${category} category. Format the response as a JSON array with each article containing a headline, summary (under 50 words), and source URL. Don't include any explanations or extra text, just return the JSON array.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log(`DeepSeek ${category} response status:`, response.status);
    
    if (!response.ok) {
      console.error(`DeepSeek API error for ${category}:`, data);
      return [];
    }

    // Extract JSON from the text response
    const content = data.choices[0].message.content;
    let newsItems = [];
    
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        newsItems = JSON.parse(jsonMatch[0]);
      } else {
        console.error(`Could not extract JSON from DeepSeek response for ${category}`);
      }
    } catch (error) {
      console.error(`Error parsing DeepSeek JSON for ${category}:`, error);
    }

    return newsItems.map((item: any) => ({
      ...item,
      provider: "deepseek",
      category
    }));
  } catch (error) {
    console.error(`Error fetching from DeepSeek for ${category}:`, error);
    return [];
  }
}

// Function to fetch news from Qwen API
async function fetchFromQwen(category: string) {
  console.log(`Fetching ${category} news from Qwen API`);
  
  try {
    const response = await fetch('https://api.qwen.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-max",
        messages: [
          {
            role: "system",
            content: "You are a news curator that provides the latest trending news in a structured format."
          },
          {
            role: "user",
            content: `Please provide the top 5 trending news articles from today in the ${category} category. Format the response as a JSON array with each article containing a headline, summary (under 50 words), and source URL. Don't include any explanations or extra text, just return the JSON array.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log(`Qwen ${category} response status:`, response.status);
    
    if (!response.ok) {
      console.error(`Qwen API error for ${category}:`, data);
      return [];
    }

    // Extract JSON from the text response
    const content = data.choices[0].message.content;
    let newsItems = [];
    
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        newsItems = JSON.parse(jsonMatch[0]);
      } else {
        console.error(`Could not extract JSON from Qwen response for ${category}`);
      }
    } catch (error) {
      console.error(`Error parsing Qwen JSON for ${category}:`, error);
    }

    return newsItems.map((item: any) => ({
      ...item,
      provider: "qwen",
      category
    }));
  } catch (error) {
    console.error(`Error fetching from Qwen for ${category}:`, error);
    return [];
  }
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

    // Fetch news from both providers for each category
    for (const category of categories) {
      const [deepseekNews, qwenNews] = await Promise.all([
        fetchFromDeepSeek(category),
        fetchFromQwen(category)
      ]);
      
      // Combine and deduplicate news (use headline as key)
      const combinedNews = [...deepseekNews, ...qwenNews];
      const uniqueHeadlines = new Set();
      const uniqueNews = combinedNews.filter(item => {
        const isDuplicate = uniqueHeadlines.has(item.headline);
        uniqueHeadlines.add(item.headline);
        return !isDuplicate;
      });
      
      // Take top 10 or fewer news items
      allNews = [...allNews, ...uniqueNews.slice(0, 10)];
    }

    // Format news in the requested structure
    const formattedNews = {
      date: today,
      news: allNews.map(item => ({
        headline: item.headline,
        summary: item.summary.substring(0, 200), // Ensure summary is not too long
        source: item.source,
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
