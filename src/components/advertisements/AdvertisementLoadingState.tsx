import { Loader2 } from "lucide-react";

export const AdvertisementLoadingState = () => {
  return (
    <div className="flex items-center justify-center h-48">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};