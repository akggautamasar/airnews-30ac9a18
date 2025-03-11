
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AdvertisementForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('advertisements').insert({
        title,
        description,
        image_url: imageUrl,
        link_url: linkUrl,
        created_by: session?.user?.id,
        active: true
      });

      if (error) throw error;
      
      toast.success('Advertisement created successfully');
      onSuccess?.();
      
      // Reset form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLinkUrl('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Advertisement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter advertisement title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter advertisement description"
            />
          </div>
          
          <div>
            <Label htmlFor="linkUrl">Link URL (optional)</Label>
            <Input
              id="linkUrl"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter link URL"
            />
          </div>
          
          <div>
            <Label>Image</Label>
            <ImageUpload
              onUploadComplete={(url) => setImageUrl(url)}
              folder="advertisements"
            />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Advertisement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
