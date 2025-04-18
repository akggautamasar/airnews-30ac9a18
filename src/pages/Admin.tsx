
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventForm } from "@/components/admin/EventForm";
import { AdvertisementForm } from "@/components/admin/AdvertisementForm";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/api-keys">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={16} />
            Manage API Keys
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="advertisements" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="advertisements">
          <AdvertisementForm />
        </TabsContent>
        
        <TabsContent value="events">
          <EventForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
