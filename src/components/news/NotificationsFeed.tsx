
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "@/components/news/NotificationItem";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  imageUrl?: string;
  timestamp: string;
}

interface NotificationsFeedProps {
  notifications: Notification[];
  onViewAll?: () => void;
  onNotificationClick?: (notificationId: string) => void;
}

export const NotificationsFeed: React.FC<NotificationsFeedProps> = ({
  notifications,
  onViewAll,
  onNotificationClick
}) => {
  const handleNotificationClick = (id: string) => {
    if (onNotificationClick) {
      onNotificationClick(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-xl font-bold">Notifications</h2>
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-700"
          onClick={onViewAll}
        >
          VIEW ALL
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="bg-gray-100 rounded-full p-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-gray-500 mt-4">No new notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              title={notification.title}
              imageUrl={notification.imageUrl}
              timestamp={notification.timestamp}
              onClick={() => handleNotificationClick(notification.id)}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
};
