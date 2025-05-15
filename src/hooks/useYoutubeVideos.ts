
import { useState, useEffect } from 'react';
import { NewsVideo, NewsChannel } from '@/data/youtubeNewsChannels';
import { toast } from 'sonner';

interface UseYoutubeVideosProps {
  initialVideos: NewsVideo[];
  channels: NewsChannel[];
}

export const useYoutubeVideos = ({ initialVideos, channels }: UseYoutubeVideosProps) => {
  const [videos, setVideos] = useState<NewsVideo[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>("All");

  useEffect(() => {
    // Set videos initially
    if (initialVideos.length > 0) {
      setVideos(initialVideos);
    }
  }, [initialVideos]);

  const fetchChannelVideos = async (channelId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll filter our initial videos based on channel name
      // In a real app, you would make an API call to YouTube Data API
      const channel = channels.find(c => c.channelId === channelId);
      
      if (channel) {
        const filteredVideos = initialVideos.filter(
          video => video.channelName === channel.name
        );
        
        // If a category is selected, filter by that too
        const categoryFilteredVideos = currentCategory === "All" ? 
          filteredVideos : 
          filteredVideos.filter(video => video.category === currentCategory);
        
        if (filteredVideos.length > 0) {
          setVideos(categoryFilteredVideos.length > 0 ? categoryFilteredVideos : filteredVideos);
          toast.success(`Showing videos from ${channel.name}`);
        } else {
          // If no videos found for this channel, show all videos
          setVideos(initialVideos);
          toast.info(`No videos found for ${channel.name}. Showing all videos instead.`);
        }
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (category: string) => {
    setCurrentCategory(category);
    
    if (category === 'All') {
      if (selectedChannel) {
        // If a channel is selected, filter by that channel
        fetchChannelVideos(selectedChannel);
      } else {
        // Otherwise show all videos
        setVideos(initialVideos);
      }
    } else {
      // Filter by category and possibly by channel
      let filtered = initialVideos.filter(video => video.category === category);
      
      if (selectedChannel) {
        const channel = channels.find(c => c.channelId === selectedChannel);
        if (channel) {
          filtered = filtered.filter(video => video.channelName === channel.name);
        }
      }
      
      if (filtered.length > 0) {
        setVideos(filtered);
      } else {
        setVideos([]);
        toast.info(`No videos found in category ${category}.`);
      }
    }
  };

  const selectChannel = (channelId: string | null) => {
    setSelectedChannel(channelId);
    
    if (channelId) {
      fetchChannelVideos(channelId);
    } else {
      // Reset to all videos but maintain category filter
      if (currentCategory !== 'All') {
        filterByCategory(currentCategory);
      } else {
        setVideos(initialVideos);
      }
    }
  };

  return {
    videos,
    loading,
    error,
    selectChannel,
    filterByCategory,
    selectedChannel
  };
};
