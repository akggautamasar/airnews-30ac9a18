
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

// Check if the API key is defined and throw a useful error if not
export function validateApiKey(apiKey: string | undefined, apiName: string): string {
  if (!apiKey) {
    throw new Error(`${apiName} API key is not defined. Please check your environment variables.`);
  }
  return apiKey;
}
