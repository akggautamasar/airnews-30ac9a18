
export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  link_url?: string;
  active?: boolean;
  created_at: string;
  created_by?: string | null;
}
