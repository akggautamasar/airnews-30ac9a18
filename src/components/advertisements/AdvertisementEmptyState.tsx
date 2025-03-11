
import { FileQuestion } from "lucide-react";

export const AdvertisementEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-48 w-full text-center py-8 text-muted-foreground gap-2">
      <FileQuestion className="h-8 w-8" />
      <p>No advertisements available at this time</p>
    </div>
  );
};
