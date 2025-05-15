
import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "./VideoCard";
import { VideoNews } from "@/components/news/VideoNews";
import { NewsVideo } from "@/data/youtubeNewsChannels";

interface VideoContentProps {
  loading: boolean;
  error: string | null;
  searchResults: NewsVideo[];
  selectedVideo: NewsVideo | null;
  handleVideoClick: (videoId: string) => void;
  selectChannel: (channelId: string | null) => void;
  selectedChannel: string | null;
  selectedCategory: string;
  resetFilters: () => void;
}

export const VideoContent: React.FC<VideoContentProps> = ({
  loading,
  error,
  searchResults,
  selectedVideo,
  handleVideoClick,
  selectChannel,
  selectedChannel,
  selectedCategory,
  resetFilters,
}) => {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-500 mt-4">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="bg-gray-100 rounded-full p-6">
          <Filter className="h-8 w-8 text-red-600" />
        </div>
        <p className="text-red-500 mt-4">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => selectChannel(selectedChannel)}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <VideoNews
        title={selectedVideo.title}
        videoId={selectedVideo.videoId}
        thumbnailUrl={selectedVideo.thumbnailUrl}
        source={selectedVideo.channelName}
        publishedAt={selectedVideo.publishedAt}
      />
    );
  }

  if (searchResults.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {searchResults.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => handleVideoClick(video.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="bg-gray-100 rounded-full p-6">
        <Filter className="h-8 w-8 text-red-600" />
      </div>
      <p className="text-gray-500 mt-4">No videos found</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
};
