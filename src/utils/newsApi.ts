export interface NewsArticle {
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  url: string;
  content: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  status: string;
  totalResults: number;
}

export const fetchNews = async (category: string = ''): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-news?category=${encodeURIComponent(category)}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};