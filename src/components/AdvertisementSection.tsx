import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { AdvertisementCarouselItem } from "./advertisements/AdvertisementCarouselItem";
import { AdvertisementLoadingState } from "./advertisements/AdvertisementLoadingState";
import { AdvertisementErrorState } from "./advertisements/AdvertisementErrorState";

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
    return <AdvertisementLoadingState />;
  }

  if (error) {
    console.error('Advertisement error:', error);
    return <AdvertisementErrorState message="Error loading advertisements" />;
  }

  if (!advertisements?.length) {
    console.log('No advertisements found');
    return <AdvertisementErrorState message="No advertisements available" />;
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
              <AdvertisementCarouselItem advertisement={advertisement} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};