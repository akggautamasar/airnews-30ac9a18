
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/news/NotificationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  title: string;
  imageUrl?: string;
  timestamp: string;
  category?: string;
  isRead?: boolean;
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Sanjay Manjrekar's 13-year-old tweet targeting Virat Kohli resurfaces after he praises him",
    imageUrl: "https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg",
    timestamp: "2023-05-13T10:30:00Z",
    category: "Sports",
    isRead: false
  },
  {
    id: "2",
    title: "BCCI didn't urge Virat Kohli to not retire, told him he doesn't fit in Test team: Report",
    imageUrl: "https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg",
    timestamp: "2023-05-13T09:15:00Z",
    category: "Sports",
    isRead: true
  },
  {
    id: "3",
    title: "IPL 2025 to resume on May 17, revised schedule released",
    imageUrl: "https://images.pexels.com/photos/3952042/pexels-photo-3952042.jpeg",
    timestamp: "2023-05-13T08:45:00Z",
    category: "Sports",
    isRead: false
  },
  {
    id: "4",
    title: "Bitcoin surges past $80,000 for the first time ever",
    imageUrl: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg",
    timestamp: "2023-05-13T07:30:00Z",
    category: "Business",
    isRead: false
  },
  {
    id: "5",
    title: "New planet discovered that could potentially support life",
    imageUrl: "https://images.pexels.com/photos/544268/pexels-photo-544268.jpeg",
    timestamp: "2023-05-12T23:15:00Z",
    category: "Science",
    isRead: true
  },
  {
    id: "6",
    title: "Global climate summit ends with historic agreement",
    imageUrl: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
    timestamp: "2023-05-12T18:45:00Z",
    category: "World",
    isRead: true
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      // This would be replaced with an actual API call in a real app
      setTimeout(() => {
        setNotifications(sampleNotifications);
        setIsLoading(false);
      }, 500);
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (id: string) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? {...notification, isRead: true} : notification
      )
    );
    
    // Navigate to article or handle as needed
    navigate(`/article/${id}`);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({...notification, isRead: true}))
    );
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-3xl mx-auto">
      <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center gap-2">
        <Button variant="ghost" className="p-1" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1">Notifications</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className={`text-sm ${filter === 'all' ? 'text-blue-500' : 'text-gray-500'}`}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant="ghost" 
            className={`text-sm ${filter === 'unread' ? 'text-blue-500' : 'text-gray-500'}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
        </div>
      </div>

      {notifications.some(n => !n.isRead) && (
        <div className="p-3 bg-blue-50 flex justify-between items-center">
          <span className="text-sm text-blue-700">
            You have {notifications.filter(n => !n.isRead).length} unread notifications
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-700 text-sm"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="bg-gray-100 rounded-full p-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-gray-500 mt-4">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={notification.isRead ? 'bg-white' : 'bg-blue-50'}
              >
                <NotificationItem
                  title={notification.title}
                  imageUrl={notification.imageUrl}
                  timestamp={notification.timestamp}
                  onClick={() => handleNotificationClick(notification.id)}
                />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
