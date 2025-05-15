
import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Reset loaded state when video ID changes
    setIsLoaded(false);
  }, [videoId]);

  return (
    <div className="w-full h-full overflow-hidden rounded-lg">
      <AspectRatio ratio={16 / 9}>
        <div className={`w-full h-full ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title || "YouTube Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        </div>
      </AspectRatio>
    </div>
  );
};
