
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { AdvertisementCarouselItem } from './AdvertisementCarouselItem';
import { Advertisement } from '@/types/advertisement';

interface AdvertisementCarouselProps {
  advertisements: Advertisement[];
}

export const AdvertisementCarousel = ({ advertisements }: AdvertisementCarouselProps) => {
  if (!advertisements.length) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {advertisements.map((ad) => (
          <CarouselItem key={ad.id} className="md:basis-1/2">
            <AdvertisementCarouselItem advertisement={ad} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};
