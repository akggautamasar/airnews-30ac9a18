
import React from "react";
import { Youtube } from "lucide-react";

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

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
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
};
