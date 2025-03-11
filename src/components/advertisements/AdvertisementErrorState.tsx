
import { AlertCircle } from "lucide-react";

interface AdvertisementErrorStateProps {
  message: string;
}

export const AdvertisementErrorState = ({ message }: AdvertisementErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-48 w-full text-center py-8 text-red-500 gap-2">
      <AlertCircle className="h-8 w-8" />
      <p>{message}</p>
    </div>
  );
};
