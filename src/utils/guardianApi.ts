const GUARDIAN_BASE_URL = 'https://content.guardianapis.com';

export interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    thumbnail?: string;
    bodyText?: string;
  };
  sectionName: string;
}

export interface GuardianResponse {
  response: {
    results: GuardianArticle[];
    status: string;
    total: number;
    pages: number;
  };
}

export const fetchGuardianNews = async (category: string = ''): Promise<GuardianArticle[]> => {
  try {
    const queryParams = new URLSearchParams({
      'api-key': 'GUARDIAN_API_KEY',
      'show-fields': 'thumbnail,bodyText',
      'page-size': '10',
      ...(category === 'Top Stories' 
        ? { 'tag': 'tone/news' } 
        : { 'section': category.toLowerCase() }),
    });

    const response = await fetch(
      `${GUARDIAN_BASE_URL}/search?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data: GuardianResponse = await response.json();
    return data.response.results;
  } catch (error) {
    console.error('Error fetching Guardian news:', error);
    return [];
  }
}