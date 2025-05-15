
import { useState } from "react";
import { Play, Share2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { YouTubePlayer } from "./YouTubePlayer";

interface VideoNewsProps {
  title: string;
  videoId: string;       // YouTube video ID
  thumbnailUrl: string;
  source: string;
  publishedAt: string;
}

export const VideoNews: React.FC<VideoNewsProps> = ({
  title,
  videoId,
  thumbnailUrl,
  source,
  publishedAt
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayPause = () => {
    setIsPlaying(true);
  };
  
  const handleShare = async () => {
    try {
      const shareUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this video: ${title}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(`${title}\n${shareUrl}`);
        toast.success("Video link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing video:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-[70vh] bg-black overflow-hidden">
        {isPlaying ? (
          <YouTubePlayer videoId={videoId} title={title} />
        ) : (
          <div className="relative w-full h-full">
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Video+Thumbnail';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Button
                onClick={handlePlayPause}
                variant="ghost"
                size="lg"
                className="rounded-full bg-white/30 backdrop-blur-sm h-16 w-16 flex items-center justify-center hover:bg-white/50"
              >
                <Play className="h-8 w-8 text-white" fill="white" />
              </Button>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">{source}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="flex items-center mt-2">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(source)}&background=random`} 
                alt={source} 
                className="w-6 h-6 rounded-full mr-2" 
              />
              <span className="text-sm text-gray-600">{source}</span>
              <span className="text-sm text-gray-400 mx-2">•</span>
              <span className="text-sm text-gray-600">{publishedAt}</span>
            </div>
          </div>
          <Button
            onClick={handleShare}
            variant="ghost"
            className="p-2 rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
