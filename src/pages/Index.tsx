import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Home, Bookmark, User, Bell, Video, TrendingUp, ArrowUp, ArrowDown, Share2, MoreHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNewsContent } from "@/hooks/useNewsContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrendingInsight } from "@/components/news/TrendingInsight";
import { VideoNews } from "@/components/news/VideoNews";
import { NotificationsFeed } from "@/components/news/NotificationsFeed";

const categories = [
  "All News",
  "My Feed",
  "Top Stories",
  "Technology",
  "Business",
  "Entertainment",
  "Sports",
  "World",
  "Science",
  "Health",
  "Videos",
  "Trending"
];

const newsAgencies = [
  { id: 'all', name: 'All News Sources' },
  { id: 'guardian', name: 'The Guardian' },
  { id: 'newsapi', name: 'News API' },
  { id: 'thenewsapi', name: 'The News API' },
  { id: 'gnews', name: 'GNews API' },
  { id: 'worldnewsapi', name: 'World News API' },
  { id: 'newsdata_io', name: 'NewsData.io' },
  { id: 'saurav-news', name: 'Saurav News API' },
  { id: 'google', name: 'Google News' },
  { id: 'google-rss', name: 'Google News RSS' },
  { id: 'ai', name: 'AI Generated' }
];

// Sample video news data
const sampleVideoNews = [
  {
    id: "1",
    title: "\"Common Family Man...\" Pak Denies US-Sanctioned Terrorist Led Funeral",
    videoUrl: "https://www.example.com/video1.mp4",
    thumbnailUrl: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg",
    source: "CRUX News",
    publishedAt: "few hours ago"
  },
  {
    id: "2",
    title: "Congress Leaders Meet After Big Win, Discuss Government Formation",
    videoUrl: "https://www.example.com/video2.mp4",
    thumbnailUrl: "https://images.pexels.com/photos/3944104/pexels-photo-3944104.jpeg",
    source: "Daily News",
    publishedAt: "2 hours ago"
  }
];

// Sample trending insights data
const sampleTrendingInsights = [
  {
    id: "1",
    headline: "Pakistan's Plea",
    quotes: [
      "And after suffering heavy losses, Pakistan's army contacted our DGMO on the afternoon of 10th May.",
      "When Pakistan appealed and said that it would not indulge in any sort of terror activities or military audacity further, India considered it."
    ],
    imageUrl: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
  },
  {
    id: "2",
    headline: "Climate Summit Outcomes",
    quotes: [
      "Nations agreed to reduce carbon emissions by 50% before 2030.",
      "This is the most ambitious climate agreement in history."
    ],
    imageUrl: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg"
  }
];

