
import { Loader2 } from "lucide-react";

export const AdvertisementLoadingState = () => {
  return (
    <div className="flex items-center justify-center h-48 w-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};
