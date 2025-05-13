
import { useState } from "react";
import { Play, Share2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoNewsProps {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  source: string;
  publishedAt: string;
}

export const VideoNews: React.FC<VideoNewsProps> = ({
  title,
  videoUrl,
  thumbnailUrl,
  source,
  publishedAt
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this video: ${title}`,
          url: videoUrl || window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${title}\n${videoUrl || window.location.href}`);
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
          <video
            src={videoUrl}
            poster={thumbnailUrl}
            className="w-full h-full object-contain"
            autoPlay
            controls={false}
            muted={isMuted}
          />
        ) : (
          <div className="relative w-full h-full">
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover" 
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

        {isPlaying && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              onClick={handleMuteToggle}
              variant="ghost" 
              size="icon"
              className="rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}
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
