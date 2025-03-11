import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Advertisement } from '@/types/advertisement';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';

export const MobileAdvertisementCarousel = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      dragFree: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const { data: advertisements, isLoading } = useQuery({
    queryKey: ['active-advertisements-mobile'],
    queryFn: async () => {
      try {
        console.log('Fetching advertisements for mobile...');
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching advertisements:', error);
          throw error;
        }
        console.log('Mobile advertisements fetched:', data);
        return data || [];
      } catch (error) {
        console.error('Error in advertisement query:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!advertisements || advertisements.length === 0) return;
    
    const handleSlideChange = (e: any) => {
      setCurrentAdIndex(e.selectedScrollSnap());
    };
    
    console.log('Current ad for lockscreen:', advertisements[currentAdIndex]?.title);
    
    return () => {
      // Cleanup
    };
  }, [advertisements, currentAdIndex]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!advertisements || advertisements.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white p-4">
        <p className="text-center">No advertisements available</p>
      </div>
    );
  }

  const handleSelect = (api: EmblaCarouselType) => {
    const index = api.selectedScrollSnap();
    setCurrentAdIndex(index);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative bg-black">
      <Carousel
        ref={emblaRef}
        className="h-full w-full"
        onSelect={() => {
          if (emblaApi) {
            handleSelect(emblaApi);
          }
        }}
      >
        <CarouselContent className="h-full">
          {advertisements?.map((ad) => (
            <CarouselItem key={ad.id} className="h-full w-full flex items-center justify-center">
              <div className="relative h-full w-full">
                {ad.image_url ? (
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-b from-gray-900 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {ad.title}
                  </h2>
                  <p className="text-lg text-white/90">
                    {ad.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
