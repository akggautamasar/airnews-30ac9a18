
export function mapCategoryForGNews(category: string): string {
  const categoryMap: Record<string, string> = {
    "Today's News": "breaking-news",
    "Top Stories": "breaking-news",
    "Technology": "technology",
    "Business": "business",
    "Entertainment": "entertainment",
    "Sports": "sports",
    "World": "world",
    "Science": "science",
    "Health": "health"
  };

  return categoryMap[category] || "breaking-news";
}

export function mapCategoryForNewsDataIO(category: string): string {
  const categoryMap: Record<string, string> = {
    'technology': 'technology',
    'business': 'business',
    'entertainment': 'entertainment',
    'sports': 'sports',
    'world': 'world',
    'science': 'science',
    'health': 'health',
    'politics': 'politics',
    'environment': 'environment',
    'food': 'food',
    'top': 'top'
  };

  const lowerCategory = category.toLowerCase();
  return categoryMap[lowerCategory] || 'top';
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Enhanced API key validation with more helpful error messages
export function validateApiKey(apiKey: string | undefined, apiName: string): string {
  if (!apiKey) {
    // List all available environment variables for debugging
    const availableEnvVars = Object.keys(Deno.env.toObject())
      .filter(key => key.includes('API_KEY'))
      .join(', ');
    
    console.error(`${apiName} API key is missing from environment variables`);
    console.error(`Available API keys: ${availableEnvVars || 'None'}`);
    
    throw new Error(`${apiName} API key is not defined. Please check your environment variables or add it in the API Keys management page.`);
  }
  
  // Check if the API key is empty or looks suspiciously invalid
  if (apiKey.trim() === '' || apiKey.length < 5) {
    console.error(`${apiName} API key appears to be invalid: ${apiKey}`);
    throw new Error(`${apiName} API key appears to be invalid. Please check your environment variables.`);
  }
  
  console.log(`${apiName} API key validation passed`);
  return apiKey;
}

// Helper function to transform API responses to a standardized format
export function transformToStandardFormat(articles: any[], source: string, category: string): any {
  return {
    response: {
      status: 'ok',
      results: articles.map((article: any, index: number) => ({
        id: `${source}-${index}`,
        type: 'article',
        sectionId: category.toLowerCase() || 'general',
        sectionName: category,
        webPublicationDate: article.publishedAt || article.published_at || article.date || new Date().toISOString(),
        webTitle: article.title || article.headline || 'No title available',
        webUrl: article.url || article.link || article.source || '#',
        apiUrl: article.url || article.link || article.source || '#',
        fields: {
          thumbnail: article.image || article.urlToImage || article.image_url || article.thumbnail,
          bodyText: article.description || article.content || article.summary || article.snippet || 'No description available'
        }
      }))
    }
  };
}
