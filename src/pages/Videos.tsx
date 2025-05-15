
import { useState, useEffect } from "react";
import { VideoHeader } from "@/components/videos/VideoHeader";
import { ChannelSelector } from "@/components/videos/ChannelSelector";
import { CategoryFilter } from "@/components/videos/CategoryFilter";
import { VideoContent } from "@/components/videos/VideoContent";
import { 
  youtubeNewsVideos, 
  videoCategories, 
  youtubeNewsChannels 
} from "@/data/youtubeNewsChannels";
import { useYoutubeVideos } from "@/hooks/useYoutubeVideos";
import { toast } from "sonner";

export default function Videos() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { 
    videos, 
    loading, 
    error, 
    selectChannel, 
    filterByCategory, 
    selectedChannel 
  } = useYoutubeVideos({
    initialVideos: youtubeNewsVideos,
    channels: youtubeNewsChannels
  });

  useEffect(() => {
    // Log the videos to console for debugging
    console.log("Available videos:", youtubeNewsVideos);
    console.log("Filtered videos:", videos);
    
    if (youtubeNewsVideos.length === 0) {
      toast.warning("No videos available. Please check your data source.");
    }
  }, [videos]);

  const searchResults = searchQuery
    ? videos.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.channelName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : videos;

  const selectedVideo = selectedVideoId 
    ? youtubeNewsVideos.find(item => item.id === selectedVideoId)
    : null;

  const handleVideoClick = (videoId: string) => {
    console.log("Video clicked:", videoId);
    setSelectedVideoId(videoId);
  };

  const handleBackToList = () => {
    setSelectedVideoId(null);
  };

  const handleCategorySelect = (category: string) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    filterByCategory(category);
  };

  const handleChannelSelect = (channelId: string | null) => {
    console.log("Channel selected:", channelId);
    selectChannel(channelId);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    selectChannel(null);
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-3xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <VideoHeader
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedVideoId={selectedVideoId}
          handleBackToList={handleBackToList}
        />

        {!isSearchOpen && !selectedVideoId && (
          <>
            <ChannelSelector
              selectedChannel={selectedChannel}
              handleChannelSelect={handleChannelSelect}
              youtubeNewsChannels={youtubeNewsChannels}
            />
            
            <CategoryFilter
              categories={videoCategories}
              selectedCategory={selectedCategory}
              handleCategorySelect={handleCategorySelect}
            />
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <VideoContent
          loading={loading}
          error={error}
          searchResults={searchResults}
          selectedVideo={selectedVideo}
          handleVideoClick={handleVideoClick}
          selectChannel={selectChannel}
          selectedChannel={selectedChannel}
          selectedCategory={selectedCategory}
          resetFilters={resetFilters}
        />
      </div>
    </div>
  );
}
