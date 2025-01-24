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

export const AdvertisementSection = () => {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      align: "center",
      dragFree: false
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const { data: advertisements } = useQuery({
    queryKey: ['active-advertisements'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching advertisements:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Error in advertisement query:', error);
        return [];
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  if (!advertisements?.length) return null;

  return (
    <div className="mb-8">
      <Carousel
        ref={emblaRef}
        opts={{
          align: "center",
          loop: true,
        }}
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