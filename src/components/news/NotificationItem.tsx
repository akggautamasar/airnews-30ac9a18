
import React from "react";
import { format } from "date-fns";

interface NotificationItemProps {
  title: string;
  imageUrl?: string;
  timestamp: string;
  onClick?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  imageUrl,
  timestamp,
  onClick,
}) => {
  const formattedDate = () => {
    try {
      const date = new Date(timestamp);
      return format(date, "dd/MM/yyyy HH:mm");
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <div 
      className="flex items-center justify-between border-b border-gray-200 py-4 px-4 cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex-1 mr-4">
        <h3 className="font-medium text-base">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{formattedDate()}</p>
      </div>
      {imageUrl && (
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};
