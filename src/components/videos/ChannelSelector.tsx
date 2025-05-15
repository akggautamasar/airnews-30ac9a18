
import React from "react";
import { Youtube, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { NewsChannel } from "@/data/youtubeNewsChannels";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChannelSelectorProps {
  selectedChannel: string | null;
  handleChannelSelect: (channelId: string | null) => void;
  youtubeNewsChannels: NewsChannel[];
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  selectedChannel,
  handleChannelSelect,
  youtubeNewsChannels,
}) => {
  return (
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
  );
};
