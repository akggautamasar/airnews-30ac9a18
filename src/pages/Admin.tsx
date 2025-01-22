import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventManagement } from "@/components/admin/EventManagement";
import { AdvertisementManagement } from "@/components/admin/AdvertisementManagement";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      return profile;
    },
  });

  useEffect(() => {
    if (!isLoading && (!profile || !profile.is_admin)) {
      navigate('/');
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <EventManagement />
        </TabsContent>
        
        <TabsContent value="advertisements">
          <AdvertisementManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}