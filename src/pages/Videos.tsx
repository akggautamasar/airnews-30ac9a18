
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoNews } from "@/components/news/VideoNews";
import { ScrollArea } from "@/components/ui/scroll-area";
import { youtubeNewsVideos, videoCategories } from "@/data/youtubeNewsChannels";

export default function Videos() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredVideos = selectedCategory === "All"
    ? youtubeNewsVideos
    : youtubeNewsVideos.filter(item => item.category === selectedCategory);

  const searchResults = searchQuery
    ? filteredVideos.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.channelName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredVideos;

  const selectedVideo = selectedVideoId 
    ? youtubeNewsVideos.find(item => item.id === selectedVideoId)
    : null;

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const handleBackToList = () => {
    setSelectedVideoId(null);
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
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex p-2 space-x-2">
              {videoCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {selectedVideo ? (
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
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="rounded-full bg-white/30 backdrop-blur-sm h-12 w-12 flex items-center justify-center">
            <Youtube className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      <div className="mt-2">
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
  );
};
