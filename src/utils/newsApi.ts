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
    const apiKey = 'e7a83668-9fd1-4b09-a497-b0c39dc2b7ec';
    const baseUrl = 'https://newsapi.org/v2/top-headlines';
    const country = 'us'; // You can change this to get news from different countries

    const queryParams = new URLSearchParams({
      apiKey,
      country,
      pageSize: '10',
      ...(category !== 'Top Stories' && { category: category.toLowerCase() }),
    });

    const response = await fetch(`${baseUrl}?${queryParams.toString()}`);
    
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