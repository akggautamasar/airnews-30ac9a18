import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";

export const AdvertisementManagement = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const { data: advertisements, isLoading } = useQuery({
    queryKey: ['advertisements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createAdvertisement = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('advertisements')
        .insert([
          {
            title,
            description,
            image_url: imageUrl,
            link_url: linkUrl,
            created_by: session.user.id,
            active: true,
          },
        ]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      setTitle("");
      setDescription("");
      setImageUrl("");
      setLinkUrl("");
      toast.success("Advertisement created successfully");
    },
    onError: (error) => {
      console.error("Error creating advertisement:", error);
      toast.error("Failed to create advertisement");
    },
  });

  const toggleAdvertisement = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('advertisements')
        .update({ active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      toast.success("Advertisement updated successfully");
    },
    onError: (error) => {
      console.error("Error updating advertisement:", error);
      toast.error("Failed to update advertisement");
    },
  });

  const deleteAdvertisement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      toast.success("Advertisement deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting advertisement:", error);
      toast.error("Failed to delete advertisement");
    },
  });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createAdvertisement.mutate();
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
                folder="advertisements"
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
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={createAdvertisement.isPending}>
              Create Advertisement
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading advertisements...</p>
        ) : (
          advertisements?.map((ad) => (
            <Card key={ad.id} className="relative overflow-hidden">
              {ad.image_url && (
                <div className="absolute inset-0">
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                </div>
              )}
              <CardContent className="relative z-10 mt-32 space-y-4">
                <h3 className="text-2xl font-bold text-white">{ad.title}</h3>
                <p className="text-white/90">{ad.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={ad.active}
                      onCheckedChange={(checked) =>
                        toggleAdvertisement.mutate({ id: ad.id, active: checked })
                      }
                    />
                    <span className="text-white">
                      {ad.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => deleteAdvertisement.mutate(ad.id)}
                    disabled={deleteAdvertisement.isPending}
                  >
                    Delete
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