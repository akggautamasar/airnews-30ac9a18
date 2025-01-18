import { Json } from "@/integrations/supabase/types";

export interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export interface CalendarCardProps {
  title: string;
  date: Date;
  description: string;
  type: 'event' | 'reminder';
}

export interface NewsCardProps {
  article: GuardianArticle;
  category: string;
}

export interface GuardianArticle {
  id: string;
  type?: string;
  sectionId?: string;
  sectionName?: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    thumbnail?: string;
    bodyText?: string;
  };
  isHosted?: boolean;
  pillarId?: string;
  pillarName?: string;
}