// Sample notifications data
const sampleNotifications = [
  {
    id: "1",
    title: "Sanjay Manjrekar's 13-year-old tweet targeting Virat Kohli resurfaces after he praises him",
    imageUrl: "https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg",
    timestamp: "2023-05-13T10:30:00Z"
  },
  {
    id: "2",
    title: "BCCI didn't urge Virat Kohli to not retire, told him he doesn't fit in Test team: Report",
    imageUrl: "https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg",
    timestamp: "2023-05-13T09:15:00Z"
  },
  {
    id: "3",
    title: "IPL 2025 to resume on May 17, revised schedule released",
    imageUrl: "https://images.pexels.com/photos/3952042/pexels-photo-3952042.jpeg",
    timestamp: "2023-05-13T08:45:00Z"
  }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState("All News");
  const [selectedNewsAgency, setSelectedNewsAgency] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const newsContainerRef = useRef<HTMLDivElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const {
    combinedContent,
    isNewsLoading,
    newsError,
    totalItems
  } = useNewsContent(selectedCategory === "All News" ? "Today's News" : selectedCategory, selectedNewsAgency, refreshKey);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success("Refreshing news feed");
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentNewsIndex(0);
    setShowNotifications(false);

    // Reset specific indices based on category
    if (category === "Videos") {
      setCurrentVideoIndex(0);
    } else if (category === "Trending") {
      setCurrentTrendingIndex(0);
    } else if (category === "My Feed") {
      // Check if user is logged in
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          toast("Please sign in to see your personalized feed", {
            action: {
              label: "Sign In",
              onClick: () => navigate("/auth"),
            },
          });
        }
      });
    }
  };
  
  const handleNextNews = () => {
    if (currentNewsIndex < combinedContent.length - 1) {
      setCurrentNewsIndex(prevIndex => prevIndex + 1);
      if (newsContainerRef.current) {
        newsContainerRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };
  
  const handlePreviousNews = () => {
    if (currentNewsIndex > 0) {
      setCurrentNewsIndex(prevIndex => prevIndex - 1);
      if (newsContainerRef.current) {
        newsContainerRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < sampleVideoNews.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleNextTrending = () => {
    if (currentTrendingIndex < sampleTrendingInsights.length - 1) {
      setCurrentTrendingIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousTrending = () => {
    if (currentTrendingIndex > 0) {
      setCurrentTrendingIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleSwipe = (event: React.TouchEvent) => {
    const touchStartX = event.touches[0].clientX;
    const touchStartY = event.touches[0].clientY;
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const xDiff = touchStartX - touchEndX;
    const yDiff = touchStartY - touchEndY;
    
    // If vertical swipe is greater than horizontal swipe
    if (Math.abs(yDiff) > Math.abs(xDiff)) {
      if (yDiff > 50) {
        if (selectedCategory === "Videos") {
          handleNextVideo();
        } else if (selectedCategory === "Trending") {
          handleNextTrending();
        } else {
          handleNextNews();
        }
      } else if (yDiff < -50) {
        if (selectedCategory === "Videos") {
          handlePreviousVideo();
        } else if (selectedCategory === "Trending") {
          handlePreviousTrending();
        } else {
          handlePreviousNews();
        }
      }
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // Reset other content when showing notifications
    if (!showNotifications) {
      setSelectedCategory("All News");
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    // Navigate to the specific news article or handle as needed
    toast.info(`Opening notification ${notificationId}`);
    setShowNotifications(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-3xl mx-auto">
      {/* Header for mobile view with tabs */}
      <div className="sticky top-0 z-10 bg-white border-b">
        {isSearchOpen ? (
          <div className="p-4 flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="p-2" 
              onClick={() => setIsSearchOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
            </Button>
            <Input
              placeholder="Search for news"
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        ) : (
          <>
            {/* Top categories scroller */}
            <div className="py-2">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex p-2 space-x-4">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      onClick={() => handleSelectCategory(category)}
                      className={
                        selectedCategory === category
                          ? `text-${category === "Videos" ? "blue" : category === "Trending" ? "blue" : "blue"}-500 font-bold bg-transparent hover:bg-transparent`
                          : "text-gray-500 hover:text-blue-500 bg-transparent hover:bg-transparent"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden relative">
        {showNotifications ? (
          <NotificationsFeed 
            notifications={sampleNotifications}
            onViewAll={() => navigate("/notifications")}
            onNotificationClick={handleNotificationClick}
          />
        ) : isNewsLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : newsError ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <p className="text-red-500 mb-4">Error loading news: {newsError.message}</p>
            <Button onClick={handleRefresh}>Try Again</Button>
          </div>
        ) : selectedCategory === "Videos" ? (
          <div className="h-full relative">
            {sampleVideoNews.length > 0 && (
              <div
                onTouchStart={isMobile ? handleSwipe : undefined}
                onTouchEnd={isMobile ? handleSwipe : undefined}
              >
                <VideoNews
                  title={sampleVideoNews[currentVideoIndex].title}
                  videoUrl={sampleVideoNews[currentVideoIndex].videoUrl}
                  thumbnailUrl={sampleVideoNews[currentVideoIndex].thumbnailUrl}
                  source={sampleVideoNews[currentVideoIndex].source}
                  publishedAt={sampleVideoNews[currentVideoIndex].publishedAt}
                />
              </div>
            )}
            
            {/* Swipe indicator for mobile */}
            {isMobile && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                Swipe for more videos
              </div>
            )}
          </div>
        ) : selectedCategory === "Trending" ? (
          <div className="h-full relative">
            {sampleTrendingInsights.length > 0 && (
              <div
                onTouchStart={isMobile ? handleSwipe : undefined}
                onTouchEnd={isMobile ? handleSwipe : undefined}
              >
                <TrendingInsight
                  headline={sampleTrendingInsights[currentTrendingIndex].headline}
                  quotes={sampleTrendingInsights[currentTrendingIndex].quotes}
                  imageUrl={sampleTrendingInsights[currentTrendingIndex].imageUrl}
                />
              </div>
            )}
            
            {/* Swipe indicator for mobile */}
            {isMobile && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                Swipe for more insights
              </div>
            )}
          </div>
        ) : combinedContent.length > 0 ? (
          <div className="h-full relative">
            <div 
              className="h-full overflow-y-auto"
              ref={newsContainerRef}
            >
              {/* Web navigation arrows */}
              {!isMobile && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePreviousNews} 
                    disabled={currentNewsIndex === 0}
                    className="rounded-full shadow-md bg-white"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextNews} 
                    disabled={currentNewsIndex === combinedContent.length - 1}
                    className="rounded-full shadow-md bg-white"
                  >
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </div>
              )}
              {combinedContent[currentNewsIndex] && (
                <div
                  onTouchStart={isMobile ? handleSwipe : undefined}
                  onTouchEnd={isMobile ? handleSwipe : undefined}
                >
                  <InShortsStyle 
                    item={combinedContent[currentNewsIndex]} 
                    currentIndex={currentNewsIndex}
                    totalItems={totalItems}
                  />
                </div>
              )}
            </div>
            
            {/* Swipe indicator for mobile */}
            {isMobile && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                Swipe for more news
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <p className="text-gray-500 mb-4">No news available for this category</p>
            <Button onClick={handleRefresh}>Refresh</Button>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-white border-t flex justify-around p-2">
        <Button variant="ghost" onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center text-xs">
          <Search size={24} />
          <span>Discover</span>
        </Button>
        <Button variant="ghost" onClick={() => setSelectedCategory("All News")} className="flex flex-col items-center text-xs">
          <Home size={24} />
          <span>Home</span>
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => handleSelectCategory("Videos")}
          className={`flex flex-col items-center text-xs ${selectedCategory === "Videos" ? "text-blue-500" : ""}`}
        >
          <Video size={24} />
          <span>Videos</span>
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => handleSelectCategory("Trending")}
          className={`flex flex-col items-center text-xs ${selectedCategory === "Trending" ? "text-blue-500" : ""}`}
        >
          <TrendingUp size={24} />
          <span>Trending</span>
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleToggleNotifications} 
          className={`flex flex-col items-center text-xs ${showNotifications ? "text-blue-500" : ""}`}
        >
          <Bell size={24} />
          <span>Alerts</span>
        </Button>
      </div>
    </div>
  );
}

// InShortsStyle component (kept from existing code)
const InShortsStyle = ({ item, currentIndex, totalItems }: { item: any, currentIndex: number, totalItems: number }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();
  
  const handleBookmark = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast.error("Please sign in to bookmark articles", {
          action: {
            label: "Sign In",
            onClick: () => navigate("/auth")
          }
        });
        return;
      }

      setBookmarked(true);
      toast.success("Article bookmarked successfully");
    } catch (error) {
      console.error("Error bookmarking article:", error);
      toast.error("Failed to bookmark article");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.content.webTitle || item.content.title,
          text: item.content.fields?.bodyText?.slice(0, 140) + "..." || item.content.description,
          url: item.content.webUrl || item.content.url
        });
      } else {
        await navigator.clipboard.writeText(item.content.webUrl || item.content.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };
  
  if (item.type === 'ad') {
    return (
      <div className="flex flex-col h-full">
        <div className="relative h-1/2 bg-gray-100">
          {item.content.image_url ? (
            <img src={item.content.image_url} alt="Advertisement" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span>Advertisement</span>
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-blue-500">Ad</Badge>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-2">{item.content.title}</h2>
          <p className="text-gray-600 mb-4">{item.content.description}</p>
          <a 
            href={item.content.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-auto text-blue-500 hover:underline"
          >
            Learn more
          </a>
        </div>
      </div>
    );
  }
  
  const article = item.content;
  
  return (
    <div className="flex flex-col min-h-full">
      <div className="relative h-1/2 min-h-[40vh] bg-gray-100">
        {article.fields?.thumbnail || article.image || article.urlToImage ? (
          <img 
            src={article.fields?.thumbnail || article.image || article.urlToImage} 
            alt={article.webTitle || article.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span>No Image Available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2">
          <div className="bg-white/90 rounded-full py-1 px-3 flex items-center">
            <img src="/lovable-uploads/75566c73-e7d9-4497-9265-da577f300186.png" className="h-6 w-6 mr-1" alt="AirNews logo" />
            <span className="text-sm font-bold">AirNews</span>
          </div>
          <div className="text-white text-sm bg-black/40 px-2 py-1 rounded-full">
            {currentIndex + 1} of {totalItems}
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-xl font-bold mb-2">{article.webTitle || article.title}</h2>
        <p className="text-gray-600 mb-4">
          {article.fields?.bodyText || article.description || "No description available"}
        </p>
        
        <div className="mt-auto border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {article.source?.name || article.sectionName || "News Source"} · {new Date(article.webPublicationDate || article.publishedAt).toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handleBookmark}>
                <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
