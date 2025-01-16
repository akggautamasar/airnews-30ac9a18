export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  url: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  status: string;
  totalResults: number;
}

export const fetchNews = async (category: string = ''): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-news?category=${encodeURIComponent(category)}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch news');
    }

    const data: NewsResponse = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Failed to fetch news');
    }

    // Filter out articles without required fields and provide fallbacks
    return data.articles.filter(article => article.title && article.description).map(article => ({
      ...article,
      urlToImage: article.urlToImage || '/placeholder.svg',
      content: article.content || article.description,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};