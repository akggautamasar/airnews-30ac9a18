
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EventForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('special_events').insert({
        title,
        description,
        image_url: imageUrl,
        event_date: eventDate
      });

      if (error) throw error;
      
      toast.success('Event created successfully');
      onSuccess?.();
      
      // Reset form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setEventDate('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
            />
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
          
          <div>
            <Label>Image</Label>
            <ImageUpload
              onUploadComplete={(url) => setImageUrl(url)}
              folder="events"
            />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
