
import { motion } from "framer-motion";
import { NewsCard } from "@/components/NewsCard";

interface ContentItemProps {
  item: {
    type: 'news' | 'ad';
    content: any;
  };
  category: string;
}

export const ContentItem = ({ item, category }: ContentItemProps) => {
  if (item.type === 'news') {
    return (
      <NewsCard
        article={item.content}
        category={category}
      />
    );
  }
  
  // Handle advertisement items
  return (
    <NewsCard
      article={{
        id: item.content.id,
        webTitle: item.content.title,
        webPublicationDate: item.content.created_at,
        webUrl: item.content.link_url,
        apiUrl: item.content.link_url,
        type: 'advertisement',
        sectionId: 'advertisement',
        sectionName: 'Advertisement',
        isHosted: false,
        pillarId: '',
        pillarName: '',
        fields: {
          thumbnail: item.content.image_url,
          bodyText: item.content.description
        }
      }}
      category="Advertisement"
    />
  );
};
