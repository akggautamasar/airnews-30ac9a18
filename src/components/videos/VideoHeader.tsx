
import React from "react";
import { ArrowLeft, Search, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface VideoHeaderProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedVideoId: string | null;
  handleBackToList: () => void;
}

export const VideoHeader: React.FC<VideoHeaderProps> = ({
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  selectedVideoId,
  handleBackToList,
}) => {
  const navigate = useNavigate();

  if (isSearchOpen) {
    return (
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
    );
  }

  if (selectedVideoId) {
    return (
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
    );
  }

  return (
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
  );
};
