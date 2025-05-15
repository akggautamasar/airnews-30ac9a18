
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Youtube, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoNews } from "@/components/news/VideoNews";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  youtubeNewsVideos, 
  videoCategories, 
  youtubeNewsChannels 
} from "@/data/youtubeNewsChannels";
import { useYoutubeVideos } from "@/hooks/useYoutubeVideos";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Videos() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col h-screen bg-white max-w-3xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        {isSearchOpen ? (
          <div className="p-4 flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="p-2" 
              onClick={() => setIsSearchOpen(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Search for videos"
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        ) : selectedVideoId ? (
          <div className="p-4 flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="p-2" 
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Now Playing</h1>
          </div>
        ) : (
          <div className="p-4 flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="p-2" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              News Videos
            </h1>
            <Button 
              variant="ghost" 
              className="p-2" 
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        )}

        {!isSearchOpen && !selectedVideoId && (
          <>
            {/* Channel Dropdown */}
            <div className="px-4 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {selectedChannel ? (
                        <>
                          <Avatar className="h-6 w-6">
                            <img 
                              src={youtubeNewsChannels.find(c => c.channelId === selectedChannel)?.thumbnail} 
                              alt="Channel" 
                              className="h-full w-full object-cover rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Channel';
                              }}
                            />
                          </Avatar>
                          <span>
                            {youtubeNewsChannels.find(c => c.channelId === selectedChannel)?.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Youtube className="h-5 w-5 text-red-600" />
                          <span>All Channels</span>
                        </>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px] bg-white">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleChannelSelect(null)}
                  >
                    <Youtube className="h-5 w-5 text-red-600" />
                    <span>All Channels</span>
                  </DropdownMenuItem>
                  
                  {youtubeNewsChannels.map((channel) => (
                    <DropdownMenuItem 
                      key={channel.id}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleChannelSelect(channel.channelId)}
                    >
                      <Avatar className="h-5 w-5">
                        <img 
                          src={channel.thumbnail} 
                          alt={channel.name} 
                          className="h-full w-full object-cover rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(channel.name);
                          }}
                        />
                      </Avatar>
                      <span>{channel.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Categories */}
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex px-4 space-x-2">
                {videoCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategorySelect(category)}
                    className={
                      selectedCategory === category
                        ? "bg-blue-500 text-white flex-shrink-0"
                        : "text-gray-700 flex-shrink-0"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 mt-4">Loading videos...</p>
          </div>
        ) : error ? (
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
        ) : selectedVideo ? (
          <VideoNews
            title={selectedVideo.title}
            videoId={selectedVideo.videoId}
            thumbnailUrl={selectedVideo.thumbnailUrl}
            source={selectedVideo.channelName}
            publishedAt={selectedVideo.publishedAt}
          />
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-4">
            {searchResults.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="bg-gray-100 rounded-full p-6">
              <Youtube className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-gray-500 mt-4">No videos found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSelectedCategory("All");
                selectChannel(null);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
    channelName: string;
    publishedAt: string;
    views?: string;
    channelThumbnail: string;
  };
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div className="flex flex-col" onClick={onClick}>
      <div className="relative h-48 overflow-hidden rounded-lg">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/480x360?text=Video+Thumbnail';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="rounded-full bg-white/30 backdrop-blur-sm h-12 w-12 flex items-center justify-center">
            <Youtube className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      <div className="mt-2 flex">
        <div className="mr-3 flex-shrink-0">
          <img 
            src={video.channelThumbnail} 
            alt={video.channelName}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(video.channelName);
            }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span>{video.channelName}</span>
            <span className="mx-1">•</span>
            <span>{video.publishedAt}</span>
            {video.views && (
              <>
                <span className="mx-1">•</span>
                <span>{video.views} views</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
