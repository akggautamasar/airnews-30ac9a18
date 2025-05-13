
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Share2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoNews } from "@/components/news/VideoNews";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Sample video news data
const videoNewsItems = [
  {
    id: "1",
    title: "\"Common Family Man...\" Pak Denies US-Sanctioned Terrorist Led Funeral",
    videoUrl: "https://www.example.com/video1.mp4",
    thumbnailUrl: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg",
    source: "CRUX News",
    publishedAt: "few hours ago",
    views: "123K",
    category: "World"
  },
  {
    id: "2",
    title: "Congress Leaders Meet After Big Win, Discuss Government Formation",
    videoUrl: "https://www.example.com/video2.mp4",
    thumbnailUrl: "https://images.pexels.com/photos/3944104/pexels-photo-3944104.jpeg",
    source: "Daily News",
    publishedAt: "2 hours ago",
    views: "45K",
    category: "Politics"
  },
  {
    id: "3",
    title: "Real Madrid celebrates Champions League win with fans in the city",
    videoUrl: "https://www.example.com/video3.mp4",
    thumbnailUrl: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
    source: "Sports Daily",
    publishedAt: "5 hours ago",
    views: "78K",
    category: "Sports"
  },
  {
    id: "4",
    title: "Tech giant unveils revolutionary AI assistant at annual developer conference",
    videoUrl: "https://www.example.com/video4.mp4",
    thumbnailUrl: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
    source: "Tech Today",
    publishedAt: "8 hours ago",
    views: "56K",
    category: "Technology"
  }
];

const videoCategories = [
  "All",
  "World",
  "Politics",
  "Sports",
  "Technology",
  "Entertainment",
  "Business"
];

export default function Videos() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredVideos = selectedCategory === "All"
    ? videoNewsItems
    : videoNewsItems.filter(item => item.category === selectedCategory);

  const searchResults = searchQuery
    ? filteredVideos.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredVideos;

  const selectedVideo = selectedVideoId 
    ? videoNewsItems.find(item => item.id === selectedVideoId)
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
            <h1 className="text-lg font-semibold">Videos</h1>
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
            videoUrl={selectedVideo.videoUrl}
            thumbnailUrl={selectedVideo.thumbnailUrl}
            source={selectedVideo.source}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
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
    source: string;
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>{video.source}</span>
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
