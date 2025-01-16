export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  webTitle: string;
  webPublicationDate: string;
  webUrl: string;
  fields: {
    thumbnail?: string;
    bodyText: string;
    trailText: string;
  };
}

export interface GuardianResponse {
  response: {
    status: string;
    results: GuardianArticle[];
    total: number;
  };
}

export const fetchNews = async (category: string = ''): Promise<GuardianArticle[]> => {
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

    const data: GuardianResponse = await response.json();
    
    if (data.response.status !== 'ok') {
      throw new Error('Failed to fetch news from Guardian');
    }

    return data.response.results;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};