import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Loader2 } from "lucide-react";

export const AdvertisementSection = () => {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      align: "center",
      dragFree: false
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const { data: advertisements, isLoading, error } = useQuery({
    queryKey: ['active-advertisements'],
    queryFn: async () => {
      try {
        console.log('Fetching advertisements...');
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching advertisements:', error);
          throw error;
        }
        console.log('Advertisements fetched:', data);
        return data || [];
      } catch (error) {
        console.error('Error in advertisement query:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Advertisement error:', error);
    return (
      <div className="text-center py-8 text-red-500">
        Error loading advertisements
      </div>
    );
  }

  if (!advertisements?.length) {
    console.log('No advertisements found');
    return (
      <div className="text-center py-8 text-gray-500">
        No advertisements available
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Carousel
        ref={emblaRef}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {advertisements.map((advertisement) => (
            <CarouselItem key={advertisement.id}>
              <a
                href={advertisement.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="overflow-hidden">
                  <div className="relative h-96">
                    {advertisement.image_url && (
                      <>
                        <img
                          src={advertisement.image_url}
                          alt={advertisement.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                      </>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h2 className="text-4xl font-bold text-white mb-4">
                        {advertisement.title}
                      </h2>
                      <p className="text-xl text-white/90">
                        {advertisement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};