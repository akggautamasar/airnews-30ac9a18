
import { motion } from "framer-motion";
import { NewsCard } from "@/components/NewsCard";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContentItemProps {
  item: {
    type: 'news' | 'ad';
    content: any;
  };
  category: string;
}

export const ContentItem = ({ item, category }: ContentItemProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Fetch alternative image if the article doesn't have one
  useEffect(() => {
    if (item.type === 'news' && !item.content.fields?.thumbnail && !item.content.image) {
      // Get article title or use category as fallback
      const searchTerm = item.content.webTitle || category;
      const fetchImage = async () => {
        try {
          // Randomly select one of the image APIs
          const imageSources = ['pixabay', 'pexels'];
          const selectedSource = imageSources[Math.floor(Math.random() * imageSources.length)];
          
          console.log(`Fetching image for "${searchTerm}" from ${selectedSource}`);
          
          // Use the Supabase Edge Function instead of a direct API call
          const response = await supabase.functions.invoke('image-search', {
            body: { 
              source: selectedSource,
              query: searchTerm
            },
          });
          
          if (response.error) {
            console.error('Error fetching image:', response.error);
            return;
          }
          
          if (response.data?.imageUrl) {
            console.log(`Found image for "${searchTerm}":`, response.data.imageUrl);
            setImageUrl(response.data.imageUrl);
          } else {
            console.log(`No image found for "${searchTerm}"`);
          }
        } catch (error) {
          console.error('Error fetching alternative image:', error);
        }
      };
      
      fetchImage();
    }
  }, [item, category]);

  if (item.type === 'news') {
    // Use the fetched alternative image if available
    if (imageUrl && !item.content.fields?.thumbnail && !item.content.image) {
      // Clone the item to avoid mutating props
      const enhancedItem = {
        ...item,
        content: {
          ...item.content,
          fields: {
            ...item.content.fields,
            thumbnail: imageUrl
          }
        }
      };
      
      return (
        <NewsCard
          article={enhancedItem.content}
          category={category}
        />
      );
    }
    
    return (
      <NewsCard
        article={item.content}
        category={category}
      />
    );
  }
  
  // Handle advertisement items
  return (
    <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden">
          {item.content.image_url ? (
            <img
              src={item.content.image_url}
              alt={item.content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Advertisement</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
            Ad
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold mb-2">{item.content.title}</h3>
          <p className="text-gray-600 mb-4 flex-1">{item.content.description}</p>
          
          <a 
            href={item.content.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm mt-auto"
          >
            Learn more
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
