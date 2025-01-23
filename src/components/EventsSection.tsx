import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCard } from "@/components/CalendarCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export const EventsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, axis: "y" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const { data: events } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('special_events')
          .select('*')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true });
        
        if (error) {
          console.error('Error fetching events:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Error in events query:', error);
        return [];
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  if (!events?.length) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3 className="font-bold text-lg mb-4">Upcoming Events</h3>
      <Carousel
        ref={emblaRef}
        opts={{
          align: "start",
          loop: true,
          axis: "y"
        }}
        orientation="vertical"
        className="h-[300px]"
      >
        <CarouselContent>
          {events.map((event) => (
            <CarouselItem key={event.id}>
              <CalendarCard
                title={event.title}
                date={new Date(event.event_date)}
                description={event.description}
                type="event"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};