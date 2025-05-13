
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrendingInsightProps {
  headline: string;
  quotes: string[];
  imageUrl?: string;
  source?: string;
}

export const TrendingInsight: React.FC<TrendingInsightProps> = ({
  headline,
  quotes,
  imageUrl,
  source = "insights"
}) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: headline,
          text: quotes[0],
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${headline}\n\n${quotes.join('\n\n')}`);
        toast.success("Content copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing insight:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-900 text-white h-full flex flex-col relative p-6 rounded-lg">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="flex items-center bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full">
            <img 
              src="/lovable-uploads/75566c73-e7d9-4497-9265-da577f300186.png" 
              className="h-5 w-5 mr-1" 
              alt="AirNews logo" 
            />
            <span className="text-sm font-semibold">insights</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-red-500 mb-4">{headline}</h2>
        
        <div className="flex-1">
          {quotes.map((quote, index) => (
            <div key={index} className="mb-4">
              <p className="text-white text-lg leading-relaxed">"{quote}"</p>
            </div>
          ))}
        </div>

        {imageUrl && (
          <div className="mt-4">
            <img 
              src={imageUrl} 
              alt={headline} 
              className="w-full h-48 object-cover rounded-md" 
            />
          </div>
        )}
        
        <div className="mt-auto flex justify-end">
          <Button 
            onClick={handleShare}
            variant="ghost" 
            size="icon"
            className="rounded-full bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
