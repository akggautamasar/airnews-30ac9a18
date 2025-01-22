import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCard } from "@/components/CalendarCard";

export const EventsSection = () => {
  const { data: events } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  if (!events?.length) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3 className="font-bold text-lg mb-4">Upcoming Events</h3>
      {events.map((event) => (
        <CalendarCard
          key={event.id}
          title={event.title}
          date={new Date(event.event_date)}
          description={event.description}
          type="event"
        />
      ))}
    </div>
  );
};