import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { format } from "date-fns";

export const EventManagement = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [eventDate, setEventDate] = useState("");

  const { data: events, isLoading } = useQuery({
    queryKey: ['special-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const createEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('special_events')
        .insert([
          {
            title,
            description,
            image_url: imageUrl,
            event_date: eventDate,
          },
        ]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-events'] });
      setTitle("");
      setDescription("");
      setImageUrl("");
      setEventDate("");
      toast.success("Event created successfully");
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('special_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-events'] });
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    },
  });

  const upcomingEvents = events?.filter(event => 
    new Date(event.event_date) >= new Date()
  ) || [];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createEvent.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label>Image</Label>
              <ImageUpload
                onUploadComplete={setImageUrl}
                folder="events"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded-md"
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={createEvent.isPending}>
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading events...</p>
        ) : (
          upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{event.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.event_date), 'PPP')}
                  </p>
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => deleteEvent.mutate(event.id)}
                    disabled={deleteEvent.isPending}
                  >
                    Delete Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};