
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebNavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
}

export function WebNavigationControls({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled
}: WebNavigationControlsProps) {
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-4 md:right-8">
      <div className="mb-4 flex justify-center">
        <img 
          src="/lovable-uploads/75566c73-e7d9-4497-9265-da577f300186.png" 
          alt="AirNews" 
          className="h-12 w-auto"
        />
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onPrevious} 
        disabled={isPreviousDisabled}
        className="rounded-full shadow-md bg-white hover:bg-gray-100"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onNext} 
        disabled={isNextDisabled}
        className="rounded-full shadow-md bg-white hover:bg-gray-100"
      >
        <ArrowDown className="h-5 w-5" />
      </Button>
    </div>
  );
}
